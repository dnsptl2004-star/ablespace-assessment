'use client';

import React from 'react';
import { Inbox, Plus, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  isSearch?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'You have no tasks matching the selected filters or search query.',
  onAction,
  actionLabel = 'Create New Task',
  isSearch = false,
}) => {
  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800/80 my-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
        {isSearch ? <SearchX className="w-8 h-8" /> : <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
