import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-black items-center justify-center p-4">
      {/* Subtle background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
       
      />
      {children}
    </div>
  );
}
