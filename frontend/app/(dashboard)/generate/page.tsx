'use client';

import React from 'react';
import ConfigForm from '@/features/generation/components/config-form';
import { Brain, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export default function GeneratePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4  ">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Generate Questions
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Configure your preferences and let our specialized AI multi-agent mesh pipeline engineer high-quality questions for you.
          </p>
        </div>
      </div>

      {/* Main Responsive Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Container: Form Controls (Spans 8 columns) */}
        <div className="lg:col-span-8">
          <ConfigForm />
        </div>

        {/* Right Container: Agent Workflow (Spans 4 columns) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-gray-50 via-gray-50/50 to-transparent p-6 rounded-2xl border border-gray-100/80 shadow-sm sticky top-6">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              Pipeline Flow
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2.5">How it works</h3>
          </div>
          
          <div className="relative pl-1">
            {/* Elegant Vertical Timeline Connecting Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-200 via-green-200 to-orange-200" />

            <div className="space-y-8">
              
              {/* Step 1: Generator */}
              <div className="flex gap-4 relative z-10 items-start group">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-purple-100 group-hover:scale-105 transition-transform">
                  1
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex-1">
                  <div className="flex items-center gap-1.5 text-purple-700">
                    <Brain className="w-3.5 h-3.5" />
                    <h4 className="text-sm font-bold text-gray-800">Generator Agent</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Parses bulk criteria strings and writes fresh targeted conceptual questions.
                  </p>
                </div>
              </div>

              {/* Step 2: Evaluator */}
              <div className="flex gap-4 relative z-10 items-start group">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-green-100 group-hover:scale-105 transition-transform">
                  2
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex-1">
                  <div className="flex items-center gap-1.5 text-green-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <h4 className="text-sm font-bold text-gray-800">Evaluator Agent</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Vets code execution, parses syntax errors, and validates key accuracy metrics.
                  </p>
                </div>
              </div>

              {/* Step 3: Refiner */}
              <div className="flex gap-4 relative z-10 items-start group">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-orange-100 group-hover:scale-105 transition-transform">
                  3
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex-1">
                  <div className="flex items-center gap-1.5 text-orange-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <h4 className="text-sm font-bold text-gray-800">Refiner Agent</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Polishes readability and enhances distractors based on evaluator critique.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}