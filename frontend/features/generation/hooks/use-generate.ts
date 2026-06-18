import { useMutation } from '@tanstack/react-query'; // ya jo bhi aap library use kar rahe hain
import { useRouter } from 'next/navigation'; // ya 'next/navigation'
import { bulkGenerateQuestions, BulkGenerateInput } from '../services/generation-api'; // path sahi kar lena
import type { BulkGenerateResponse } from '@/types/api';

export const useBulkGenerate = () => {
  const router = useRouter();

  return useMutation<BulkGenerateResponse, Error, BulkGenerateInput>({
    // Ab direct single API hit hogi comma-separated string ke saath
    mutationFn: ({ topics, difficulties, count }) =>
      bulkGenerateQuestions({ topics, difficulties, count }),
    
    onSuccess: (data) => {
      console.log(`Generated ${data.generated} questions, ${data.failed} failed`);
      // Generation shuru hone ke baad user ko Review Queue mein redirect kiya
      router.push('/review');
    },
    onError: (error) => {
      console.error("Generation failed:", error);
    }
  });
};