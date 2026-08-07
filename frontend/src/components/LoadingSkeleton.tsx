'use client';

import React from 'react';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
        </div>
      ))}
    </div>
  );
};
