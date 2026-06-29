package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AdminMiddleware validates JWT and marks the request as admin-authorized.
// Uses the same JWT as AuthMiddleware; role distinction can be added later
// when a role field is added to the User model.
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, utils.BuildError(
				utils.ErrUnauthenticated, "Authorization header is required", nil,
			))
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, utils.BuildError(
				utils.ErrUnauthenticated, "Authorization header format must be Bearer {token}", nil,
			))
			return
		}

		tokenString := parts[1]
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			c.AbortWithStatusJSON(http.StatusInternalServerError, utils.BuildError(
				utils.ErrInternal, "JWT_SECRET is not configured on the server", nil,
			))
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, utils.BuildError(
				utils.ErrUnauthenticated, "Invalid or expired token", nil,
			))
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, utils.BuildError(
				utils.ErrUnauthenticated, "Invalid token claims", nil,
			))
			return
		}

		role, ok := claims["role"].(string)
		if !ok || role == "patient" {
			c.AbortWithStatusJSON(http.StatusForbidden, utils.BuildError(
				utils.ErrUnauthorized, "Access denied: Staff only", nil,
			))
			return
		}

		c.Set("user_id", claims["user_id"])
		c.Set("role", role)
		c.Set("is_admin", role == "admin")
		c.Next()
	}
}
