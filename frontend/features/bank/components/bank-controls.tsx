'use client';

import React, { useState } from 'react';
import { FileDown, ChevronDown, Loader2, X, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { useExportPdf, useExportDocx, useExportQuesWithoutDetailPdf, useExportQuesWithoutDetailDocx } from '../hooks/use-bank';

interface ControlsProps {
  selectedIds: string[];
  selectedCount: number;
  onSearchChange: (val: string) => void;
  onTopicChange: (val: string) => void;
  onDifficultyChange:(val: string) => void;
  onStatusChange:(val:string)=>void;
  onCancelSelection: () => void;
  onBulkDelete: () => void;
}

export default function BankControls({ selectedIds, selectedCount, onSearchChange, onTopicChange, onDifficultyChange,onStatusChange, onCancelSelection, onBulkDelete }: ControlsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showParamMenu, setShowParamMenu] = useState(false);
  
  const { mutate: exportPdf, isPending: isPdfPending } = useExportPdf();
  const { mutate: exportDocx, isPending: isDocxPending } = useExportDocx();
  const { mutate: exportWithParampdf, isPending: isWithParampdf } = useExportQuesWithoutDetailPdf();
  const { mutate: exportWithParamDocs, isPending: isWithParamdocs } = useExportQuesWithoutDetailDocx();
  
  const isPending = isPdfPending || isDocxPending;
  const isParamPending = isWithParampdf || isWithParamdocs;

  const [payload, setPayload] = useState({
    status: "approved",
    difficulty: "",
    topic: "",
    include_answers: false,
    include_explanations: false
  });

  const handleWithParamExport = (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      exportWithParampdf({ ...payload }, {
        onSuccess: () => setShowParamMenu(false)
      });
    } else {
      exportWithParamDocs({ ...payload }, {
        onSuccess: () => setShowParamMenu(false)
      });
    }
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    if (selectedIds.length === 0) return;
    if (format === 'pdf') {
      exportPdf(selectedIds);
    } else {
      exportDocx(selectedIds);
    }
    setShowExportMenu(false);
  };

  // ─── Bulk Actions Toolbar (shown when rows are selected) ───
  if (selectedCount > 0) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gradient-to-r from-rose-50/80 via-white to-white p-4 rounded-xl border border-rose-200/60 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
        {/* Left: selection info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">
              {selectedCount} question{selectedCount > 1 ? 's' : ''} selected
            </span>
            <p className="text-[10px] text-gray-400 font-medium">Select an action below or cancel to deselect all</p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Cancel selection */}
          <button
            onClick={onCancelSelection}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          {/* Delete Selected */}
          <button
            onClick={onBulkDelete}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm shadow-rose-200 hover:shadow-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected ({selectedCount})</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Standard Filters & Search Bar (shown when nothing is selected) ───
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      {/* Search & Filters */}
      <div className="flex text-black flex-1 flex-wrap gap-3 w-full sm:w-auto">
        <input 
          type="text" 
          placeholder="Search questions..." 
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select 
          onChange={(e) => onTopicChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-600 font-medium"
        >
          <option value="">All Topics</option>
          <option value="SQL">SQL</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="C">C</option>
          <option value="Statistics">Statistics</option>
          <option value="Probability">Probability</option>
          <option value="Aptitude">Aptitude</option>
        </select>
        <select 
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-600 font-medium"
        >
          <option value="">All Difficulties</option>
          <option value="easy">EASY</option>
          <option value="medium">MEDIUM</option>
          <option value="hard">HARD</option>
        </select>
        <select 
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-600 font-medium"
        >
          <option value="">All</option>
          <option value="approved">APPROVED</option>
          <option value="rejected">REJECTED</option>
          <option value="pending_review">PENDING</option>
        </select>
      </div>

      {/* Export Action Controls */}
      <div className="relative self-end sm:self-auto">
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setShowParamMenu(true)}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Export With Modifiers</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-50 transition-all shadow-sm"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>Export {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} Selected</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Modifiers Popup Window (Modal Container) */}
        {showParamMenu && (
          <div className="fixed inset-0 text-black z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 relative m-4 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Export Modifiers</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Filter custom configurations before exporting all files</p>
                </div>
                <button 
                  onClick={() => setShowParamMenu(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Input Fields (5 fields total) */}
              <div className="space-y-4 text-xs">
                {/* Field 1: Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-600">Question Status</label>
                  <select 
                    value={payload.status}
                    onChange={(e) => setPayload({ ...payload, status: e.target.value })}
                    className="p-2.5 border border-gray-200 rounded-xl bg-white w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Field 2: Difficulty */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-600">Difficulty Level</label>
                  <select 
                    value={payload.difficulty}
                    onChange={(e) => setPayload({ ...payload, difficulty: e.target.value })}
                    className="p-2.5 border border-gray-200 rounded-xl bg-white w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Field 3: Topic */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-600">Specific Topic</label>
                  <select 
                    value={payload.topic}
                    onChange={(e) => setPayload({ ...payload, topic: e.target.value })}
                    className="p-2.5 border border-gray-200 rounded-xl bg-white w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">All Topics</option>
                    <option value="SQL">SQL</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

                {/* Field 4 & 5: Checkboxes for Answers & Explanations */}
                <div className="grid grid-cols-2 gap-4 pt-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={payload.include_answers}
                      onChange={(e) => setPayload({ ...payload, include_answers: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="font-semibold text-gray-600">Include Answers</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={payload.include_explanations}
                      onChange={(e) => setPayload({ ...payload, include_explanations: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="font-semibold text-gray-600">Explanations</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons Footer (PDF and DOCX Buttons) */}
              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 mt-5">
                <button
                  type="button"
                  disabled={isParamPending}
                  onClick={() => handleWithParamExport('pdf')}
                  className="py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isWithParampdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Export PDF</span>
                </button>

                <button
                  type="button"
                  disabled={isParamPending}
                  onClick={() => handleWithParamExport('docx')}
                  className="py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isWithParamdocs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Export DOCX</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Standard Selected Export Dropdown */}
        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl p-3 z-30 space-y-2 text-xs animate-in fade-in duration-100">
            <span className="font-bold text-gray-400 block border-b border-gray-50 pb-1.5 uppercase tracking-wider text-[10px]">Export Format</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={() => handleExport('pdf')} 
                disabled={isPdfPending}
                className="py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-lg text-[11px] disabled:opacity-50"
              >
                {isPdfPending ? '...' : 'PDF'}
              </button>
              <button 
                onClick={() => handleExport('docx')} 
                disabled={isDocxPending}
                className="py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 font-bold rounded-lg text-[11px] disabled:opacity-50"
              >
                {isDocxPending ? '...' : 'DOCX'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
