'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { 
  LayoutDashboard, 
  FilePlus2, 
  ClipboardList, 
  Database,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Image from 'next/image';


const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Generate Questions', href: '/generate', icon: FilePlus2 },
  { label: 'Review Queue', href: '/review', icon: ClipboardList },
  { label: 'Question Bank', href: '/bank', icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile state tracking
  const menuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Close user dropdown and mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      // Close mobile menu if clicked outside sidebar panel
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close mobile sidebar automatically on navigation change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Generate initials from user name
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <>
      {/* Mobile Top Header Bar / Trigger button Container */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F1016] border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <div className="flex mx-auto">
                    <div className="">
                      <Image 
                        src="/white.png" 
                        alt="RecruitAI Logo" 
                        width={70} 
                        height={70} 
                        priority
                        className="object-contain filter "
                      />
                    </div>
                  
                  </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-900 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Dimmed Background Overlay for Mobile (closes sidebar on click) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Component */}
      <aside 
        ref={sidebarRef}
        className={`w-64 h-screen bg-[#0F1016] text-gray-400 flex flex-col justify-between fixed left-0 top-0 border-r border-gray-800 z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Upper Navigation section */}
        <div>
          {/* Brand/Logo Area */}
          <div className="p-6 flex items-center justify-between border-b border-gray-800 h-16 md:h-auto">
             <div className="md:flex mx-auto hidden">
                    <div className="">
                      <Image 
                        src="/white.png" 
                        alt="RecruitAI Logo" 
                        width={100} 
                        height={100} 
                        priority
                        className="object-contain filter "
                      />
                    </div>
                  
                  </div>

            {/* Close button inside sidebar for convenient alternative access on mobile */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="mt-6 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' 
                      : 'hover:bg-gray-900 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile layout footer */}
        <div className="relative" ref={menuRef}>
          {/* Logout dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 mx-3 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-4 border-t border-gray-800 flex items-center justify-between group cursor-pointer hover:bg-gray-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-gray-800 shadow-md">
                {initials}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-semibold text-gray-200 leading-none truncate">
                  {user?.name ?? 'Loading...'}
                </h2>
                <span className="text-xs text-gray-500 mt-1 block truncate">
                  {user?.email ?? ''}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </aside>
    </>
  );
}