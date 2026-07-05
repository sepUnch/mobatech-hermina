package services

import (
	"backend/models"
	"backend/repositories"
)

type PharmacyService interface {
	GetAllCategories() ([]models.MedicineCategory, error)
	GetCategoryByID(id uint) (*models.MedicineCategory, error)
	CreateCategory(cat *models.MedicineCategory) error
	UpdateCategory(cat *models.MedicineCategory) error
	DeleteCategory(id uint) error

	GetAllMedicines(categoryID uint, search string, limit int, offset int) ([]models.Medicine, int64, error)
	GetMedicineByID(id uint) (*models.Medicine, error)
	CreateMedicine(med *models.Medicine) error
	UpdateMedicine(med *models.Medicine) error
	DeleteMedicine(id uint) error

	GetPrescriptionsByUserID(userID uint) ([]models.Prescription, error)
	GetPrescriptionByID(id uint) (*models.Prescription, error)
	GetAllPrescriptions() ([]models.Prescription, error)
	CreatePrescription(p *models.Prescription) error
	DeletePrescription(id uint, userID *uint) error
	UpdatePrescriptionStatus(id uint, status string) error

	GetOrdersByUserID(userID uint) ([]models.PharmacyOrder, error)
	GetOrderByID(id uint) (*models.PharmacyOrder, error)
	GetAllOrders(search string, filter string, limit int, offset int) ([]models.PharmacyOrder, int64, error)
	CreateOrder(order *models.PharmacyOrder) error
	UpdateOrderStatus(id uint, status string) error
	UpdateOrderPayment(id uint, paymentStatus string) error

	GetCartByUserID(userID uint) (*models.Cart, error)
	AddToCart(userID uint, medicineID uint, quantity int) error
	UpdateCartItemQuantity(userID uint, cartItemID uint, quantity int) error
	RemoveFromCart(userID uint, cartItemID uint) error
	ClearCart(userID uint) error
}
type pharmacyService struct {
	repo repositories.PharmacyRepository
}

func NewPharmacyService(repo repositories.PharmacyRepository) PharmacyService {
	return &pharmacyService{repo}
}

func (s *pharmacyService) GetAllCategories() ([]models.MedicineCategory, error) {
	return s.repo.GetAllCategories()
}

func (s *pharmacyService) GetCategoryByID(id uint) (*models.MedicineCategory, error) {
	return s.repo.GetCategoryByID(id)
}

func (s *pharmacyService) CreateCategory(cat *models.MedicineCategory) error {
	return s.repo.CreateCategory(cat)
}

func (s *pharmacyService) UpdateCategory(cat *models.MedicineCategory) error {
	return s.repo.UpdateCategory(cat)
}

func (s *pharmacyService) DeleteCategory(id uint) error {
	return s.repo.DeleteCategory(id)
}

func (s *pharmacyService) GetAllMedicines(categoryID uint, search string, limit int, offset int) ([]models.Medicine, int64, error) {
	return s.repo.GetAllMedicines(categoryID, search, limit, offset)
}

func (s *pharmacyService) GetMedicineByID(id uint) (*models.Medicine, error) {
	return s.repo.GetMedicineByID(id)
}

func (s *pharmacyService) CreateMedicine(med *models.Medicine) error {
	return s.repo.CreateMedicine(med)
}

func (s *pharmacyService) UpdateMedicine(med *models.Medicine) error {
	return s.repo.UpdateMedicine(med)
}

func (s *pharmacyService) DeleteMedicine(id uint) error {
	return s.repo.DeleteMedicine(id)
}
