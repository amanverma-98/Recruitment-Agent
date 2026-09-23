from fastapi import FastAPI
from app.models.user import User
from app.api.routes.questions import router as question_router
from app.models.question import Question
from app.models.generation_log import GenerationLog
from app.core.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes import assessment
from app.api.routes.public import router as public_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RecruitAI Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://recruitment-agent-eight.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    question_router,
    prefix="/questions",
    tags=["Questions"]
)

app.include_router(
    assessment.router,
    prefix="/assessment",
    tags=["Assessment"]
)

from app.api.routes.analytics import (router as analytics_router)
app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    public_router,
    prefix="/public",
    tags=["Public"]
)  # NEW