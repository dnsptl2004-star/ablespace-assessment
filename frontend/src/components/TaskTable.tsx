'use client';

import React from 'react';
import { Calendar, Edit2, Trash2, CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskTableProps {
  tasks: Task[];
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

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
      {/* Mobile Card List View (< sm screens) */}
      <div className="block sm:hidden divide-y divide-slate-200/60 dark:divide-slate-800/60">
        {tasks.map((task) => {
          const isOverdue =
            task.dueDate &&
            task.status !== 'COMPLETED' &&
            new Date(task.dueDate) < new Date();

          return (
            <div key={task.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className={`font-semibold text-sm block leading-snug ${
                      task.status === 'COMPLETED'
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] uppercase border border-indigo-500/20">
                    {task.category || 'Work'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${
                      PRIORITY_BADGES[task.priority]?.style
                    }`}
                  >
                    {PRIORITY_BADGES[task.priority]?.label}
                  </span>
                </div>

                <select
                  value={task.status}
                  onChange={(e) =>
                    onStatusChange(task.id, e.target.value as TaskStatus)
                  }
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold border bg-transparent focus:outline-none cursor-pointer ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                  }`}
                >
                  <option value="TODO" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    To Do
                  </option>
                  <option value="IN_PROGRESS" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    In Progress
                  </option>
                  <option value="COMPLETED" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    Completed
                  </option>
                </select>
              </div>

              {task.dueDate && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className={isOverdue ? 'text-red-500 font-bold flex items-center gap-1' : ''}>
                    {isOverdue && <AlertTriangle className="w-3 h-3 text-red-500" />}
                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= sm screens) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Task Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
            {tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                task.status !== 'COMPLETED' &&
                new Date(task.dueDate) < new Date();

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <span
                      className={`font-semibold block truncate ${
                        task.status === 'COMPLETED'
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">
                        {task.description}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                      {task.category || 'Work'}
                    </span>
                  </td>

                  {/* Status dropdown/toggle */}
                  <td className="py-3.5 px-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        onStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className={`px-2.5 py-1 rounded-lg font-semibold border bg-transparent focus:outline-none cursor-pointer ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                      }`}
                    >
                      <option value="TODO" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                        To Do
                      </option>
                      <option value="IN_PROGRESS" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                        In Progress
                      </option>
                      <option value="COMPLETED" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                        Completed
                      </option>
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md font-semibold border ${
                        PRIORITY_BADGES[task.priority]?.style
                      }`}
                    >
                      {PRIORITY_BADGES[task.priority]?.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4">
                    {task.dueDate ? (
                      <span
                        className={`flex items-center gap-1 font-medium ${
                          isOverdue ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
