'use client';

import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

const PRIORITY_BADGES: Record<TaskPriority, { label: string; style: string }> = {
  LOW: { label: 'Low', style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
  MEDIUM: { label: 'Medium', style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  HIGH: { label: 'High', style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  URGENT: { label: 'Urgent', style: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: any; color: string }> = {
  TODO: { label: 'To Do', icon: Circle, color: 'text-slate-400' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'text-amber-500' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isOverdue =
    task.dueDate &&
    task.status !== 'COMPLETED' &&
    new Date(task.dueDate) < new Date();

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] uppercase tracking-wide border border-indigo-500/20">
              {task.category || 'General'}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide border ${
                PRIORITY_BADGES[task.priority]?.style
              }`}
            >
              {PRIORITY_BADGES[task.priority]?.label}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              title="Delete Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h4
          className={`font-bold text-base mb-1.5 leading-snug ${
            task.status === 'COMPLETED'
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs mt-3">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDueDate ? (
            <span
              className={
                isOverdue
                  ? 'text-red-500 dark:text-red-400 font-bold flex items-center gap-1'
                  : ''
              }
            >
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              {formattedDueDate}
            </span>
          ) : (
            <span>No due date</span>
          )}
        </div>

        {/* Status Toggle Button */}
        <div className="flex items-center gap-1">
          {task.status === 'TODO' && (
            <button
              onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors"
            >
              Start <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task.id, 'COMPLETED')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              Complete <CheckCircle2 className="w-3 h-3" />
            </button>
          )}
          {task.status === 'COMPLETED' && (
            <button
              onClick={() => onStatusChange(task.id, 'TODO')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-500/20 transition-colors"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
