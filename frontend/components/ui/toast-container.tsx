'use client';

import React from 'react';
import { useToastStore } from '@/lib/hooks/use-toast';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-500',
    text: 'text-emerald-800',
  },
  error: {
    bg: 'bg-rose-50 border-rose-200',
    icon: 'text-rose-500',
    text: 'text-rose-800',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    text: 'text-blue-800',
  },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const colors = colorMap[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300 ${colors.bg}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colors.icon}`} />
            <p className={`text-sm font-medium flex-1 ${colors.text}`}>{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
