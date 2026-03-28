import pytesseract
from PIL import Image
import io

class OCRService:
    def __init__(self):
        # Note: In a real production environment, you must ensure Tesseract-OCR is installed on the OS.
        # For Windows, you might need to set the path:
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass

    def extract_text(self, image_bytes: bytes) -> str:
        """Extracts text from an image (JPEG, PNG, etc.) using Tesseract OCR."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            print(f"OCR Error: {e}")
            return ""
