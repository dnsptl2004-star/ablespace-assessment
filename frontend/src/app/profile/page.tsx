'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { User } from '../../types';
import { User as UserIcon, Shield, Lock, Save, Loader2, Check } from 'lucide-react';

const AVATAR_SEEDS = ['User', 'Alex', 'Sarah', 'GuestUser', 'Developer', 'Designer', 'Manager', 'Product'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatePayload: any = { name, avatarUrl };
      if (newPassword.trim().length >= 6) {
        updatePayload.newPassword = newPassword;
      }

      const res = await api.patch<User>('/users/profile', updatePayload);
      updateUser(res.data);
      setSuccessMsg('Profile updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 min-w-0">
        <Navbar
          title="Account Profile"
          description="Manage your identity, avatar, and security settings."
        />

        <main className="p-8 max-w-4xl mx-auto space-y-8">
          {/* Notification Alerts */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-8">
            {/* Header Identity Block */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <img
                src={avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/30 bg-indigo-50 dark:bg-indigo-950"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user?.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user?.email}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wide">
                  {user?.role || 'MEMBER'}
                </span>
              </div>
            </div>

            {/* Avatar Pickers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Select Pre-set Avatar Preset
              </label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_SEEDS.map((seed) => {
                  const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                  const isSelected = avatarUrl === url;
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`p-1 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={url}
                        alt={seed}
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleProfileSave} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 text-slate-400 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Password Change */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-indigo-500" /> Security & Password
                </h4>
                <div className="max-w-md">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password (leave empty to keep current)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
