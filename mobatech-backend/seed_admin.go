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
	config.DB.AutoMigrate(&models.User{})

	password := "admin123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return
	}

	admin := models.User{
		FullName:    "Super Admin Hermina",
		Email:       "admin@hermina.com",
		Password:    string(hashedPassword),
		PhoneNumber: "081234567890",
		Gender:      "Laki-laki",
	}

	// Cek apakah admin sudah ada
	var existing models.User
	if err := config.DB.Where("email = ?", admin.Email).First(&existing).Error; err != nil {
		if err := config.DB.Create(&admin).Error; err != nil {
			fmt.Println("Gagal membuat admin:", err)
		} else {
			fmt.Println("✅ Super Admin successfully seeded via GORM!")
		}
	} else {
		fmt.Println("⚠️ Admin sudah ada di database.")
	}
}
