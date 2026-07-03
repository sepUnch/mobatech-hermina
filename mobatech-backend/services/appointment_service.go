package services

import (
	"backend/models"
	"backend/repositories"
	"errors"
	"fmt"
	"time"
)

type AppointmentService interface {
	GetAllAppointments(search string, filter string, userID uint, role string) ([]models.Appointment, error)
	GetUserAppointments(userID uint) ([]models.Appointment, error)
	BookAppointment(userID uint, req *models.Appointment) (*models.Appointment, error)
	CancelAppointment(id uint, userID uint, isAdmin bool) error
	ApproveAppointment(id uint) error
	CompleteAppointment(id uint) error
}

type appointmentService struct {
	appointmentRepo repositories.AppointmentRepository
	scheduleRepo    repositories.ScheduleRepository
}

func NewAppointmentService(appointmentRepo repositories.AppointmentRepository, scheduleRepo repositories.ScheduleRepository) AppointmentService {
	return &appointmentService{appointmentRepo, scheduleRepo}
}

func (s *appointmentService) GetAllAppointments(search string, filter string, userID uint, role string) ([]models.Appointment, error) {
	return s.appointmentRepo.FindAll(search, filter, userID, role)
}

func (s *appointmentService) GetUserAppointments(userID uint) ([]models.Appointment, error) {
	return s.appointmentRepo.FindByUserID(userID)
}

func (s *appointmentService) BookAppointment(userID uint, req *models.Appointment) (*models.Appointment, error) {
	// Verify schedule exists and has quota
	schedule, err := s.scheduleRepo.FindByID(req.DoctorScheduleID)
	if err != nil {
		return nil, errors.New("schedule not found")
	}

	if !schedule.IsAvailable || schedule.Booked >= schedule.Quota {
		return nil, errors.New("schedule is full or not available")
	}

	// Validate if the schedule is expired (past date/time)
	now := time.Now()
	// Combine schedule.Date (time.Time) and schedule.EndTime (string)
	scheduleEndStr := fmt.Sprintf("%s %s", schedule.Date.Format("2006-01-02"), schedule.EndTime)
	
	var scheduleEnd time.Time
	var errParse error
	if len(schedule.EndTime) > 5 {
		scheduleEnd, errParse = time.ParseInLocation("2006-01-02 15:04:05", scheduleEndStr, time.Local)
	} else {
		scheduleEnd, errParse = time.ParseInLocation("2006-01-02 15:04", scheduleEndStr, time.Local)
	}

	if errParse == nil {
		if now.After(scheduleEnd) {
			return nil, errors.New("schedule has already expired")
		}
	}

	schedule.Booked += 1
	err = s.scheduleRepo.Update(schedule)
	if err != nil {
		return nil, err
	}

	req.DoctorID = schedule.DoctorID
	req.UserID = userID
	req.Status = "pending"

	err = s.appointmentRepo.Create(req)
	if err != nil {
		s.rollbackScheduleBooking(schedule)
		return nil, err
	}

	return s.appointmentRepo.FindByID(req.ID)
}

func (s *appointmentService) CancelAppointment(id uint, userID uint, isAdmin bool) error {
	appointment, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return errors.New("appointment not found")
	}

	if !isAdmin && appointment.UserID != userID {
		return errors.New("unauthorized to cancel this appointment")
	}

	if appointment.Status == "cancelled" || appointment.Status == "completed" {
		return errors.New("cannot cancel an already cancelled or completed appointment")
	}

	appointment.Status = "cancelled"
	err = s.appointmentRepo.Update(appointment)
	if err != nil {
		return err
	}

	// Release schedule slot
	schedule, err := s.scheduleRepo.FindByID(appointment.DoctorScheduleID)
	if err == nil && schedule.Booked > 0 {
		schedule.Booked -= 1
		s.scheduleRepo.Update(schedule)
	}

	return nil
}

func (s *appointmentService) ApproveAppointment(id uint) error {
	appointment, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return errors.New("appointment not found")
	}

	if appointment.Status != "pending" {
		return errors.New("can only approve pending appointments")
	}

	appointment.Status = "approved"
	return s.appointmentRepo.Update(appointment)
}

func (s *appointmentService) rollbackScheduleBooking(schedule *models.DoctorSchedule) {
	schedule.Booked -= 1
	s.scheduleRepo.Update(schedule)
}

func (s *appointmentService) CompleteAppointment(id uint) error {
	appointment, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return errors.New("appointment not found")
	}

	if appointment.Status != "approved" {
		return errors.New("can only complete approved appointments")
	}

	appointment.Status = "completed"
	return s.appointmentRepo.Update(appointment)
}
