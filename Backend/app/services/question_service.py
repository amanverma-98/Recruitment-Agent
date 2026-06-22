from sqlalchemy.orm import Session
from app.models.question import Question
from app.schemas.question import CreateQuestionPayload


def create_question(db: Session, payload, user_id):
    payload = CreateQuestionPayload.model_validate(payload)

    existing = (
        db.query(Question)
        .filter(Question.question_text == payload.question)
        .first()
    )

    if existing:
        raise ValueError("Duplicate question generated")
    if not (0 <= payload.correct_option <= 3):
        raise ValueError("Invalid correct option index")
    if len(payload.options) != 4:
        raise ValueError("Exactly four options required")

    normalized = [
        option.strip().lower()
        for option in payload.options]
    if len(set(normalized)) != 4:
        raise ValueError("Duplicate options found")

    banned_phrases = [
        "write a sql query",
        "write sql query",
        "write a query",
        "construct a query",
        "create a query",
        "implement",
        "write code",
        "complete the code",
        "predict output",
        "design a database",
        "build a table"
    ]

    question_text = payload.question.lower()

    for phrase in banned_phrases:
        if phrase in question_text:
            raise ValueError("Invalid generated question")

    difficulty = payload.difficulty.lower()
    question_words = len(payload.question.split())
    longest_option = max(
        len(option.split())
        for option in payload.options
    )
    explanation_words = len(
        payload.explanation.split()
    )

    if difficulty == "easy":
        if question_words > 18:
            raise ValueError("Easy question too long")
        if longest_option > 6:
            raise ValueError("Easy options too long")
    elif difficulty == "medium":
        if question_words > 30:
            raise ValueError("Medium question too long")
        if longest_option > 10:
            raise ValueError("Medium options too long")
    elif difficulty == "hard":
        if question_words > 45:
            raise ValueError("Hard question too long")
        if longest_option > 15:
            raise ValueError("Hard options too long")
    if explanation_words > 40:
        raise ValueError("Explanation too long")
    if payload.ai_score < 60:
        raise ValueError(
            f"Question quality too low ({payload.ai_score})"
        )


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

    db.add(question)
    db.flush()
    db.refresh(question)

    return question