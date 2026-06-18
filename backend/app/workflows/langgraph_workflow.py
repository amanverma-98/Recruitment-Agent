from app.graph.graph import get_graph
from typing import TypedDict

class QuestionState(TypedDict):
    topic: str
    difficulty: str
    question: dict
    score: int
    strengths: list
    improvements: list
    refinement_iterations: int
    status: str
    workflow_stage: str
    feedback: list[str] | None


import uuid

def run_question_workflow(topic, difficulty, question_id=None):
    if question_id is None:
        question_id = str(uuid.uuid4())
    graph = get_graph()
    result = graph.invoke(
        {
            "topic": topic,
            "difficulty": difficulty,
            "refinement_iterations": 0
        },
        config={
            "configurable": {
                "thread_id": question_id
            }
        }
    )

    print("Workflow result:", result)

    # Workflow paused at human review
    if "__interrupt__" in result:
        question = result["question"]
        question["ai_score"] = result.get("score", 0)
        question["strengths"] = result.get("strengths", [])
        question["evaluation_feedback"] = result.get("improvements", [])
        question["refinement_iterations"] = result.get("refinement_iterations", 0)
        question["status"] = "pending_review"
        question["workflow_id"] = question_id
        question["topic"] = topic
        question["difficulty"] = difficulty

        return question

    # Workflow completed normally
    question = result["question"]
    question["ai_score"] = result.get("score", 0)
    question["strengths"] = result.get("strengths", [])
    question["evaluation_feedback"] = result.get("improvements", [])
    question["refinement_iterations"] = result.get("refinement_iterations", 0)
    question["status"] = result.get("status", "pending_review")
    question["workflow_id"] = question_id
    question["topic"] = topic
    question["difficulty"] = difficulty
    question["feedback"] = result.get("improvements", [])

    return question