# app/test_pipeline.py

from app.workflows.question_pipeline import generate_and_refine

question = generate_and_refine(
    topic="SQL",
    difficulty="Medium"
)

print(question)