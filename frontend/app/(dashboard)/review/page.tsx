'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Check, RefreshCw, Trash2 } from 'lucide-react';
import { usePendingQuestions, useUpdateStatus } from '@/features/review/hooks/use-review';
import QuestionDetailPanel from '@/features/review/components/question-detail-panel';
import EvaluationMetrics from '@/features/review/components/evalutaion-metrics';
import { Question } from '@/features/review/services/review-api';

export default function ReviewQueuePage() {
  const { data: questions, isLoading, isError } = usePendingQuestions();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatus();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Sync selection defaults when items payload refreshes successfully
  useEffect(() => {
    if (questions && questions.length > 0) {
      // Keep selection tracking fluid
      const activeExists = questions.find(q => q.id === selectedQuestion?.id);
      if (!activeExists) {
        setSelectedQuestion(questions[0]);
      }
    } else if (questions && questions.length === 0) {
      setSelectedQuestion(null);
    }
  }, [questions, selectedQuestion]);

  if (isLoading) {
    return (
      <div className="h-[75vh] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
        Failed to load pending questions. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Queue</h1>
        <p className="text-sm text-gray-500 mt-1">Review and take action on AI-generated questions.</p>
      </div>

      {/* 3-Column Split Workspace Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Side: Pending queue selection vertical roll track */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4 overflow-y-auto space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
              Pending Items ({questions?.length || 0})
            </span>
          </div>

          {questions && questions.length > 0 ? (
            questions.map((q) => {
              const isSelected = selectedQuestion?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-150 relative ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/30 shadow-sm'
                      : 'border-gray-100 bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <p className={`text-xs font-bold line-clamp-2 leading-relaxed ${isSelected ? 'text-purple-950' : 'text-gray-800'}`}>
                      {q.question_text}
                    </p>
                    <span className="text-[10px] font-black bg-gray-50 text-gray-500 border border-gray-100 px-1.5 py-0.5 rounded shrink-0">
                      {q.ai_score ?? '—'}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mt-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    <span className={isSelected ? 'text-purple-600' : ''}>{q.topic}</span>
                    <span>•</span>
                    <span>{q.difficulty}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs font-semibold text-gray-400">
              Queue clear! No items pending.
            </div>
          )}
        </div>

        {/* Center Canvas: Active prompt details wrapper */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm relative">
          {selectedQuestion ? (
            <>
              <div className="p-6 overflow-y-auto flex-1">
                <QuestionDetailPanel question={selectedQuestion} />
              </div>

              {/* Operations Command Bar at bottom container footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/40 grid grid-cols-3 gap-3">
                <button
                  disabled={isUpdating}
                  onClick={() => updateStatus({ id: selectedQuestion.id, status: 'approved' })}
                  className="py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/10"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Approve
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => updateStatus({ id: selectedQuestion.id, status: 'improved' })}
                  className="py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-amber-500/10"
                >
                  <RefreshCw className="w-4 h-4 stroke-[2.5]" /> Improve
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => updateStatus({ id: selectedQuestion.id, status: 'rejected' })}
                  className="py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-rose-600/10"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" /> Reject
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-semibold text-gray-400">
              Select an item from the queue list to start evaluation.
            </div>
          )}
        </div>

        {/* Right Side: Score ring panel metrics */}
        <div className="lg:col-span-1">
          {selectedQuestion && (
            <EvaluationMetrics 
              score={selectedQuestion.ai_score ?? 0}
            />
          )}
        </div>

      </div>
    </div>
  );
}