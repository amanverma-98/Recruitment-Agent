from typing import TypedDict
from langgraph.graph import StateGraph, END

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

from app.services.groq_service import generate_mcq
def generate_node(state: QuestionState):
    try:
        question = generate_mcq(
            state["topic"],
            state["difficulty"]
        )
    except Exception as e:
        raise ValueError(
            f"MCQ generation failed: {str(e)}"
        )
    return {
        "question": question,
        "workflow_stage": "generated"
    }

from app.agents.evaluator import evaluate_question


def evaluate_node(state: QuestionState):

    evaluation = evaluate_question(
        state["question"]
    )

    score = evaluation["score"]

    question = state["question"]
    if len(set(question["options"])) != 4:
        score -= 25

    if not (0 <= question["correct_option"] <= 3):
        score -= 50    

    question_length = len(question["question"].split())

    longest_option = max(
        len(option.split())
        for option in question["options"]
    )

    difficulty = state["difficulty"].lower()

    if difficulty == "easy":

        if question_length > 20:
            score -= 7

        if longest_option > 9:
            score -= 7

    elif difficulty == "medium":

        if question_length > 35:
            score -= 8

        if longest_option > 14:
            score -= 8

    elif difficulty == "hard":

        if question_length > 50:
            score -= 6

        if longest_option > 20:
            score -= 6

    score = max(0, min(score, 100))

    return {
        "score": score,
        "strengths": evaluation["strengths"],
        "improvements": evaluation["improvements"],
        "workflow_stage": "evaluated"
    }



from app.agents.refiner import refine_question
def refine_node(state: QuestionState):
    refined = refine_question(state["question"],state["improvements"], state["review_feedback"])
    return {
        "question": refined,
        "refinement_iterations":
            state["refinement_iterations"] + 1,
        "workflow_stage": "refined"
    }


TARGET_SCORE = 80
MAX_ITERATIONS = 3
def route_after_evaluation(state: QuestionState):

    if (state["score"] >= TARGET_SCORE or state["refinement_iterations"] >= MAX_ITERATIONS):
        return "human_review"

    return "refine"


def human_review_node(state: QuestionState):
    return {
        "status": "pending_review",
        "workflow_stage": "human_review"
    }


from langgraph.graph import StateGraph, END

builder = StateGraph(QuestionState)

builder.add_node("generate", generate_node)
builder.add_node("evaluate", evaluate_node)
builder.add_node("refine", refine_node)
builder.add_node("human_review", human_review_node)

builder.set_entry_point("generate")

builder.add_edge("generate", "evaluate")

builder.add_conditional_edges(
    "evaluate",
    route_after_evaluation,
    {
        "refine": "refine",
        "human_review": "human_review"
    }
)

builder.add_edge("refine", "evaluate")
builder.add_edge("human_review", END)