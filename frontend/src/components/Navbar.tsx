'use client';

import React from 'react';
import { Search, Bell, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  title: string;
  description?: string;
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ title, description, onOpenCreateModal }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Task Create Action Button */}
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        )}

        {/* Notification indicator */}
        <div className="relative">
          <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>
        </div>

        {/* User Chip */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden sm:block">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              {user?.name}
            </span>
            <span className="block text-[10px] text-emerald-500 font-medium">
              ● Active Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
