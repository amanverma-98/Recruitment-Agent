import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { bulkGenerateWithProgress, BulkGenerateInput } from '../services/generation-api';
import { useToast } from '@/lib/hooks/use-toast';

interface ProgressState {
  current: number;
  total: number;
  generated: number;
  failed: number;
  percent: number;
  last_topic?: string;
  last_difficulty?: string;
}

export const useBulkGenerate = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);

  const mutate = useCallback(async (input: BulkGenerateInput) => {
    setIsPending(true);
    setProgress({ current: 0, total: input.count, generated: 0, failed: 0, percent: 0 });

    try {
      await bulkGenerateWithProgress(
        input,
        (prog) => {
          setProgress(prog);
        },
        (result) => {
          setIsPending(false);
          setProgress(null);
          showToast(`${result.generated} questions generated successfully.`, 'success');
          router.push('/review');
        },
        (error) => {
          setIsPending(false);
          setProgress(null);
          showToast(error || 'Failed to generate questions. Please check your connection.', 'error');
        }
      );
    } catch {
      setIsPending(false);
      setProgress(null);
      showToast('Failed to generate questions. Please check your connection.', 'error');
    }
  }, [router, showToast]);

  return { mutate, isPending, progress };
};
