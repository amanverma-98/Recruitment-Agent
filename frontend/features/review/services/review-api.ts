import { apiClient } from '@/lib/axios';
import type { QuestionResponse, UpdateStatusRequest } from '@/types/api';

// Re-export for components that import Question from here
export type Question = QuestionResponse;

// GET /questions?status=pending
export const getPendingQuestions = async (): Promise<Question[]> => {
  const { data } = await apiClient.get('/questions/', { params: { status: 'pending_review' } });
  return data;
};

// PATCH /questions/{id}/status
export const updateQuestionStatus = async (id: string, status: string) => {
  const payload: UpdateStatusRequest = { status };
  const { data } = await apiClient.patch(`/questions/${id}/status`, payload);
  return data;
};