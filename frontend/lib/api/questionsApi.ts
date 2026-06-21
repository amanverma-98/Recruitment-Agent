import { apiClient } from '@/lib/axios';
import type {
  QuestionResponse,
  GenerateQuestionRequest,
  BulkGenerateRequest,
  BulkGenerateResponse,
  UpdateStatusRequest,
  ReviewRequest,
  ExportPdfRequest,
  ExportQuesWithoutDetailPdfRequest,
} from '@/types/api';

// ── Fetch ──

export const getQuestions = async (status:string): Promise<QuestionResponse[]> => {
  const { data } = await apiClient.get<QuestionResponse[]>('/questions/',{
    params:{status}
  });
  return data;
};

export const getQuestionById = async (id: string): Promise<QuestionResponse> => {
  const { data } = await apiClient.get<QuestionResponse>(`/questions/${id}`);
  return data;
};

// ── Create / Generate ──

export const generateQuestion = async (payload: GenerateQuestionRequest): Promise<QuestionResponse> => {
  const { data } = await apiClient.post<QuestionResponse>('/questions/generate', payload);
  return data;
};

export const bulkGenerateQuestions = async (payload: BulkGenerateRequest): Promise<BulkGenerateResponse> => {
  const { data } = await apiClient.post<BulkGenerateResponse>('/questions/bulk-generate', payload);
  return data;
};

// ── Update ──

export const updateQuestionStatus = async (id: string, status: string): Promise<QuestionResponse> => {
  const payload: UpdateStatusRequest = { status };
  const { data } = await apiClient.patch<QuestionResponse>(`/questions/${id}/status`, payload);
  return data;
};

export const reviewQuestion = async (
  id: string,
  action: ReviewRequest['action'],
  feedback?: string[] | null
): Promise<QuestionResponse> => {
  const payload: ReviewRequest = { action, feedback };
  const { data } = await apiClient.patch<QuestionResponse>(`/questions/${id}/review`, payload);
  return data;
};

// ── Delete ──

export const deleteQuestions = async (questionIds: string[]): Promise<{ deleted: number }> => {
  const { data } = await apiClient.delete<{ deleted: number }>('/questions/', {
    data: { question_ids: questionIds },
  });
  return data;
};

// ── Export ──

export const exportQuestionsPdf = async (questionIds: string[]): Promise<Blob> => {
  const payload: ExportPdfRequest = { question_ids: questionIds };
  const response = await apiClient.post('/questions/export/pdf', payload, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportQuestionsDocx = async (questionIds: string[]): Promise<Blob> => {
  const payload: ExportPdfRequest = { question_ids: questionIds };
  const response = await apiClient.post('/questions/export/docx', payload, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportQuesWithoutDetailPdf = async (payload:ExportQuesWithoutDetailPdfRequest)=>{

  const {status , topic , difficulty , include_answers , include_explanations} = payload;
  const response = await apiClient.get(`/questions/export/pdf/all` ,
    {
      params:payload,
      responseType:'blob'
    }
  );
  return response.data;
}

export const exportQuesWithoutDetailDocx = async (payload:ExportQuesWithoutDetailPdfRequest)=>{

  const {status , topic , difficulty , include_answers , include_explanations} = payload;
  const response = await apiClient.get('/questions/export/docx/all', {
    params: payload,
    responseType: 'blob'
  });
  return response.data;
}
