import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics, getActivityLogs } from '../services/analytics-api';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: getDashboardAnalytics,
    refetchInterval: 1000 * 30, // Background auto-refresh every 30s
  });
};

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ['dashboard', 'logs'],
    queryFn: getActivityLogs,
  });
};