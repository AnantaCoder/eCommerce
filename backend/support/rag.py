import logging
import re
import time
import openai
from django.conf import settings
from store.models import Item
from support.models import ChatMessage
from langchain_core.documents import Document
from langchain_community.retrievers import BM25Retriever

logger = logging.getLogger(__name__)

# In-memory cached retriever for sub-millisecond retrieval latency
_CACHED_RETRIEVER = None
_CACHED_DOCS = []
_LAST_INDEX_TIME = 0
INDEX_TTL_SECONDS = 300  # Automatically refresh index every 5 minutes if data changes

STOPWORDS = {
    "what", "do", "you", "have", "in", "stock", "the", "a", "an", "is", "are",
    "can", "i", "get", "show", "me", "any", "some", "for", "please", "looking",
    "tell", "about", "which", "available", "buy", "sell", "there", "store",
    "product", "products", "item", "items"
}


def clean_search_query(query: str) -> str:
    """
    Strips conversational stop words to maximize search accuracy
    for catalog items (e.g., 'Do you have any books in stock?' -> 'books').
    """
    words = re.findall(r'\b[a-zA-Z0-9_-]+\b', query.lower())
    meaningful_words = [w for w in words if w not in STOPWORDS]
    return " ".join(meaningful_words) if meaningful_words else query


def build_product_documents():
    """
    Fetches all active items from the store database and transforms them
    into structured LangChain Documents for RAG context.
    """
    items = Item.objects.filter(is_active=True).select_related('category')
    docs = []
    
    for item in items:
        category_name = item.category.name if item.category else "General"
        stock_status = f"In Stock ({item.quantity} units available)" if item.is_in_stock else "Out of Stock"
        
        # Grounding content with rich product metadata
        content = (
            f"Product Name: {item.item_name}\n"
            f"Category: {category_name}\n"
            f"Brand: {item.manufacturer}\n"
            f"Type: {item.item_type}\n"
            f"Price: Rs. {item.price}\n"
            f"Stock Status: {stock_status}\n"
            f"Description: {item.description or 'No extra description.'}"
        )
        
        doc = Document(
            page_content=content,
            metadata={
                "id": item.id,
                "name": item.item_name,
                "price": float(item.price),
                "in_stock": item.is_in_stock,
                "category": category_name
            }
        )
        docs.append(doc)
        
    return docs


def get_catalog_retriever(force_reload=False):
    """
    Returns an in-memory LangChain BM25Retriever for lightning-fast (<1ms)
    lexical & semantic product search without external embedding API costs or latency.
    """
    global _CACHED_RETRIEVER, _CACHED_DOCS, _LAST_INDEX_TIME
    now = time.time()
    
    if force_reload or _CACHED_RETRIEVER is None or (now - _LAST_INDEX_TIME > INDEX_TTL_SECONDS):
        try:
            docs = build_product_documents()
            _CACHED_DOCS = docs
            if docs:
                _CACHED_RETRIEVER = BM25Retriever.from_documents(docs, k=3)
                _LAST_INDEX_TIME = now
                logger.info(f"Loaded {len(docs)} products into LangChain RAG retriever.")
            else:
                _CACHED_RETRIEVER = None
        except Exception as e:
            logger.error(f"Error building product index: {e}")
            
    return _CACHED_RETRIEVER


def reload_catalog_index():
    """Manually invalidate and rebuild the catalog index."""
    return get_catalog_retriever(force_reload=True)


def retrieve_relevant_items(query: str, top_k: int = 3):
    """Retrieves top relevant LangChain product documents."""
    retriever = get_catalog_retriever()
    if not retriever:
        return []
        
    search_term = clean_search_query(query)
    docs = retriever.invoke(search_term)
    return docs[:top_k] if docs else []


def generate_rag_response(prompt: str, session_id: int) -> str:
    """
    LangChain RAG Pipeline:
    1. Retrieves top relevant store products matching user query with LangChain BM25Retriever.
    2. Builds conversation context from previous chat messages.
    3. Prompts the LLM with grounded catalog context.
    4. Delivers concise, accurate, low-latency conversational search responses.
    """
    relevant_docs = []
    try:
        # 1. Retrieve relevant products from catalog
        relevant_docs = retrieve_relevant_items(prompt, top_k=3)
        product_context = ""
        
        if relevant_docs:
            product_context = "\n---\n".join([d.page_content for d in relevant_docs])
        else:
            product_context = "No specific catalog products found matching this exact query."

        # 2. Retrieve recent chat history (maintains multi-turn conversational context)
        history = ChatMessage.objects.filter(session_id=session_id).order_by('-timestamp')[:6]
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful, concise AI Shopping Assistant for our e-commerce store. "
                    "Use the verified store catalog below to answer customer inquiries:\n\n"
                    "=== STORE CATALOG CONTEXT ===\n"
                    f"{product_context}\n"
                    "==============================\n\n"
                    "Instructions:\n"
                    "1. Reply in 1-3 short, friendly sentences.\n"
                    "2. Explicitly state the Product Name, Price (Rs.), and Stock status when recommending items.\n"
                    "3. If an item is not in the catalog context, politely state it is unavailable and recommend the closest alternative.\n"
                    "4. NEVER invent or hallucinate items not present in the catalog context."
                )
            }
        ]

        # Add chronological conversation history
        for msg in reversed(history):
            role = "user" if msg.sender == "user" else "assistant"
            messages.append({"role": role, "content": msg.message})

        messages.append({"role": "user", "content": prompt})

        # 3. Call LLM (using client with sufficient token window for reasoning models)
        client = openai.OpenAI(
            base_url=settings.AI_BASE_URL,
            api_key=settings.AI_MODEL_API_KEY,
            timeout=30.0
        )

        response = client.chat.completions.create(
            model=settings.AI_MODEL_NAME,
            messages=messages,
            max_tokens=600,
            temperature=float(settings.TEMPERATURE or 0.3)
        )

        if response.choices:
            msg_obj = response.choices[0].message
            content = msg_obj.content
            if content and content.strip():
                return content.strip()
            
            # If a reasoning model outputted in reasoning_content
            reasoning = getattr(msg_obj, "reasoning_content", None)
            if reasoning and reasoning.strip():
                # Extract clean concluding sentences
                clean_lines = [l.strip() for l in reasoning.split("\n") if l.strip() and not l.startswith("Let me") and not l.startswith("I should")]
                if clean_lines:
                    return clean_lines[-1]

    except Exception as e:
        logger.error(f"RAG LLM Error: {e}")

    # Grounded fallback if LLM has high latency or network issue
    if relevant_docs:
        best_doc = relevant_docs[0]
        meta = best_doc.metadata
        return (
            f"Here is what I found in our catalog: {meta.get('name')} for Rs. {meta.get('price')}. "
            f"Status: {'In Stock' if meta.get('in_stock') else 'Out of Stock'}. "
            f"Let me know if you would like more details!"
        )

    return "I'm having trouble searching our catalog right now. Please try again in a moment."
