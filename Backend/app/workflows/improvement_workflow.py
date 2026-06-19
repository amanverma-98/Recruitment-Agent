from app.agents.refiner import (refine_question)
from app.agents.evaluator import (evaluate_question)

def run_improvement_workflow(question, feedback):
    refined = refine_question(question, feedback)
    evaluation = (evaluate_question(refined))
    refined["ai_score"] = (evaluation["score"])
    refined["strengths"] = (evaluation["strengths"])
    refined["evaluation_feedback"] = (evaluation["improvements"])

    return refined