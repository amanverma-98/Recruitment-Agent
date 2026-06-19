import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class GenerationLog(Base):

    __tablename__ = "generation_logs"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    topic = Column(String)

    difficulty = Column(String)

    question_id = Column(
        UUID(as_uuid=True)
    )

    score = Column(Integer)

    iterations = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )