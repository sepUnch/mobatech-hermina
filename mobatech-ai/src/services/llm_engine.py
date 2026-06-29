import os
import google.generativeai as genai
from dotenv import load_dotenv

backend_env_path = os.path.join(os.path.dirname(__file__), "../../../mobatech-backend/.env")
load_dotenv(backend_env_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
class GenerativeEngine:
    def __init__(self):
        # We use gemini-1.5-pro or gemini-1.5-flash
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def generate_response(self, query: str, contexts: list[str]) -> str:
        if not GEMINI_API_KEY:
            return "Sistem AI sedang offline. Silakan tambahkan GEMINI_API_KEY di environment."
            
        context_str = "\n".join([f"- {c}" for c in contexts])
        prompt = f"""Anda adalah 'Hermina Smart Assistant', asisten virtual medis di RS Hermina.
Gunakan informasi konteks jadwal dan layanan berikut untuk menjawab pertanyaan pengguna.
Jawab dengan ramah, profesional, dan berbahasa Indonesia.
Jika informasi tidak ada di konteks, katakan Anda belum memiliki data tersebut dan arahkan ke Customer Service.

Konteks Sistem (Database Jadwal & Layanan RS):
{context_str}

Pertanyaan Pasien: {query}
"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Maaf, terjadi gangguan pada sistem AI: {str(e)}"
