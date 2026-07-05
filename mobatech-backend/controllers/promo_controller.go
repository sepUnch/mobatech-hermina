package controllers
import (
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)
type PromoController struct { DB *gorm.DB }
func NewPromoController(db *gorm.DB) *PromoController { return &PromoController{DB: db} }

func (c *PromoController) GetPromos(ctx *gin.Context) {
	var promos []models.Promo
	c.DB.Where("is_active = ?", true).Find(&promos)
	ctx.JSON(http.StatusOK, gin.H{"data": promos})
}

func (c *PromoController) GetAllPromos(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var promos []models.Promo
	var totalCount int64
	query := c.DB.Model(&models.Promo{})
	
	if err := query.Count(&totalCount).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.BuildError(utils.ErrInternal, "Failed to count promos", nil))
		return
	}
	
	if limit > 0 {
		query = query.Limit(limit).Offset(offset)
	}
	
	query.Find(&promos)
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", promos, page, limit, totalCount))
}

func (c *PromoController) CreatePromo(ctx *gin.Context) {
	var req models.Promo
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.BuildError("VALIDATION_ERROR", "Data tidak valid", nil))
		return
	}
	c.DB.Create(&req)
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Promo ditambahkan", req))
}

func (c *PromoController) UpdatePromo(ctx *gin.Context) {
	id := ctx.Param("id")
	var promo models.Promo
	if err := c.DB.First(&promo, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, utils.BuildError("NOT_FOUND", "Promo tidak ditemukan", nil))
		return
	}
	if err := ctx.ShouldBindJSON(&promo); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.BuildError("VALIDATION_ERROR", "Data tidak valid", nil))
		return
	}
	c.DB.Save(&promo)
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Promo diperbarui", promo))
}

func (c *PromoController) DeletePromo(ctx *gin.Context) {
	id := ctx.Param("id")
	c.DB.Delete(&models.Promo{}, id)
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Promo dihapus", nil))
}
