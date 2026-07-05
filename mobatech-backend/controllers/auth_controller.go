package controllers
import (
	"backend/services"
	"backend/utils"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)
type AuthController struct {
	service services.AuthService
}
func NewAuthController(service services.AuthService) *AuthController {
	return &AuthController{service}
}
func (c *AuthController) Register(ctx *gin.Context) {
	var req struct {
		FullName    string `json:"full_name" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		PhoneNumber string `json:"phone_number" binding:"required"`
		Password    string `json:"password" binding:"required,min=6"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	user, err := c.service.Register(req.FullName, req.Email, req.PhoneNumber, req.Password)
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrConflict, http.StatusConflict, "Email sudah terdaftar atau terjadi kesalahan server."))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", user))
}
func (c *AuthController) Login(ctx *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	token, user, err := c.service.Login(req.Email, req.Password)
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Email atau kata sandi salah."))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", gin.H{"token": token, "user": user}))
}
func (c *AuthController) GoogleLogin(ctx *gin.Context) {
	var req struct {
		IDToken string `json:"id_token" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	token, user, err := c.service.GoogleLogin(ctx.Request.Context(), req.IDToken)
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Gagal masuk menggunakan Google: " + err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", gin.H{"token": token, "user": user}))
}
func (c *AuthController) Me(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.Error(utils.NewAppError(utils.ErrUnauthenticated, http.StatusUnauthorized, "Unauthorized"))
		return
	}
	user, err := c.service.GetUser(uint(userID.(float64)))
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrNotFound, http.StatusNotFound, "User not found"))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", user))
}
func (c *AuthController) GetAllUsers(ctx *gin.Context) {
	search := ctx.Query("search")
	filter := ctx.Query("filter")
	roleFilter := ctx.Query("role")
	roleFloat, _ := ctx.Get("role")
	viewerRole := ""
	if roleFloat != nil {
		viewerRole = roleFloat.(string)
	}
	
	userIDFloat, _ := ctx.Get("user_id")
	viewerID := uint(0)
	if userIDFloat != nil {
		viewerID = uint(userIDFloat.(float64))
	}
	
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	users, totalCount, err := c.service.GetAllUsers(search, filter, roleFilter, viewerID, viewerRole, limit, offset)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildPaginatedSuccess("Success", users, page, limit, totalCount))
}
func (c *AuthController) AdminCreateUser(ctx *gin.Context) {
	var req struct {
		FullName    string `json:"full_name" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		PhoneNumber string `json:"phone_number" binding:"required"`
		Password    string `json:"password" binding:"required,min=6"`
		Role        string `json:"role" binding:"required"`
		ImageURL    string `json:"image_url"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	user, err := c.service.AdminCreateUser(req.FullName, req.Email, req.PhoneNumber, req.Password, req.Role, req.ImageURL)
	if err != nil {
		ctx.Error(utils.NewAppError(utils.ErrConflict, http.StatusConflict, "Gagal membuat pengguna."))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", user))
}
func (c *AuthController) AdminUpdateUser(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)
	var req struct {
		FullName    string `json:"full_name"`
		Email       string `json:"email"`
		PhoneNumber string `json:"phone_number"`
		Role        string `json:"role"`
		ImageURL    string `json:"image_url"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.Error(utils.NewValidationError(err.Error()))
		return
	}
	user, err := c.service.AdminUpdateUser(uint(id), req.FullName, req.Email, req.PhoneNumber, req.Role, req.ImageURL)
	if err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", user))
}
func (c *AuthController) AdminDeleteUser(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)
	if err := c.service.DeleteUser(uint(id)); err != nil {
		ctx.Error(utils.NewInternalError(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, utils.BuildSuccess("OK", "Success", nil))
}
