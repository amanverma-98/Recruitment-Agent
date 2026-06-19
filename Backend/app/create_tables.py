from Backend.app.core.database import engine
from Backend.app.models.question import Question
from Backend.app.models.user import User
from Backend.app.core.database import Base

from Backend.app.models.generation_log import GenerationLog

Base.metadata.create_all(bind=engine)

print("Tables created successfully")