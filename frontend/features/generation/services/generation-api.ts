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
  // Send arrays directly — backend expects topics[] and difficulties[]
  return bulkGenerate({
    topics,
    difficulties,
    count,
  });
};