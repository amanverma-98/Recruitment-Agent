from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable


def generate_questions_pdf(questions, include_answers=False, include_explanations=False):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading3"]
    body_style = styles["BodyText"]

    elements = []

    elements.append(Paragraph("Question Bank", title_style))
    elements.append(Spacer(1, 20))

    for index, q in enumerate(questions, start=1):
        # Topic
        elements.append(Paragraph(f"<b>Topic:</b> {q.topic}", body_style))

        # Difficulty
        elements.append(
            Paragraph(f"<b>Difficulty:</b> {q.difficulty}", body_style))
        elements.append(Spacer(1, 8))

        # Question Number
        elements.append(
            Paragraph(f"<b>Question {index}:</b>", heading_style))

        # Question
        elements.append(Paragraph(q.question_text, body_style))
        elements.append(Spacer(1, 8))

        # Options Heading
        elements.append(Paragraph("<b>Options:</b>", body_style))
        elements.append(Spacer(1, 4))

        # Numbered Options
        for option_index, option in enumerate(q.options, start=1):
            elements.append(Paragraph(f"{option_index}. {option}", body_style))
        elements.append(Spacer(1, 8))

        # Answer
        if include_answers:
            elements.append(Paragraph(f"<b>Answer:</b> {q.correct_option + 1}. {q.options[q.correct_option]}", body_style))
            elements.append(Spacer(1, 6))

        # Explanation
        if include_explanations:
            elements.append(Paragraph("<b>Explanation:</b>", body_style))
            elements.append(Paragraph(q.explanation, body_style))
            elements.append(Spacer(1, 8))

        # Horizontal Divider
        elements.append(HRFlowable(width="100%", thickness=1))
        elements.append(Spacer(1, 12))

    doc.build(elements)
    buffer.seek(0)

    return buffer