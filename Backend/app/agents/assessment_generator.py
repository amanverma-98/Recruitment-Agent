import random

from sqlalchemy.orm import Session

from app.models.question import Question


class AssessmentGeneratorAgent:

    def __init__(self, db: Session):
        self.db = db

    def generate(self, user_id, sections):

        assessment = []

        selected_question_ids = set()

        for section in sections:

            questions = (
                self.db.query(Question)
                .filter(
                    Question.user_id == user_id,
                    Question.topic == section.topic,
                    Question.difficulty == section.difficulty,
                    Question.status == "approved"
                )
                .all()
            )

            # Remove already selected questions
            questions = [
                q for q in questions
                if q.id not in selected_question_ids
            ]

            if len(questions) < section.count:
                raise ValueError(
                    f"Not enough approved questions for "
                    f"{section.topic} ({section.difficulty})"
                )

            selected = random.sample(
                questions,
                section.count
            )

            for q in selected:

                selected_question_ids.add(q.id)

                assessment.append({

                    "id": str(q.id),

                    "topic": q.topic,

                    "difficulty": q.difficulty,

                    "question": q.question_text,

                    "options": q.options,

                    "correct_option": q.correct_option,

                    "explanation": q.explanation

                })

        random.shuffle(assessment)

        return {

            "total_questions": len(assessment),

            "questions": assessment

        }