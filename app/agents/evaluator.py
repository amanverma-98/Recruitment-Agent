import json
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def evaluate_question(question):
    prompt = f"""
You are an expert recruitment question evaluator.
A score of:

100 = Production-ready assessment question
90+ = Excellent
80-89 = Good
70-79 = Acceptable
60-69 = Weak
Below 60 = Reject

Be conservative in scoring.

Do not inflate scores.

Evaluate the following question.

Question:
{json.dumps(question, indent=2)}

Score based on:

1. Correctness
2. Clarity
3. Difficulty Alignment
4. Practical Relevance
5. Quality of Options

Return ONLY JSON:

{{
    "score": 0,
    "strengths": [""],
    "improvements": [""]
}}

The correct answer is:

options[correct_option]

You MUST evaluate the question assuming that option is the intended correct answer.

Do not infer a different correct answer.
Do not criticize the correct option unless it is genuinely wrong.

Feedback should be specific and actionable.

Reduce score significantly if:

- The question is unnecessarily verbose
- The correct answer is obvious from the wording
- Distractors are clearly weaker than the correct answer
- The explanation merely repeats the answer
- The question tests memorization rather than reasoning

A production-ready question should rarely score above 95.
Reserve 95-100 only for exceptional assessment quality.
"""

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[{"role":"user", "content":prompt}],temperature=0)

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(content)