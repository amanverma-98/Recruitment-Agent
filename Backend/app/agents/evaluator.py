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
Question
==================================================

{json.dumps(question, indent=2)}

==================================================
Evaluate the following independently
==================================================

Give an INTEGER score for EACH criterion.

1. Concept Correctness (0-25)

Does the question test a technically correct concept?

--------------------------------------------------

2. Difficulty Alignment (0-15)

Does the difficulty actually match Easy / Medium / Hard?

--------------------------------------------------

3. Question Clarity (0-15)

Is the wording easy to understand?

Is there any ambiguity?

--------------------------------------------------

4. Option Quality (0-15)

Are all options concise?

Are they grammatically consistent?

Are they similar in style?

--------------------------------------------------

5. Distractor Quality (0-15)

Are incorrect options believable?

Do they require thinking?

Avoid obviously wrong options.

--------------------------------------------------

6. Explanation Quality (0-10)

Is the explanation correct?

Is it concise?

--------------------------------------------------

7. Conciseness (0-5)

Is the question appropriately short for the requested difficulty?

==================================================
IMPORTANT
==================================================

DO NOT calculate the final score.

Only score each criterion independently.

The application will calculate the final score.

==================================================
Return ONLY JSON
==================================================

{
    "concept_correctness": 0,
    "difficulty_alignment": 0,
    "clarity": 0,
    "option_quality": 0,
    "distractor_quality": 0,
    "explanation_quality": 0,
    "conciseness": 0,

    "strengths": [
        ""
    ],

    "improvements": [
        ""
    ]
}

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

    evaluation = json.loads(content)

    evaluation["score"] = (
        evaluation["concept_correctness"]
        + evaluation["difficulty_alignment"]
        + evaluation["clarity"]
        + evaluation["option_quality"]
        + evaluation["distractor_quality"]
        + evaluation["explanation_quality"]
        + evaluation["conciseness"]
    )

    return evaluation