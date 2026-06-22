import json

from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def evaluate_question(question):

    prompt = f"""
    You are an experienced Computer Science faculty member.
    Your task is to evaluate the quality of ONE multiple-choice question.
    The question is intended for students moving from FIRST YEAR to SECOND YEAR.

    Assume students know only:
    • Basic SQL
    • Basic HTML
    • Basic CSS
    • Basic Javascript
    • Basic Python
    • Basic C
    • Statistics
    • Probability
    • Aptitude

    ==================================================
    QUESTION
    ========

    {json.dumps(question, indent=2)}

    ==================================================
    EVALUATION CRITERIA
    ===================

    Evaluate the question on the following:

    1. Technical correctness
    * Is the concept accurate?
    * Is the correct answer actually correct?

    2. Difficulty alignment
    * Does the question match its intended difficulty?

    3. Clarity
    * Is the wording easy to understand?
    * Is there any ambiguity?

    4. Option quality
    * Are all options concise?
    * Are they similar in style and length?
    * Do they belong to the same category?

    5. Distractor quality
    * Are incorrect options believable?
    * Are they technically valid but incorrect?
    * Are any distractors obviously wrong?

    6. Single correct answer
    * Is there exactly one correct answer?
    * Could another option reasonably be considered correct?

    7. Explanation quality
    * Is the explanation technically correct?
    * Does it justify the correct answer?

    ==================================================
    SCORING
    =======

    Assign ONE overall score between 0 and 100.
    General guidance:

    96–100
    Outstanding classroom-quality MCQ.
    91–95
    Excellent with only minor improvements.
    82–89
    Good question with noticeable improvements possible.
    71–79
    Acceptable but requires revision.
    61–69
    Weak question with significant issues.
    Below 60
    Unsuitable for assessment.

    Do NOT favor or penalize a question simply because it is short.
    Reduce the score only when genuine quality issues exist.

    ==================================================
    IMPROVEMENTS
    ============

    List ONLY real problems.
    Do NOT invent improvements.
    If the question is already excellent, return an empty improvements list.
    Do not suggest:
    * Business scenarios
    * Enterprise examples
    unless they are required to fix an actual flaw.

    ==================================================
    QUALITY CHECK
    =============

    Also make sure that:
    • The score matches the actual quality.
    • Strengths are supported by the question.
    • Improvements describe real issues only.
    • Do not contradict yourself.
    • Do not praise and criticize the same aspect.

    ==================================================
    OUTPUT
    ======

    Return ONLY valid JSON.
    {{
    "score": 0,
    "strengths": [""],
    "improvements": [""]
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