from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Legal Intelligence System"
    API_V1_STR: str = "/api/v1"
    
    # API Keys
    GROQ_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Database
    DATABASE_URL: Optional[str] = None
    VECTOR_DB_PATH: str = "./chroma_db"
    NEO4J_URI: Optional[str] = None
    NEO4J_USER: Optional[str] = None
    NEO4J_PASSWORD: Optional[str] = None
    
    # LangChain Tracing
    LANGCHAIN_TRACING_V2: str = "false"
    LANGCHAIN_API_KEY: Optional[str] = None
    LANGCHAIN_PROJECT: str = "ai-legal-intelligence-system"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-for-development-only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Model Paths
    LEGAL_BERT_PATH: str = "nlpaueb/legal-bert-base-uncased"
    INDICBERT_PATH: str = "ai4bharat/indic-bert"
    
    class Config:
        env_file = ".env"

settings = Settings()
