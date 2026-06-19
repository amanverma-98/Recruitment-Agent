from app.models.generation_log import (
    GenerationLog
)


def create_log(
    db,
    topic,
    difficulty,
    question_id,
    score,
    iterations
):

    log = GenerationLog(
        topic=topic,
        difficulty=difficulty,
        question_id=question_id,
        score=score,
        iterations=iterations
    )

    db.add(log)
    db.commit()

    return log