# 🤖 AI Resume Chat

An AI-powered chatbot that lets you upload a resume (PDF) and ask questions about it in natural language.

**Live Demo:** [ai-resume-chat.vercel.app](https://ai-resume-chat.vercel.app)

---

## ✨ Features

- 📄 Upload any resume as a PDF
- 💬 Ask natural language questions about the resume
- ⚡ Semantic search using vector embeddings
- 🔄 Auto-refreshes on every new upload — no stale data

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, deployed on Vercel |
| Backend | FastAPI + Uvicorn, deployed on Render |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector Store | ChromaDB (in-memory) |
| LLM | OpenAI GPT |
| PDF Parsing | PyPDF2 / pdfplumber |

---

## 🏗️ Project Structure

```
ai-resume-chat/
├── backend/
│   ├── chat_api.py          # FastAPI app, /upload and /chat endpoints
│   ├── requirements.txt
│   └── rag/
│       ├── chat_engine.py   # Calls LLM with retrieved context
│       ├── vector_store.py  # ChromaDB embeddings + search
│       ├── ingest_resume.py # Orchestrates parse → chunk → embed
│       ├── resume_parser.py # Extracts text from PDF
│       └── chunker.py       # Splits text into chunks
└── frontend/
    ├── src/
    │   └── Chat.jsx         # Main chat UI
    └── vite.config.js
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API key

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create .env file
echo OPENAI_API_KEY=sk-your-key-here > .env

uvicorn chat_api:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`

---

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |

Set this in a `.env` file locally, or in the Render dashboard for production.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload a PDF resume |
| POST | `/chat` | Ask a question about the resume |
| GET | `/health` | Health check |

---

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com) — connect GitHub repo, set root to `frontend`
- **Backend** → [Render](https://render.com) — connect GitHub repo, set root to `backend`, add `OPENAI_API_KEY` env variable

---

## 📝 How It Works

1. User uploads a PDF resume
2. Backend extracts text and splits it into chunks
3. Each chunk is embedded using OpenAI's embedding model
4. Embeddings are stored in ChromaDB
5. When a question is asked, it's embedded and matched against stored chunks
6. The top matching chunks are passed to GPT as context
7. GPT returns a grounded answer based on the resume

---

## 🙋‍♀️ Author

Built by **Priyanshi** — [GitHub](https://github.com/YOUR_USERNAME)
