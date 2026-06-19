'use client';

import React from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Wraps children so they are only rendered when the user is authenticated.
 * While checking auth state, shows a loading spinner.
 * If not authenticated, redirects to /login.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
