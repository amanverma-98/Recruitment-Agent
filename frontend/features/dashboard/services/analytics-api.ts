import { apiClient } from '@/lib/axios';
import type { DashboardAnalytics, ActivityLog } from '@/types/api';

// GET /analytics/ endpoint
export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const { data } = await apiClient.get('/analytics/');
  return data;
};

// GET /analytics/logs endpoint
export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const { data } = await apiClient.get('/analytics/logs');
  return data;
};

// Re-export types for convenience
export type { DashboardAnalytics, ActivityLog };