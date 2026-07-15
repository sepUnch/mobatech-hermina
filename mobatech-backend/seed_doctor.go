//go:build ignore

package main

import (
	"backend/config"
	"backend/models"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.ConnectDatabase()
	
	password := "dokter123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return
	}

	doctor := models.User{
		FullName:    "Dr. Andi Budi",
		Email:       "dokter@hermina.com",
		Password:    string(hashedPassword),
		PhoneNumber: "081299998888",
		Gender:      "Laki-laki",
		Role:        "doctor",
	}

	var existing models.User
	if err := config.DB.Where("email = ?", doctor.Email).First(&existing).Error; err != nil {
		if err := config.DB.Create(&doctor).Error; err != nil {
			fmt.Println("Gagal membuat dokter:", err)
		} else {
			fmt.Println("✅ Default Doctor successfully seeded via GORM!")
		}
	} else {
		fmt.Println("⚠️ Dokter sudah ada di database.")
	}
}
