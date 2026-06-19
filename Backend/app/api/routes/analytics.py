from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.question import Question

router = APIRouter()


@router.get("/")
def analytics(db: Session = Depends(get_db)):
    total = db.query(Question).count()
    approved = (db.query(Question).filter(Question.status == "approved").count())
    pending = (db.query(Question).filter(Question.status.in_(["pending_review","needs_improvement"])).count())
    rejected = (db.query(Question).filter(Question.status == "rejected").count())
    avg_score = (db.query(func.avg(Question.ai_score)).scalar())
    avg_iterations = (db.query(func.avg(Question.refinement_iterations)).scalar())
    needs_improvement = (db.query(Question).filter(Question.status == "needs_improvement").count())

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
def get_logs(db: Session = Depends(get_db)):
    return db.query(GenerationLog).all()