# AI Legal Intelligence System (ALIS) 🏛️🤖

ALIS is a cutting-edge, end-to-end AI platform designed to revolutionize the Indian legal system. It provides citizens, lawyers, and judicial officers with intelligent tools for legal research, case analysis, and document drafting.

## 🌟 Key Features

### 1. **Nyaya Analytics Dashboard**
- **Real-time Metrics**: Visualization of 44M+ pending cases across Indian courts.
- **AI Triage**: Automatically prioritizes cases based on duration and petitioner vulnerability.
- **Adjournment Abuse Detection**: Identifies patterns of procedural manipulation using lawyer-wise analytics.

### 2. **Nyaya Citizen Chatbot**
- **Multilingual Support**: Assistance in English, Hindi, Marathi, and Tamil.
- **Voice-to-Text**: Hands-free legal queries using integrated speech recognition.
- **Document OCR**: Upload legal notices or FIRs for instant AI explanation.

### 3. **Legal Knowledge Engine**
- **Semantic Search**: Deep search across 15M+ records, including Supreme Court judgments and the new BNS 2023.
- **Source Citations**: Every AI response is backed by primary legal sources.

### 4. **Case Outcome Predictor**
- **Legal-BERT Analysis**: Win probability prediction trained on 500k+ historical judgments.
- **Risk Assessment**: Identifies procedural and evidentiary risks.

### 5. **Multilingual Doc Drafter**
- **Ready-to-File Docs**: Generates FIRs, RTIs, and Legal Notices in 6+ languages.

## 🛠️ Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python) + Uvicorn
- **AI/ML**: Legal-BERT, Sentence Transformers, Tesseract (OCR)
- **Database**: Excel-based rapid prototyping (User DB) + Vector DB (Legal Knowledge)

## 🚀 Deployment

### Backend (Render)
1. Set up a Web Service on [Render](https://render.com).
2. Use the provided `Dockerfile` or build command: `pip install -r requirements.txt`.
3. Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### Frontend (Vercel)
1. Connect your GitHub repo to [Vercel](https://vercel.com).
2. Set Environment Variable: `VITE_API_BASE_URL` to your Render backend URL.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/alis-legal-ai.git

# Install Backend Dependencies
cd backend
pip install -r requirements.txt

# Install Frontend Dependencies
cd ../frontend
npm install

# Run the project
cd ..
npm run dev
```

## 📜 License
MIT License - 2024 ALIS Team
