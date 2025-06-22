# import openai 
# from support.models import ChatMessage
# from django.conf import settings


# def generate_ai_response(prompt: str, session_id: int) -> str:
#     history = ChatMessage.objects.filter(session_id=session_id)
#     context = '\n'.join([f"{m.sender}: {m.message}" for m in reversed(history)])
#     full_prompt = context + f"\nuser: {prompt}\nbot:"

#     client = openai.OpenAI(
#         base_url="https://integrate.api.nvidia.com/v1",
#         api_key=settings.DEEPSEEK_R1_API_KEY 
#     )
#     response = client.chat.completions.create(
#         model="deepseek-ai/deepseek-r1",
#         messages=[
#             {'role': 'system', 'content': 'You are a helpful e-commerce assistant.'},
#             {'role': 'user', 'content': full_prompt}
#         ],
#     )
#     return response.choices[0].message.content.strip() if response.choices else "Im sorry , I could not process your request at this time . Please try again later."

import openai 
from django.conf import settings


def generate_ai_response(prompt: str, session_id: int) -> str:
    """
    Generate AI response - simplified version for REST API usage
    Note: This is used by REST API views, not WebSocket consumers
    """
    try:
        # Get recent chat history (limit to avoid token limits)
        from support.models import ChatMessage
        history = ChatMessage.objects.filter(
            session_id=session_id
        ).order_by('-timestamp')[:10]  
        
        context_messages = []
        for msg in reversed(history):
            role = "user" if msg.sender == "user" else "assistant"
            context_messages.append({
                "role": role,
                "content": msg.message
            })
        
        context_messages.append({
            "role": "user", 
            "content": prompt
        })

        client = openai.OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.DEEPSEEK_R1_API_KEY 
        )
        
        response = client.chat.completions.create(
            model="deepseek-ai/deepseek-r1",
            messages=[
                {
                    'role': 'system', 
                    'content': 'You are a helpful e-commerce customer support assistant. Keep responses concise and helpful.'
                }
            ] + context_messages,
            max_tokens=200,
            temperature=0.7
        )
        
        if response.choices:
            return response.choices[0].message.content.strip()
        else:
            return "I'm sorry, I couldn't process your request right now. Please try again."
            
    except Exception as e:
        print(f"AI generation error: {e}")
        return "I'm having trouble generating a response. Please try again later."