from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class GenerateQuestionRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=100, description="Question topic")
    difficulty: Literal["Easy", "Medium", "Hard"]
    question_type: Literal["MCQ", "Coding"]


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
    correct_option: int
    explanation: str | None = None
    ai_score: int = None
    status: str

    class Config:
        from_attributes = True


class UpdateStatusRequest(BaseModel):
    status: str


class BulkGenerateRequest(BaseModel):
    topic: str
    difficulty: str
    count: int

class BulkGenerateResponse(BaseModel):
    generated: int
    failed: int
    question_ids: list[str]    


class ReviewRequest(BaseModel):
    action: Literal["approve","reject","improve"]
    feedback: list[str] | None = None    



class CreateQuestionPayload(BaseModel):
    topic: str
    difficulty: str

    question: str = Field(min_length=10)

    options: List[str] = Field(min_length=4, max_length=4)

    correct_option: int = Field(ge=0, le=3)

    explanation: str

    ai_score: int = Field(ge=0, le=100)

    strengths: List[str]
    evaluation_feedback: List[str]

    refinement_iterations: int = Field(ge=0) 

    status: str = "pending_review"
    workflow_id: Optional[str] = None