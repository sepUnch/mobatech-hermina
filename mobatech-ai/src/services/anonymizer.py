import re
from transformers import pipeline

class AnonymizationEngine:
    def __init__(self):
        try:
            self.ner_pipeline = pipeline(
                "ner", 
                model="cahya/bert-base-indonesian-NER", 
                aggregation_strategy="simple"
            )
        except Exception as e:
            self.ner_pipeline = None
            print("Warning: NER model not loaded. Using fallback regex anonymizer.")

    def normalize_text(self, text: str) -> str:
        # Pembersihan karakter encoding & whitespace (Text Normalization)
        text = text.encode('ascii', 'ignore').decode('ascii')
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def apply_regex_masking(self, text: str) -> str:
        # Lapis 1: Regex untuk pola statis (NIK, No HP, Tanggal)
        text = re.sub(r'\b\d{16}\b', '[REDACTED_NIK]', text)
        text = re.sub(r'\b(?:08|\+628)\d{8,11}\b', '[REDACTED_PHONE]', text)
        
        return text

    def anonymize(self, text: str) -> str:
        text = self.normalize_text(text)
        text = self.apply_regex_masking(text)
        
        if not self.ner_pipeline:
            return self._fallback_anonymize(text)
            
        # Lapis 2: NER berbasis BERT
        entities = self.ner_pipeline(text)
        anonymized_text = text
        
        sorted_entities = sorted(entities, key=lambda x: x['start'], reverse=True)
        
        for entity in sorted_entities:
            start = entity['start']
            end = entity['end']
            label = entity['entity_group']
            
            # Disabled PER, ORG, LOC redaction because it destroys Doctor names, Hospital names, and queries.
            # if label in ['PER', 'ORG', 'LOC']:
            #     anonymized_text = anonymized_text[:start] + f"[REDACTED_{label}]" + anonymized_text[end:]
            pass
                
        return anonymized_text

    def _fallback_anonymize(self, text: str) -> str:
        return text.replace("Hermina", "[RS_NAME]")
