package main

import (
	"backend/config"
	"backend/controllers"
	"backend/cron"
	"backend/middleware"
	"backend/models"
	"backend/routes"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()

	cron.StartScheduleExpirationCron(config.DB)

	// Ensure uploads directory exists to prevent crash on file upload
	os.MkdirAll("uploads", os.ModePerm)

	// Run Auto Migrations for all models
	config.DB.AutoMigrate(
		&models.User{},
		&models.ChatSession{},
		&models.ChatMessage{},
		&models.MedicalResult{},
		&models.Reminder{},
		&models.MedicineCategory{},
		&models.Medicine{},
		&models.Prescription{},
		&models.PrescriptionItem{},
		&models.PharmacyOrder{},
		&models.PharmacyOrderItem{},
		&models.Cart{},
		&models.CartItem{},
		&models.Branch{},
		&models.Promo{},
	)

	r := gin.Default()
	r.Use(middleware.ErrorHandler())
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	// Routes
	branchCtrl := controllers.NewBranchController(config.DB)
	r.GET("/api/branches", branchCtrl.GetBranches)
	r.GET("/api/branches/:id", branchCtrl.GetBranchByID)
	
	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.POST("/branches", branchCtrl.CreateBranch)
	admin.PUT("/branches/:id", branchCtrl.UpdateBranch)
	admin.DELETE("/branches/:id", branchCtrl.DeleteBranch)

	r.Static("/uploads", "./uploads")

	r.POST("/api/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}
		// Ensure unique filename
		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
		dst := "uploads/" + filename
		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"url": "http://127.0.0.1:8080/uploads/" + filename,
		})
	})

	// Health check endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Sample endpoint to get users
	r.GET("/users", func(c *gin.Context) {
		var users []models.User
		config.DB.Find(&users)
		c.JSON(http.StatusOK, gin.H{"data": users})
	})

	routes.SetupAuthRoutes(r, config.DB)
	routes.SetupChatRoutes(r, config.DB)
	routes.SetupHospitalServiceRoutes(r, config.DB)
	routes.SetupEmergencyRoutes(r, config.DB)
	routes.SetupPharmacyRoutes(r, config.DB)
	routes.SetupDoctorRoutes(r, config.DB)
	routes.SetupPolyclinicRoutes(r, config.DB)
	routes.SetupPatientSupportRoutes(r, config.DB)
	routes.SetupForYouRoutes(r, config.DB)
	routes.SetupPromoRoutes(r, config.DB)
	// Setup RAG Routes
	routes.SetupRAGRoutes(r)

	// Start the server
	r.Run(":8080")
}
