# Panduan Instalasi & Penggunaan Aplikasi Mobatech

Bagian ini memuat panduan lengkap untuk menginstal dan menjalankan ekosistem Mobatech secara lokal di komputer/laptop Anda, mulai dari persiapan *database* hingga menjalankan aplikasi mobile dan *web dashboard*.

## 1. Persyaratan Sistem
Pastikan aplikasi berikut sudah terinstal di laptop Anda:
- **Go (Golang)** v1.21 atau terbaru
- **Node.js** v18.0.0 atau terbaru
- **Flutter SDK** v3.19 atau terbaru
- **Python** v3.10 atau terbaru
- **Laragon** atau XAMPP (untuk menjalankan layanan MySQL lokal)
- **Android Studio** (beserta Android Emulator)

---

## 2. Panduan Instalasi

### 2.1. Persiapan Database (MySQL)
1. Buka **Laragon** (atau XAMPP) dan pastikan layanan MySQL sedang berjalan.
2. Buat *database* baru dengan nama `mobatech`. Anda bisa menggunakan aplikasi seperti HeidiSQL, atau melalui terminal:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mobatech;"
   ```

### 2.2. Konfigurasi Backend (Go)
Backend ini mengurus logika utama aplikasi dan komunikasi langsung dengan *database*.
1. Buka terminal dan arahkan ke folder backend:
   ```bash
   cd mobatech-backend
   ```
2. Buat atau sesuaikan file konfigurasi bernama `.env` di dalam folder tersebut:
   ```env
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=mobatech
   JWT_SECRET=rahasia_jwt_anda
   FIREBASE_PROJECT_ID=mobatech-firebase
   ```
3. Unduh semua *library* yang dibutuhkan dan jalankan servernya:
   ```bash
   go mod tidy
   go run main.go
   ```
4. *Opsional*: Buka terminal baru dan jalankan *seeder* untuk mengisi data awal (seperti akun *Super Admin* dan data rumah sakit):
   ```bash
   go run seed_admin.go
   go run seed_branches.go
   ```

### 2.3. Konfigurasi Mesin AI (Python)
AI Engine digunakan untuk fitur RAG (*Retrieval-Augmented Generation*) dan *chatbot* yang menganalisa keluhan penyakit.
1. Buka terminal baru dan arahkan ke folder AI:
   ```bash
   cd mobatech-ai
   ```
2. Sesuaikan file `.env` di dalam folder tersebut untuk menghubungkan API Gemini:
   ```env
   GEMINI_API_KEY=kunci_api_gemini_anda
   ```
3. Jalankan server Python (contoh di bawah menggunakan instalasi Python bawaan Laragon):
   ```bash
   C:\laragon\bin\python\python-3.10\python.exe src\api.py
   ```
   *(Catatan: Gunakan perintah `python src\api.py` jika Anda menggunakan instalasi Python standar).*

### 2.4. Konfigurasi Web CRM / Dashboard (Next.js)
Portal ini digunakan oleh staf rumah sakit untuk mengelola operasional (jadwal, dokter, dll).
1. Buka terminal baru dan arahkan ke folder CRM:
   ```bash
   cd mobatech-crm
   ```
2. Instal semua *dependencies* (paket Node.js) dan jalankan *website*-nya:
   ```bash
   npm install
   npm run dev
   ```
3. Buka *browser* favorit Anda dan akses portal melalui URL: `http://localhost:3000`.

### 2.5. Konfigurasi Aplikasi Pasien (Flutter Mobile)
Aplikasi mobile yang akan di-instal ke HP pasien untuk memesan jadwal dan berkonsultasi dengan AI.
1. Buka terminal baru dan arahkan ke folder aplikasi Flutter:
   ```bash
   cd mobatech-flutter
   ```
2. Sesuaikan file `.env`:
   ```env
   API_URL=http://10.0.2.2:8080
   GOOGLE_WEB_CLIENT_ID=kunci_web_client_id_dari_firebase
   ```
   *(Catatan Teknis: IP `10.0.2.2` adalah alamat khusus agar Emulator Android bisa terhubung ke localhost milik laptop).*
3. **Penting untuk Google Sign-In**: 
   - Dapatkan kode sidik jari digital (SHA-1) dari laptop Anda menggunakan perintah `keytool`.
   - Masukkan kode SHA-1 tersebut di **Firebase Console** (Pengaturan Project Android).
   - Unduh ulang file `google-services.json` dari Firebase dan letakkan di dalam direktori `mobatech-flutter/android/app/`.
4. Bersihkan *cache* dan jalankan aplikasi di Emulator Android:
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

---

## 3. Panduan Penggunaan Sistem (Use Case)

### 3.1 Sisi Pasien (Mobile App)
1. **Pendaftaran dan Akses Awal**: Pasien mengunduh dan membuka aplikasi di HP. Mereka bisa mendaftar akun baru secara manual atau melakukan *Login* cepat menggunakan integrasi akun Google.
2. **Konsultasi AI (Chatbot)**: Di beranda aplikasi, pasien dapat mengakses asisten pintar AI. Pasien dapat menceritakan keluhan penyakitnya melalui obrolan.
3. **Sistem Rujukan Pintar**: AI akan secara cerdas menganalisa keluhan dan memberikan diagnosa awal. Setelah itu, AI akan langsung merekomendasikan pendaftaran ke Dokter Spesialis dan Poliklinik yang paling tepat secara otomatis.
4. **Pemesanan Jadwal**: Pasien dapat melihat jadwal praktik dokter yang direkomendasikan dan mem-*booking* nomor antrean dari HP.

### 3.2 Sisi Staf & Admin (Web CRM Portal)
1. **Akses Dashboard**: Staf rumah sakit atau admin masuk ke web menggunakan browser di alamat `localhost:3000` dengan akun *Super Admin* atau akun staf.
2. **Live Queue Monitoring**: Admin menggunakan fitur *Live Queue* di *dashboard* untuk memantau antrean pasien yang mendaftar dan hadir pada hari itu secara *real-time*.
3. **Manajemen Konsultasi**: Staf dapat memvalidasi dan menyetujui jadwal konsultasi yang masuk dari aplikasi pasien.
4. **Manajemen Master Data**: Admin mengelola data-data vital rumah sakit seperti penambahan cabang rumah sakit baru, stok obat di apotek, serta data profil jadwal praktik dokter. Seluruh pengelolaan ini dibalut dalam antarmuka UI *Glassmorphism* yang super cepat dan mulus.
