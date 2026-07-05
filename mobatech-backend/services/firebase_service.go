package services

import (
	"context"
	"os"

	firebase "firebase.google.com/go/v4"
)

var firebaseApp *firebase.App

func InitFirebase() error {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		// Fallback: If not specified, firebase.NewApp will try to look for GOOGLE_APPLICATION_CREDENTIALS.
		// We'll proceed but log a warning.
		projectID = "mobatech"
	}

	config := &firebase.Config{
		ProjectID: projectID,
	}

	app, err := firebase.NewApp(context.Background(), config)
	if err != nil {
		return err
	}
	firebaseApp = app
	return nil
}

func VerifyFirebaseIDToken(ctx context.Context, idToken string) (string, string, string, error) {
	if firebaseApp == nil {
		if err := InitFirebase(); err != nil {
			return "", "", "", err
		}
	}

	client, err := firebaseApp.Auth(ctx)
	if err != nil {
		return "", "", "", err
	}

	token, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return "", "", "", err
	}

	email, _ := token.Claims["email"].(string)
	name, _ := token.Claims["name"].(string)
	photo, _ := token.Claims["picture"].(string)

	return email, name, photo, nil
}
