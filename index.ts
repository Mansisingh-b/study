export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  category: string;
  completed: boolean;
  date: string;
  priority?: "low" | "medium" | "high";
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  streak: number;
  frequency: string;
  lastCompleted?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  type: "mini" | "boss";
  progress: number;
  target: number;
  icon: string;
  color: string;
  xpReward: number;
}

export interface StudySession {
  id: string;
  duration: number;
  date: string;
  xpEarned: number;
}

export interface DayCompletion {
  day: string;
  planned: number;
  actual: number;
  tasksCompleted: number;
  totalTasks: number;
  percentage: number;
}

export interface TimetableItem {
  hour: string;
  plan: string;
}

export interface AppSettings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  reminderTime: string;
  chatbotEnabled: boolean;
  timerSound: boolean;
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  hoursPerWeek: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}

export interface StudyFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  url: string;
  folderId: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  timestamp?: string; // seconds from start
  autoSummary?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  bookmarked: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  location: string;
}

export interface AppState {
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
}

export interface BookmarkItem {
  id: string;
  title: string;
  url?: string; // Optional for tasks
  type: 'link' | 'pdf' | 'mp4' | 'mp3' | 'timetable' | 'task' | 'other';
  folderId: string | null;
  createdAt: string;
  metadata?: Record<string, unknown>; // For storing task details or other info
}

export interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
}
