//go:build ignore

package main

import (
	"backend/config"
	"backend/models"
	"fmt"
)

func main() {
	config.ConnectDatabase()

	categories := []string{
		"Obat Bebas",
		"Obat Bebas Terbatas",
		"Obat Keras (Resep Dokter)",
		"Sirup / Cair",
		"Tablet / Kapsul",
		"Salep / Krim / Tetes",
		"Vitamin & Suplemen",
		"Alat Kesehatan",
	}

	for _, name := range categories {
		cat := models.MedicineCategory{Name: name}
		if err := config.DB.Where("name = ?", name).FirstOrCreate(&cat).Error; err != nil {
			fmt.Printf("Gagal membuat kategori %s: %v\n", name, err)
		} else {
			fmt.Printf("✅ Kategori '%s' berhasil ditambahkan/sudah ada.\n", name)
		}
	}
	fmt.Println("🎉 Seeding kategori apotek selesai!")
}
