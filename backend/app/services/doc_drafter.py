from langchain_groq import ChatGroq
from app.core.config import settings

class MultilingualDocDrafter:
    def __init__(self):
        self.model = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)
    
    def generate_draft(self, description: str, doc_type: str, language: str = "en"):
        print(f"Generating draft for type: {doc_type}, language: {language}")
        templates = {
            "FIR": "Draft a formal First Information Report (FIR) to be filed at a Police Station in India. Include sections for: Police Station details, Informant info, Date/Time/Place of Occurrence, Details of incident, Sections of IPC/BNS if applicable, and Prayer for action.",
            "RTI": "Draft a formal Right to Information (RTI) application under the RTI Act, 2005. Include: Details of the Public Authority, Specific information requested, Time period of info, Declaration of citizenship, and Payment of fee details.",
            "Bail Application": "Draft a formal Bail Application to be filed in an Indian court. Include: Case details (FIR No, Police Station), Grounds for bail, Undertaking to cooperate with investigation, and Prayer for relief.",
            "Consumer Complaint": "Draft a formal Consumer Complaint for the Consumer Forum. Include: Details of parties, Facts of the case, Deficiency in service or defect in goods, Loss suffered, and Compensation claimed."
        }

        template_instruction = templates.get(doc_type, f"Draft a formal {doc_type} in India.")
        
        system_prompt = f"""
        You are an expert Indian Legal Drafter. Your task is to generate a professional, ready-to-file legal document.
        Document Type: {doc_type}
        Language: {language}
        Instruction: {template_instruction}
        Situation: {description}

        FORMATTING RULES:
        1. Use professional legal headers (e.g., "BEFORE THE HON'BLE COURT OF...", "IN THE MATTER OF...").
        2. Use clear bold headings for each section (e.g., **FACTS OF THE CASE**, **PRAYER**, etc.).
        3. Use professional numbering (1, 2, 3...) for paragraphs.
        4. Use [PLACEHOLDERS IN BRACKETS] for all personal information like Name, Address, Date, etc.
        5. The final output must be in beautiful Markdown format so it looks like a real printed document.
        6. Provide the final output in {language}.

        Legal Requirements:
        - Use formal legal terminology relevant to the Indian Judiciary.
        - Ensure the structure is correct for the specific document type.
        """
        
        try:
            print("Invoking Groq model...")
            response = self.model.invoke(system_prompt)
            print("Model response received.")
            return response.content
        except Exception as e:
            print(f"Error in Groq invoke: {e}")
            return f"Error generating draft: {e}"
