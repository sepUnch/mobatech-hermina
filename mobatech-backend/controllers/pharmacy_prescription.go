package controllers

import (
	"backend/models"
	"backend/utils"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (c *PharmacyController) GetMyPrescriptions(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDVal.(float64))

	prescriptions, err := c.service.GetPrescriptionsByUserID(userID)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", prescriptions))
}

func (c *PharmacyController) CreatePrescription(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDVal.(float64))

	var req models.Prescription
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewAppError(utils.ErrValidation, http.StatusUnprocessableEntity, err.Error()))
		return
	}
	req.UserID = userID
	req.Status = "Pending"

	if err := c.service.CreatePrescription(&req); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusCreated, utils.BuildSuccess("OK", "Prescription created", req))
}

func (c *PharmacyController) DeletePrescription(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDVal.(float64))

	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	if err := c.service.DeletePrescription(uint(id), &userID); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Prescription deleted", nil))
}

func (c *PharmacyController) authorizePrescriptionAccess(ctx *gin.Context, id int) (*models.Prescription, error) {
	prescription, err := c.service.GetPrescriptionByID(uint(id))
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrNotFound, http.StatusNotFound, "Prescription not found"))
		return nil, err
	}

	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		err = utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized")
		ctx.Error(err)
		return nil, err
	}
	userID := uint(userIDVal.(float64))
	if prescription.UserID != userID {
		err = fmt.Errorf("Access denied")
		ctx.Error(utils.NewAppError(utils.ErrUnauthorized, http.StatusForbidden, err.Error()))
		return nil, err
	}
	return prescription, nil
}

func (c *PharmacyController) GetPrescriptionDetail(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.Atoi(idStr)

	prescription, err := c.authorizePrescriptionAccess(ctx, id)
	if err != nil {
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", prescription))
}
