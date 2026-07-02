package models

import "gorm.io/gorm"

type Doctor struct {
	gorm.Model
	UserID         *uint       `json:"user_id,omitempty"` // Optional user account link
	PolyclinicID   *uint       `json:"polyclinic_id,omitempty"`
	Polyclinic     *Polyclinic `json:"polyclinic,omitempty" gorm:"foreignKey:PolyclinicID"`
	Name           string      `json:"name"`
	Specialization string      `json:"specialization"`
	ContactInfo    string      `json:"contact_info"`
	Description    string      `json:"description"`
	ImageURL       string      `json:"image_url"`
	IsActive       bool        `json:"is_active" gorm:"default:true"`
	IsAvailableToday bool      `json:"is_available_today" gorm:"-"`
}
