from uuid import UUID

from pydantic import BaseModel


class AssessmentSection(BaseModel):
    topic: str
    difficulty: str
    count: int


class AssessmentRequest(BaseModel):
    user_id: UUID
    sections: list[AssessmentSection]