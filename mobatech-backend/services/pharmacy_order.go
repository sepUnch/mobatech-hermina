package services

import (
	"backend/models"
	"errors"
	"fmt"
	"time"
)

func (s *pharmacyService) GetPrescriptionsByUserID(userID uint) ([]models.Prescription, error) {
	return s.repo.GetPrescriptionsByUserID(userID)
}

func (s *pharmacyService) GetPrescriptionByID(id uint) (*models.Prescription, error) {
	return s.repo.GetPrescriptionByID(id)
}

func (s *pharmacyService) GetAllPrescriptions() ([]models.Prescription, error) {
	return s.repo.GetAllPrescriptions()
}

func (s *pharmacyService) CreatePrescription(p *models.Prescription) error {
	p.Status = "Active"
	return s.repo.CreatePrescription(p)
}

func (s *pharmacyService) DeletePrescription(id uint, userID *uint) error {
	if userID != nil {
		p, err := s.repo.GetPrescriptionByID(id)
		if err != nil {
			return err
		}
		if p.UserID != *userID {
			return errors.New("unauthorized to delete this prescription")
		}
	}
	return s.repo.DeletePrescription(id)
}

func (s *pharmacyService) UpdatePrescriptionStatus(id uint, status string) error {
	return s.repo.UpdatePrescriptionStatus(id, status)
}

func (s *pharmacyService) GetOrdersByUserID(userID uint) ([]models.PharmacyOrder, error) {
	return s.repo.GetOrdersByUserID(userID)
}

func (s *pharmacyService) GetOrderByID(id uint) (*models.PharmacyOrder, error) {
	return s.repo.GetOrderByID(id)
}

func (s *pharmacyService) GetAllOrders(search string, filter string, limit int, offset int) ([]models.PharmacyOrder, int64, error) {
	return s.repo.GetAllOrders(search, filter, limit, offset)
}

func (s *pharmacyService) CreateOrder(order *models.PharmacyOrder) error {
	if len(order.Items) == 0 {
		return errors.New("order must have at least one item")
	}

	order.OrderNumber = fmt.Sprintf("ORD-%d", time.Now().Unix())
	order.Status = "Pending"
	order.PaymentStatus = "Unpaid"

	total, err := s.processOrderItems(order)
	if err != nil {
		return err
	}
	order.TotalPrice = total

	if err := s.repo.CreateOrder(order); err != nil {
		return err
	}

	// Deduct stock
	for _, item := range order.Items {
		s.repo.UpdateMedicineStock(item.MedicineID, -item.Quantity)
	}

	if order.PrescriptionID != nil {
		s.repo.UpdatePrescriptionStatus(*order.PrescriptionID, "Redeemed")
	}

	return nil
}

func (s *pharmacyService) UpdateOrderStatus(id uint, status string) error {
	order, err := s.repo.GetOrderByID(id)
	if err != nil {
		return err
	}

	if status == "Cancelled" && order.Status != "Cancelled" {
		for _, item := range order.Items {
			// Increase stock back by item.Quantity
			s.repo.UpdateMedicineStock(item.MedicineID, item.Quantity)
		}
	} else if order.Status == "Cancelled" && status != "Cancelled" {
		// If order status is changed from Cancelled back to something else, deduct the stock again
		for _, item := range order.Items {
			s.repo.UpdateMedicineStock(item.MedicineID, -item.Quantity)
		}
	}

	return s.repo.UpdateOrderStatus(id, status)
}

func (s *pharmacyService) UpdateOrderPayment(id uint, paymentStatus string) error {
	return s.repo.UpdateOrderPayment(id, paymentStatus)
}

func (s *pharmacyService) processOrderItems(order *models.PharmacyOrder) (float64, error) {
	var total float64
	for i, item := range order.Items {
		med, err := s.repo.GetMedicineByID(item.MedicineID)
		if err != nil {
			return 0, fmt.Errorf("medicine %d not found", item.MedicineID)
		}
		if med.Stock < item.Quantity {
			return 0, fmt.Errorf("insufficient stock for %s", med.Name)
		}
		order.Items[i].Price = med.Price
		order.Items[i].Subtotal = med.Price * float64(item.Quantity)
		total += order.Items[i].Subtotal
	}
	return total, nil
}
