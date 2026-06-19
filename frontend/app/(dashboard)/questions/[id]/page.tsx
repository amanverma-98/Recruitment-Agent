'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuestionDetail } from '@/features/bank/hooks/use-question-detail';
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const { data: question, isLoading, isError } = useQuestionDetail(questionId);

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-400">Loading question details...</p>
        </div>
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="p-6 bg-red-50/80 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            Question not found or failed to load. Please check the ID and try again.
          </span>
        </div>
      </div>
    );
  }

  // Score color mapping
  const getScoreColor = (s: number) => {
    if (s >= 80) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
    if (s >= 60) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' };
  };

  const statusColor: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
    needs_improvement: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const scoreColors = question.ai_score != null ? getScoreColor(question.ai_score) : null;

  return (
    <div className="px-4 pt-7 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Question Bank
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Topic badge */}
            <span className="text-[10px] uppercase font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md tracking-wider border border-purple-100">
              {question.topic}
            </span>
            {/* Difficulty badge */}
            <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md tracking-wider border ${
              question.difficulty === 'Easy'
                ? 'text-green-600 bg-green-50 border-green-100'
                : question.difficulty === 'Medium'
                  ? 'text-amber-600 bg-amber-50 border-amber-100'
                  : 'text-red-600 bg-red-50 border-red-100'
            }`}>
              {question.difficulty}
            </span>
            {/* Type badge */}
            <span className="text-[10px] uppercase font-extrabold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md tracking-wider border border-gray-200">
              {question.question_type}
            </span>
            {/* Status badge */}
            <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md tracking-wider border ${statusColor[question.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              {question.status.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-relaxed tracking-tight">
            {question.question_text}
          </h1>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Options */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Answer Options</h3>
              <div className="space-y-2.5">
                {question.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = idx === question.correct_option;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 border rounded-xl text-sm font-medium transition-all ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                          : 'border-gray-100 bg-white text-gray-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black border shrink-0 ${
                        isCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}>
                        {letter}
                      </div>
                      <span className="flex-1">{option}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Correct Answer */}
          <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl">
            <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider block mb-1">Correct Answer</span>
            <p className="text-sm font-semibold text-emerald-800">
              Option {String.fromCharCode(65 + question.correct_option)}: {question.options[question.correct_option]}
            </p>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Explanation</span>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{question.explanation}</p>
            </div>
          )}

          {/* AI Score */}
          {question.ai_score != null && scoreColors && (
            <div className={`p-4 ${scoreColors.bg} border ${scoreColors.border} rounded-xl`}>
              <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-1">AI Quality Score</span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${scoreColors.text}`}>{question.ai_score}</span>
                <span className="text-sm text-gray-400 font-medium">/100</span>
                <div className="flex-1 bg-white/50 h-2 rounded-full overflow-hidden ml-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      question.ai_score >= 80
                        ? 'bg-emerald-500'
                        : question.ai_score >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${question.ai_score}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-2">Metadata</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">ID</span>
                <span className="text-gray-700 font-semibold break-all">{question.id}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Topic</span>
                <span className="text-gray-700 font-semibold">{question.topic}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Difficulty</span>
                <span className="text-gray-700 font-semibold">{question.difficulty}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Type</span>
                <span className="text-gray-700 font-semibold">{question.question_type}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Status</span>
                <span className="text-gray-700 font-semibold capitalize">{question.status.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">AI Score</span>
                <span className="text-gray-700 font-semibold">{question.ai_score ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
