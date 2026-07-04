package controllers

import (
	"backend/models"
	"backend/services"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DoctorController struct {
	doctorService services.DoctorService
}

func NewDoctorController(doctorService services.DoctorService) *DoctorController {
	return &DoctorController{doctorService}
}

func (c *DoctorController) GetDoctors(ctx *gin.Context) {
	search := ctx.Query("search")
	filter := ctx.Query("filter")
	specialization := ctx.Query("specialization")
	polyclinicID, _ := strconv.ParseUint(ctx.DefaultQuery("polyclinic_id", "0"), 10, 32)
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	doctors, totalCount, err := c.doctorService.GetAllDoctors(search, filter, specialization, uint(polyclinicID), limit, offset)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", doctors, page, limit, totalCount))
}

func (c *DoctorController) GetDoctorByID(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)
	doctor, err := c.doctorService.GetDoctorByID(uint(id))
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrNotFound, http.StatusNotFound, "Doctor not found"))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", doctor))
}

func (c *DoctorController) CreateDoctor(ctx *gin.Context) {
	var doctor models.Doctor
	if err := ctx.ShouldBindJSON(&doctor); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	if err := c.doctorService.CreateDoctor(&doctor); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", doctor))
}

func (c *DoctorController) UpdateDoctor(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)
	var input models.Doctor
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	doctor, err := c.doctorService.UpdateDoctor(uint(id), &input)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", doctor))
}

func (c *DoctorController) DeleteDoctor(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err := c.doctorService.DeleteDoctor(uint(id)); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}
