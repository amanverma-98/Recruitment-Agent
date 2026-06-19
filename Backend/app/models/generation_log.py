import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import DateTime
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from Backend.app.core.database import Base


class GenerationLog(Base):

    __tablename__ = "generation_logs"

    user_id = Column(
    UUID(as_uuid=True),
    ForeignKey("users.id", ondelete="CASCADE"),
    nullable=False,
    index=True
)

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    topic = Column(String)

    difficulty = Column(String)

    question_id = Column(
    String,
    ForeignKey("questions.id", ondelete="CASCADE"),
    nullable=False,
    index=True
)

    score = Column(Integer)

    iterations = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    user = relationship(
        "User",
        back_populates="generation_logs"
    )    

    question = relationship(
    "Question",
    back_populates="logs"
)