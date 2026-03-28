import os
import pypdf
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

def load_documents(doc_path):
    # Load documents from a directory
    documents = []
    print(f"Loading documents from {doc_path}...")
    if not os.path.exists(doc_path):
        print(f"Error: Path {doc_path} does not exist.")
        return []
    
    files = [f for f in os.listdir(doc_path) if f.endswith(".pdf") or f.endswith(".txt")]
    print(f"Found {len(files)} files: {files}")
    
    for file in files:
        file_path = os.path.join(doc_path, file)
        try:
            if file.endswith(".pdf"):
                with open(file_path, 'rb') as f:
                    pdf_reader = pypdf.PdfReader(f)
                    content = ""
                    for page in pdf_reader.pages:
                        content += page.extract_text()
                    documents.append(content)
                    print(f"Loaded {file} ({len(content)} characters)")
            elif file.endswith(".txt"):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    documents.append(content)
                    print(f"Loaded {file} ({len(content)} characters)")
        except Exception as e:
            print(f"Error loading {file}: {e}")
    return documents

def main():
    # Get the root directory of the project
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Path to the directory containing legal documents
    doc_path = os.path.join(root_dir, "scripts", "legal_docs")
    
    # Load documents
    documents = load_documents(doc_path)
    
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.create_documents(documents)
    
    # Create embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Create and persist vector store
    vector_db = Chroma.from_documents(
        documents=texts, 
        embedding=embeddings, 
        persist_directory=settings.VECTOR_DB_PATH
    )
    vector_db.persist()
    print("Vector store created and persisted.")

if __name__ == "__main__":
    main()
