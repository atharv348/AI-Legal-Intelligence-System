import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))
from app.core.config import settings

def test_search():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    print(f"Loading Chroma from: {settings.VECTOR_DB_PATH}")
    vector_db = Chroma(persist_directory=settings.VECTOR_DB_PATH, embedding_function=embeddings)
    
    query = "Constitution"
    print(f"Searching for: {query}")
    results = vector_db.similarity_search(query, k=2)
    print(f"Found {len(results)} results")
    for i, res in enumerate(results):
        print(f"Result {i+1}: {res.page_content[:100]}...")

if __name__ == "__main__":
    test_search()
