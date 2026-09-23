from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionPublicResponse

router = APIRouter()


@router.get("/questions", response_model=list[QuestionPublicResponse])
def get_public_questions(
    topic: str | None = None,
    difficulty: str | None = None,
    include_answers: bool = False,
    db: Session = Depends(get_db)
):
    """
    Public endpoint — no auth required.
    Used by the student-facing test app to fetch approved questions.

    Query params:
      - topic: filter by topic (optional)
      - difficulty: filter by difficulty (optional)
      - include_answers: set True only after test submission for scoring
    """
    query = db.query(Question).filter(Question.status == "approved")

    if topic:
        query = query.filter(Question.topic == topic)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    questions = query.order_by(Question.created_at.desc()).all()

    if not questions:
        raise HTTPException(status_code=404, detail="No approved questions found")

    result = []
    for q in questions:
        result.append(QuestionPublicResponse(
            id=q.id,
            topic=q.topic,
            difficulty=q.difficulty,
            question_type=q.question_type,
            question_text=q.question_text,
            options=q.options,
            correct_option=q.correct_option if include_answers else None,
            status=q.status
        ))

    return result