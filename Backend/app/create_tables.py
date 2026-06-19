from app.core.database import engine
from app.models.question import Question
from app.models.user import User
from app.core.database import Base

from app.models.generation_log import GenerationLog

Base.metadata.create_all(bind=engine)

print("Tables created successfully")