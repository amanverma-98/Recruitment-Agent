'use client';

import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { ActivityLog } from '@/types/api';

interface Props {
  logs: ActivityLog[];
}

interface DayEntry {
  date: string;
  label: string;
  count: number;
}

// Custom tooltip matching the dashboard theme
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl px-4 py-3 text-xs">
      <p className="font-bold text-gray-800">{label}</p>
      <p className="text-purple-600 font-semibold mt-0.5">
        {payload[0].value} question{payload[0].value !== 1 ? 's' : ''} generated
      </p>
    </div>
  );
}

export default function GenerationVelocityChart({ logs }: Props) {
  const chartData = useMemo(() => {
    // Build a map of last 7 days with counts
    const now = new Date();
    const dayMap = new Map<string, number>();

    // Pre-fill last 14 days with zeroes
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      dayMap.set(key, 0);
    }

    // Count logs per day
    for (const log of logs) {
      try {
        const key = new Date(log.created_at).toISOString().slice(0, 10);
        if (dayMap.has(key)) {
          dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
        }
      } catch {
        // skip malformed timestamps
      }
    }

    // Convert to array with readable labels
    const result: DayEntry[] = [];
    for (const [dateStr, count] of dayMap.entries()) {
      const d = new Date(dateStr + 'T00:00:00');
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result.push({ date: dateStr, label, count });
    }

    return result;
  }, [logs]);

  const hasData = chartData.some((d) => d.count > 0);

  // Handle empty state
  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">Generation Velocity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Questions generated over the last 7 days</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs font-semibold text-gray-400">No generation activity in the past 7 days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Generation Velocity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Questions generated over the last 7 days</p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">
            Trend
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#velocityGradient)"
              dot={{ r: 3, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
