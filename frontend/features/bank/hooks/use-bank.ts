import { useQuery, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getApprovedQuestions, exportQuestionsPdf, exportQuestionsDocx } from '../services/bank-api';
import type { ExportQuesWithoutDetailPdfRequest, QuestionResponse } from '@/types/api';
import { exportQuesWithoutDetailDocx, exportQuesWithoutDetailPdf } from '@/lib/api/questionsApi';

/**
 * Fetches all approved questions and applies client-side filtering.
 * The backend's GET /questions/ only supports `status` as a query param,
 * so topic and search filtering happens here in-memory.
 */
export const useQuestionBank = (filters: { topic?: string; search?: string }) => {
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

    // Client-side search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(q =>
        q.question_text.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term)
      );
    }

    return result;
  }, [query.data, filters.topic, filters.search]);

  return {
    ...query,
    data: filteredData,
  };
};

export const useExportPdf = () => {
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
    },
    onError: (error) => {
      console.error("PDF Export failed:", error);
    }
  });
};

export const useExportDocx = () => {
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
    },
    onError: (error) => {
      console.error("DOCX Export failed:", error);
    }
  });
};

export const useExportQuesWithoutDetailPdf = () => {
  return useMutation({
    // Is baar mutationFn ek payload (object) accept karega jo GET API me pass hoga
    mutationFn: (payload: ExportQuesWithoutDetailPdfRequest) => 
      exportQuesWithoutDetailPdf(payload),
    onSuccess: (blobData) => {
      // Browser me file download trigger karne ka standard tarika
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all-questions.pdf'); // File name badal diya taaki differentiate ho sake
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("All PDF Export failed:", error);
    }
  });
};

export const useExportQuesWithoutDetailDocx = () => {
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
    },
    onError: (error) => {
      console.error("DOCX Export failed:", error);
    }
  });
};