export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Finance' | 'Health' | 'Design' | 'Development' | 'DevOps';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'amber' | 'cyan';

export interface UserSettings {
  id?: string;
  userId?: string;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  compactMode?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
  settings?: UserSettings;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionRate: number;
  priorityCounts: {
    URGENT: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
