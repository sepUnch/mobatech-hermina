package models

import (
	"time"

	"gorm.io/gorm"
)

type Medicine struct {
	ID                   uint             `json:"id" gorm:"primarykey"`
	CreatedAt            time.Time        `json:"created_at"`
	UpdatedAt            time.Time        `json:"updated_at"`
	DeletedAt            gorm.DeletedAt   `json:"deleted_at" gorm:"index"`
	CategoryID           uint             `json:"category_id"`
	Category             MedicineCategory `json:"category" gorm:"foreignKey:CategoryID"`
	Name                 string           `json:"name"`
	GenericName          string           `json:"generic_name"`
	Description          string           `json:"description" gorm:"type:text"`
	Dosage               string           `json:"dosage"`
	Unit                 string           `json:"unit"`
	Price                float64          `json:"price"`
	Stock                int              `json:"stock"`
	RequiresPrescription bool             `json:"requires_prescription"`
	Manufacturer         string           `json:"manufacturer"`
	ImageURL             string           `json:"image_url"`
}
