package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type AppointmentRepository interface {
	FindAll(search string, filter string) ([]models.Appointment, error)
	FindByUserID(userID uint) ([]models.Appointment, error)
	FindByID(id uint) (*models.Appointment, error)
	Create(appointment *models.Appointment) error
	Update(appointment *models.Appointment) error
}

type appointmentRepository struct {
	db *gorm.DB
}

func NewAppointmentRepository(db *gorm.DB) AppointmentRepository {
	return &appointmentRepository{db}
}

func (r *appointmentRepository) FindAll(search string, filter string) ([]models.Appointment, error) {
	var appointments []models.Appointment
	query := r.db.Preload("User").Preload("Doctor").Preload("Schedule").
		Joins("LEFT JOIN users ON users.id = appointments.user_id")
		
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("appointments.complaint LIKE ? OR users.full_name LIKE ?", searchTerm, searchTerm)
	}
	if filter == "today" {
		query = query.Where("DATE(schedule_date) = CURDATE()")
	} else if filter == "tomorrow" {
		query = query.Where("DATE(schedule_date) = CURDATE() + INTERVAL 1 DAY")
	}
	
	err := query.Order("appointments.created_at desc").Find(&appointments).Error
	return appointments, err
}

func (r *appointmentRepository) FindByUserID(userID uint) ([]models.Appointment, error) {
	var appointments []models.Appointment
	err := r.db.Preload("Doctor").Preload("Schedule").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&appointments).Error
	return appointments, err
}

func (r *appointmentRepository) FindByID(id uint) (*models.Appointment, error) {
	var appointment models.Appointment
	err := r.db.Preload("User").Preload("Doctor").Preload("Schedule").First(&appointment, id).Error
	if err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (r *appointmentRepository) Create(appointment *models.Appointment) error {
	return r.db.Create(appointment).Error
}

func (r *appointmentRepository) Update(appointment *models.Appointment) error {
	return r.db.Omit("created_at").Save(appointment).Error
}
