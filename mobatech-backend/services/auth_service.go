package services
import (
	"context"
	"backend/models"
	"backend/repositories"
	"errors"
	"os"
	"time"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)
type AuthService interface {
	Register(fullName, email, phone, password string) (*models.User, error)
	Login(email, password string) (string, *models.User, error)
	GoogleLogin(ctx context.Context, idToken string) (string, *models.User, error)
	GetUser(userID uint) (*models.User, error)
	UpdateProfile(userID uint, fullName, phone, imagePath, bloodType string, height int, weight int, allergies, dob, gender string) (*models.User, error)
	AddFamilyMember(member *models.FamilyMember) error
	DeleteFamilyMember(id uint) error
	GetAllUsers(search string, filter string, roleFilter string, viewerID uint, viewerRole string, limit int, offset int) ([]models.User, int64, error)
	AdminCreateUser(fullName, email, phone, password, role, imageURL string) (*models.User, error)
	AdminUpdateUser(id uint, fullName, email, phone, role, imageURL string) (*models.User, error)
	DeleteUser(id uint) error
}
type authService struct {
	repo repositories.AuthRepository
}
func NewAuthService(repo repositories.AuthRepository) AuthService {
	return &authService{repo}
}
func (s *authService) Register(fullName, email, phone, password string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &models.User{FullName: fullName, Email: email, PhoneNumber: phone, Password: string(hashedPassword), Role: "patient"}
	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}
	return user, nil
}
func (s *authService) Login(email, password string) (string, *models.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", nil, errors.New("invalid email or password")
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", nil, errors.New("JWT_SECRET is not configured on the server")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID, "role": user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", nil, err
	}
	return tokenString, user, nil
}
func (s *authService) GetUser(userID uint) (*models.User, error) {
	return s.repo.FindByID(userID)
}
func (s *authService) GetAllUsers(search string, filter string, roleFilter string, viewerID uint, viewerRole string, limit int, offset int) ([]models.User, int64, error) {
	return s.repo.GetAllUsers(search, filter, roleFilter, viewerID, viewerRole, limit, offset)
}
func (s *authService) AddFamilyMember(member *models.FamilyMember) error {
	return s.repo.AddFamilyMember(member)
}
func (s *authService) DeleteFamilyMember(id uint) error {
	return s.repo.DeleteFamilyMember(id)
}
func (s *authService) DeleteUser(id uint) error {
	return s.repo.DeleteUser(id)
}
func (s *authService) UpdateProfile(userID uint, fullName, phone, imagePath, bloodType string, height int, weight int, allergies, dob, gender string) (*models.User, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	s.applyProfileUpdates(user, fullName, phone, imagePath, bloodType, height, weight, allergies, dob, gender)
	if err := s.repo.UpdateUser(user); err != nil {
		return nil, err
	}
	return user, nil
}
func (s *authService) applyProfileUpdates(user *models.User, fullName, phone, imagePath, bloodType string, height int, weight int, allergies, dob, gender string) {
	if fullName != "" { user.FullName = fullName }
	if phone != "" { user.PhoneNumber = phone }
	if imagePath != "" { user.ImageURL = imagePath }
	if bloodType != "" { user.BloodType = bloodType }
	if height > 0 { user.Height = height }
	if weight > 0 { user.Weight = weight }
	if allergies != "" { user.Allergies = allergies }
	if dob != "" { user.DateOfBirth = dob }
	if gender != "" { user.Gender = gender }
}

func (s *authService) GoogleLogin(ctx context.Context, idToken string) (string, *models.User, error) {
	email, name, photo, err := VerifyFirebaseIDToken(ctx, idToken)
	if err != nil {
		return "", nil, err
	}

	if email == "" {
		return "", nil, errors.New("firebase token does not contain a valid email address")
	}

	user, err := s.repo.FindByEmail(email)
	if err != nil {
		user = &models.User{
			FullName:    name,
			Email:       email,
			PhoneNumber: "-",
			Password:    "",
			Role:        "patient",
			ImageURL:    photo,
		}
		if err := s.repo.CreateUser(user); err != nil {
			return "", nil, err
		}
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", nil, errors.New("JWT_SECRET is not configured on the server")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", nil, err
	}
	return tokenString, user, nil
}
