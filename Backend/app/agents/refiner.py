import json

from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def refine_question(question, improvements):

    prompt = f"""
You are an experienced Computer Science professor.

You are NOT rewriting the question.

You are ONLY improving it.

==================================================
Target Audience
==================================================

Students moving from FIRST YEAR to SECOND YEAR.

They know only:

• Basic SQL

• Basic HTML

• Basic CSS

• Basic DBMS

• Basic Python

• Basic C++

==================================================
Current Question
==================================================

{json.dumps(question, indent=2)}

==================================================
Evaluator Feedback
==================================================

{json.dumps(improvements, indent=2)}

==================================================
VERY IMPORTANT RULES
==================================================

Improve ONLY the issues mentioned.

DO NOT increase difficulty.

DO NOT make the question longer.

DO NOT add business scenarios.

DO NOT add enterprise examples.

DO NOT add production systems.

DO NOT add unnecessary explanation.

Keep the same topic.

Keep the same difficulty.

If Easy:

• keep under 18 words

• options under 6 words

If Medium:

• keep under 30 words

• options under 10 words

If Hard:

• keep under 45 words

• options under 15 words

Keep exactly four options.

Exactly one correct answer.

Explanation:

Maximum two short sentences.

==================================================
Return ONLY JSON
==================================================

{{
    "question":"",
    "options":[
        "",
        "",
        "",
        ""
    ],
    "correct_option":0,
    "explanation":""
}}
"""

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)