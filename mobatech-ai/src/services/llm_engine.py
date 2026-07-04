import os
import google.generativeai as genai
from dotenv import load_dotenv
import datetime
import locale

backend_env_path = os.path.join(os.path.dirname(__file__), "../../../mobatech-backend/.env")
load_dotenv(backend_env_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
class GenerativeEngine:
    def __init__(self):
        # We use gemini-1.5-pro or gemini-1.5-flash
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def generate_response(self, query: str, contexts: list[str]) -> str:
        if not GEMINI_API_KEY:
            return "Sistem AI sedang offline. Silakan tambahkan GEMINI_API_KEY di environment."
            
        context_str = "\n".join([f"- {c}" for c in contexts])
        
        # Inject Temporal Context
        try: locale.setlocale(locale.LC_TIME, 'id_ID.UTF-8')
        except: pass
        current_time_str = datetime.datetime.now().strftime("%A, %d %B %Y %H:%M WIB")

        prompt = f"""Anda adalah 'Hermina Smart Assistant', asisten virtual medis dan layanan pelanggan resmi di RS Hermina.
Tugas utama Anda adalah memberikan informasi jadwal dokter, layanan rumah sakit, dan triase awal gejala (mengarahkan ke poliklinik yang tepat).

KONTEKS WAKTU SAAT INI: {current_time_str}
Gunakan waktu ini sebagai acuan mutlak jika pengguna bertanya tentang 'hari ini', 'besok', atau 'jadwal terdekat'.

ATURAN KETAT (SYSTEM GUARDRAILS):
1. OUT-OF-DOMAIN: Jika pertanyaan di luar konteks medis, kesehatan, jadwal dokter, atau RS Hermina (misal: resep masakan, politik, coding), TOLAK DENGAN SOPAN. Katakan bahwa Anda hanya asisten medis RS Hermina.
2. TRIAGE & DISCLAIMER GEJALA: Jika pasien menyebutkan keluhan penyakit/gejala, Anda HARUS memberikan peringatan bahwa Anda bukan dokter. Arahkan mereka ke Poliklinik yang relevan berdasarkan konteks.
3. GAWAT DARURAT (EMERGENCY): Jika gejala meliputi nyeri dada berat, sesak napas parah, pendarahan hebat, atau penurunan kesadaran, SEGERA arahkan pasien ke IGD (Instalasi Gawat Darurat) terdekat tanpa basa-basi.
4. ANTI-HALUSINASI: Dilarang keras merekomendasikan nama dokter, jadwal, atau fasilitas yang TIDAK ADA dalam 'Konteks Sistem' di bawah ini. Jika jadwal tidak ada, katakan Anda belum memiliki data tersebut.

Konteks Sistem (Database Jadwal & Layanan RS):
{context_str}

Pertanyaan Pasien: {query}
"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Maaf, terjadi gangguan pada sistem AI: {str(e)}"
