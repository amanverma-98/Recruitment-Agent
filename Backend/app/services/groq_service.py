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
Generate EXACTLY ONE unique Multiple Choice Question.

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

Never create questions based on assumptions, opinions, or undefined real-world statistics.
Only generate questions whose correct answer can be derived from established concepts, formulas, or the information provided in the question.

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

• be unique
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

• Avoid unnecessary repeated words like explaining question in options contain only specific words.
• Contain only the essential term or phrase.
• Belong to the same category.
• Be similar in wording and length.
• Be concise.
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

Write a short explanation (maximum three sentences), also focus more if it is numerical question.
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
SPECIAL RULES FOR APTITUDE, STATISTICS & PROBABILITY
=========================================================

If the topic belongs to Aptitude, Statistics, Probability, Quantitative Aptitude, or Numerical Reasoning:

• Generate only mathematically valid questions.
• Never invent formulas, statistical facts, or numerical values.
• Internally solve the problem before writing the options.
• Verify the computed answer first before selecting the correct option.
• Exactly one option must match the correct solution.
• Every distractor must be mathematically incorrect.
• Never create ambiguous numerical questions.
• Never ask vague questions such as:
  - "What percentage of people are above average?"
  - "What is the average number of attempts needed..."
  unless all required assumptions are explicitly provided.

• If a numerical value is required, include all necessary information in the question.
• Do NOT generate questions requiring advanced university-level mathematics.

=========================================================
CORRECT ANSWER VERIFICATION
=========================================================

Make sure that the options that is marked as correct_option must be correct and match with answer of explanation.
Do not guess answer by yourself especially for aptitude , statistics and probability questions. 

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