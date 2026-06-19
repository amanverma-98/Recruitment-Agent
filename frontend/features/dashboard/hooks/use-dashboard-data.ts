import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics, getActivityLogs } from '../services/analytics-api';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: getDashboardAnalytics,
    refetchInterval: 1000 * 30, // Har 30 seconds mein background auto-refresh
  });
};

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ['dashboard', 'logs'],
    queryFn: getActivityLogs,
  });
};