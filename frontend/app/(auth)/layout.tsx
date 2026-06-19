import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1016] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      {/* Subtle background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(168,85,247,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {children}
    </div>
  );
}
