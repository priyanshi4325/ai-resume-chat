from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag.chat_engine import ask_resume
from rag.ingest_resume import ingest_resume
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    print(f"📁 Received file: {file.filename}")

    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Ingest into vector store
    ingest_resume(temp_path)

    # Clean up temp file
    os.remove(temp_path)

    print("✅ Ingest complete")
    return {"message": f"Resume '{file.filename}' uploaded and indexed successfully"}

@app.post("/chat")
def chat(q: Question):
    answer = ask_resume(q.question)
    return {"answer": answer}

@app.get("/health")
def health():
    return {"status": "ok"}