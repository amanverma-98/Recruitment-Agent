'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Plus, ArrowRight, Loader2, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDashboardAnalytics, useActivityLogs } from '@/features/dashboard/hooks/use-dashboard-data';
import AnalyticsCard from '@/features/dashboard/components/analytics-card';
import AgentStatusList from '@/features/dashboard/components/agent-status-list';

export default function DashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardAnalytics();
  const { data: logs, isLoading: logsLoading } = useActivityLogs();

  // Format today's date range for display
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const dateRange = `${weekAgo.toLocaleDateString('en-US', dateFormat)} – ${now.toLocaleDateString('en-US', dateFormat)}, ${now.getFullYear()}`;

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-400">Loading workspace insights...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50/80 border border-red-100 text-red-600 rounded-xl max-w-2xl mx-auto mt-12 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">Failed to load dashboard metrics. Verify backend configuration connection.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-2 md:px-4 py-4">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of question generation execution and multi-agent systems</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 border border-gray-200 rounded-xl shadow-sm text-xs font-semibold text-gray-600 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Grid view 1: Four Main metrics counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnalyticsCard title="Total Questions" value={metrics?.total_questions ?? 0} />
        <AnalyticsCard title="Approved" value={metrics?.approved ?? 0} />
        <AnalyticsCard title="Pending Review" value={metrics?.pending ?? 0} />
        <AnalyticsCard title="Rejected" value={metrics?.rejected ?? 0} isNegative />
      </div>

      {/* Grid view 2: NEW Pipeline Status Monitor Table paired with side status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Active Generation Monitors */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Active Generation Monitors</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time status of agent verification pipelines</p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">
              Live Stream
            </span>
          </div>

          <div className="overflow-x-auto">
            {logsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            ) : logs && logs.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-6">Pipeline Operation / Target</th>
                    <th className="py-3 px-4">Stage Status</th>
                    <th className="py-3 px-6 text-right">Executed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm h-100">
  {logs
    .slice() 
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((log) => {
      const uniqueKey = log.id;
      const logMessage = `Generated ${log.topic} Question (${log.difficulty})`;
      const isHighScore = log.score >= 70;

      return (
        <tr key={uniqueKey} className="hover:bg-gray-50/40 transition-colors">
          <td className="py-4 px-6 font-medium text-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg shrink-0 bg-purple-50 text-purple-600">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{logMessage}</span>
                <span className="text-xs text-gray-400">ID: {log.question_id?.slice(0, 8)}...</span>
              </div>
            </div>
          </td>

          <td className="py-4 px-4">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border
              ${isHighScore 
                ? 'bg-green-50/60 border-green-100 text-green-700' 
                : 'bg-amber-50/60 border-amber-100 text-amber-700'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Score: {log.score}%
            </span>
          </td>

          <td className="py-4 px-6 text-right text-xs text-gray-400 font-medium whitespace-nowrap">
            {formatTimestamp(log.created_at)}
          </td>
        </tr>
      );
    })}
</tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-xs font-semibold text-gray-400">No generation telemetry streams found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Agent cluster list */}
        <div className="lg:col-span-4">
          <AgentStatusList />
        </div>
      </div>

      {/* Quick Action Navigation links */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href="/generate" className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-white hover:from-purple-100/40 border border-purple-100/80 rounded-2xl transition-all duration-200 group shadow-sm">
            <div>
              <h4 className="font-bold text-purple-950 text-sm">Generate Questions</h4>
              <p className="text-xs text-purple-600/80 mt-1">Initialize custom prompt strings via agent meshes</p>
            </div>
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform shrink-0 ml-4">
              <Plus className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/review" className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-white hover:from-green-100/40 border border-green-100/80 rounded-2xl transition-all duration-200 group shadow-sm">
            <div>
              <h4 className="font-bold text-green-950 text-sm">Open Review Queue</h4>
              <p className="text-xs text-green-600/80 mt-1">Audit generation quality markers and push items live</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-green-200 group-hover:scale-105 transition-transform shrink-0 ml-4">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Format an ISO timestamp into a human-friendly relative time string */
function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return ts;
  }
}