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

/**
 * Streams bulk generation progress via SSE.
 * Calls onProgress for each question completed, onComplete when done.
 */
export const bulkGenerateWithProgress = async (
  { topics, difficulties, count }: BulkGenerateInput,
  onProgress: (progress: {
    current: number;
    total: number;
    generated: number;
    failed: number;
    percent: number;
    last_topic?: string;
    last_difficulty?: string;
  }) => void,
  onComplete: (result: {
    generated: number;
    failed: number;
    question_ids: string[];
  }) => void,
  onError: (error: string) => void
): Promise<void> => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('recruit_ai_token') : null;

  const response = await fetch(`${API_BASE_URL}/questions/bulk-generate-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ topics, difficulties, count }),
  });

  if (!response.ok) {
    onError('Failed to start generation');
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError('Stream not available');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.complete) {
            onComplete({
              generated: data.generated,
              failed: data.failed,
              question_ids: data.question_ids,
            });
          } else {
            onProgress(data);
          }
        } catch {
          // skip malformed lines
        }
      }
    }
  }
};