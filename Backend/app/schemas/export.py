from pydantic import BaseModel

class ExportRequest(BaseModel):
    question_ids: list[str] | None = None
    status: str | None = None
    include_answers: bool = False
    include_explanations: bool = False
    include_topic: bool = True
    include_difficulty: bool = True