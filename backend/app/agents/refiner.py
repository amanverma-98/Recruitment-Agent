import json

from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def refine_question(question, improvements):

    prompt = f"""
    You are an expert assessment designer.

    Improve the following question using the provided feedback.

    Question:
    {json.dumps(question, indent=2)}

    Improvements:
    {json.dumps(improvements, indent=2)}

    Rules:
    - Keep the same topic
    - Keep the same difficulty level
    - Improve clarity
    - Improve distractors
    - Improve practical relevance

    Return ONLY JSON:

    {{
        "question": "",
        "options": [
            "",
            "",
            "",
            ""
        ],
        "correct_option": 0,
        "explanation": ""
    }}
    """

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}], temperature=0.3)

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)