import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class VectorSearchEngine:
    def __init__(self, data_path: str):
        self.data_path = data_path
        # Model specified in the report: paraphrase-multilingual-MiniLM-L12-v2 (dim 384)
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.knowledge_base = []
        
    def build_index(self):
        try:
            df = pd.read_csv(self.data_path)
        except Exception:
            return False
            
        self.knowledge_base = df.to_dict('records')
        texts = [item['teks'] for item in self.knowledge_base]
        
        if not texts:
            self.index = faiss.IndexFlatL2(self.dimension)
            return True

        # Create embeddings
        embeddings = self.model.encode(texts)
        faiss.normalize_L2(embeddings)
        
        # Reset the index before adding new ones
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(embeddings)
        return True
        
    def search(self, query: str, top_k: int = 3) -> list:
        if self.index.ntotal == 0:
            return []
            
        query_vector = self.model.encode([query])
        faiss.normalize_L2(query_vector)
        
        distances, indices = self.index.search(query_vector, top_k)
        
        results = []
        for i in range(top_k):
            idx = indices[0][i]
            if idx != -1:
                results.append(self.knowledge_base[idx]['teks'])
                
        return results
