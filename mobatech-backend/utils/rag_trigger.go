package utils

import (
	"log"
	"net/http"
)

// TriggerAsyncRAGSync triggers the Python RAG engine to sync its vector database with MySQL.
// This should be called asynchronously as a goroutine to not block the main request flow.
func TriggerAsyncRAGSync() {
	go func() {
		resp, err := http.Post("http://localhost:8000/api/rag/sync", "application/json", nil)
		if err != nil {
			log.Printf("[RAG Sync] Failed to trigger auto-sync: %v\n", err)
			return
		}
		defer resp.Body.Close()
		log.Println("[RAG Sync] Auto-sync triggered successfully due to data changes.")
	}()
}
