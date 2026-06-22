'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { DashboardAnalytics } from '@/types/api';

interface Props {
  metrics: DashboardAnalytics;
}

const COLORS = {
  approved: '#10b981',   // emerald-500
  pending: '#f59e0b',    // amber-500
};

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

// Custom tooltip matching the dashboard theme
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartEntry }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0];
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl px-4 py-3 text-xs">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-bold text-gray-800">{data.name}</span>
      </div>
      <p className="text-gray-500 font-semibold mt-1">
        {data.value} question{data.value !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

// Custom legend with nice styling
function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-semibold text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatusDistributionChart({ metrics }: Props) {
  const data: ChartEntry[] = [
    { name: 'Approved', value: metrics.approved, color: COLORS.approved },
    { name: 'Pending', value: metrics.pending, color: COLORS.pending },
  ];

  const total = metrics.approved + metrics.pending + metrics.rejected;

  // Handle empty state
  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">Status Distribution</h3>
          <p className="text-xs text-gray-400 mt-0.5">Question approval breakdown</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs font-semibold text-gray-400">No question data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-900">Status Distribution</h3>
        <p className="text-xs text-gray-400 mt-0.5">Question approval breakdown</p>
      </div>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 mt-2">
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-600">{metrics.approved}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-500">{metrics.pending}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
        </div>
      </div>
    </div>
  );
}
