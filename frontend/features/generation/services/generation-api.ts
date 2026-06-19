import { bulkGenerateQuestions as bulkGenerate } from '@/lib/api/questionsApi';
import type { BulkGenerateResponse } from '@/types/api';

export interface BulkGenerateInput {
  topics: string[];
  difficulties: string[];
  count: number;
}

/**
 * Calls POST /questions/bulk-generate with comma-separated values.
 */
export const bulkGenerateQuestions = async ({ 
  topics, 
  difficulties, 
  count 
}: BulkGenerateInput): Promise<BulkGenerateResponse> => {
  // Array ko comma-separated string mein convert kar rahe hain
  return bulkGenerate({
    topic: topics.join(', '),
    difficulty: difficulties.join(', '),
    count: count,
  });
};