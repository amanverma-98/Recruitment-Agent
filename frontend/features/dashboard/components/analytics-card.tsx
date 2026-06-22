import React from 'react';

interface MetricProps {
  title: string;
  value: number | string;
  suffix?: string;
  isNegative?: boolean;
}

export default function AnalyticsCard({ title, value, suffix, isNegative = false }: MetricProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNeg = isNegative && !isNaN(numericValue) && numericValue > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <h3 className={`text-3xl font-bold mt-2 tracking-tight ${
          isNeg ? 'text-rose-600' : 'text-gray-900'
        }`}>
          {value}{suffix && <span className="text-xl ml-0.5">{suffix}</span>}
        </h3>
      </div>
    </div>
  );
}