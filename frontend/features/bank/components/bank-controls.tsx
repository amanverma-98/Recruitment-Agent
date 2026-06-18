'use client';

import React, { useState } from 'react';
import { FileDown, ChevronDown, Loader2 } from 'lucide-react';
import { useExportPdf, useExportDocx } from '../hooks/use-bank';

interface ControlsProps {
  selectedIds: string[];
  onSearchChange: (val: string) => void;
  onTopicChange: (val: string) => void;
}

export default function BankControls({ selectedIds, onSearchChange, onTopicChange }: ControlsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { mutate: exportPdf, isPending: isPdfPending } = useExportPdf();
  const { mutate: exportDocx, isPending: isDocxPending } = useExportDocx();

  const isPending = isPdfPending || isDocxPending;

  const handleExport = (format: 'pdf' | 'docx') => {
    if (selectedIds.length === 0) return;
    if (format === 'pdf') {
      exportPdf(selectedIds);
    } else {
      exportDocx(selectedIds);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      {/* Search & Filters */}
      <div className="flex flex-1 gap-3 w-full sm:w-auto">
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
      </div>

      {/* Export Action Controls */}
      <div className="relative self-end sm:self-auto">
        <button
          disabled={selectedIds.length === 0}
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-50 transition-all shadow-sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          <span>Export {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} Questions</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Export Format Dropdown */}
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