'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { TaskCard } from '../../components/TaskCard';
import { TaskTable } from '../../components/TaskTable';
import { TaskModal } from '../../components/TaskModal';
import { EmptyState } from '../../components/EmptyState';
import { TaskCardSkeleton } from '../../components/LoadingSkeleton';
import { api } from '../../lib/api';
import { Task, TaskStatus, TaskPriority, PaginatedResponse } from '../../types';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Kanban,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

export default function TasksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'kanban'>('grid');

  // Search, Filter & Sort Controls State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(viewMode === 'table' ? 10 : 9),
        sortBy,
        sortOrder,
      });

      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);

      const res = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
      setTasks(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder, search, viewMode]);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, data);
      } else {
        await api.post('/tasks', data);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Task save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        await fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-64 min-w-0">
        <Navbar
          title="Task Operations Center"
          description="Manage, filter, sort, and organize your tasks."
          onOpenCreateModal={openCreateModal}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Controls Bar: Search, Filters, Views & Sort */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search title or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* View Layout Toggles */}
              <div className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" /> Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" /> Table
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Kanban Board"
                >
                  <Kanban className="w-4 h-4" /> Kanban
                </button>
              </div>
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1 sm:col-span-2 lg:col-span-1">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </span>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full lg:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                className="w-full lg:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="w-full lg:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Work">Work</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Personal">Personal</option>
              </select>

              {/* Sort By */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto lg:ml-auto pt-2 lg:pt-0 sm:col-span-2 lg:col-span-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {sortOrder}
                </button>
              </div>
            </div>
          </div>

          {/* View Content Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title={search ? 'No matching tasks' : 'No tasks created yet'}
              description={
                search
                  ? `No task titles or descriptions matched "${search}". Try adjusting your keywords.`
                  : 'Start building your task management workflow by creating a task.'
              }
              onAction={openCreateModal}
              actionLabel="Create Task"
              isSearch={!!search}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : viewMode === 'table' ? (
            <TaskTable
              tasks={tasks}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ) : (
            /* Kanban Board Columns */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as TaskStatus[]).map((statusKey) => {
                const columnTasks = tasks.filter((t) => t.status === statusKey);
                const statusTitle =
                  statusKey === 'TODO'
                    ? 'To Do'
                    : statusKey === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'Completed';

                return (
                  <div
                    key={statusKey}
                    className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/30 flex flex-col space-y-4"
                  >
                    <div className="flex items-center justify-between px-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            statusKey === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : statusKey === 'IN_PROGRESS'
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                        />
                        {statusTitle}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-4 flex-1">
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                Showing page <strong className="text-slate-900 dark:text-white">{meta.page}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white">{meta.totalPages}</strong> ({meta.total} total items)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Modal Dialog */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
          initialData={editingTask}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
