import { useQuery, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getApprovedQuestions, exportQuestionsPdf, exportQuestionsDocx } from '../services/bank-api';
import type { ExportQuesWithoutDetailPdfRequest, QuestionResponse } from '@/types/api';
import { exportQuesWithoutDetailDocx, exportQuesWithoutDetailPdf } from '@/lib/api/questionsApi';
import { useToast } from '@/lib/hooks/use-toast';

/**
 * Fetches all approved questions and applies client-side filtering.
 * The backend's GET /questions/ only supports `status` as a query param,
 * so topic and search filtering happens here in-memory.
 */
export const useQuestionBank = (filters: { topic?: string; search?: string , difficulty?:string }) => {
  const query = useQuery({
    queryKey: ['questions', 'bank'],
    queryFn: getApprovedQuestions,
  });

  const filteredData = useMemo(() => {
    if (!query.data) return undefined;

    let result: QuestionResponse[] = query.data;

    // Client-side topic filter
    if (filters.topic) {
      result = result.filter(q => q.topic.toLowerCase() === filters.topic!.toLowerCase());
    }

    if(filters.difficulty)
    {
      result =result.filter(q=> q.difficulty.toLowerCase()===filters.difficulty!.toLowerCase());
    }

    // Client-side search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(q =>
        q.question_text.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term)
      );
    }

    return result;
  }, [query.data, filters.topic, filters.search , filters.difficulty]);

  return {
    ...query,
    data: filteredData,
  };
};

export const useExportPdf = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (questionIds: string[]) => exportQuestionsPdf(questionIds),
    onSuccess: (blobData) => {
      // Browser mein file download trigger karne ka standard tarika
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported-questions.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('PDF exported successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to export PDF. Please try again.', 'error');
    }
  });
};

export const useExportDocx = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (questionIds: string[]) => exportQuestionsDocx(questionIds),
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported-questions.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('DOCX exported successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to export DOCX. Please try again.', 'error');
    }
  });
};

export const useExportQuesWithoutDetailPdf = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: ExportQuesWithoutDetailPdfRequest) => 
      exportQuesWithoutDetailPdf(payload),
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all-questions.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('PDF exported successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to export PDF. Please try again.', 'error');
    }
  });
};

export const useExportQuesWithoutDetailDocx = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload:ExportQuesWithoutDetailPdfRequest) => exportQuesWithoutDetailDocx(payload),
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported-questions.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('DOCX exported successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to export DOCX. Please try again.', 'error');
    }
  });
};
