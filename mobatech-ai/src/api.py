import logging
from fastapi import FastAPI
from pydantic import BaseModel
from services.anonymizer import AnonymizationEngine
from services.rag_search import VectorSearchEngine
from services.sync_engine import SyncEngine
from services.llm_engine import GenerativeEngine
from apscheduler.schedulers.background import BackgroundScheduler
import os

app = FastAPI(title="Hermina AI Orchestrator")

anonymizer = AnonymizationEngine()
llm_engine = GenerativeEngine()

data_path = os.path.join(os.path.dirname(__file__), "../data/mock_medical_knowledge.csv")
backend_env_path = os.path.join(os.path.dirname(__file__), "../../mobatech-backend/.env")

vector_search = VectorSearchEngine(data_path)
vector_search.build_index()

sync_engine = SyncEngine(data_path, backend_env_path)

scheduler = BackgroundScheduler()

@scheduler.scheduled_job('cron', minute=0) # Runs every hour at minute 0
def automated_daily_sync():
    logging.info("Running automated hourly Vector DB sync...")
    if sync_engine.sync_database():
        vector_search.build_index()

scheduler.start()

class PromptRequest(BaseModel):
    query: str

class RAGResponse(BaseModel):
    anonymized_query: str
    context: list[str]

class ChatResponse(BaseModel):
    query: str
    answer: str
    context_used: int

@app.post("/api/rag/sync")
def sync_rag():
    success = sync_engine.sync_database()
    if not success:
        return {"status": "error", "message": "Database synchronization failed"}
    rebuilt = vector_search.build_index()
    if not rebuilt:
        return {"status": "error", "message": "Failed to rebuild FAISS index"}
    return {"status": "success", "message": "Vector DB synced and rebuilt successfully"}

@app.get("/api/rag/status")
def get_rag_status():
    return {
        "status": "active",
        "vector_count": vector_search.index.ntotal,
        "knowledge_base_size": len(vector_search.knowledge_base)
    }

@app.post("/api/rag/context", response_model=RAGResponse)
def get_rag_context(req: PromptRequest):
    safe_query = anonymizer.anonymize(req.query)
    context_chunks = vector_search.search(safe_query, top_k=10)
    return RAGResponse(anonymized_query=safe_query, context=context_chunks)

@app.post("/api/rag/chat", response_model=ChatResponse)
def get_rag_chat(req: PromptRequest):
    safe_query = anonymizer.anonymize(req.query)
    context_chunks = vector_search.search(safe_query, top_k=10)
    
    answer = llm_engine.generate_response(safe_query, context_chunks)
    
    return ChatResponse(
        query=req.query,
        answer=answer,
        context_used=len(context_chunks)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
