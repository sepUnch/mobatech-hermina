package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type PolyclinicRepository interface {
	FindAll(search string, filter string, limit int, offset int) ([]models.Polyclinic, int64, error)
	FindByID(id uint) (*models.Polyclinic, error)
	Create(polyclinic *models.Polyclinic) error
	Update(polyclinic *models.Polyclinic) error
	Delete(id uint) error

	FindSchedulesByPolyclinic(polyclinicID uint) ([]models.PolyclinicSchedule, error)
	CreateSchedule(schedule *models.PolyclinicSchedule) error
	UpdateSchedule(schedule *models.PolyclinicSchedule) error
	DeleteSchedule(id uint) error
}

type polyclinicRepository struct {
	db *gorm.DB
}

func NewPolyclinicRepository(db *gorm.DB) PolyclinicRepository {
	return &polyclinicRepository{db}
}

func (r *polyclinicRepository) FindAll(search string, filter string, limit int, offset int) ([]models.Polyclinic, int64, error) {
	var polyclinics []models.Polyclinic
	var totalCount int64
	query := r.db.Model(&models.Polyclinic{})
	
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("name LIKE ?", searchTerm)
	}
	if filter == "active" {
		query = query.Where("is_active = ?", true)
	} else if filter == "inactive" {
		query = query.Where("is_active = ?", false)
	}
	
	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}
	
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}
	
	err := query.Preload("Schedules").Preload("Doctors").Find(&polyclinics).Error
	return polyclinics, totalCount, err
}

func (r *polyclinicRepository) FindByID(id uint) (*models.Polyclinic, error) {
	var polyclinic models.Polyclinic
	err := r.db.Preload("Schedules").Preload("Doctors").First(&polyclinic, id).Error
	return &polyclinic, err
}

func (r *polyclinicRepository) Create(polyclinic *models.Polyclinic) error {
	return r.db.Create(polyclinic).Error
}

func (r *polyclinicRepository) Update(polyclinic *models.Polyclinic) error {
	return r.db.Omit("created_at").Save(polyclinic).Error
}

func (r *polyclinicRepository) Delete(id uint) error {
	return r.db.Delete(&models.Polyclinic{}, id).Error
}

func (r *polyclinicRepository) FindSchedulesByPolyclinic(polyclinicID uint) ([]models.PolyclinicSchedule, error) {
	var schedules []models.PolyclinicSchedule
	err := r.db.Where("polyclinic_id = ?", polyclinicID).Find(&schedules).Error
	return schedules, err
}

func (r *polyclinicRepository) CreateSchedule(schedule *models.PolyclinicSchedule) error {
	return r.db.Create(schedule).Error
}

func (r *polyclinicRepository) UpdateSchedule(schedule *models.PolyclinicSchedule) error {
	return r.db.Omit("created_at").Save(schedule).Error
}

func (r *polyclinicRepository) DeleteSchedule(id uint) error {
	return r.db.Delete(&models.PolyclinicSchedule{}, id).Error
}
