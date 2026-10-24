from support.rag import generate_rag_response


def generate_ai_response(prompt: str, session_id: int) -> str:
    """
    Generate context-aware AI response grounded in the store catalog using
    the LangChain RAG pipeline with low latency and high accuracy.
    """
    return generate_rag_response(prompt, session_id)