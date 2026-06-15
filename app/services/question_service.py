from app.models.question import Question


def create_question(db, payload):

    existing = (
        db.query(Question)
        .filter(Question.question_text == payload["question"])
        .first()
    )

    if existing:
        raise ValueError("Duplicate question generated")
    
    if not (0 <= payload["correct_option"] < len(payload["options"])):
        raise ValueError("Invalid correct option index")
    
    if len(set(payload["options"])) != 4:
        raise ValueError("Duplicate options found")
    
    print(payload)
    question = Question(
        topic=payload["topic"],
        difficulty=payload["difficulty"],
        question_type="MCQ",
        workflow_id=payload.get("workflow_id"),
        question_text=payload["question"],
        options=payload["options"],
        correct_option=payload["correct_option"],
        explanation=payload["explanation"],
        ai_score=payload.get("ai_score", 0),
        evaluation_feedback=payload.get("evaluation_feedback", []),
        status=payload.get("status","pending_review"),
        strengths=payload.get("strengths", []),
        refinement_iterations=payload.get("refinement_iterations",0)
    )
    

    question_text = payload["question"].lower()

    banned_phrases = [
        "write a query",
        "create a query",
        "sql query will return",
        "which query",
        "write sql",
        "construct a query"
    ]

    for phrase in banned_phrases:
        if phrase in question_text:
            raise ValueError(
                "Invalid generated question"
            )
        

    if len(payload["options"]) != 4:
        raise ValueError(
            "Invalid generated question"
        )    
    db.add(question)
    db.commit()
    db.refresh(question)

    return question