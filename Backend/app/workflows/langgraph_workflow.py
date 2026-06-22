from app.graph.graph import get_graph
from typing import TypedDict

from typing import TypedDict, Annotated
from operator import add


class QuestionState(TypedDict):
    topic: str
    difficulty: str

    question: dict

    score: int

    strengths: Annotated[list[str], add]

    improvements: Annotated[list[str], add]

    refinement_iterations: int

    status: str

    workflow_stage: str

    review_feedback: Annotated[list[str], add]

    approved: bool | None


import uuid

def run_question_workflow(topic, difficulty, question_id=None):
    if question_id is None:
        question_id = str(uuid.uuid4())
    graph = get_graph()
    result = graph.invoke(
        {
            "topic": topic,
            "difficulty": difficulty,
            "refinement_iterations": 0,
            "strengths": [],
            "improvements": [],
            "review_feedback": []
        },
        config={
            "configurable": {
                "thread_id": question_id
            }
        }
    )

    print("Workflow result:", result)


    question = result["question"]

    question["topic"] = topic
    question["difficulty"] = difficulty

    question["ai_score"] = result["score"]

    question["strengths"] = result["strengths"]

    question["evaluation_feedback"] = result["improvements"]

    question["refinement_iterations"] = result["refinement_iterations"]

    question["status"] = result["status"]

    question["workflow_id"] = question_id

    return question