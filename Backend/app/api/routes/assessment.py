from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.assessment import AssessmentRequest

from app.agents.assessment_generator import (
    AssessmentGeneratorAgent
)

router = APIRouter()


@router.post("/generate")
def generate_assessment(
    request: AssessmentRequest,
    db: Session = Depends(get_db)
):

    agent = AssessmentGeneratorAgent(db)

    return agent.generate(
        request.user_id,
        request.sections
    )