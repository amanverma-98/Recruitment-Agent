import json

from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def evaluate_question(question):

    prompt = f"""
You are an experienced Computer Science faculty member.

Your job is NOT to create interview questions.

Your job is to evaluate questions designed for students
moving from FIRST YEAR to SECOND YEAR.

Assume the students know only:

• Basic SQL
• Basic HTML
• Basic CSS
• Basic DBMS
• Basic Python
• Basic C++

==================================================
Evaluate ONLY these criteria
==================================================

1. Concept correctness

2. Difficulty matches requested level

3. Clarity

4. Brevity

5. Good distractors

6. Single correct answer

==================================================
Scoring Guide
==================================================

95-100

Outstanding classroom assessment.

90-94

Excellent.

80-89

Very Good.

75-79

Good.

70-74

Needs small improvement.

60-69

Weak.

Below 60

Reject.

DO NOT reduce score simply because
the question is short.

Short questions are GOOD.

DO reduce score if:

• wording is confusing

• options overlap

• multiple answers appear correct

• explanation is wrong

• difficulty is incorrect

• question is unnecessarily long

• business scenario is unnecessary

==================================================
Question
==================================================

{json.dumps(question, indent=2)}

==================================================
Return ONLY JSON
==================================================

{{
    "score": 0,
    "strengths": [
        ""
    ],
    "improvements": [
        ""
    ]
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
        temperature=0
    )

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)