package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type PharmacyRepository interface {
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
	UpdateMedicineStock(id uint, quantityChange int) error

	GetPrescriptionsByUserID(userID uint) ([]models.Prescription, error)
	GetPrescriptionByID(id uint) (*models.Prescription, error)
	GetAllPrescriptions() ([]models.Prescription, error)
	CreatePrescription(p *models.Prescription) error
	DeletePrescription(id uint) error
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
type pharmacyRepository struct {
	db *gorm.DB
}

func NewPharmacyRepository(db *gorm.DB) PharmacyRepository {
	return &pharmacyRepository{db}
}

func (r *pharmacyRepository) GetAllCategories() ([]models.MedicineCategory, error) {
	var cats []models.MedicineCategory
	err := r.db.Find(&cats).Error
	return cats, err
}

func (r *pharmacyRepository) GetCategoryByID(id uint) (*models.MedicineCategory, error) {
	var cat models.MedicineCategory
	err := r.db.First(&cat, id).Error
	return &cat, err
}

func (r *pharmacyRepository) CreateCategory(cat *models.MedicineCategory) error {
	return r.db.Create(cat).Error
}

func (r *pharmacyRepository) UpdateCategory(cat *models.MedicineCategory) error {
	return r.db.Omit("created_at").Save(cat).Error
}

func (r *pharmacyRepository) DeleteCategory(id uint) error {
	return r.db.Delete(&models.MedicineCategory{}, id).Error
}

func (r *pharmacyRepository) GetAllMedicines(categoryID uint, search string, limit int, offset int) ([]models.Medicine, int64, error) {
	var meds []models.Medicine
	var totalCount int64
	query := r.db.Model(&models.Medicine{})

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("name LIKE ? OR generic_name LIKE ?", searchPattern, searchPattern)
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}

	err := query.Preload("Category").Find(&meds).Error
	return meds, totalCount, err
}

func (r *pharmacyRepository) GetMedicineByID(id uint) (*models.Medicine, error) {
	var med models.Medicine
	err := r.db.Preload("Category").First(&med, id).Error
	return &med, err
}

func (r *pharmacyRepository) CreateMedicine(med *models.Medicine) error {
	return r.db.Create(med).Error
}

func (r *pharmacyRepository) UpdateMedicine(med *models.Medicine) error {
	return r.db.Omit("created_at").Save(med).Error
}

func (r *pharmacyRepository) DeleteMedicine(id uint) error {
	return r.db.Delete(&models.Medicine{}, id).Error
}

func (r *pharmacyRepository) UpdateMedicineStock(id uint, quantityChange int) error {
	return r.db.Model(&models.Medicine{}).Where("id = ?", id).
		UpdateColumn("stock", gorm.Expr("stock + ?", quantityChange)).Error
}
