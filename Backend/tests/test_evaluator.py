from Backend.app.agents.evaluator import evaluate_question


question = {
    "question":"What is SQL?",
    "options":[
        "Database",
        "Language",
        "Protocol",
        "Framework"
    ],
    "answer":"Language"
}

print(
    evaluate_question(question)
)