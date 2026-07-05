package services

import (
	"backend/models"
	"backend/repositories"
	"context"
	"fmt"

	"github.com/google/generative-ai-go/genai"
)

type ChatService interface {
	CreateSession(userID string, title string) (*models.ChatSession, error)
	GetUserSessions(userID string) ([]models.ChatSession, error)
	GetSessionMessages(sessionID uint) ([]models.ChatMessage, error)
	DeleteSession(userID uint, sessionID uint) error
	RenameSession(userID uint, sessionID uint, newTitle string) error
	StreamChat(ctx context.Context, sessionID uint, userMessage string, outChan chan<- string, errChan chan<- error)
	GetAllSessions(search string) ([]models.ChatSession, error)
}

type chatService struct {
	repo repositories.ChatRepository
}

func NewChatService(repo repositories.ChatRepository) ChatService {
	return &chatService{repo}
}

func (s *chatService) CreateSession(userID string, title string) (*models.ChatSession, error) {
	session := &models.ChatSession{UserID: userID, Title: title}
	return session, s.repo.CreateSession(session)
}

func (s *chatService) GetUserSessions(userID string) ([]models.ChatSession, error) {
	return s.repo.GetUserSessions(userID)
}

func (s *chatService) GetSessionMessages(sessionID uint) ([]models.ChatMessage, error) {
	return s.repo.GetSessionMessages(sessionID)
}

func (s *chatService) DeleteSession(userID uint, sessionID uint) error {
	return s.repo.DeleteSession(userID, sessionID)
}

func (s *chatService) RenameSession(userID uint, sessionID uint, newTitle string) error {
	return s.repo.RenameSession(userID, sessionID, newTitle)
}

func (s *chatService) GetAllSessions(search string) ([]models.ChatSession, error) {
	return s.repo.GetAllSessions(search)
}

func (s *chatService) StreamChat(ctx context.Context, sessionID uint, userMessage string, outChan chan<- string, errChan chan<- error) {
	defer close(outChan)
	defer close(errChan)

	if err := s.saveUserMessage(sessionID, userMessage); err != nil {
		errChan <- err
		return
	}

	historyMsg, err := s.repo.GetSessionMessages(sessionID)
	if err != nil {
		errChan <- fmt.Errorf("failed to get history: %v", err)
		return
	}

	if len(historyMsg) == 1 {
		go s.asyncGenerateTitle(sessionID, userMessage)
	}

	model, client, err := s.setupGemini(ctx)
	if err != nil {
		errChan <- err
		return
	}
	defer client.Close()

	cs := model.StartChat()
	s.populateHistory(cs, historyMsg, userMessage)

	// RAG Integration
	ragQuery := s.buildRAGPrompt(userMessage)

	iter := cs.SendMessageStream(ctx, genai.Text(ragQuery))
	s.processStream(iter, outChan, errChan, sessionID)
}

func (s *chatService) saveUserMessage(sessionID uint, userMessage string) error {
	err := s.repo.AddMessage(&models.ChatMessage{
		SessionID: sessionID,
		Role:      "user",
		Content:   userMessage,
	})
	if err != nil {
		return fmt.Errorf("failed to save user message: %v", err)
	}
	return nil
}

func (s *chatService) asyncGenerateTitle(sessionID uint, firstMessage string) {
	ctx := context.Background()
	model, client, err := s.setupGemini(ctx)
	if err != nil {
		return
	}
	defer client.Close()
	
	prompt := fmt.Sprintf("Create a short (max 4 words) and natural title for a medical chat session starting with this prompt. No quotes, no punctuation. Prompt: %s", firstMessage)
	
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err == nil && len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		title := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])
		s.repo.UpdateSessionTitle(sessionID, title)
	}
}

