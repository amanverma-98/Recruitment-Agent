import json
from io import BytesIO

def generate_questions_json(questions, include_answers=True, include_explanations=False, include_topic=True, include_difficulty=True):
    result = []
    for q in questions:
        item = {
            "id": str(q.id),
            "question_text": q.question_text,
            "options": q.options,
        }
        if include_answers:
            item["correct_option"] = q.correct_option
            item["correct_answer"] = q.options[q.correct_option] if q.correct_option < len(q.options) else None
        if include_explanations:
            item["explanation"] = q.explanation
        if include_topic:
            item["topic"] = q.topic
        if include_difficulty:
            item["difficulty"] = q.difficulty
        result.append(item)

    json_bytes = json.dumps(result, indent=2, ensure_ascii=False).encode("utf-8")
    buffer = BytesIO(json_bytes)
    buffer.seek(0)
    return buffer
