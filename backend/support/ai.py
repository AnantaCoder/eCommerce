import openai
from django.conf import settings
from support.models import ChatMessage

def generate_ai_response(prompt: str, session_id: int) -> str:
    """
    Generate concise AI response optimized for DeepSeek R1.
    """
    try:
        # Build context from last 10 messages
        history = ChatMessage.objects.filter(
            session_id=session_id
        ).order_by('-timestamp')[:10]

        messages = [
            {"role": "system", "content": (
                "You are a concise e-commerce support assistant. "
                "Reply in 1-2 short sentences, no extra explanation."
            )}
        ]
        # Prepend history in chronological order
        for msg in reversed(history):
            role = "user" if msg.sender == "user" else "assistant"
            messages.append({"role": role, "content": msg.message})

        messages.append({"role": "user", "content": prompt})

        client = openai.OpenAI(
            base_url=settings.AI_BASE_URL,
            api_key=settings.AI_MODEL_API_KEY
        )

        response = client.chat.completions.create(
            model=settings.AI_MODEL_NAME,
            messages=messages,
            # type casting 
            max_tokens=int(settings.MAX_TOKENS),
            temperature=float(settings.TEMPERATURE)
        )

        text = response.choices[0].message.content.strip() if response.choices else ''
        # Truncate to first two sentences if needed
        sentences = text.split('.')
        return ('.'.join(sentences[:3]) + '.') if len(sentences) > 1 else text

    except Exception as e:
        print(f"AI generation error: {e}")
        return "Sorry, I couldn’t generate a response right now."