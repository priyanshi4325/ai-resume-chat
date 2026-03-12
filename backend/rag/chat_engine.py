from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI
from rag.vector_store import search_chunks

client = OpenAI()

def ask_resume(question):

    chunks = search_chunks(question)

    context = "\n\n".join(chunks)

    prompt = f"""
You are an AI assistant helping recruiters understand a candidate resume.

Use the following resume context to answer the question.

Resume Context:
{context}

Question:
{question}

Answer clearly and professionally.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful resume assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content