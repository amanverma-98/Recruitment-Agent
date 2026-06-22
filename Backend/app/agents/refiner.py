import json

from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def refine_question(question, improvements):

    prompt = f"""
You are an experienced Computer Science professor.

You are NOT rewriting the question.

You are ONLY improving it.

ONLY modify exactly what the reviewer requested.

Do not modify anything by yourself only modify what the reviewer explicitly asked you to modify.

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

Your job is to make the MINIMUM changes required.

Read the reviewer feedback carefully.

Modify ONLY the parts explicitly requested by the reviewer.

Everything else MUST remain unchanged.

For example:

If the reviewer asks to:

• shorten options
→ modify ONLY the options

• improve options
→ modify ONLY the options

• improve the explanation
→ modify ONLY the explanation

• make the question easier
→ modify ONLY the question and options as needed

• make the question harder
→ modify ONLY the question and options as needed

• improve grammar
→ correct grammar only

• fix spelling
→ correct spelling only

• change HTML tags
→ modify only the requested HTML text

• use proper syntax
→ modify only the syntax requested

If the reviewer does NOT ask to modify something,
DO NOT change it.

Never make unnecessary improvements.

Never rewrite the entire question just because you think it can be better.

Never introduce new scenarios unless explicitly requested.

Never change the topic.

Never change the difficulty unless requested.

Never change the correct answer unless required by the requested modification.

Never replace the explanation unless the reviewer asked for it or the correct answer changed.

Keep the original intent of the question.

==================================================
Question Length Rules
==================================================

Easy:
• Question ≤18 words
• Each option ≤6 words

Medium:
• Question ≤30 words
• Each option ≤10 words

Hard:
• Question ≤45 words
• Each option ≤15 words

==================================================
Output Rules
==================================================

Exactly 4 options.

Exactly 1 correct option.

Explanation:
Maximum 2 short sentences.


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