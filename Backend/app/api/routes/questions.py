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
def generate_question(
    request: GenerateQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = None

    try:
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
            topic=question.topic,
            difficulty=question.difficulty,
            question_id=question.id,
            score=question.ai_score,
            iterations=question.refinement_iterations
        )

        db.commit()
        db.refresh(question)

        return question

    except Exception:
        db.rollback()
        raise

from concurrent.futures import ThreadPoolExecutor
from itertools import product
import random
from app.core.database import SessionLocal

def generate_single_question(topic, difficulty, user_id):
    db: Session = SessionLocal()

    try:
        question = None
        for _ in range(3):
            try:
                generated = run_question_workflow(topic=topic, difficulty=difficulty)
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

                question = create_question(db=db, payload=payload, user_id=user_id)
                break

            except ValueError as e:
                if ("Duplicate question" in str(e) or "Invalid generated question" in str(e)):
                    continue
                raise

        if question is None:
            raise Exception("Generation failed")

        create_log(
            db=db,
            user_id=user_id,
            topic=question.topic,
            difficulty=question.difficulty,
            question_id=question.id,
            score=question.ai_score,
            iterations=question.refinement_iterations
        )

        db.commit()

        return question.id

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


@router.post("/bulk-generate", response_model=BulkGenerateResponse)
def bulk_generate(request: BulkGenerateRequest, current_user: User = Depends(get_current_user)):

    combinations = list(product(request.topics, request.difficulties))
    random.shuffle(combinations)
    tasks = []
    for i in range(request.count):
        tasks.append(combinations[i % len(combinations)])

    generated_questions = []
    failed = 0
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(
                generate_single_question,
                topic,
                difficulty,
                current_user.id
            )
            for topic, difficulty in tasks
        ]

        for future in futures:
            try:
                generated_questions.append(future.result())
            except Exception as e:
                print(e)
                failed += 1

    if not generated_questions:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate questions"
        )

    return {
        "generated": len(generated_questions),
        "failed": failed,
        "question_ids": generated_questions
    }


from app.models.question import Question
@router.get("/", response_model=list[QuestionResponse])
def get_questions(status: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Question).filter(Question.user_id == current_user.id)
    if status:
        query = query.filter(Question.status == status)
    return query.all()


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (db.query(Question).filter(Question.id == question_id, Question.user_id == current_user.id).first())
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question




from app.schemas.question import (UpdateStatusRequest)
@router.patch("/{question_id}/status", response_model=QuestionResponse)
def update_status(question_id: str, request: UpdateStatusRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (db.query(Question).filter(Question.id == question_id, Question.user_id == current_user.id).first())
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
from app.workflows.improvement_workflow import run_improvement_workflow
@router.patch("/{question_id}/review")
def review_question(question_id: str,request: ReviewRequest,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = (db.query(Question).filter(Question.id == question_id, Question.user_id == current_user.id).first())
    if not question:
        raise HTTPException(status_code=404,detail="Question not found")
    if request.action == "approve":
        question.status = "approved"

    elif request.action == "reject":
        db.delete(question)
        db.commit()
        return {
            "message": "Question rejected and deleted successfully"
        }

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
        import traceback
        try:
            payload = {
                "question": question.question_text,
                "options": question.options,
                "correct_option": question.correct_option,
                "explanation": question.explanation,
            }

            result = run_improvement_workflow(payload, question.evaluator_feedback, request.feedback)
            
            print(result)

            question.question_text = result["question"]
            question.options = result["options"]
            question.correct_option = result["correct_option"]
            question.explanation = result["explanation"]
            question.ai_score = result["ai_score"]
            question.strengths = result["strengths"]
            question.evaluation_feedback = result["evaluation_feedback"]
            question.refinement_iterations += 1
            question.status = "pending_review"
            question.review_feedback = request.feedback

            from datetime import datetime, timezone
            question.reviewed_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(question)


        except Exception as e:
            traceback.print_exc()
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

        return question


from fastapi.responses import StreamingResponse
from app.schemas.export import ExportRequest
from app.services.export_service import (generate_questions_pdf)
@router.post("/export/pdf")
def export_pdf(request: ExportRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    questions = (db.query(Question).filter(Question.user_id == current_user.id, Question.id.in_(request.question_ids)).all())
    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    pdf = generate_questions_pdf(questions, include_answers=request.include_answers, include_explanations=request.include_explanations)
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
    questions = (db.query(Question).filter(Question.user_id == current_user.id, Question.id.in_(request.question_ids)).all())
    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found"
        )

    buffer = generate_docx(questions, include_answers=request.include_answers, include_explanations=request.include_explanations)
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
    include_answers: bool = True,
    include_explanations: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Question).filter(Question.user_id == current_user.id)

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

    buffer = generate_questions_pdf(questions, include_answers=include_answers, include_explanations=include_explanations)
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
    include_answers: bool = True,
    include_explanations: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Question).filter(Question.user_id == current_user.id)

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

    buffer = generate_docx(questions, include_answers=include_answers, include_explanations=include_explanations)
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
        db.query(Question).filter( Question.user_id == current_user.id, Question.id.in_(request.question_ids)).all())

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