'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in (requireUnAuth)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'detail' in err
          ? String((err as { detail: string }).detail)
          : 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show nothing while checking auth state
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* Logo Layout Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="relative shrink-0">
          <Image 
            src="/logo_black.png" 
            alt="RecruitAI Logo" 
            width={100} 
            height={100} 
            priority
            className="object-contain filter "
          />
        </div>
      
      </div>

      {/* Card: Opacity bumped up for crisp contrast against gradients */}
      <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-300 mt-1">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold text-center tracking-wide">
              {error}
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-bold text-gray-200 block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-11 pr-4 py-3 bg-white/[0.06] border border-white/15 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password with Eye Toggler added */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-bold text-gray-200 block uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3 bg-white/[0.06] border border-white/15 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action Block */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}