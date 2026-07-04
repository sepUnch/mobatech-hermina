package controllers

import (
	"backend/models"
	"backend/services"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AppointmentController struct {
	appointmentService services.AppointmentService
}

func NewAppointmentController(appointmentService services.AppointmentService) *AppointmentController {
	return &AppointmentController{appointmentService}
}

func (c *AppointmentController) GetAllAppointments(ctx *gin.Context) {
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

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	appointments, totalCount, err := c.appointmentService.GetAllAppointments(search, filter, userID, role, limit, offset)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", appointments, page, limit, totalCount))
}

func (c *AppointmentController) GetUserAppointments(ctx *gin.Context) {
	userIDFloat, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDFloat.(float64))

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	appointments, totalCount, err := c.appointmentService.GetUserAppointments(userID, limit, offset)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", appointments, page, limit, totalCount))
}

func (c *AppointmentController) BookAppointment(ctx *gin.Context) {
	userIDFloat, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDFloat.(float64))

	var req models.Appointment
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	appointment, err := c.appointmentService.BookAppointment(userID, &req)
	if err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", appointment))
}

func (c *AppointmentController) CancelAppointment(ctx *gin.Context) {
	userIDFloat, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	userID := uint(userIDFloat.(float64))

	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)

	if err := c.appointmentService.CancelAppointment(uint(id), userID, false); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}

func (c *AppointmentController) AdminCancelAppointment(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)

	if err := c.appointmentService.CancelAppointment(uint(id), 0, true); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}

func (c *AppointmentController) ApproveAppointment(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)

	if err := c.appointmentService.ApproveAppointment(uint(id)); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}

func (c *AppointmentController) CompleteAppointment(ctx *gin.Context) {
	id, _ := strconv.ParseUint(ctx.Param("id"), 10, 32)

	if err := c.appointmentService.CompleteAppointment(uint(id)); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}
