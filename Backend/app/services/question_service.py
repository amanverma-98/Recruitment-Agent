from app.models.question import Question
from app.schemas.question import CreateQuestionPayload


def create_question(db, payload, user_id):

    payload = CreateQuestionPayload.model_validate(payload)

    existing = (
        db.query(Question)
        .filter(Question.question_text == payload.question)
        .first()
    )

    if existing:
        raise ValueError("Duplicate question generated")

    if not (0 <= payload.correct_option < len(payload.options)):
        raise ValueError("Invalid correct option index")

    if len(set(payload.options)) != 4:
        raise ValueError("Duplicate options found")

    question_text = payload.question.lower()

    banned_phrases = [
    "write a sql query",
    "write sql query",
    "write a query",
    "create a sql query",
    "create a query",
    "construct a query",
    "which query",
    "sql query will return"
]

    for phrase in banned_phrases:
        if phrase in question_text:
            raise ValueError("Invalid generated question")

    if len(payload.options) != 4:
        raise ValueError("Invalid generated question")

    question = Question(
        topic=payload.topic,
        user_id=user_id,
        difficulty=payload.difficulty,
        question_type="MCQ",
        question_text=payload.question,
        options=payload.options,
        correct_option=payload.correct_option,
        explanation=payload.explanation,
        ai_score=payload.ai_score,
        strengths=payload.strengths,
        evaluation_feedback=payload.evaluation_feedback,
        refinement_iterations=payload.refinement_iterations,
        status="pending_review",
        workflow_id=payload.workflow_id
    )

    if payload.ai_score < 50:
        raise ValueError(
            f"Question quality too low ({payload.ai_score})"
        )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question