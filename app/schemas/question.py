from pydantic import BaseModel
from typing import List, Optional, Literal


class GenerateQuestionRequest(BaseModel):
    topic: str
    difficulty: str
    question_type: str


class GeneratedQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str


class QuestionResponse(BaseModel):
    id: str
    topic: str
    difficulty: str
    question_type: str
    question_text: str
    options: List[str]
    answer: str
    explanation: str
    ai_score: Optional[int] = None
    status: str

    class Config:
        from_attributes = True


class UpdateStatusRequest(BaseModel):
    status: str


class BulkGenerateRequest(BaseModel):
    topic: str
    difficulty: str
    count: int


class ReviewRequest(BaseModel):
    action: Literal["approve","reject","improve"]
    feedback: list[str] | None = None    