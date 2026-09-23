import {
  getQuestions,
  exportQuestionsPdf,
  exportQuestionsDocx,
  exportQuestionsJson,
} from '@/lib/api/questionsApi';
import type { QuestionResponse } from '@/types/api';

// Re-export for use in components
export type Question = QuestionResponse;

/**
 * Fetch all approved questions from the centralized API.
 */
export const getApprovedQuestions = async (): Promise<Question[]> => {
  return getQuestions(status="");
};

/**
 * Export selected questions as PDF/DOCX/JSON.
 */
export { exportQuestionsPdf, exportQuestionsDocx, exportQuestionsJson };