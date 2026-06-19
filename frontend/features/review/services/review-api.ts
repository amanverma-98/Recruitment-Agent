import { getQuestions, updateQuestionStatus as patchStatus, reviewQuestion as patchReview } from '@/lib/api/questionsApi';
import type { QuestionResponse, ReviewRequest } from '@/types/api';

// Re-export for components that import Question from here
export type Question = QuestionResponse;

// GET /questions?status=pending_review
export const getPendingQuestions = async (): Promise<Question[]> => {
  return getQuestions('pending_review');
};

// PATCH /questions/{id}/status
export const updateQuestionStatus = async (id: string, status: string) => {
  return patchStatus(id, status);
};

// PATCH /questions/{id}/review  — triggers AI-powered review actions
export const reviewQuestion = async (
  id: string,
  action: ReviewRequest['action'],
  feedback?: string,
): Promise<Question> => {
  // Backend expects feedback as string[] | null
  return patchReview(id, action, feedback ? [feedback] : null);
};