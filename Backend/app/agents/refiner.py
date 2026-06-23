import json
from groq import Groq
from app.core.config import settings
client = Groq(api_key=settings.GROQ_API_KEY)


def refine_question(question, improvements, reviewer_feedback):

    prompt = f"""
You are an experienced Computer Science professor.
Your task is to improve an existing multiple-choice question.
You are **NOT** generating a new question.
You are **NOT** redesigning the assessment.
Your job is to apply the reviewer feedback while preserving the original question as much as possible.

==================================================
TARGET AUDIENCE
===============
Students moving from FIRST YEAR to SECOND YEAR.
Assume they know only:

• Basic SQL
• Basic HTML
• Basic CSS
• Basic DBMS
• Basic Python
• Basic C++

==================================================
CURRENT QUESTION
================

{json.dumps(question, indent=2)}

==================================================
REVIEWER FEEDBACK (HIGHEST PRIORITY)
====================================

{json.dumps(reviewer_feedback, indent=2)}

==================================================
EVALUATOR FEEDBACK (SECONDARY)
==============================

{json.dumps(improvements, indent=2)}

==================================================
PRIMARY OBJECTIVE
=================

Make the SMALLEST possible changes required to satisfy the reviewer.
Preserve everything that is already correct.
Do not redesign the question.

==================================================
FEEDBACK PRIORITY
=================

1. Reviewer feedback ALWAYS has the highest priority.
2. Evaluator feedback is only additional guidance.
3. Use evaluator feedback ONLY if it helps satisfy the reviewer.
4. If evaluator feedback conflicts with reviewer feedback, ignore the evaluator.
5. Never modify something that the reviewer did not ask to modify.

==================================================
MODIFICATION RULES
==================

Modify ONLY the parts explicitly required.

Examples of allowed modifications:
• Question wording
• Options
• Explanation
• Grammar
• Spelling
• Formatting
• Difficulty (only if requested)
• Technical correctness (only if required)

Everything else must remain unchanged.

==================================================
STRICT RULES
============

Never rewrite the entire question.
Never introduce new concepts.
Never introduce new scenarios.
Never add business or enterprise examples.
Never increase complexity unless requested.
Never change the topic.
Never change the learning objective.
Never change the correct answer unless required.
Never change the explanation unless:
• the reviewer requested it, or
• the correct answer changed.
Never modify unrelated fields simply because you think they can be improved.

==================================================
QUESTION QUALITY
================

Also ensure that:
• Exactly ONE concept is tested.
• Exactly FOUR options exist.
• Exactly ONE option is correct.
• Distractors remain technically valid.
• Options are consistent in wording and style.
• The explanation matches the correct answer.

==================================================
LENGTH RULES
============

Easy
• Question ≤20 words
• Options ≤9 words

Medium
• Question ≤35 words
• Options ≤14 words

Hard
• Question ≤50 words
• Options ≤20 words

==================================================
FINAL VALIDATION
================
Also verify internally that:
✓ Every reviewer request has been satisfied.
✓ Only the necessary fields were modified.
✓ No unrelated content changed.
✓ Exactly one correct answer exists.
✓ The explanation matches the correct answer.

==================================================
OUTPUT
======

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
        temperature=0.2
    )

    
    import re

    content = (
        response.choices[0]
        .message.content
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )
    # Extract only the first JSON object
    match = re.search(r"\{.*\}", content, re.DOTALL)

    if not match:
        raise ValueError(f"No JSON found.\n\nResponse:\n{content}")

    content = match.group(0)

    return json.loads(content)