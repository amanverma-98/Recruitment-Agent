import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestions } from '@/lib/api/questionsApi';
import { useToast } from '@/lib/hooks/use-toast';

export const useDeleteQuestions = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (questionIds: string[]) => deleteQuestions(questionIds),
    onSuccess: (data) => {
      showToast(`Successfully deleted ${data.deleted} question(s).`, 'success');
      queryClient.invalidateQueries({ queryKey: ['questions', 'bank'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analytics'] });
    },
    onError: (error) => {
      const message =
        typeof error === 'object' && error !== null && 'detail' in error
          ? String((error as { detail: string }).detail)
          : 'Failed to delete question(s). Please try again.';
      showToast(message, 'error');
    },
  });
};
