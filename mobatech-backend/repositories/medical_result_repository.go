package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type MedicalResultRepository interface {
	FindAll(search string, filter string) ([]models.MedicalResult, error)
	FindByUserID(userID uint) ([]models.MedicalResult, error)
	FindByID(id uint) (*models.MedicalResult, error)
	Create(medicalResult *models.MedicalResult) error
	Update(medicalResult *models.MedicalResult) error
	Delete(id uint) error
}

type medicalResultRepository struct {
	db *gorm.DB
}

func NewMedicalResultRepository(db *gorm.DB) MedicalResultRepository {
	return &medicalResultRepository{db}
}

func (r *medicalResultRepository) FindAll(search string, filter string) ([]models.MedicalResult, error) {
	var results []models.MedicalResult
	query := r.db.Joins("LEFT JOIN users ON users.id = medical_results.user_id")
	
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("medical_results.test_name LIKE ? OR users.full_name LIKE ?", searchTerm, searchTerm)
	}
	
	if filter == "newest" {
		query = query.Order("medical_results.date_of_test desc")
	} else if filter == "oldest" {
		query = query.Order("medical_results.date_of_test asc")
	} else {
		query = query.Order("medical_results.created_at desc")
	}
	
	err := query.Find(&results).Error
	return results, err
}

func (r *medicalResultRepository) FindByUserID(userID uint) ([]models.MedicalResult, error) {
	var results []models.MedicalResult
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&results).Error
	return results, err
}

func (r *medicalResultRepository) FindByID(id uint) (*models.MedicalResult, error) {
	var result models.MedicalResult
	err := r.db.First(&result, id).Error
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (r *medicalResultRepository) Create(medicalResult *models.MedicalResult) error {
	return r.db.Create(medicalResult).Error
}

func (r *medicalResultRepository) Update(medicalResult *models.MedicalResult) error {
	return r.db.Omit("created_at").Save(medicalResult).Error
}

func (r *medicalResultRepository) Delete(id uint) error {
	return r.db.Delete(&models.MedicalResult{}, id).Error
}
