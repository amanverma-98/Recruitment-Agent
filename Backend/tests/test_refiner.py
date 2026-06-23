from app.agents.refiner import refine_question

question = {
    "question": "What is SQL?",
    "options": [
        "Database",
        "Language",
        "Protocol",
        "Framework"
    ],
    "answer": "Language"
}

improvements = [
    "Increase difficulty",
    "Improve distractors",
    "Add practical context"
]

reviewer_feedback = ["explain the options"]

print(
    refine_question(
        question,
        improvements,
        reviewer_feedback
    )
)