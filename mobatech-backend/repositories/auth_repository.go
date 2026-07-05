package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type AuthRepository interface {
	CreateUser(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindByID(id uint) (*models.User, error)
	UpdateUser(user *models.User) error
	AddFamilyMember(member *models.FamilyMember) error
	DeleteFamilyMember(id uint) error
	GetAllUsers(search string, filter string, roleFilter string, viewerID uint, viewerRole string, limit int, offset int) ([]models.User, int64, error)
	DeleteUser(id uint) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db}
}

func (r *authRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *authRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("FamilyMembers").Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *authRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.Preload("FamilyMembers").First(&user, id).Error
	return &user, err
}

func (r *authRepository) UpdateUser(user *models.User) error {
	return r.db.Omit("created_at").Save(user).Error
}

func (r *authRepository) DeleteUser(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *authRepository) AddFamilyMember(member *models.FamilyMember) error {
	return r.db.Create(member).Error
}

func (r *authRepository) DeleteFamilyMember(id uint) error {
	return r.db.Delete(&models.FamilyMember{}, id).Error
}

func (r *authRepository) GetAllUsers(search string, filter string, roleFilter string, viewerID uint, viewerRole string, limit int, offset int) ([]models.User, int64, error) {
	var users []models.User
	var totalCount int64
	query := r.db.Model(&models.User{})
	
	if viewerRole == "doctor" && roleFilter == "patient" {
		query = query.Where("id IN (SELECT user_id FROM appointments WHERE doctor_id = (SELECT id FROM doctors WHERE user_id = ? LIMIT 1))", viewerID)
	}

	if roleFilter != "" {
		query = query.Where("role = ?", roleFilter)
	}
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?", searchTerm, searchTerm, searchTerm)
	}
	if filter == "newest" {
		query = query.Order("created_at desc")
	} else if filter == "oldest" {
		query = query.Order("created_at asc")
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Preload("FamilyMembers").Find(&users).Error
	return users, totalCount, err
}
