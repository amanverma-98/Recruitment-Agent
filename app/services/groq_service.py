import json
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

from pydantic import BaseModel, field_validator
from typing import List


class MCQSchema(BaseModel):
    question: str
    options: List[str]
    correct_option: int
    explanation: str

    @field_validator("correct_option")
    @classmethod
    def validate_correct_option(cls, value):
        if value < 0 or value > 3:
            raise ValueError(
                "correct_option must be between 0 and 3"
            )
        return value


def generate_mcq(topic: str, difficulty: str):

    prompt = f"""
    Generate EXACTLY ONE recruitment-level MCQ.

    Topic: {topic}
    Difficulty: {difficulty}

    You are generating a Multiple Choice Question for candidate assessment.

    CRITICAL REQUIREMENTS:

    1. The question MUST be answerable by selecting ONE of the provided options.

    2. The candidate must NEVER be required to:

    * Write SQL
    * Construct SQL
    * Complete SQL
    * Create a query
    * Design a query
    * Implement code
    * Write code
    * Predict results from a query not shown in the options

    3. STRICTLY FORBIDDEN QUESTION TYPES:

    ❌ "Write a query..."
    ❌ "Create a query..."
    ❌ "Which query would return..."
    ❌ "Given a table, return..."
    ❌ "How would you retrieve..."
    ❌ "What query should be used..."
    ❌ "Generate a query..."
    ❌ "Construct a query..."
    ❌ Open-ended questions
    ❌ Questions requiring manual coding

    4. ALLOWED QUESTION TYPES:

    ✅ "Which SQL clause is used to group rows?"
    ✅ "Which JOIN returns all rows from both tables?"
    ✅ "Which statement about indexes is correct?"
    ✅ "What will be the output of the following query?"
    ✅ "Which constraint prevents duplicate values?"
    ✅ "Which SQL command adds a new row to a table?"

    5. Question Quality Requirements:

    * Clear and concise
    * Single correct answer
    * No ambiguity
    * Real interview style
    * Appropriate for recruitment assessments
    * Difficulty must match the requested level
    * Options must be realistic distractors
    * Avoid trick questions

    6. Option Requirements:

    * Exactly 4 options
    * Exactly 1 correct option
    * No duplicate options
    * Similar length options when possible
    * Options must be mutually exclusive

    7. Explanation Requirements:

    * 1–3 sentences
    * Explain why the correct answer is correct
    * Do not discuss every option

    Return ONLY valid JSON.

    Do NOT return markdown.
    Do NOT return code fences.
    Do NOT return any text outside JSON.

    Output format:

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
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    content = (
    response.choices[0]
    .message
    .content
    .replace("```json", "")
    .replace("```", "")
    .strip()
    )

    print("RAW GROQ RESPONSE")
    print(content)
    print("=" * 50)

    data = json.loads(content)
    validated = MCQSchema.model_validate(data)

    return validated.model_dump()