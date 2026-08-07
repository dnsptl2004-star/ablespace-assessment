'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import {
  Search,
  Users,
  Zap,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  Minus,
  Sparkles,
  X,
  FileText,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  discipline: 'SPED' | 'Speech' | 'OT' | 'PT';
  activeGoalsCount: number;
  dueTodayCount: number;
  completedToday: boolean;
  goals: string[];
}

const SAMPLE_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 4',
    discipline: 'SPED',
    activeGoalsCount: 3,
    dueTodayCount: 2,
    completedToday: false,
    goals: [
      'Expressive Vocabulary (80% Target)',
      'Transitions between tasks with < 2 verbal prompts',
      'Multi-step Math Problem Solving',
    ],
  },
  {
    id: '2',
    name: 'Sophia Reynolds',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 2',
    discipline: 'Speech',
    activeGoalsCount: 2,
    dueTodayCount: 1,
    completedToday: false,
    goals: [
      'Articulation of /r/ and /s/ blends',
      'Answering Wh- questions in structured sentences',
    ],
  },
  {
    id: '3',
    name: 'Ethan Miller',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 5',
    discipline: 'OT',
    activeGoalsCount: 4,
    dueTodayCount: 0,
    completedToday: true,
    goals: [
      'Pencil grip and handwriting legibility',
      'Bilateral coordination during cutting activities',
      'Sensory regulation strategies',
      'Buttoning & Zipper manipulation',
    ],
  },
  {
    id: '4',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 3',
    discipline: 'SPED',
    activeGoalsCount: 3,
    dueTodayCount: 3,
    completedToday: false,
    goals: [
      'Reading comprehension - main idea identification',
      'Peer interaction during recess',
      'On-task behavior for 15-minute intervals',
    ],
  },
  {
    id: '5',
    name: 'Liam Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 1',
    discipline: 'PT',
    activeGoalsCount: 2,
    dueTodayCount: 1,
    completedToday: false,
    goals: [
      'Single leg balance for 10 seconds',
      'Stair navigation using alternating feet',
    ],
  },
  {
    id: '6',
    name: 'Olivia Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 4',
    discipline: 'Speech',
    activeGoalsCount: 3,
    dueTodayCount: 0,
    completedToday: true,
    goals: [
      'Topic maintenance in 5-turn conversations',
      'Identifying idiom meanings in context',
      'Fluency shaping techniques',
    ],
  },
];

type PromptLevel = 'Independent' | 'Verbal' | 'Gestural' | 'Physical';

interface Trial {
  type: 'correct' | 'incorrect';
  prompt: PromptLevel;
}

export default function CaseloadPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [activeModalStudent, setActiveModalStudent] = useState<Student | null>(null);

  // Take Data Modal Session State
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [promptLevel, setPromptLevel] = useState<PromptLevel>('Independent');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [sessionTimer, setSessionTimer] = useState<number>(145); // 02:25
  const [note, setNote] = useState<string>('');
  const [sessionSaved, setSessionSaved] = useState(false);

  // Filter students based on search and discipline
  const filteredStudents = SAMPLE_STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.goals.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline =
      selectedDiscipline === 'All' || student.discipline === selectedDiscipline;

    return matchesSearch && matchesDiscipline;
  });

  const openTakeDataModal = (student: Student) => {
    setActiveModalStudent(student);
    setSelectedGoal(student.goals[0] || 'General IEP Target');
    setPromptLevel('Independent');
    setTrials([
      { type: 'correct', prompt: 'Independent' },
      { type: 'correct', prompt: 'Independent' },
      { type: 'incorrect', prompt: 'Verbal' },
      { type: 'correct', prompt: 'Gestural' },
      { type: 'correct', prompt: 'Independent' },
    ]);
    setNote('');
    setSessionSaved(false);
  };

  const addTrial = (type: 'correct' | 'incorrect') => {
    setTrials((prev) => [...prev, { type, prompt: promptLevel }]);
  };

  const correctCount = trials.filter((t) => t.type === 'correct').length;
  const accuracy = trials.length > 0 ? Math.round((correctCount / trials.length) * 100) : 0;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      <Sidebar />

      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <Navbar title="AbleSpace Caseload & Take Data" />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/15">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AbleSpace SPED Workflow System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Caseload Management & Take Data
              </h1>
              <p className="text-indigo-100 text-sm max-w-2xl">
                Track assigned students, evaluate active IEP goals, and capture high-frequency trial data with one-click interactive counters.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
              <Users className="w-72 h-72 text-white" />
            </div>
          </div>

          {/* Controls Bar: Search & Discipline Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student name, grade, or IEP goal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['All', 'SPED', 'Speech', 'OT', 'PT'].map((discipline) => (
                <button
                  key={discipline}
                  onClick={() => setSelectedDiscipline(discipline)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDiscipline === discipline
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {discipline === 'All' ? 'All Caseload' : discipline}
                </button>
              ))}
            </div>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Row: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/20 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {student.grade}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            {student.discipline}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {student.completedToday ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" /> {student.dueTodayCount} Due
                      </span>
                    )}
                  </div>

                  {/* Active Goals List Preview */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-indigo-500" />
                        Active IEP Goals
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {student.activeGoalsCount} Total
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {student.goals.slice(0, 2).map((goal, idx) => (
                        <li key={idx} className="line-clamp-1 flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                      {student.goals.length > 2 && (
                        <li className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 pl-3">
                          + {student.goals.length - 2} more goals
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Reports
                  </button>
                  <button
                    onClick={() => openTakeDataModal(student)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" /> TAKE DATA
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Take Data Session Modal */}
          {activeModalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
              <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeModalStudent.avatar}
                      alt={activeModalStudent.name}
                      className="w-12 h-12 rounded-xl border-2 border-white/30 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-xl">{activeModalStudent.name}</h2>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/20 font-bold">
                          {activeModalStudent.grade}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-100 flex items-center gap-2 mt-0.5">
                        <span>⚡ Active Session</span> • <span>Timer: {formatTimer(sessionTimer)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModalStudent(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {/* Goal Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Target IEP Goal
                    </label>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      {activeModalStudent.goals.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accuracy & Trial Counters */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20">
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Accuracy
                      </div>
                      <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                        <TrendingUp className="w-5 h-5" /> {accuracy}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Correct (+)
                      </div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {correctCount}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20">
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        Total Trials
                      </div>
                      <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                        {trials.length}
                      </div>
                    </div>
                  </div>

                  {/* Prompt Level Hierarchy Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Prompt Hierarchy Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Independent', color: 'bg-emerald-500' },
                        { label: 'Verbal', color: 'bg-amber-500' },
                        { label: 'Gestural', color: 'bg-purple-500' },
                        { label: 'Physical', color: 'bg-rose-500' },
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setPromptLevel(p.label as PromptLevel)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                            promptLevel === p.label
                              ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-500/10'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${p.color}`} />
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Touch Target Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => addTrial('correct')}
                      className="py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-7 h-7 stroke-[3]" /> CORRECT (+)
                    </button>
                    <button
                      onClick={() => addTrial('incorrect')}
                      className="py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Minus className="w-7 h-7 stroke-[3]" /> INCORRECT (-)
                    </button>
                  </div>

                  {/* Trial Tape Visual History */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Trial Sequence Tape
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 min-h-[52px]">
                      {trials.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-lg text-xs font-black text-white flex-shrink-0 flex items-center gap-1 shadow-sm ${
                            t.type === 'correct' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        >
                          {t.type === 'correct' ? '+' : '-'}{t.prompt[0]}
                        </span>
                      ))}
                      {trials.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No trials recorded yet. Tap + or - above.</span>
                      )}
                    </div>
                  </div>

                  {/* Clinical Notes Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Qualitative Session Notes
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g., Student responded well to verbal cues during trial 3..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Saved Toast Notification */}
                  {sessionSaved && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <Award className="w-4 h-4" /> Session data successfully recorded to IEP progress ledger!
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveModalStudent(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSessionSaved(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Session Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
