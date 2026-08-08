'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { TaskModal } from '../../components/TaskModal';
import { DashboardStatsSkeleton } from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { TaskStats, Task, TaskStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchDashboardData = async (showLoading = false) => {
    try {
      if (showLoading || !stats) {
        setIsLoading(true);
      }
      const [statsRes, tasksRes] = await Promise.all([
        api.get<TaskStats>('/tasks/stats'),
        api.get('/tasks?limit=5&sortBy=createdAt&sortOrder=desc'),
      ]);
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
  }, []);

  const handleCreateTask = async (data: any) => {
    try {
      setSubmitLoading(true);
      await api.post('/tasks', data);
      setIsModalOpen(false);
      await fetchDashboardData(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const prevTasks = [...recentTasks];
    const prevStats = stats ? { ...stats } : null;

    // Optimistic UI Update
    setRecentTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    if (stats) {
      const taskToUpdate = recentTasks.find((t) => t.id === id);
      if (taskToUpdate && taskToUpdate.status !== newStatus) {
        const updatedStats = { ...stats };
        if (newStatus === 'COMPLETED') {
          updatedStats.completed += 1;
          if (taskToUpdate.status === 'IN_PROGRESS') updatedStats.inProgress -= 1;
          if (taskToUpdate.status === 'TODO') updatedStats.todo -= 1;
        } else if (newStatus === 'IN_PROGRESS') {
          updatedStats.inProgress += 1;
          if (taskToUpdate.status === 'COMPLETED') updatedStats.completed -= 1;
          if (taskToUpdate.status === 'TODO') updatedStats.todo -= 1;
        }
        updatedStats.completionRate =
          updatedStats.total > 0
            ? Math.round((updatedStats.completed / updatedStats.total) * 100)
            : 0;
        setStats(updatedStats);
      }
    }

    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      fetchDashboardData(false);
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Revert on error
      setRecentTasks(prevTasks);
      setStats(prevStats);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-64 min-w-0">
        <Navbar
          title={`Welcome back, ${user?.name || 'User'} 👋`}
          description="Here is your team's real-time task productivity overview."
          onOpenCreateModal={() => setIsModalOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
          {/* Stats Cards Row */}
          {isLoading || !stats ? (
            <DashboardStatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Total Tasks */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total Tasks
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <ListTodo className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats.total}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Active across all projects
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Completed
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stats.completed}
                </div>
                <div className="text-[11px] text-emerald-600/80 font-medium mt-1">
                  {stats.completionRate}% completion rate
                </div>
              </div>

              {/* In Progress Tasks */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    In Progress
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {stats.inProgress}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Currently active work
                </div>
              </div>

              {/* Overdue Tasks */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Overdue
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                  {stats.overdue}
                </div>
                <div className="text-[11px] text-red-500/80 font-medium mt-1">
                  Requires immediate attention
                </div>
              </div>
            </div>
          )}

          {/* Productivity & Priority Visual Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Completion Rate Card */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Completion Velocity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Visual progress ratio of finished vs total assigned tasks
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                  {stats?.completionRate || 0}% Target
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${stats?.completionRate || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium pt-1">
                  <span>0 Completed</span>
                  <span>{stats?.completed || 0} of {stats?.total || 0} Tasks Done</span>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-red-500" /> Priority Mix
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-semibold">
                  <span>Urgent Tasks</span>
                  <span>{stats?.priorityCounts?.URGENT || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                  <span>High Priority</span>
                  <span>{stats?.priorityCounts?.HIGH || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Medium Priority</span>
                  <span>{stats?.priorityCounts?.MEDIUM || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Low Priority</span>
                  <span>{stats?.priorityCounts?.LOW || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Task Activity Section */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Tasks Feed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest updates and items requiring action
                </p>
              </div>
              <Link
                href="/tasks"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All Tasks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent tasks found. Create a task to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {t.category} • Created {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>

                      {t.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(t.id, 'COMPLETED')}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold"
                          title="Mark Complete"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Task Creation Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          isLoading={submitLoading}
        />
      </div>
    </div>
  );
}
