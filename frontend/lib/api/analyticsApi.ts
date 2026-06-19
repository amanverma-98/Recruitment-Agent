import { apiClient } from '@/lib/axios';
import type { DashboardAnalytics } from '@/types/api';

/** GET /analytics/ */
export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const { data } = await apiClient.get<DashboardAnalytics>('/analytics/');
  return data;
};

/** Actual shape returned by the backend GenerationLog model */
export interface GenerationLogEntry {
  id: string;
  user_id: string;
  topic: string;
  difficulty: string;
  question_id: string;
  score: number;
  iterations: number;
  created_at: string;
}

/** GET /analytics/logs */
export const getActivityLogs = async (): Promise<GenerationLogEntry[]> => {
  const { data } = await apiClient.get<GenerationLogEntry[]>('/analytics/logs');
  return data;
};
