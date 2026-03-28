import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.search_engine import LegalSearchEngine
from app.core.config import settings

def test_article_21():
    print("Testing LegalSearchEngine with 'Article 21' query...")
    engine = LegalSearchEngine()
    result = engine.search("What are the fundamental rights guaranteed under Article 21?")
    
    print("\n--- AI RESPONSE ---\n")
    print(result['answer'])
    print("\n--- SOURCES ---\n")
    for src in result['sources']:
        print(f"- {src['content'][:100]}...")

if __name__ == "__main__":
    test_article_21()
