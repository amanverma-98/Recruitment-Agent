from app.models.generation_log import (
    GenerationLog
)


def create_log(db, user_id, topic, difficulty, question_id, score, iterations):

    log = GenerationLog(topic=topic, user_id=user_id, difficulty=difficulty, question_id=question_id, score=score, iterations=iterations)
    db.add(log)
    db.commit()
    db.refresh(log)

    return log