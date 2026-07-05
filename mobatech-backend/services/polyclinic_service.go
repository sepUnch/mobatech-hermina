package services

import (
	"errors"
	"backend/models"
	"backend/repositories"
	"backend/utils"
)

type PolyclinicService interface {
	GetAllPolyclinics(search string, filter string, limit int, offset int) ([]models.Polyclinic, int64, error)
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

func (s *polyclinicService) GetAllPolyclinics(search string, filter string, limit int, offset int) ([]models.Polyclinic, int64, error) {
	return s.repo.FindAll(search, filter, limit, offset)
}

func (s *polyclinicService) GetPolyclinicByID(id uint) (*models.Polyclinic, error) {
	return s.repo.FindByID(id)
}

func (s *polyclinicService) CreatePolyclinic(polyclinic *models.Polyclinic) error {
	err := s.repo.Create(polyclinic)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *polyclinicService) UpdatePolyclinic(polyclinic *models.Polyclinic) error {
	err := s.repo.Update(polyclinic)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *polyclinicService) DeletePolyclinic(id uint) error {
	polyclinic, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if len(polyclinic.Doctors) > 0 {
		return errors.New("Tidak bisa menghapus poliklinik karena masih ada dokter yang terdaftar di dalamnya. Pindahkan dokternya terlebih dahulu.")
	}

	err = s.repo.Delete(id)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *polyclinicService) GetSchedules(polyclinicID uint) ([]models.PolyclinicSchedule, error) {
	return s.repo.FindSchedulesByPolyclinic(polyclinicID)
}

func (s *polyclinicService) CreateSchedule(schedule *models.PolyclinicSchedule) error {
	err := s.repo.CreateSchedule(schedule)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *polyclinicService) UpdateSchedule(schedule *models.PolyclinicSchedule) error {
	err := s.repo.UpdateSchedule(schedule)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *polyclinicService) DeleteSchedule(id uint) error {
	err := s.repo.DeleteSchedule(id)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}
