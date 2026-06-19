import { useQuery } from '@tanstack/react-query';
import { getQuestionById } from '@/lib/api/questionsApi';

export const useQuestionDetail = (id: string) => {
  return useQuery({
    queryKey: ['questions', 'detail', id],
    queryFn: () => getQuestionById(id),
    enabled: !!id,
  });
};
