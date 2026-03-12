from rag.resume_parser import extract_text_from_pdf
from rag.chunker import chunk_text
from rag.vector_store import create_embeddings

def ingest_resume(path):

    text = extract_text_from_pdf(path)

    chunks = chunk_text(text)

    create_embeddings(chunks)