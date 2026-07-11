from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.question import Question

from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/")
def analytics(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    total = db.query(Question).filter(
    Question.user_id == current_user.id
).count()
    approved = (db.query(Question).filter(Question.user_id == current_user.id, Question.status == "approved").count())
    pending = (db.query(Question).filter(Question.user_id == current_user.id, Question.status.in_(["pending_review","needs_improvement"])).count())
    rejected = (db.query(Question).filter(Question.user_id == current_user.id, Question.status == "rejected").count())
    avg_score = (
        db.query(func.avg(Question.ai_score))
        .filter(Question.user_id == current_user.id)
        .scalar()
    )

    avg_iterations = (
        db.query(func.avg(Question.refinement_iterations))
        .filter(Question.user_id == current_user.id)
        .scalar()
    )
    needs_improvement = (db.query(Question).filter(Question.user_id == current_user.id,Question.status == "needs_improvement").count())

    return {
        "total_questions": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "needs_improvement": needs_improvement,
        "avg_ai_score": round(avg_score or 0, 2),
        "avg_iterations": round(avg_iterations or 0, 2)
    }


from app.models.generation_log import GenerationLog
@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(GenerationLog)
        .filter(
            GenerationLog.user_id == current_user.id
        )
        .all()
    )