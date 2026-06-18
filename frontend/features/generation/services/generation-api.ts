import { apiClient } from '@/lib/axios';
import type { BulkGenerateResponse } from '@/types/api';

// Hum mutation hook se arrays (`string[]`) accept karenge aur function ke andar string banayenge
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
  
  // Array ko comma-separated string mein convert kar rahe hain: "html , css"
  const payload = {
    topic: topics.join(', '),
    difficulty: difficulties.join(', '),
    count: count
  };

  const { data } = await apiClient.post('/questions/bulk-generate', payload);
  return data;
};