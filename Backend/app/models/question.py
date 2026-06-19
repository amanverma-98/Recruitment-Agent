import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import JSON

from sqlalchemy.sql import func
from sqlalchemy import Index
from app.core.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    topic = Column(String(100))
    difficulty = Column(String(50))
    question_type = Column(String(50))
    question_text = Column(Text, unique=True)
    options = Column(JSON)
    correct_option = Column(Integer, nullable=False)
    explanation = Column(Text)
    ai_score = Column(Integer, nullable=True)
    evaluation_feedback = Column(JSON, nullable=True)
    version = Column(Integer, default=1)
    refinement_iterations = Column(Integer,default=0)
    strengths = Column(JSON,nullable=True)
    status = Column(String(50),default="pending_review")
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    review_feedback = Column(JSON, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    workflow_id = Column(String,nullable=True)


Index(
    "idx_question_status",
    Question.status
)

Index(
    "idx_question_topic",
    Question.topic
)    