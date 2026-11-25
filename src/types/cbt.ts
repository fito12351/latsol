export type SubjectGroup = 'mipa' | 'bahasa' | 'umum';

export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionOption {
  key: OptionKey;
  text: string;
  image?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface MCQuestion {
  id: string;
  number: number;
  passage?: string;
  passageTitle?: string;
  prompt: string;
  image?: string;
  imageCaption?: string;
  table?: TableData;
  options: QuestionOption[];
  answer: OptionKey;
  explanation: string;
  topic?: string;
}

export interface EssayQuestion {
  id: string;
  number: number;
  passage?: string;
  passageTitle?: string;
  prompt: string;
  image?: string;
  imageCaption?: string;
  rubric: string;
  modelAnswer: string;
}

export interface SubjectData {
  id: string;
  name: string;
  shortName: string;
  group: SubjectGroup;
  schedule: string;
  durationMinutes: number;
  accentColor: string;
  questions: MCQuestion[];
  essays: EssayQuestion[];
}

export type QuestionMastery = 'new' | 'learning' | 'mastered';

export interface QuestionStat {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  lastAttemptAt: number;
  mastery: QuestionMastery;
}

export interface ExamHistoryEntry {
  id: string;
  subjectId: string;
  subjectName: string;
  mode: 'cbt' | 'practice';
  score: number;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  completedAt: number;
}

export interface EssayProgress {
  draft: string;
  status: 'new' | 'review' | 'mastered';
  updatedAt: number;
}

export interface PersistedProgress {
  questionStats: Record<string, QuestionStat>;
  essayStats: Record<string, EssayProgress>;
  history: ExamHistoryEntry[];
  todayDate: string;
  todayAnswered: number;
  todayMastered: number;
}
