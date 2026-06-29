package services

import (
	"errors"
	"backend/models"
	"backend/repositories"
)

type PolyclinicService interface {
	GetAllPolyclinics(search string, filter string) ([]models.Polyclinic, error)
	GetPolyclinicByID(id uint) (*models.Polyclinic, error)
	CreatePolyclinic(polyclinic *models.Polyclinic) error
	UpdatePolyclinic(polyclinic *models.Polyclinic) error
	DeletePolyclinic(id uint) error

	GetSchedules(polyclinicID uint) ([]models.PolyclinicSchedule, error)
	CreateSchedule(schedule *models.PolyclinicSchedule) error
	UpdateSchedule(schedule *models.PolyclinicSchedule) error
	DeleteSchedule(id uint) error
}

type polyclinicService struct {
	repo repositories.PolyclinicRepository
}

func NewPolyclinicService(repo repositories.PolyclinicRepository) PolyclinicService {
	return &polyclinicService{repo}
}

func (s *polyclinicService) GetAllPolyclinics(search string, filter string) ([]models.Polyclinic, error) {
	return s.repo.FindAll(search, filter)
}

func (s *polyclinicService) GetPolyclinicByID(id uint) (*models.Polyclinic, error) {
	return s.repo.FindByID(id)
}

func (s *polyclinicService) CreatePolyclinic(polyclinic *models.Polyclinic) error {
	return s.repo.Create(polyclinic)
}

func (s *polyclinicService) UpdatePolyclinic(polyclinic *models.Polyclinic) error {
	return s.repo.Update(polyclinic)
}

func (s *polyclinicService) DeletePolyclinic(id uint) error {
	polyclinic, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Check if there are active doctors before deleting
	if len(polyclinic.Doctors) > 0 {
		return errors.New("Tidak bisa menghapus poliklinik karena masih ada dokter yang terdaftar di dalamnya. Pindahkan dokternya terlebih dahulu.")
	}

	return s.repo.Delete(id)
}

func (s *polyclinicService) GetSchedules(polyclinicID uint) ([]models.PolyclinicSchedule, error) {
	return s.repo.FindSchedulesByPolyclinic(polyclinicID)
}

func (s *polyclinicService) CreateSchedule(schedule *models.PolyclinicSchedule) error {
	return s.repo.CreateSchedule(schedule)
}

func (s *polyclinicService) UpdateSchedule(schedule *models.PolyclinicSchedule) error {
	return s.repo.UpdateSchedule(schedule)
}

func (s *polyclinicService) DeleteSchedule(id uint) error {
	return s.repo.DeleteSchedule(id)
}
