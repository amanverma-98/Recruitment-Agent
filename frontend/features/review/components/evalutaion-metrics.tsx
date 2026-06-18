'use client';

import React from 'react';

interface MetricsProps {
  score: number;
}

export default function EvaluationMetrics({ score }: MetricsProps) {
  // Determine the color based on the score
  const getScoreColor = (s: number) => {
    if (s >= 80) return { ring: 'border-emerald-500', bg: 'bg-emerald-50/20', bar: 'bg-emerald-500', text: 'text-emerald-600' };
    if (s >= 60) return { ring: 'border-amber-500', bg: 'bg-amber-50/20', bar: 'bg-amber-500', text: 'text-amber-600' };
    return { ring: 'border-rose-500', bg: 'bg-rose-50/20', bar: 'bg-rose-500', text: 'text-rose-600' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 h-full">
      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">AI Evaluation</h3>
      
      {/* Dynamic Score Ring Display */}
      <div className={`relative w-32 h-32 mx-auto flex items-center justify-center rounded-full border-4 ${colors.ring} ${colors.bg} shadow-inner`}>
        <div>
          <span className="text-3xl font-black text-gray-900">{score}</span>
          <span className="text-xs text-gray-400 block font-bold mt-0.5">/100</span>
        </div>
      </div>

      {/* Overall Quality Bar */}
      <div className="space-y-4 text-left pt-2">
        <div>
          <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
            <span>Overall Quality</span>
            <span className={`${colors.text} font-extrabold`}>{score}/100</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className={`${colors.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Score interpretation */}
        <div className="pt-2 border-t border-gray-50">
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            {score >= 80 
              ? '✅ This question meets high quality standards and is recommended for approval.'
              : score >= 60 
                ? '⚠️ This question is acceptable but may benefit from refinement.'
                : '❌ This question needs significant improvement before approval.'}
          </p>
        </div>
      </div>
    </div>
  );
}