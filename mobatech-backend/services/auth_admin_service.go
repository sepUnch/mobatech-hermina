package services
import (
	"backend/models"
	"errors"
	"golang.org/x/crypto/bcrypt"
)
func (s *authService) AdminCreateUser(fullName, email, phone, password, role, imageURL string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	if role == "" {
		role = "patient"
	}
	user := &models.User{FullName: fullName, Email: email, PhoneNumber: phone, Password: string(hashedPassword), Role: role, ImageURL: imageURL}
	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}
	return user, nil
}
func (s *authService) AdminUpdateUser(id uint, fullName, email, phone, role, imageURL string) (*models.User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("user not found")
	}
	if fullName != "" { user.FullName = fullName }
	if email != "" { user.Email = email }
	if phone != "" { user.PhoneNumber = phone }
	if role != "" { user.Role = role }
	if imageURL != "" { user.ImageURL = imageURL }
	if err := s.repo.UpdateUser(user); err != nil {
		return nil, err
	}
	return user, nil
}
