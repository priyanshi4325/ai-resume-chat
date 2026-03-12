from dotenv import load_dotenv
load_dotenv()

import chromadb
from openai import OpenAI

client = OpenAI()
chroma_client = chromadb.Client()

def create_embeddings(chunks):
    # Clear old collection
    try:
        chroma_client.delete_collection("resume")
    except:
        pass

    collection = chroma_client.create_collection("resume")

    embeddings = client.embeddings.create(
        model="text-embedding-3-small",
        input=chunks
    )

    vectors = [e.embedding for e in embeddings.data]

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            embeddings=[vectors[i]],
            ids=[str(i)]
        )
    
    print(f"✅ Indexed {len(chunks)} chunks into Chroma")  # Add this to confirm it runs


def search_chunks(query, k=3):
    # ✅ Always fetch fresh — no stale reference
    try:
        collection = chroma_client.get_collection("resume")
    except Exception:
        return []  # No resume uploaded yet

    emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=[query]
    )

    query_vector = emb.data[0].embedding

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=k
    )

    return results["documents"][0]