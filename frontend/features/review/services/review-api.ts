import { getQuestions, updateQuestionStatus as patchStatus } from '@/lib/api/questionsApi';
import type { QuestionResponse } from '@/types/api';

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