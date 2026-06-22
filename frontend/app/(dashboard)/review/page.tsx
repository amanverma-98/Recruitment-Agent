'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Check, RefreshCw, Trash2, X, MessageSquarePlus } from 'lucide-react';
import { usePendingQuestions, useUpdateStatus, useReviewQuestion } from '@/features/review/hooks/use-review';
import QuestionDetailPanel from '@/features/review/components/question-detail-panel';
import EvaluationMetrics from '@/features/review/components/evalutaion-metrics';
import { Question } from '@/features/review/services/review-api';

export default function ReviewQueuePage() {
  const { data: questions, isLoading, isError } = usePendingQuestions();
  const { mutate: updateStatus, isPending: isStatusUpdating } = useUpdateStatus();
  const { mutate: reviewMutate, isPending: isReviewUpdating } = useReviewQuestion();
  const isUpdating = isStatusUpdating || isReviewUpdating;

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null);

  const handleImprove = () => {
    if (!selectedQuestion) return;
    setFeedbackText('');
    setShowFeedbackModal(true);
    // Auto-focus the textarea after modal renders
    setTimeout(() => feedbackInputRef.current?.focus(), 100);
  };

  const handleReject = ()=>{
    if(!selectedQuestion) return ;
    const feedback = feedbackText.trim()
    reviewMutate(
      { id: selectedQuestion.id, action: 'reject', feedback },
      {
        onSuccess: (updatedQuestion) => {
          setSelectedQuestion(updatedQuestion);
        },
      },
    );
  }

  const submitImprove = () => {
    if (!selectedQuestion) return;
    const feedback = feedbackText.trim() || 'Please improve the quality and clarity of this question.';
    setShowFeedbackModal(false);
    reviewMutate(
      { id: selectedQuestion.id, action: 'improve', feedback },
      {
        onSuccess: (updatedQuestion) => {
          setSelectedQuestion(updatedQuestion);
        },
      },
    );
  };
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
    /* md breakpoint se hi inner height scaling ko track karega taaki layouts flexbox ke andat tight rahein */
    <div className="space-y-6 pt-7 px-4 md:px-6 h-auto lg:h-screen flex flex-col pb-8 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Queue</h1>
        <p className="text-sm text-gray-500 mt-1">Review and take action on AI-generated questions.</p>
      </div>

      {/* 3-Column/Tablet-friendly Row Workspace Layer */}
      {/* Tab view (md) par 3 cols layout seamless side-by-side display karega jabki right panel automatic fluid wrap hoga */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* Left Side: Pending queue selection vertical roll track */}
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-2xl p-4 md:overflow-y-auto space-y-2.5 shadow-sm h-fit md:h-full">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
              Pending Items ({questions?.length || 0})
            </span>
          </div>

          {questions && questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 max-h-[220px] md:max-h-none overflow-y-auto md:overflow-visible pr-1 md:pr-0">
              {questions.map((q) => {
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
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-xs font-semibold text-gray-400">
              Queue clear! No items pending.
            </div>
          )}
        </div>

        {/* Center Canvas: Active prompt details wrapper */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm relative h-auto md:h-full">
          {selectedQuestion ? (
            <>
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <QuestionDetailPanel question={selectedQuestion} />
              </div>

              {/* Operations Command Bar at bottom container footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/40 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                <button
                  disabled={isUpdating}
                  onClick={() => updateStatus({ id: selectedQuestion.id, status: 'approved' })}
                  className="py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/10 w-full"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Approve
                </button>
                <button
                  disabled={isUpdating}
                  onClick={handleImprove}
                  className="py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-amber-500/10 w-full"
                >
                  <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isReviewUpdating ? 'animate-spin' : ''}`} /> {isReviewUpdating ? 'Improving…' : 'Improve'}
                </button>
                <button
                  disabled={isUpdating}
                  onClick={handleReject}
                  className="py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-rose-600/10 w-full"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" /> Reject
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 md:h-full flex items-center justify-center text-xs font-semibold text-gray-400">
              Select an item from the queue list to start evaluation.
            </div>
          )}
        </div>

        {/* Right Side: Score ring panel metrics */}
        {/* Tablet view par yeh neat width me full width layout adapt karega desktop mode me grid cell par shift hoga */}
        <div className="col-span-1 md:col-span-3 lg:col-span-1 h-auto lg:h-full">
          {selectedQuestion && (
            <EvaluationMetrics 
              score={selectedQuestion.ai_score ?? 0}
            />
          )}
        </div>

      </div>

      {/* ── Feedback Modal Popup ── */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />

          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-gray-100 animate-[scaleIn_200ms_ease-out]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Improve Question</h3>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">Tell the AI how to improve this question</p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <textarea
                ref={feedbackInputRef}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    submitImprove();
                  }
                }}
                placeholder="e.g. Make the options more challenging, add a code snippet, improve clarity…"
                rows={4}
                className="w-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all resize-none"
              />
              <p className="text-[10px] text-gray-400 mt-2 font-medium">
                Leave empty to use default improvement instructions • <span className="text-gray-500">Ctrl+Enter</span> to submit
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-5 pb-5">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitImprove}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-amber-500/20 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Send & Improve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}