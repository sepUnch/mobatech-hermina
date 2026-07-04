package models

import "gorm.io/gorm"

type ChatSession struct {
	gorm.Model
	UserID   string        `json:"user_id" gorm:"index"`
	Title    string        `json:"title"`
	Messages []ChatMessage `json:"messages" gorm:"foreignKey:SessionID"`
}

type ChatMessage struct {
	gorm.Model
	SessionID uint   `json:"session_id" gorm:"index"`
	Role      string `json:"role"` // "user" or "model"
	Content   string `json:"content"`
}
