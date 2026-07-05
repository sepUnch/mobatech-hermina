package routes

import (
	"backend/controllers"
	"backend/middleware"
	"backend/repositories"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupDoctorRoutes(router *gin.Engine, db *gorm.DB) {
	doctorRepo := repositories.NewDoctorRepository(db)
	scheduleRepo := repositories.NewScheduleRepository(db)
	appointmentRepo := repositories.NewAppointmentRepository(db)

	doctorService := services.NewDoctorService(doctorRepo)
	scheduleService := services.NewScheduleService(scheduleRepo)
	appointmentService := services.NewAppointmentService(appointmentRepo, scheduleRepo)

	doctorController := controllers.NewDoctorController(doctorService)
	scheduleController := controllers.NewScheduleController(scheduleService)
	appointmentController := controllers.NewAppointmentController(appointmentService)

	api := router.Group("/api")

	api.GET("/doctors", doctorController.GetDoctors)
	api.GET("/doctors/:id", doctorController.GetDoctorByID)
	api.GET("/doctors/:id/schedules", scheduleController.GetDoctorSchedules)

	// Protected Mobile Endpoints (require authentication)
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/appointments", appointmentController.GetUserAppointments)
		protected.POST("/appointments", appointmentController.BookAppointment)
		protected.POST("/appointments/:id/cancel", appointmentController.CancelAppointment)
	}

	admin := api.Group("/admin")
	admin.Use(middleware.AdminMiddleware())
	{
		admin.POST("/doctors", doctorController.CreateDoctor)
		admin.PUT("/doctors/:id", doctorController.UpdateDoctor)
		admin.DELETE("/doctors/:id", doctorController.DeleteDoctor)

		admin.GET("/schedules", scheduleController.GetAllSchedules)
		admin.POST("/schedules", scheduleController.CreateSchedule)
		admin.PUT("/schedules/:id", scheduleController.UpdateSchedule)
		admin.DELETE("/schedules/:id", scheduleController.DeleteSchedule)

		admin.GET("/appointments", appointmentController.GetAllAppointments)
		admin.POST("/appointments/:id/approve", appointmentController.ApproveAppointment)
		admin.POST("/appointments/:id/complete", appointmentController.CompleteAppointment)
		admin.POST("/appointments/:id/cancel", appointmentController.AdminCancelAppointment)
	}
}
