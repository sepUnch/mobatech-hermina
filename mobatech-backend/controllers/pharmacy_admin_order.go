package controllers

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (c *PharmacyController) AdminCreatePrescription(ctx *gin.Context) {
	var p models.Prescription
	if err := ctx.ShouldBindJSON(&p); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	if err := c.service.CreatePrescription(&p); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusCreated, utils.BuildSuccess("CREATED", "Resource created successfully", p))
}

func (c *PharmacyController) AdminGetAllPrescriptions(ctx *gin.Context) {
	prescriptions, err := c.service.GetAllPrescriptions()
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", prescriptions))
}

func (c *PharmacyController) AdminDeletePrescription(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	if err := c.service.DeletePrescription(uint(id), nil); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Prescription deleted", nil))
}

func (c *PharmacyController) AdminUpdatePrescriptionStatus(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	var req struct {
		Status string `json:"status"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	if err := c.service.UpdatePrescriptionStatus(uint(id), req.Status); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}

func (c *PharmacyController) AdminGetAllOrders(ctx *gin.Context) {
	search := ctx.Query("search")
	filter := ctx.Query("filter")
	
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	orders, totalCount, err := c.service.GetAllOrders(search, filter, limit, offset)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", orders, page, limit, totalCount))
}

func (c *PharmacyController) AdminUpdateOrderStatus(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	var req struct {
		Status string `json:"status"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	if err := c.service.UpdateOrderStatus(uint(id), req.Status); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}

func (c *PharmacyController) AdminUpdateOrderPayment(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	var req struct {
		PaymentStatus string `json:"payment_status"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	if err := c.service.UpdateOrderPayment(uint(id), req.PaymentStatus); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}
