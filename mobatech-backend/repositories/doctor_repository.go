package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type DoctorRepository interface {
	FindAll(search string, filter string, specialization string, polyclinicID uint, limit, offset int) ([]models.Doctor, error)
	FindByID(id uint) (*models.Doctor, error)
	Create(doctor *models.Doctor) error
	Update(doctor *models.Doctor) error
	Delete(id uint) error
}

type doctorRepository struct {
	db *gorm.DB
}

func NewDoctorRepository(db *gorm.DB) DoctorRepository {
	return &doctorRepository{db}
}

func (r *doctorRepository) FindAll(search string, filter string, specialization string, polyclinicID uint, limit, offset int) ([]models.Doctor, error) {
	var doctors []models.Doctor
	query := r.db.Preload("Polyclinic").Where("doctors.is_active = ?", true)
	if search != "" {
		query = query.Where("doctors.name LIKE ?", "%"+search+"%")
	}
	if filter != "" {
		query = query.Joins("LEFT JOIN polyclinics ON polyclinics.id = doctors.polyclinic_id").Where("polyclinics.name LIKE ?", "%"+filter+"%")
	}
	if specialization != "" {
		query = query.Where("specialization = ?", specialization)
	}
	if polyclinicID > 0 {
		query = query.Where("polyclinic_id = ?", polyclinicID)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}
	err := query.Find(&doctors).Error
	return doctors, err
}

func (r *doctorRepository) FindByID(id uint) (*models.Doctor, error) {
	var doctor models.Doctor
	err := r.db.Preload("Polyclinic").First(&doctor, id).Error
	if err != nil {
		return nil, err
	}
	return &doctor, nil
}

func (r *doctorRepository) Create(doctor *models.Doctor) error {
	return r.db.Create(doctor).Error
}

func (r *doctorRepository) Update(doctor *models.Doctor) error {
	return r.db.Omit("created_at").Save(doctor).Error
}

func (r *doctorRepository) Delete(id uint) error {
	return r.db.Model(&models.Doctor{}).Where("id = ?", id).Update("is_active", false).Error
}
