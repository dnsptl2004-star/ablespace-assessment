'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, AccentColor, UserSettings } from '../types';

interface ThemeContextType {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  compactMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setCompactMode: (compact: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_COLOR_MAP: Record<AccentColor, { primary: string; hover: string; ring: string; bg: string; badge: string }> = {
  indigo: {
    primary: 'bg-indigo-600 dark:bg-indigo-500',
    hover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
    ring: 'focus:ring-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  },
  emerald: {
    primary: 'bg-emerald-600 dark:bg-emerald-500',
    hover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
    ring: 'focus:ring-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  violet: {
    primary: 'bg-violet-600 dark:bg-violet-500',
    hover: 'hover:bg-violet-700 dark:hover:bg-violet-600',
    ring: 'focus:ring-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  },
  amber: {
    primary: 'bg-amber-600 dark:bg-amber-500',
    hover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
    ring: 'focus:ring-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
  cyan: {
    primary: 'bg-cyan-600 dark:bg-cyan-500',
    hover: 'hover:bg-cyan-700 dark:hover:bg-cyan-600',
    ring: 'focus:ring-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('indigo');
  const [compactMode, setCompactModeState] = useState<boolean>(false);

  useEffect(() => {
    const savedMode = (localStorage.getItem('task_master_theme_mode') as ThemeMode) || 'dark';
    const savedAccent = (localStorage.getItem('task_master_accent_color') as AccentColor) || 'indigo';
    const savedCompact = localStorage.getItem('task_master_compact_mode') === 'true';

    setThemeModeState(savedMode);
    setAccentColorState(savedAccent);
    setCompactModeState(savedCompact);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('task_master_theme_mode', mode);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem('task_master_accent_color', color);
  };

  const setCompactMode = (compact: boolean) => {
    setCompactModeState(compact);
    localStorage.setItem('task_master_compact_mode', String(compact));
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    if (settings.themeMode) setThemeMode(settings.themeMode);
    if (settings.accentColor) setAccentColor(settings.accentColor);
    if (settings.compactMode !== undefined) setCompactMode(settings.compactMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        accentColor,
        compactMode,
        setThemeMode,
        setAccentColor,
        setCompactMode,
        updateSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
