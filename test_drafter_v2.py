
import sys
import os
import asyncio
from dotenv import load_dotenv

# Path to the backend .env
env_path = os.path.join(os.getcwd(), 'backend', '.env')
print(f"Loading .env from: {env_path}")
load_dotenv(env_path)

# Verify GROQ_API_KEY
print(f"GROQ_API_KEY exists: {'Yes' if os.getenv('GROQ_API_KEY') else 'No'}")

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.doc_drafter import MultilingualDocDrafter

async def test_drafter():
    drafter = MultilingualDocDrafter()
    print("Testing Document Drafter...")
    try:
        draft = drafter.generate_draft(
            description="I want to file an FIR for a lost mobile phone near Central Railway Station.",
            doc_type="FIR",
            language="en"
        )
        print("Draft generated successfully!")
        print("-" * 50)
        print(draft)
        print("-" * 50)
    except Exception as e:
        print(f"Error generating draft: {e}")

if __name__ == "__main__":
    asyncio.run(test_drafter())
