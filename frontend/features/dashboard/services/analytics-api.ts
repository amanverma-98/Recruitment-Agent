import { getDashboardAnalytics, getActivityLogs } from '@/lib/api/analyticsApi';

// Re-export from centralized API layer
export { getDashboardAnalytics, getActivityLogs };
export type { GenerationLogEntry } from '@/lib/api/analyticsApi';
export type { DashboardAnalytics } from '@/types/api';