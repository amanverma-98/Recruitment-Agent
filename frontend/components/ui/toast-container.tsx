'use client';

import React, { useEffect } from 'react';
import { useToastStore } from '@/lib/hooks/use-toast';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Explicit types for safety
type ToastType = 'success' | 'error' | 'info' | 'warning';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200/60 ',
    icon: 'text-emerald-500',
    text: 'text-emerald-900 ',
  },
  error: {
    bg: 'bg-white border-rose-200/60 ',
    icon: 'text-rose-500',
    text: 'text-rose-900 ',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200/60',
    icon: 'text-blue-500',
    text: 'text-blue-900 ',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200/60 ',
    icon: 'text-amber-500',
    text: 'text-amber-900 ',
  },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  // Handle auto-dismiss safely for each toast if not handled in Zustand/Redux store
  useEffect(() => {
    if (toasts.length === 0) return;

    const latestToast = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      dismissToast(latestToast.id);
    }, 4000); // 4 seconds auto-dismiss

    return () => clearTimeout(timer);
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none generic-overlay">
      {toasts.map((toast) => {
        // Fallback to 'info' if type is mismatched or unknown
        const type: ToastType = colorMap[toast.type as ToastType] ? (toast.type as ToastType) : 'info';
        
        const Icon = iconMap[type];
        const colors = colorMap[type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-md backdrop-blur-md 
              animate-in slide-in-from-right-5 fade-in duration-300 ${colors.bg}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colors.icon}`} />
            
            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-medium leading-relaxed ${colors.text}`}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}