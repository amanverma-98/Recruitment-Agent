from io import BytesIO
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer)
from reportlab.lib.styles import getSampleStyleSheet


def generate_questions_pdf(questions,

    include_answers=False,

    include_explanations=False):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    elements = []
    elements.append(
        Paragraph("Question Bank", styles["Title"]))
    elements.append(Spacer(1, 20))

    for index, q in enumerate(questions, start=1):
        elements.append(Paragraph(f"{index}. {q.question_text}", styles["Heading3"]))
        elements.append(Paragraph(f"Topic: {q.topic}", styles["BodyText"]))
        elements.append(Paragraph(f"Difficulty: {q.difficulty}", styles["BodyText"]))
        elements.append(Spacer(1, 10))

        for option in q.options:
            elements.append(Paragraph(option, styles["BodyText"]))
        if include_answers:
            elements.append(Paragraph(f"Correct Answer: {q.correct_option}", styles["BodyText"]))
        if include_explanations:    
            elements.append(Paragraph(q.explanation, styles["BodyText"]))
        elements.append(Spacer(1, 20))

    doc.build(elements)
    buffer.seek(0)

    return buffer