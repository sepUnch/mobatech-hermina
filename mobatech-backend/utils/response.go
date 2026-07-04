package utils

import (
	"math"
	"time"

	"github.com/gin-gonic/gin"
)

type MetaData struct {
	Timestamp string `json:"timestamp"`
	RequestID string `json:"request_id,omitempty"`
}

type SuccessResponse struct {
	Success bool        `json:"success"`
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Meta    MetaData    `json:"meta"`
}

type ErrorResponse struct {
	Success bool        `json:"success"`
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Errors  interface{} `json:"errors"`
	Meta    MetaData    `json:"meta"`
}

func BuildSuccess(code, message string, data interface{}) SuccessResponse {
	return SuccessResponse{
		Success: true,
		Code:    code,
		Message: message,
		Data:    data,
		Meta: MetaData{
			Timestamp: time.Now().Format(time.RFC3339),
		},
	}
}

func BuildError(code, message string, errors interface{}) ErrorResponse {
	return ErrorResponse{
		Success: false,
		Code:    code,
		Message: message,
		Errors:  errors,
		Meta: MetaData{
			Timestamp: time.Now().Format(time.RFC3339),
		},
	}
}

func BuildPaginatedSuccess(message string, data interface{}, page int, limit int, totalData int64) gin.H {
	totalPages := 0
	if limit > 0 {
		totalPages = int(math.Ceil(float64(totalData) / float64(limit)))
	}
	return gin.H{
		"success": true,
		"code":    "OK",
		"message": message,
		"data":    data,
		"meta": gin.H{
			"timestamp":    time.Now().Format(time.RFC3339),
			"current_page": page,
			"limit":        limit,
			"total_data":   totalData,
			"total_pages":  totalPages,
		},
	}
}
