from Backend.app.agents.refiner import refine_question

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

print(
    refine_question(
        question,
        improvements
    )
)