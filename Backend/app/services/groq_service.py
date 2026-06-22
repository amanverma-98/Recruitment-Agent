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

Students moving to SECOND YEAR.

Assume they know only:

• Basic SQL
• Basic HTML
• Basic CSS
• Basic Python
• Basic C
• Statistics
• Probabilty
• Aptitude
• Basic Javascript

Generate questions suitable for:

• University examinations
• Internship screening tests
• Beginner coding assessments

=========================================================
TOPIC
=========================================================

{topic}

=========================================================
DIFFICULTY
=========================================================

{difficulty}

Difficulty Guidelines

Easy
• One concept only
• Direct question
• No scenario
• Maximum 24 words

Medium
• Small scenario allowed
• Tests understanding
• Maximum 50 words
• Moderately complex questions allowed

Hard
• Small practical scenario
• Requires reasoning
• Maximum 80 words
• No enterprise-level knowledge
• Slightly complex questions allowed

=========================================================
QUESTION RULES
=========================================================

The question must:

• Test exactly ONE concept.
• Be technically correct.
• Match the requested difficulty.
• Be clear and concise.
• Have exactly ONE correct answer.
• Avoid ambiguity.
• Avoid trick wording.
• Be answerable without writing code.

Never ask students to:

• Write code
• Write SQL
• Construct queries
• Complete code
• Design algorithms
• Create HTML or CSS

=========================================================
OPTION RULES
=========================================================

Generate EXACTLY FOUR options.

The options must:

• Belong to the same category.
• Be similar in wording and length.
• Be concise.
• Contain only the essential term or phrase.
• Avoid unnecessary repeated words.
• Avoid explanations inside options.
• Avoid overlapping meanings.
• Avoid duplicate options.
• Avoid obviously incorrect distractors.
• Be plausible enough that students must understand the concept to choose correctly.

Never use:

• Multiple correct answers

=========================================================
EXPLANATION
=========================================================

Write a short explanation (maximum three sentences).
Explain only why the correct answer is correct.

=========================================================
QUALITY CHECK
=========================================================

Also, make sure that:

• The concept is technically correct.
• Only one option is correct.
• Distractors are realistic.
• No option accidentally becomes correct.
• Options follow the same style.
• The question matches the requested difficulty.
• The explanation matches the correct answer.


=========================================================
OUTPUT
=========================================================

Return ONLY valid JSON.

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