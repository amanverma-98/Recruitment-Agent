from pydantic import BaseModel

class ExportRequest(BaseModel):
    question_ids: list[str] | None = None
    status: str | None = None