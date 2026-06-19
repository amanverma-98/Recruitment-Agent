import { apiClient } from '@/lib/axios';
import type { QuestionResponse, ExportPdfRequest, ExportDocxRequest } from '@/types/api';

// Re-export for use in components
export type Question = QuestionResponse;

/**
 * Fetch all approved questions from `GET /questions/?status=approved`.
 * The backend only supports the `status` query param, so topic/search
 * filtering is handled client-side in the hook layer.
 */
export const getApprovedQuestions = async (): Promise<Question[]> => {
  const { data } = await apiClient.get('/questions/', {
    params: { status: 'approved' },
  });
  return data;
};

/**
 * Export selected questions as PDF via `POST /questions/export/pdf`.
 * Returns a blob for file download.
 */
export const exportQuestionsPdf = async (questionIds: string[]) => {
  const payload: ExportPdfRequest = { question_ids: questionIds };
  const response = await apiClient.post('/questions/export/pdf', payload, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export selected questions as DOCX via `POST /questions/export/docx`.
 * Returns a blob for file download.
 */
export const exportQuestionsDocx = async (questionIds: string[]) => {
  const payload: ExportDocxRequest = { question_ids: questionIds };
  const response = await apiClient.post('/questions/export/docx', payload, {
    responseType: 'blob',
  });
  return response.data;
};