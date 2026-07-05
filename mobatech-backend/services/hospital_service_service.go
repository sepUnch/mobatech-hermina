package services

import (
	"backend/models"
	"backend/repositories"
	"backend/utils"
)

type HospitalServiceService interface {
	GetAll(search string, filter string) ([]models.HospitalService, error)
	GetByID(id uint) (*models.HospitalService, error)
	Create(service *models.HospitalService) error
	Update(service *models.HospitalService) error
	Delete(id uint) error
}

type hospitalServiceService struct {
	repo repositories.HospitalServiceRepository
}

func NewHospitalServiceService(repo repositories.HospitalServiceRepository) HospitalServiceService {
	return &hospitalServiceService{repo}
}

func (s *hospitalServiceService) GetAll(search string, filter string) ([]models.HospitalService, error) {
	return s.repo.GetAll(search, filter)
}

func (s *hospitalServiceService) GetByID(id uint) (*models.HospitalService, error) {
	return s.repo.GetByID(id)
}

func (s *hospitalServiceService) Create(service *models.HospitalService) error {
	err := s.repo.Create(service)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *hospitalServiceService) Update(service *models.HospitalService) error {
	err := s.repo.Update(service)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}

func (s *hospitalServiceService) Delete(id uint) error {
	err := s.repo.Delete(id)
	if err == nil {
		utils.TriggerAsyncRAGSync()
	}
	return err
}
