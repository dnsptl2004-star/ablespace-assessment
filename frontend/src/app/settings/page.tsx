'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode, AccentColor } from '../../types';
import { api } from '../../lib/api';
import { Sun, Moon, Laptop, Palette, Check, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { themeMode, accentColor, compactMode, setThemeMode, setAccentColor } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'light', label: 'Light Mode', icon: Sun },
    { mode: 'dark', label: 'Dark Mode', icon: Moon },
    { mode: 'system', label: 'System Default', icon: Laptop },
  ];

  const colorOptions: { color: AccentColor; label: string; bgClass: string }[] = [
    { color: 'indigo', label: 'Indigo (Default)', bgClass: 'bg-indigo-600' },
    { color: 'emerald', label: 'Emerald Green', bgClass: 'bg-emerald-600' },
    { color: 'violet', label: 'Deep Violet', bgClass: 'bg-violet-600' },
    { color: 'amber', label: 'Warm Amber', bgClass: 'bg-amber-600' },
    { color: 'cyan', label: 'Ocean Cyan', bgClass: 'bg-cyan-600' },
  ];

  const handleSyncBackend = async () => {
    try {
      setIsSaving(true);
      await api.patch('/users/settings', {
        themeMode,
        accentColor,
        compactMode,
      });
      setSavedMessage('Settings successfully synchronized to backend cloud database!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Settings sync error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-64 min-w-0">
        <Navbar
          title="Theme & Customization Settings"
          description="Personalize your workspace aesthetics, dark mode preference, and color palette."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full">
          {savedMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> {savedMessage}
            </div>
          )}

          {/* Theme Mode Selector Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" /> Interface Theme Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Select how TaskMaster Pro looks to you. Preferences persist across devices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = themeMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    onClick={() => setThemeMode(opt.mode)}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-lg shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Palette Selector */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Accent Color Palette
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose your primary highlight color for buttons, badges, and active tabs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {colorOptions.map((opt) => {
                const isSelected = accentColor === opt.color;
                return (
                  <button
                    key={opt.color}
                    onClick={() => setAccentColor(opt.color)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${opt.bgClass} flex-shrink-0`} />
                    <span className="text-xs text-slate-800 dark:text-slate-200 truncate">{opt.label.split(' ')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save / Sync Action */}
          <div className="flex justify-end pt-2 sm:pt-4">
            <button
              onClick={handleSyncBackend}
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Sync Settings to Cloud
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
