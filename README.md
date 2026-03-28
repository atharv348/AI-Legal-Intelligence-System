# AI Legal Intelligence System (ALIS)

## Problem Statement
India's legal system faces a massive backlog of **50 million pending court cases**. Approximately **70% of citizens cannot afford a lawyer**, and undertrial prisoners often wait over **3 years** for their first hearing. Legal professionals spend countless hours manually searching through **200 years of case law** across **22 languages** to find relevant precedents. Furthermore, legal documents are often filled with dense legalese, making them inaccessible to the very people they concern.

## Solution — AI Legal Intelligence System
ALIS is an end-to-end AI platform designed to transform the Indian legal landscape through five core capabilities:

1.  **Semantic RAG Search Engine**: High-speed retrieval over **15 million Indian court judgements**. Lawyers and citizens can type questions in plain English or Hindi and receive relevant precedents in seconds.
2.  **Case Outcome Predictor**: A predictive model trained on **500,000 labelled judgements**. By analyzing case facts using **Legal-BERT embeddings and XGBoost**, it provides win probabilities and likely judgement types.
3.  **Multilingual Legal Document Drafter**: An LLM-powered tool that generates ready-to-file bail applications, RTI requests, or consumer complaints in correct legal formats based on descriptions provided in **Marathi, Hindi, or English**.
4.  **Citizen Rights Chatbot**: A WhatsApp-integrated assistant available in **10 Indian languages**. It is strictly grounded in **Retrieval-Augmented Generation (RAG)** to ensure accuracy and prevent hallucinations.
5.  **Court Docket Intelligence Dashboard**: A specialized tool for administrators to flag long-pending cases, detect **adjournment abuse patterns**, and recommend triage priorities for faster justice delivery.

## Core Stack
The system is built on a modern, high-performance AI and web stack:
-   **AI & NLP**: Llama 3.1 (via Groq), Legal-BERT, IndicBERT, LangChain, LlamaIndex.
-   **Databases**: ChromaDB (Vector Store), Neo4j (Knowledge Graph), Excel (User Data Persistence).
-   **Backend**: FastAPI (Python), JWT Authentication, Web Speech API (Voice-to-Text).
-   **Frontend**: Next.js 16.2.1 (Turbopack), Tailwind CSS, Lucide Icons.
-   **Deployment & Infrastructure**: Vercel (Frontend), Supabase, Gemini API.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key (for LLM services)

### Installation

#### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set up your `.env` file with `GROQ_API_KEY`.
4. Run the server: `uvicorn app.main:app --reload`.

#### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## License
This project is licensed under the MIT License.
