from fastapi import FastAPI

from app.api.routes.questions import router as question_router

app = FastAPI(
    title="RecruitAI Agent"
)

app.include_router(
    question_router,
    prefix="/questions",
    tags=["Questions"]
)

from app.api.routes.analytics import (router as analytics_router)
app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Analytics"]
)