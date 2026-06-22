import json
from typing import List

from groq import Groq
from pydantic import BaseModel, field_validator

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


class MCQSchema(BaseModel):
    question: str
    options: List[str]
    correct_option: int
    explanation: str

    @field_validator("correct_option")
    @classmethod
    def validate_correct_option(cls, value):
        if value < 0 or value > 3:
            raise ValueError("correct_option must be between 0 and 3")
        return value


def generate_mcq(topic: str, difficulty: str):

    difficulty = difficulty.capitalize()

    prompt = f"""
You are an expert Computer Science professor.

Generate EXACTLY ONE Multiple Choice Question.

=========================================================
TARGET AUDIENCE
=========================================================

Students moving from FIRST YEAR to SECOND YEAR.

Assume they only know:

• Basic SQL
• Basic HTML
• Basic CSS
• Basic Python
• Basic C++
• Basic DBMS

DO NOT generate interview questions for experienced developers.

DO NOT generate enterprise-level questions.

DO NOT assume production experience.

Questions should resemble:

• University exams
• Internship screening tests
• NPTEL quizzes
• GeeksForGeeks beginner MCQs
• Coding Ninjas beginner assessments

=========================================================
TOPIC
=========================================================

{topic}

=========================================================
DIFFICULTY
=========================================================

{difficulty}

Difficulty Rules

---------------------------------------------------------
EASY
---------------------------------------------------------

• One concept only
• Direct question
• No scenario
• Maximum 24 words
• Options: 4-9 words each
• Explanation under 50 words

Examples:

Which SQL clause filters rows?

Which HTML tag creates a paragraph?

---------------------------------------------------------
MEDIUM
---------------------------------------------------------

• Small scenario allowed
• Moderate complexity
• Maximum 50 words
• Tests understanding
• Options 5-12 words
• Explanation under 55 words

---------------------------------------------------------
HARD
---------------------------------------------------------

• Small practical scenario
• Slightly complex question
• Maximum 80 words
• Requires reasoning
• NOT enterprise level
• Options 8-18 words
• Explanation under 70 words

=========================================================
STRICTLY FORBIDDEN
=========================================================

Never generate questions asking students to:

❌ Write SQL
❌ Create SQL
❌ Construct SQL
❌ Write code
❌ Predict output from code
❌ Complete code
❌ Fill missing query
❌ Create HTML
❌ Write CSS
❌ Design algorithms

Also avoid:

❌ Huge paragraphs

❌ Tricky wording

❌ Ambiguous questions

❌ Multiple correct answers

❌ "Choose all"

❌ "Select two"

=========================================================
OPTION RULES
=========================================================

Exactly 4 options.

Exactly ONE correct answer.

Options should be similar in length.

No duplicate options.

No "All of the above".

No "None of the above".

=========================================================
QUESTION QUALITY
=========================================================

The question must:

• Be clear

• Test ONE concept

• Match requested difficulty

• Be suitable for classroom assessment

=========================================================
OUTPUT FORMAT
=========================================================

Return ONLY JSON.

No markdown.

No explanation outside JSON.

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
        temperature=0.4
    )

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    print("RAW GROQ RESPONSE")
    print(content)
    print("=" * 80)

    data = json.loads(content)

    validated = MCQSchema.model_validate(data)

    return validated.model_dump()