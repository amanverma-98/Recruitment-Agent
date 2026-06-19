'use client';

import React from 'react';
import { Question } from '../services/review-api';

interface DetailProps {
  question: Question;
}

export default function QuestionDetailPanel({ question }: DetailProps) {
  return (
    <div className="space-y-6">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md tracking-wider">
          {question.topic}
        </span>
        <span className="text-[10px] uppercase font-extrabold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md tracking-wider">
          {question.difficulty}
        </span>
      </div>

      {/* Main Prompt Text Statement */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed tracking-tight">
          {question.question_text}
        </h2>
      </div>

      {/* MCQ Multi-choice items grid list */}
      {question.options && question.options.length > 0 && (
        <div className="space-y-3 pt-2">
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = idx === question.correct_option;
            
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3 p-4 border rounded-xl text-xs font-semibold transition-all ${
                  isCorrect 
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' 
                    : 'border-gray-100 bg-white text-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border shrink-0 mt-0.5 ${
                  isCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  {letter}
                </div>
                <span className="leading-relaxed pt-0.5">{option}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Rationale explanation text block inside design mockup */}
      {question.explanation && (
        <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-1.5 mt-4">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Explanation</span>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}