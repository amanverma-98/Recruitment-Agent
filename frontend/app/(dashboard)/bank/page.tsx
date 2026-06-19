'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, Trash2 } from 'lucide-react';
import { useQuestionBank } from '@/features/bank/hooks/use-bank';
import { useDeleteQuestions } from '@/features/bank/hooks/use-delete-questions';
import BankControls from '@/features/bank/components/bank-controls';

export default function QuestionBankPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ search: '', topic: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { data: questions, isLoading, isError } = useQuestionBank(filters);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestions();

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && questions) {
      setSelectedIds(questions.map(q => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteQuestion([id], {
      onSuccess: () => {
        setDeleteConfirm(null);
        setSelectedIds(prev => prev.filter(sid => sid !== id));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Question Bank</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and manage all approved questions.</p>
      </div>

      {/* Dynamic Controls Filter & Dropdown Export Config Panel */}
      <BankControls 
        selectedIds={selectedIds}
        onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
        onTopicChange={(val) => setFilters(prev => ({ ...prev, topic: val }))}
      />

      {/* Data Table Primitive Layer Component */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-48 w-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500 font-medium text-sm">
            Failed to load questions. Please check your backend connection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox"
                      checked={questions != null && selectedIds.length === questions.length && questions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                  </th>
                  <th className="p-4">Question</th>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Score</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {questions && questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(q.id)}
                          onChange={(e) => handleSelectRow(q.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                      </td>
                      <td className="p-4 max-w-sm font-semibold text-gray-900 line-clamp-1 mt-2">{q.question_text}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-[10px]">
                          {q.topic}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${
                          q.difficulty === 'Easy' ? 'text-green-600' : q.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">{q.ai_score ?? '—'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Eye icon — navigate to question detail page */}
                          <button
                            onClick={() => router.push(`/questions/${q.id}`)}
                            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Delete icon */}
                          <button
                            onClick={() => setDeleteConfirm(q.id)}
                            className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                      No approved questions found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-rose-50 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Question</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}