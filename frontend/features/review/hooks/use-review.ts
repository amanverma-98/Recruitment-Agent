import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingQuestions, updateQuestionStatus } from '../services/review-api';

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