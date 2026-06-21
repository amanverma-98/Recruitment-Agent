import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingQuestions, updateQuestionStatus, reviewQuestion } from '../services/review-api';
import type { Question } from '../services/review-api';
import { useToast } from '@/lib/hooks/use-toast';

export const usePendingQuestions = () => {
  return useQuery({
    queryKey: ['questions', 'pending'],
    queryFn: getPendingQuestions,
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'improved' }) => 
      updateQuestionStatus(id, status),
    onSuccess: (_data, variables) => {
      const action = variables.status === 'approved' ? 'approved' : variables.status === 'rejected' ? 'rejected' : 'updated';
      showToast(`Question ${action} successfully.`, 'success');
      // Refresh related query caches
      queryClient.invalidateQueries({ queryKey: ['questions', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['questions', 'bank'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analytics'] });
    },
    onError: () => {
      showToast('Failed to update question status. Please try again.', 'error');
    },
  });
};

export const useReviewQuestion = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, action, feedback }: { id: string; action: 'improve'; feedback?: string }) =>
      reviewQuestion(id, action, feedback),
    onSuccess: (updatedQuestion) => {
      showToast('Question review processed successfully.', 'success');
      // Update the question inside the pending list cache so the UI reflects
      // the AI-regenerated content in real-time without a full refetch
      queryClient.setQueryData<Question[]>(['questions', 'pending'], (old) => {
        if (!old) return old;
        return old.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
      });
      // Also invalidate to ensure eventual consistency
      queryClient.invalidateQueries({ queryKey: ['questions', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['questions', 'bank'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analytics'] });
    },
    onError: () => {
      showToast('Failed to process review. Please check your connection.', 'error');
    },
  });
};
