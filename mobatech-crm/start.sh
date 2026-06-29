#!/bin/bash

echo "🚀 Memulai Factory Reset (Hanya 1 Akun Admin)..."

# 1. Masuk ke direktori backend
cd ../mobatech-backend || exit

# 2. Hapus dan Buat Ulang Database (Kosong Bersih)
echo "📦 Menghapus database lama..."
mysql -u root -pruko -e "DROP DATABASE IF EXISTS mobatech; CREATE DATABASE mobatech;"

# 3. Pancing Gorm AutoMigrate
echo "🛠️ Menjalankan Automigrasi Gorm..."
go build -o temp_server main.go
./temp_server &
SERVER_PID=$!
sleep 5
kill $SERVER_PID
rm temp_server

# 4. Injeksi Super Admin Tunggal
echo "🌱 Menyuntikkan 1 Super Admin..."
go run seed_admin.go

echo "✅ SELESAI! Database murni kosong."
echo "Silakan testing flow aplikasi melalui UI CRM (localhost:3000)."
echo "Kredensial Admin: admin@hermina.com | admin123"
