'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
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
  BarChart3,
  Calendar,
  PlusCircle,
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
  averageAccuracy?: number;
}

interface SessionLog {
  id: string;
  studentId: string;
  studentName: string;
  goal: string;
  date: string;
  accuracy: number;
  correctCount: number;
  totalTrials: number;
  durationSeconds: number;
  note: string;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 4',
    discipline: 'SPED',
    activeGoalsCount: 3,
    dueTodayCount: 2,
    completedToday: false,
    averageAccuracy: 78,
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
    averageAccuracy: 85,
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
    averageAccuracy: 92,
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
    averageAccuracy: 70,
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
    averageAccuracy: 88,
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
    averageAccuracy: 95,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  
  // Persistent Student List
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ablespace_students_list');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_STUDENTS;
  });

  // Persistent Session History
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ablespace_session_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: 'log-1',
        studentId: '1',
        studentName: 'Marcus Vance',
        goal: 'Expressive Vocabulary (80% Target)',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        accuracy: 80,
        correctCount: 4,
        totalTrials: 5,
        durationSeconds: 145,
        note: 'Marcus was highly responsive to picture prompt flashcards today.',
      },
      {
        id: 'log-2',
        studentId: '3',
        studentName: 'Ethan Miller',
        goal: 'Pencil grip and handwriting legibility',
        date: new Date(Date.now() - 43200000).toLocaleDateString(),
        accuracy: 90,
        correctCount: 9,
        totalTrials: 10,
        durationSeconds: 320,
        note: 'Maintained tripod grip independently throughout whole activity.',
      },
    ];
  });

  // Modals state
  const [activeModalStudent, setActiveModalStudent] = useState<Student | null>(null);
  const [reportStudent, setReportStudent] = useState<Student | null>(null);
  const [addingGoalStudent, setAddingGoalStudent] = useState<Student | null>(null);
  const [newGoalText, setNewGoalText] = useState('');

  // Take Data Session State
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [promptLevel, setPromptLevel] = useState<PromptLevel>('Independent');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [sessionTimer, setSessionTimer] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [sessionSaved, setSessionSaved] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ablespace_students_list', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ablespace_session_history', JSON.stringify(sessionLogs));
    }
  }, [sessionLogs]);

  // Session Timer interval tick while Take Data modal is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeModalStudent) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeModalStudent]);

  // Filter students based on search and discipline
  const filteredStudents = students.filter((student) => {
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
    setSessionTimer(0);
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

  const handleSaveSessionData = () => {
    if (!activeModalStudent) return;

    const newLog: SessionLog = {
      id: `log-${Date.now()}`,
      studentId: activeModalStudent.id,
      studentName: activeModalStudent.name,
      goal: selectedGoal,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      accuracy,
      correctCount,
      totalTrials: trials.length,
      durationSeconds: sessionTimer,
      note: note.trim() || 'Trial session completed cleanly.',
    };

    setSessionLogs((prev) => [newLog, ...prev]);

    // Update student metrics
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === activeModalStudent.id) {
          return {
            ...s,
            completedToday: true,
            dueTodayCount: Math.max(0, s.dueTodayCount - 1),
            averageAccuracy: Math.round(((s.averageAccuracy || 80) + accuracy) / 2),
          };
        }
        return s;
      })
    );

    setSessionSaved(true);
    setTimeout(() => {
      setActiveModalStudent(null);
      setSessionSaved(false);
    }, 1200);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingGoalStudent || !newGoalText.trim()) return;

    const goalStr = newGoalText.trim();
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === addingGoalStudent.id) {
          const updatedGoals = [...s.goals, goalStr];
          return {
            ...s,
            goals: updatedGoals,
            activeGoalsCount: updatedGoals.length,
          };
        }
        return s;
      })
    );

    setNewGoalText('');
    setAddingGoalStudent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-64 min-w-0">
        <Navbar
          title="AbleSpace Caseload & Take Data"
          description="Track assigned students, evaluate IEP goals, and capture trial data."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/15">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AbleSpace SPED Workflow System</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Caseload Management & Take Data
              </h1>
              <p className="text-indigo-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Track assigned students, evaluate active IEP goals, and capture high-frequency trial data with one-click interactive counters.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
              <Users className="w-72 h-72 text-white" />
            </div>
          </div>

          {/* Controls Bar: Search & Discipline Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student name, grade, or IEP goal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['All', 'SPED', 'Speech', 'OT', 'PT'].map((discipline) => (
                <button
                  key={discipline}
                  onClick={() => setSelectedDiscipline(discipline)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDiscipline === discipline
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {discipline === 'All' ? 'All Caseload' : discipline}
                </button>
              ))}
            </div>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Row: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/20 shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 truncate">
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
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
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
                      <button
                        onClick={() => setAddingGoalStudent(student)}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        title="Add IEP Goal"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> {student.goals.length} Goals
                      </button>
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
                  <button
                    onClick={() => setReportStudent(student)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
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

          {/* Student Progress Reports Modal */}
          {reportStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
              <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={reportStudent.avatar}
                      alt={reportStudent.name}
                      className="w-12 h-12 rounded-xl border-2 border-white/30 object-cover"
                    />
                    <div>
                      <h2 className="font-extrabold text-lg sm:text-xl">{reportStudent.name} IEP Progress Report</h2>
                      <p className="text-xs text-indigo-100">{reportStudent.grade} • {reportStudent.discipline} Discipline</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReportStudent(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">Avg Accuracy</span>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {reportStudent.averageAccuracy || 85}%
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">Active Goals</span>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {reportStudent.goals.length}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-500/20">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">Sessions Recorded</span>
                      <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                        {sessionLogs.filter((l) => l.studentId === reportStudent.id).length}
                      </div>
                    </div>
                  </div>

                  {/* Active Goals List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-500" /> Active IEP Goals Matrix
                    </h4>
                    <div className="space-y-2">
                      {reportStudent.goals.map((g, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{g}</span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            On Track
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historical Session Logs */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-indigo-500" /> Session Trial Log History
                    </h4>

                    {sessionLogs.filter((l) => l.studentId === reportStudent.id).length === 0 ? (
                      <p className="text-slate-400 italic text-center py-4">
                        No trial session logs recorded yet. Use &quot;TAKE DATA&quot; to capture session trials.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {sessionLogs
                          .filter((l) => l.studentId === reportStudent.id)
                          .map((log) => (
                            <div
                              key={log.id}
                              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                            >
                              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                                <span className="truncate max-w-xs">{log.goal}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                                  {log.accuracy}% ({log.correctCount}/{log.totalTrials} trials)
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>{log.date}</span>
                                <span>Duration: {formatTimer(log.durationSeconds)}</span>
                              </div>
                              {log.note && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg mt-1">
                                  &quot;{log.note}&quot;
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
                  <button
                    onClick={() => setReportStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Custom Goal Modal */}
          {addingGoalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
              <div className="glass-card w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Add IEP Goal for {addingGoalStudent.name}
                  </h3>
                  <button onClick={() => setAddingGoalStudent(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Goal Description</label>
                    <textarea
                      rows={3}
                      required
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      placeholder="e.g. Will write complete sentences using capital letters with 80% accuracy."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingGoalStudent(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                    >
                      Add Goal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Interactive Take Data Session Modal */}
          {activeModalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
              <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Modal Header */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeModalStudent.avatar}
                      alt={activeModalStudent.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white/30 object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-base sm:text-xl truncate">{activeModalStudent.name}</h2>
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-white/20 font-bold flex-shrink-0">
                          {activeModalStudent.grade}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-indigo-100 flex items-center gap-2 mt-0.5 truncate">
                        <span>⚡ Active Session</span> • <span>Timer: {formatTimer(sessionTimer)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModalStudent(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
                  {/* Goal Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Target IEP Goal
                    </label>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      {activeModalStudent.goals.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accuracy & Trial Counters */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
                    <div className="p-2.5 sm:p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20">
                      <div className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Accuracy
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> {accuracy}%
                      </div>
                    </div>
                    <div className="p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
                      <div className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Correct (+)
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {correctCount}
                      </div>
                    </div>
                    <div className="p-2.5 sm:p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20">
                      <div className="text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400">
                        Total Trials
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                        {trials.length}
                      </div>
                    </div>
                  </div>

                  {/* Prompt Level Hierarchy Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Prompt Hierarchy Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            promptLevel === p.label
                              ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${p.color} flex-shrink-0`} />
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Touch Target Buttons */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => addTrial('correct')}
                      className="py-4 sm:py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Plus className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3]" /> CORRECT (+)
                    </button>
                    <button
                      onClick={() => addTrial('incorrect')}
                      className="py-4 sm:py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Minus className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3]" /> INCORRECT (-)
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
                    onClick={handleSaveSessionData}
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
