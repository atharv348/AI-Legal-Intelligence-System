import pypdf

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    pdf_path = r"C:\Users\devil\Desktop\ai_fullstack_guide.pdf"
    content = extract_text_from_pdf(pdf_path)
    print(content)
