from fastapi import HTTPException
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.question import (GenerateQuestionRequest, BulkGenerateRequest, QuestionResponse, BulkGenerateResponse)
from app.services.question_service import (create_question)
from app.workflows.langgraph_workflow import (run_question_workflow)
from app.services.log_service import (create_log)
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.generation_log import GenerationLog

router = APIRouter()


@router.post("/generate", response_model=QuestionResponse)
def generate_question(request: GenerateQuestionRequest, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    question = None
    for _ in range(3):
        try:
            generated = run_question_workflow(topic=request.topic, difficulty=request.difficulty)
            payload = {
                "topic": generated["topic"],
                "difficulty": generated["difficulty"],
                "question": generated["question"],
                "options": generated["options"],
                "correct_option": generated["correct_option"],
                "explanation": generated["explanation"],
                "ai_score": generated["ai_score"],
                "strengths": generated["strengths"],
                "evaluation_feedback": generated["evaluation_feedback"],
                "refinement_iterations": generated["refinement_iterations"],
                "workflow_id": generated["workflow_id"]
            }
            question = create_question(db=db, payload=payload, user_id=current_user.id)
            break

        except ValueError as e:
            if ("Duplicate question" in str(e) or "Invalid generated question" in str(e)):
                continue
            raise

    if question is None:
        raise HTTPException(
            status_code=500,
            detail="Could not generate unique question"
        )

    create_log(
        db=db,
        user_id=current_user.id,
        topic=request.topic,
        difficulty=request.difficulty,
        question_id=question.id,
        score=question.ai_score,
        iterations=question.refinement_iterations
    )


    return {
    "id": question.id,
    "topic": question.topic,
    "difficulty": question.difficulty,
    "question_type": question.question_type,
    "question_text": question.question_text,
    "options": question.options,
    "correct_option": question.correct_option,
    "explanation": question.explanation,
    "ai_score": question.ai_score,
    "status": question.status,
    "refinement_iterations": question.refinement_iterations,
    "workflow_id": question.workflow_id
}



@router.post("/bulk-generate", response_model=BulkGenerateResponse)
def bulk_generate(request: BulkGenerateRequest,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    generated_questions = []
    failed_questions = 0
    for _ in range(request.count):
        try:
            question = None
            for _ in range(3):
                try:
                    generated = run_question_workflow(topic=request.topic, difficulty=request.difficulty)
                    payload = {
                        "topic": generated["topic"],
                        "difficulty": generated["difficulty"],
                        "question": generated["question"],
                        "options": generated["options"],
                        "correct_option": generated["correct_option"],
                        "explanation": generated["explanation"],
                        "ai_score": generated["ai_score"],
                        "strengths": generated["strengths"],
                        "evaluation_feedback": generated["evaluation_feedback"],
                        "refinement_iterations": generated["refinement_iterations"],
                        "workflow_id": generated["workflow_id"]
                    }
                    question = create_question(db=db, payload=payload, user_id=current_user.id)
                    break

                except ValueError as e:
                    if ("Duplicate question" in str(e) or "Invalid generated question" in str(e)):
                        continue
                    raise

            if question is None:
                raise HTTPException(
                    status_code=500,
                    detail="Could not generate unique question"
                )

            generated_questions.append(question.id)

            create_log(
                db=db,
                user_id=current_user.id,
                topic=request.topic,
                difficulty=request.difficulty,
                question_id=question.id,
                score=question.ai_score,
                iterations=question.refinement_iterations
            )
        except Exception as e:
            failed_questions += 1
            print(e)
    
    if not generated_questions:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate questions"
        )
    
    return {
    "generated": len(generated_questions),
    "failed": failed_questions,
    "question_ids": generated_questions
    }


from app.models.question import Question

@router.get("/", response_model=list[QuestionResponse])
def get_questions(status: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Question).filter(
    Question.user_id == current_user.id
    )
    if status:
        query = query.filter(Question.status == status)
    return query.all()


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (
    db.query(Question)
    .filter(
        Question.id == question_id,
        Question.user_id == current_user.id
    )
    .first()
)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question




from app.schemas.question import (UpdateStatusRequest)

@router.patch("/{question_id}/status", response_model=QuestionResponse)
def update_status(question_id: str, request: UpdateStatusRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (
    db.query(Question)
    .filter(
        Question.id == question_id,
        Question.user_id == current_user.id
    )
    .first()
)
    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )
    question.status = request.status
    db.commit()
    db.refresh(question)

    return question


from app.schemas.question import ReviewRequest
from app.workflows.resume_workflow import resume_workflow

@router.patch("/{question_id}/review", response_model=QuestionResponse)
def review_question(question_id: str,request: ReviewRequest,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (
    db.query(Question)
    .filter(
        Question.id == question_id,
        Question.user_id == current_user.id
    )
    .first()
)

    if not question:
        raise HTTPException(status_code=404,detail="Question not found")
    if request.action == "approve":
        question.status = "approved"

    elif request.action == "reject":
        question.status = "rejected"

    elif request.action == "improve":
        if not request.feedback:
            raise HTTPException(
                status_code=400,
                detail="Feedback is required for improve action"
            )
        
        if not question.workflow_id:
            raise HTTPException(
                status_code=400,
                detail="Question has no workflow checkpoint"
            )
        try:
            result = resume_workflow(
                question.workflow_id,
                request.feedback
            )

            question.topic = result["topic"]
            question.difficulty = result["difficulty"]
            question.question_text = result["question"]["question"]
            question.options = result["question"]["options"]
            question.correct_option = result["question"]["correct_option"]
            question.explanation = result["question"]["explanation"]
            question.ai_score = result["score"]
            question.refinement_iterations = result["refinement_iterations"]
            question.status = "pending_review"
            question.strengths = result["strengths"]
            question.evaluation_feedback = result["improvements"]
            question.review_feedback = request.feedback

            from datetime import datetime, timezone
            question.reviewed_at = datetime.now(timezone.utc)

            db.commit()
            db.refresh(question)

        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Failed to improve question"
            )

        return question


from fastapi.responses import StreamingResponse
from app.schemas.export import ExportRequest
from app.services.export_service import (generate_questions_pdf)

@router.post("/export/pdf")
def export_pdf(request: ExportRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    questions = (
    db.query(Question)
    .filter(
        Question.user_id == current_user.id,
        Question.id.in_(request.question_ids)
    )
    .all()
)
    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    pdf = generate_questions_pdf(questions)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=questions.pdf"
        }
    )


from app.services.docx_export_service import (generate_docx)


@router.post("/export/docx")
def export_docx(request: ExportRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    questions = (
    db.query(Question)
    .filter(
        Question.user_id == current_user.id,
        Question.id.in_(request.question_ids)
    )
    .all()
)
    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    buffer = generate_docx(questions)

    return StreamingResponse(
        buffer,
        media_type=(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ),
        headers={
            "Content-Disposition":
            "attachment; filename=questions.docx"
        }
    )


@router.get("/export/pdf/all")
def export_all_pdf(
    topic: str | None = None,
    difficulty: str | None = None,
    status: str = "approved",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Question).filter(
    Question.user_id == current_user.id)

    if topic:
        query = query.filter(Question.topic == topic)

    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    if status:
        query = query.filter(Question.status == status)

    questions = (query.order_by(Question.created_at.desc()).all())

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    buffer = generate_questions_pdf(questions)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=question_bank.pdf"
        }
    )


@router.get("/export/docx/all")
def export_all_docx(
    topic: str | None = None,
    difficulty: str | None = None,
    status: str = "approved",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Question).filter(
    Question.user_id == current_user.id)

    if topic:
        query = query.filter(Question.topic == topic)

    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    if status:
        query = query.filter(Question.status == status)

    questions = (query.order_by(Question.created_at.desc()).all())

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    buffer = generate_docx(questions)

    return StreamingResponse(
        buffer,
        media_type=(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ),
        headers={
            "Content-Disposition":
            "attachment; filename=question_bank.docx"
        }
    )


from app.schemas.question import DeleteQuestionsRequest

@router.delete("/")
def delete_questions(
    request: DeleteQuestionsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    questions = (
        db.query(Question)
        .filter(
            Question.user_id == current_user.id,
            Question.id.in_(request.question_ids)
        )
        .all()
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    deleted = len(questions)

    try:
        question_ids = [question.id for question in questions]

        db.query(GenerationLog).filter(
            GenerationLog.user_id == current_user.id,
            GenerationLog.question_id.in_(question_ids)
        ).delete(synchronize_session=False)

        for question in questions:
            db.delete(question)

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete questions"
        )

    return {
        "deleted": deleted
    }