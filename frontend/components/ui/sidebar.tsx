'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FilePlus2, 
  ClipboardList, 
  Database,
  ChevronDown
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Generate Questions', href: '/generate', icon: FilePlus2 },
  { label: 'Review Queue', href: '/review', icon: ClipboardList },
  { label: 'Question Bank', href: '/bank', icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0F1016] text-gray-400 flex flex-col justify-between fixed left-0 top-0 border-r border-gray-800">
      {/* Upper Navigation section */}
      <div>
        {/* Brand/Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
            R
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide leading-none">RecruitAI</h1>
            <span className="text-xs text-purple-400 font-medium">Agent</span>
          </div>
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
      <div className="p-4 border-t border-gray-800 flex items-center justify-between group cursor-pointer hover:bg-gray-900/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-gray-800 shadow-md">
            AA
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-200 leading-none">Adeed & Aman</h2>
            <span className="text-xs text-gray-500 mt-1 block">Coordinators</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
      </div>
    </aside>
  );
}