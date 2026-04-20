import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  User, Task, Habit, Goal, StudySession, DayCompletion,
  TimetableItem, AppSettings, Subject, Assignment, Exam, BookmarkItem
} from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { addXP, XP_REWARDS } from '../utils/xp';

// ─── Default Values ───────────────────────────────────────────────────────────

const defaultUser: User = {
  id: '1', name: 'Student', email: 'student@example.com',
  avatar: '🎓', level: 1, xp: 0, role: 'Student',
};

const defaultSettings: AppSettings = {
  darkMode: false, notificationsEnabled: true,
  reminderTime: '09:00', chatbotEnabled: true, timerSound: true,
};

const generateWeeklyProgress = (): DayCompletion[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({ day, planned: 0, actual: 0, tasksCompleted: 0, totalTasks: 0, percentage: 0 }));
};

// ─── Context Type ─────────────────────────────────────────────────────────────

interface PlannerContextType {
  // State
  user: User;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  studySessions: StudySession[];
  weeklyProgress: DayCompletion[];
  timetable: TimetableItem[];
  settings: AppSettings;
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  bookmarks: BookmarkItem[];

  // User actions
  updateUser: (updates: Partial<User>) => void;
  earnXP: (amount: number) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Habit actions
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;

  // Goal actions
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementGoalProgress: (id: string, amount: number) => void;

  // Study actions
  addStudySession: (session: Omit<StudySession, 'id'>) => void;

  // Timetable actions
  updateTimetable: (items: TimetableItem[]) => void;
  clearTimetable: () => void;

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetTimerData: () => void;
  clearChatHistory: () => void;

  // Subject actions
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Assignment actions
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentComplete: (id: string) => void;

  // Exam actions
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Bookmark actions
  addBookmark: (bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  deleteBookmark: (id: string) => void;
}

// ─── Context Creation ─────────────────────────────────────────────────────────

const PlannerContext = createContext<PlannerContextType>({} as PlannerContextType);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => loadFromStorage('user', defaultUser));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage('tasks', []));
  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage('habits', []));
  const [goals, setGoals] = useState<Goal[]>(() => loadFromStorage('goals', []));
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => loadFromStorage('studySessions', []));
  const [weeklyProgress] = useState<DayCompletion[]>(() => loadFromStorage('weeklyProgress', generateWeeklyProgress()));
  const [timetable, setTimetable] = useState<TimetableItem[]>(() => loadFromStorage('timetable', []));
  const [settings, setSettings] = useState<AppSettings>(() => loadFromStorage('settings', defaultSettings));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('subjects', []));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadFromStorage('assignments', []));
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage('exams', []));
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => loadFromStorage('bookmarksData', []));

  // ─── Persistence effects ─────────────────────────────────────────────────
  useEffect(() => { saveToStorage('user', user); }, [user]);
  useEffect(() => { saveToStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('habits', habits); }, [habits]);
  useEffect(() => { saveToStorage('goals', goals); }, [goals]);
  useEffect(() => { saveToStorage('studySessions', studySessions); }, [studySessions]);
  useEffect(() => { saveToStorage('weeklyProgress', weeklyProgress); }, [weeklyProgress]);
  useEffect(() => { saveToStorage('timetable', timetable); }, [timetable]);
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('assignments', assignments); }, [assignments]);
  useEffect(() => { saveToStorage('exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('bookmarksData', bookmarks); }, [bookmarks]);

  // ─── Dark mode effect ─────────────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  // ─── User actions ─────────────────────────────────────────────────────────
  const updateUser = (updates: Partial<User>) => setUser(prev => ({ ...prev, ...updates }));

  const earnXP = (amount: number) => {
    setUser(prev => {
      const { newXP, newLevel } = addXP(prev.xp, amount);
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  // ─── Task actions ─────────────────────────────────────────────────────────
  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newCompleted = !t.completed;
      if (newCompleted) earnXP(XP_REWARDS.TASK_COMPLETE);
      return { ...t, completed: newCompleted };
    }));
  };

  // ─── Habit actions ────────────────────────────────────────────────────────
  const addHabit = (habit: Omit<Habit, 'id'>) => {
    setHabits(prev => [...prev, { ...habit, id: Date.now().toString() }]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const completeHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      if (h.lastCompleted === today) return h;
      earnXP(XP_REWARDS.HABIT_COMPLETE);
      return { ...h, streak: h.streak + 1, lastCompleted: today };
    }));
  };

  // ─── Goal actions ─────────────────────────────────────────────────────────
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const incrementGoalProgress = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newProgress = Math.min(g.progress + amount, g.target);
      if (newProgress >= g.target) {
        earnXP(g.type === 'boss' ? XP_REWARDS.BOSS_GOAL_COMPLETE : XP_REWARDS.MINI_GOAL_COMPLETE);
      }
      return { ...g, progress: newProgress };
    }));
  };

  // ─── Study actions ────────────────────────────────────────────────────────
  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    setStudySessions(prev => [...prev, { ...session, id: Date.now().toString() }]);
  };

  // ─── Timetable actions ────────────────────────────────────────────────────
  const updateTimetable = (items: TimetableItem[]) => setTimetable(items);
  const clearTimetable = () => setTimetable([]);

  // ─── Settings actions ─────────────────────────────────────────────────────
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetTimerData = () => {
    saveToStorage('timerSettings', {});
  };

  const clearChatHistory = () => {
    saveToStorage('studyChatHistory', []);
  };

  // ─── Subject actions ──────────────────────────────────────────────────────
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    setSubjects(prev => [...prev, { ...subject, id: Date.now().toString() }]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // ─── Assignment actions ───────────────────────────────────────────────────
  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    setAssignments(prev => [...prev, { ...assignment, id: Date.now().toString() }]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const toggleAssignmentComplete = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  // ─── Exam actions ─────────────────────────────────────────────────────────
  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => [...prev, { ...exam, id: Date.now().toString() }]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // ─── Bookmark actions ─────────────────────────────────────────────────────
  const addBookmark = (bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
    const newBookmark: BookmarkItem = {
      ...bookmark,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // ─── Context value ────────────────────────────────────────────────────────
  const value: PlannerContextType = {
    user, tasks, habits, goals, studySessions, weeklyProgress,
    timetable, settings, subjects, assignments, exams, bookmarks,
    updateUser, earnXP,
    addTask, updateTask, deleteTask, toggleTaskComplete,
    addHabit, updateHabit, deleteHabit, completeHabit,
    addGoal, updateGoal, deleteGoal, incrementGoalProgress,
    addStudySession,
    updateTimetable, clearTimetable,
    updateSettings, resetTimerData, clearChatHistory,
    addSubject, updateSubject, deleteSubject,
    addAssignment, updateAssignment, deleteAssignment, toggleAssignmentComplete,
    addExam, updateExam, deleteExam,
    addBookmark, deleteBookmark,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
