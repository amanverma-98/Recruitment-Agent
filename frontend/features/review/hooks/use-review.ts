import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingQuestions, updateQuestionStatus, reviewQuestion } from '../services/review-api';
import type { Question } from '../services/review-api';

export const usePendingQuestions = () => {
  return useQuery({
    queryKey: ['questions', 'pending'],
    queryFn: getPendingQuestions,
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'improved' }) => 
      updateQuestionStatus(id, status),
    onSuccess: () => {
      // Jab koi question approve ya reject ho, toh list aur dashboard metrics auto-refresh ho jayein
      queryClient.invalidateQueries({ queryKey: ['questions', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['questions', 'bank'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analytics'] });
    },
  });
};

export const useReviewQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, feedback }: { id: string; action: 'improve'; feedback?: string }) =>
      reviewQuestion(id, action, feedback),
    onSuccess: (updatedQuestion) => {
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
  });
};