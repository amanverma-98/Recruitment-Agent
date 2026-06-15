from typing import TypedDict
from langgraph.graph import StateGraph, END

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

from app.services.groq_service import generate_mcq
def generate_node(state):
    question = generate_mcq(state["topic"],state["difficulty"])
    return {"question": question}

from app.agents.evaluator import evaluate_question
def evaluate_node(state):
    evaluation = evaluate_question(state["question"])
    return {
        "score": evaluation["score"],
        "strengths": evaluation["strengths"],
        "improvements": evaluation["improvements"]
    }



from app.agents.refiner import refine_question
def refine_node(state):
    refined = refine_question(state["question"],state["improvements"])
    return {
        "question": refined,
        "refinement_iterations":
        state["refinement_iterations"] + 1
    }



TARGET_SCORE = 90
MAX_ITERATIONS = 5
def route_after_evaluation(state):

    if state.get("feedback") is not None:
        return "save"

    if state["score"] >= TARGET_SCORE:
        return "human_review"

    if state["refinement_iterations"] >= MAX_ITERATIONS:
        return "human_review"

    return "refine"


def save_node(state):
    return {
        "status": "pending_review",
        "workflow_stage": "completed"
        }


from langgraph.types import interrupt
def human_review_node(state):
    feedback = interrupt(
        {
            "question": state["question"],
            "score": state["score"]
        })
    return {"feedback": feedback.get("feedback")}


from app.agents.refiner import refine_question
def apply_feedback_node(state):
    refined = refine_question(state["question"], state["feedback"])
    return {"question": refined}

from langgraph.graph import StateGraph,END
builder = StateGraph(QuestionState)
builder.add_node("generate", generate_node)
builder.add_node("evaluate", evaluate_node)
builder.add_node("refine", refine_node)
builder.add_node("save", save_node)
builder.add_node("human_review", human_review_node)
builder.add_node("apply_feedback", apply_feedback_node)
builder.set_entry_point("generate")
builder.add_edge("generate", "evaluate")
builder.add_conditional_edges(
    "evaluate",
    route_after_evaluation,
    {
        "refine": "refine",
        "save": "save",
        "human_review": "human_review"
    }
)
builder.add_edge("refine", "evaluate")
builder.add_edge("save", END)
builder.add_edge("human_review", "apply_feedback")
builder.add_edge("apply_feedback", "evaluate")