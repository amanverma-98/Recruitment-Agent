'use client';

import React, { useState } from 'react';
import { Loader2, Eye } from 'lucide-react';
import { useQuestionBank } from '@/features/bank/hooks/use-bank';
import BankControls from '@/features/bank/components/bank-controls';

export default function QuestionBankPage() {
  const [filters, setFilters] = useState({ search: '', topic: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const { data: questions, isLoading, isError } = useQuestionBank(filters);

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
                        <button className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-purple-600 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
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
    </div>
  );
}