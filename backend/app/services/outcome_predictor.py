from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.services.search_engine import LegalSearchEngine
import os
import json

class CaseOutcomePredictor:
    def __init__(self, search_engine: LegalSearchEngine):
        self.search_engine = search_engine
        self.api_key = settings.GROQ_API_KEY
        if self.api_key:
            self.llm = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.llm = None
        
        # Lazy loading for BERT to save startup time and memory
        self._tokenizer = None
        self._model = None

        template = """
        You are an advanced Legal Outcome Predictor for the Indian Judicial System.
        Your goal is to analyze the provided case facts and retrieved legal precedents to predict the likely outcome of a case.

        IMPORTANT: If the user provides a general or hypothetical query (e.g., "what if I have a car accident?"), do NOT say "insufficient data". Instead, provide a "Standard Legal Trajectory" prediction based on typical cases and the Motor Vehicles Act.

        USER CASE FACTS:
        {facts}

        RETRIEVED PRECEDENTS & LEGAL CONTEXT:
        {context}

        Based on the above, provide a structured prediction in JSON format with the following keys:
        1. "predicted_for": Identify who the user likely is in this scenario (e.g., "Victim / Complainant" or "Accused / Respondent").
        2. "win_probability": A float between 0 and 1 representing the likelihood of a favourable judgement FOR THE IDENTIFIED ROLE.
        3. "judgement_type": A string (e.g., "Favourable", "Unfavourable", "Conditional Relief", "Standard MACT Procedure").
        4. "settlement_range": A suggested settlement range in INR. MANDATORY: If no specific amount can be calculated, provide a typical range for this case type (e.g., "₹2,00,000 - ₹5,00,000 for minor injury"). NEVER leave this empty or say "N/A".
        5. "reasoning": A detailed explanation. 
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
           ADVANCED RESPONSE INTELLIGENCE RULES (Apply to this field)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
           A. SEMANTIC CHUNKING: Each paragraph = one complete idea.
           B. PROGRESSIVE DISCLOSURE: Simple answer → Plain language → Technical detail.
           C. ENTITY ANCHORING: Bold the single most critical legal entity (section, case, deadline) once per paragraph.
           D. COGNITIVE LOAD: Max 7 bullets per block.
           E. TRANSITIONS: Use bridge sentences between sections.
           F. EMOTIONAL INTELLIGENCE: If the user is distressed, start the reasoning with ONE empathy sentence.
           G. SCOPED UNCERTAINTY: Be precise about what varies by state or jurisdiction.
           H. REGISTER MIRRORING: Match the user's vocabulary level.
        6. "key_risks": A list of potential legal risks (e.g., "Lack of valid insurance", "Delay in FIR", "Contributory negligence").

        Ensure the output is strictly valid JSON.
        """
        self.prompt = ChatPromptTemplate.from_template(template)

    @property
    def tokenizer(self):
        if self._tokenizer is None:
            from transformers import AutoTokenizer
            self._tokenizer = AutoTokenizer.from_pretrained(settings.LEGAL_BERT_PATH)
        return self._tokenizer

    @property
    def model(self):
        if self._model is None:
            from transformers import AutoModel
            import torch
            self._model = AutoModel.from_pretrained(settings.LEGAL_BERT_PATH)
        return self._model
    
    def get_bert_embeddings(self, text: str):
        import torch
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state[:, 0, :].numpy()
    
    def predict(self, case_facts: str):
        if not self.llm:
            return {
                "win_probability": 0.0,
                "judgement_type": "Service Unavailable",
                "settlement_range": "N/A",
                "reasoning": "Case Prediction is disabled because the GROQ_API_KEY is missing.",
                "key_risks": ["System configuration incomplete"]
            }
            
        # 1. Retrieve similar precedents using the search engine
        search_results = self.search_engine.search(case_facts, top_k=5)
        context_text = "\n\n---\n\n".join([res['content'] for res in search_results['sources']])

        # 2. Format the prompt
        formatted_prompt = self.prompt.format(
            facts=case_facts,
            context=context_text
        )

        # 3. Get prediction from LLM
        response = self.llm.invoke(formatted_prompt).content
        
        try:
            # Clean the response to ensure valid JSON
            clean_response = response.strip()
            # Remove markdown JSON wrappers if present
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:].strip()
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3].strip()
            
            # Find the first { and last } to isolate the JSON object
            start_idx = clean_response.find("{")
            end_idx = clean_response.rfind("}")
            if start_idx != -1 and end_idx != -1:
                clean_response = clean_response[start_idx:end_idx+1]
            
            prediction_data = json.loads(clean_response)
            
            # Ensure win_probability is a float
            if isinstance(prediction_data.get("win_probability"), str):
                prediction_data["win_probability"] = 0.65 # Default if string
                
            return prediction_data
        except Exception as e:
            print(f"Error parsing LLM prediction: {e}")
            # Fallback to a structured default if parsing fails
            return {
                "win_probability": 0.5,
                "judgement_type": "Inconclusive",
                "settlement_range": "N/A",
                "reasoning": "The AI could not generate a clear prediction. Please provide more case facts.",
                "key_risks": ["Insufficient data for analysis"]
            }
