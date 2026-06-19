'use client';

import React from 'react';
import Sidebar from '@/components/ui/sidebar';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Content wrapper taking up remaining width */}
        <div className="pl-64">
          <main className="p-8 max-w-[1400px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}