import logging
import pymysql
import csv
import os
from dotenv import dotenv_values

class SyncEngine:
    def __init__(self, data_path: str, backend_env_path: str):
        self.data_path = data_path
        self.env_path = backend_env_path

    def get_db_connection(self):
        config = dotenv_values(self.env_path)
        return pymysql.connect(
            host=config.get("DB_HOST", "127.0.0.1"),
            user=config.get("DB_USER", "root"),
            password=config.get("DB_PASSWORD", ""),
            database=config.get("DB_NAME", "mobatech"),
            port=int(config.get("DB_PORT", 3306)),
            cursorclass=pymysql.cursors.DictCursor
        )

    def _fetch_data_from_db(self):
        try:
            conn = self.get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, name, specialization, description FROM doctors WHERE deleted_at IS NULL AND is_active = 1")
                doctors = cursor.fetchall()
                cursor.execute("SELECT id, doctor_id, date, start_time, end_time, quota, booked FROM doctor_schedules WHERE deleted_at IS NULL AND is_available = 1")
                schedules = cursor.fetchall()
                cursor.execute("SELECT id, name, description FROM polyclinics WHERE deleted_at IS NULL AND is_active = 1")
                polyclinics = cursor.fetchall()
                cursor.execute("SELECT id, name, address, gmaps_link FROM branches WHERE deleted_at IS NULL")
                branches = cursor.fetchall()
            return doctors, schedules, polyclinics, branches
        except Exception as e:
            logging.info(f"DB error: {e}")
            return None, None, None, None
        finally:
            if 'conn' in locals() and conn:
                conn.close()

    def _process_dynamic_knowledge(self, doctors, schedules, polyclinics, branches):
        knowledge = []
        row_id = 100
        doc_map = {d["id"]: d for d in doctors}

        for poly in polyclinics:
            knowledge.append({"id": row_id, "kategori": "Layanan", "teks": f"Layanan Poliklinik {poly['name']}: {poly['description']}."})
            row_id += 1

        for branch in branches:
            knowledge.append({"id": row_id, "kategori": "Cabang", "teks": f"Cabang Rumah Sakit Hermina {branch['name']} berlokasi di alamat {branch['address']}. Link Google Maps: {branch['gmaps_link']}"})
            row_id += 1

        for doc in doctors:
            knowledge.append({"id": row_id, "kategori": "Dokter", "teks": f"Dokter {doc['name']} adalah spesialis {doc['specialization']}. {doc['description']}"})
            row_id += 1

        for sched in schedules:
            doc = doc_map.get(sched["doctor_id"])
            if doc:
                date_str = sched["date"].strftime("%Y-%m-%d") if hasattr(sched["date"], "strftime") else str(sched["date"])[:10]
                text = f"Jadwal praktik {doc['name']} ({doc['specialization']}): tanggal {date_str} jam {sched['start_time']} - {sched['end_time']}. Sisa kuota pasien: {sched['quota'] - sched['booked']}."
                knowledge.append({"id": row_id, "kategori": "Jadwal", "teks": text})
                row_id += 1
        return knowledge

    def _load_static_items(self):
        static_items = []
        if os.path.exists(self.data_path):
            try:
                with open(self.data_path, mode='r', encoding='utf-8') as f:
                    static_items = [row for row in csv.DictReader(f) if row["kategori"] not in ["Jadwal", "Layanan", "Dokter", "Cabang"]]
            except Exception as e:
                logging.info(f"CSV read error: {e}")
        return static_items

    def _save_to_csv(self, static_items, new_knowledge):
        try:
            with open(self.data_path, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=["id", "kategori", "teks"])
                writer.writeheader()
                writer.writerows(static_items)
                writer.writerows(new_knowledge)
            return True
        except Exception as e:
            logging.info(f"CSV write error: {e}")
            return False

    def sync_database(self) -> bool:
        db_data = self._fetch_data_from_db()
        if db_data[0] is None:
            return False
            
        doctors, schedules, polyclinics, branches = db_data
        new_knowledge = self._process_dynamic_knowledge(doctors, schedules, polyclinics, branches)
        static_items = self._load_static_items()
        
        return self._save_to_csv(static_items, new_knowledge)
