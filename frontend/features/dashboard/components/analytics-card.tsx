import React from 'react';

interface MetricProps {
  title: string;
  value: number;
  isNegative?: boolean;
}

export default function AnalyticsCard({ title, value, isNegative = false }: MetricProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <h3 className={`text-3xl font-bold mt-2 tracking-tight ${
          isNegative && value > 0 ? 'text-rose-600' : 'text-gray-900'
        }`}>{value}</h3>
      </div>
    </div>
  );
}