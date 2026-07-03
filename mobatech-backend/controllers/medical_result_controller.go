package controllers

import (
	"backend/models"
	"backend/services"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MedicalResultController struct {
	service services.MedicalResultService
}

func NewMedicalResultController(service services.MedicalResultService) *MedicalResultController {
	return &MedicalResultController{service}
}

func (c *MedicalResultController) GetAll(ctx *gin.Context) {
	search := ctx.Query("search")
	filter := ctx.Query("filter")

	roleFloat, _ := ctx.Get("role")
	role := ""
	if roleFloat != nil {
		role = roleFloat.(string)
	}

	userIDFloat, _ := ctx.Get("user_id")
	userID := uint(0)
	if userIDFloat != nil {
		userID = uint(userIDFloat.(float64))
	}

	results, err := c.service.GetAllMedicalResults(search, filter, userID, role)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", results))
}

func (c *MedicalResultController) GetUserResults(ctx *gin.Context) {
	userIDFloat, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDFloat.(float64))

	results, err := c.service.GetUserMedicalResults(userID)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", results))
}

func (c *MedicalResultController) GetByID(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)
	result, err := c.service.GetMedicalResultByID(uint(id))
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrNotFound, http.StatusNotFound, err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", result))
}

func (c *MedicalResultController) Create(ctx *gin.Context) {
	role, exists := ctx.Get("role")
	if !exists || role != "doctor" {
		ctx.JSON(http.StatusForbidden, utils.BuildError(utils.ErrUnauthorized, "Aksi klinis ditolak. Hanya Dokter yang berhak menambah hasil medis.", nil))
		return
	}

	var req models.MedicalResult
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	result, err := c.service.CreateMedicalResult(&req)
	if err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", result))
}

func (c *MedicalResultController) Update(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)

	var req models.MedicalResult
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	req.ID = uint(id)

	result, err := c.service.UpdateMedicalResult(&req)
	if err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", result))
}

func (c *MedicalResultController) Delete(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err := c.service.DeleteMedicalResult(uint(id)); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}
