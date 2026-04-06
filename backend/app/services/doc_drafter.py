from langchain_groq import ChatGroq
from app.core.config import settings

class MultilingualDocDrafter:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if self.api_key:
            self.model = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.model = None
    
    def generate_draft(self, description: str, doc_type: str, language: str = "en"):
        if not self.model:
            return "Document drafting is unavailable because the GROQ_API_KEY is missing. Please add it to the environment variables."
            
        print(f"Generating draft for type: {doc_type}, language: {language}")
        templates = {
            "FIR": "Draft a formal First Information Report (FIR) to be filed at a Police Station in India. Include sections for: Police Station details, Informant info, Date/Time/Place of Occurrence, Details of incident, Sections of IPC/BNS if applicable, and Prayer for action.",
            "RTI": "Draft a formal Right to Information (RTI) application under the RTI Act, 2005. Include: Details of the Public Authority, Specific information requested, Time period of info, Declaration of citizenship, and Payment of fee details.",
            "Bail Application": "Draft a formal Bail Application to be filed in an Indian court. Include: Case details (FIR No, Police Station), Grounds for bail, Undertaking to cooperate with investigation, and Prayer for relief.",
            "Consumer Complaint": "Draft a formal Consumer Complaint for the Consumer Forum. Include: Details of parties, Facts of the case, Deficiency in service or defect in goods, Loss suffered, and Compensation claimed."
        }

        template_instruction = templates.get(doc_type, f"Draft a formal {doc_type} in India.")
        
        system_prompt = f"""
        You are Nyaya AI, a professional legal assistant. Your goal is to draft court-ready Indian legal documents.
        
        CRITICAL RULES:
        - Never use section headers like "DIRECT ANSWER" or "EXPLANATION".
        - Never output any text before or after the formal document. No preamble, no "Here is your draft", no advice after the signature.
        - Hard stop after the final signature/verification block.
        - Use [___] for missing personal details.
        - Use professional legal formatting (e.g., "BEFORE THE HON'BLE COURT...", "IN THE MATTER OF...").

        DOCUMENT-SPECIFIC STRUCTURES:
        1. FIR: Police Station details, Informant info, Incident details, IPC/BNS sections, Prayer.
        2. RTI: Public Authority details, Specific info requested, Citizenship declaration, Fee details.
        3. Bail: Case details, FIR No, Grounds for bail, Undertaking, Prayer for relief, Verification.
        4. Consumer: Party details, Facts, Deficiency in service, Loss suffered, Compensation, Prayer.
        5. Legal Notice: Sender/Recipient details, Facts, Legal demand, Deadline (e.g., 15 days), Consequences.
        6. Affidavit: Deponent details, Facts in numbered paragraphs, Verification clause.

        Document Type: {doc_type}
        Language: {language}
        Situation: {description}

        Draft the {doc_type} now in {language}:
        """
        
        try:
            print("Invoking Groq model...")
            response = self.model.invoke(system_prompt)
            print("Model response received.")
            return response.content
        except Exception as e:
            print(f"Error in Groq invoke: {e}")
            return f"Error generating draft: {e}"
