package services

import (
	"backend/models"
	"backend/repositories"
)

type DoctorService interface {
	GetAllDoctors(search string, filter string, specialization string, polyclinicID uint, limit, offset int) ([]models.Doctor, error)
	GetDoctorByID(id uint) (*models.Doctor, error)
	CreateDoctor(doctor *models.Doctor) error
	UpdateDoctor(id uint, input *models.Doctor) (*models.Doctor, error)
	DeleteDoctor(id uint) error
}

type doctorService struct {
	doctorRepo repositories.DoctorRepository
}

func NewDoctorService(doctorRepo repositories.DoctorRepository) DoctorService {
	return &doctorService{doctorRepo}
}

func (s *doctorService) GetAllDoctors(search string, filter string, specialization string, polyclinicID uint, limit, offset int) ([]models.Doctor, error) {
	return s.doctorRepo.FindAll(search, filter, specialization, polyclinicID, limit, offset)
}

func (s *doctorService) GetDoctorByID(id uint) (*models.Doctor, error) {
	return s.doctorRepo.FindByID(id)
}

func (s *doctorService) CreateDoctor(doctor *models.Doctor) error {
	doctor.IsActive = true
	return s.doctorRepo.Create(doctor)
}

func (s *doctorService) UpdateDoctor(id uint, input *models.Doctor) (*models.Doctor, error) {
	doctor, err := s.doctorRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if input.Name != "" {
		doctor.Name = input.Name
	}
	if input.Specialization != "" {
		doctor.Specialization = input.Specialization
	}
	if input.ContactInfo != "" {
		doctor.ContactInfo = input.ContactInfo
	}
	if input.Description != "" {
		doctor.Description = input.Description
	}
	if input.ImageURL != "" {
		doctor.ImageURL = input.ImageURL
	}
	doctor.PolyclinicID = input.PolyclinicID

	err = s.doctorRepo.Update(doctor)
	if err != nil {
		return nil, err
	}

	return doctor, nil
}

func (s *doctorService) DeleteDoctor(id uint) error {
	return s.doctorRepo.Delete(id)
}
