import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bulkGenerateQuestions, BulkGenerateInput } from '../services/generation-api';
import type { BulkGenerateResponse } from '@/types/api';
import { useToast } from '@/lib/hooks/use-toast';

export const useBulkGenerate = () => {
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation<BulkGenerateResponse, Error, BulkGenerateInput>({
    mutationFn: ({ topics, difficulties, count }) =>
      bulkGenerateQuestions({ topics, difficulties, count }),
    
    onSuccess: (data) => {
      showToast(`${data.generated} questions generated successfully.`, 'success');
      // Redirect user to Review Queue after generation
      router.push('/review');
    },
    onError: () => {
      showToast('Failed to generate questions. Please check your connection.', 'error');
    },
  });
};
