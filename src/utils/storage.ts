import type { EssayProgress, ExamHistoryEntry, PersistedProgress, QuestionStat } from '../types/cbt';

const STORAGE_KEY = 'latsol_psas_progress_v1';

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createEmptyProgress(): PersistedProgress {
  return {
    questionStats: {},
    essayStats: {},
    history: [],
    todayDate: getTodayKey(),
    todayAnswered: 0,
    todayMastered: 0,
  };
}

export function loadProgress(): PersistedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    const today = getTodayKey();
    const sameDay = parsed.todayDate === today;
    return {
      questionStats: parsed.questionStats ?? {},
      essayStats: parsed.essayStats ?? {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      todayDate: today,
      todayAnswered: sameDay ? parsed.todayAnswered ?? 0 : 0,
      todayMastered: sameDay ? parsed.todayMastered ?? 0 : 0,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(progress: PersistedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota errors in private mode
  }
}

export function recordQuestionAttempt(
  prev: PersistedProgress,
  questionId: string,
  isCorrect: boolean
): PersistedProgress {
  const today = getTodayKey();
  const sameDay = prev.todayDate === today;
  const existing: QuestionStat | undefined = prev.questionStats[questionId];
  const wasMastered = existing?.mastery === 'mastered';

  const attempts = (existing?.attempts ?? 0) + 1;
  const correct = (existing?.correct ?? 0) + (isCorrect ? 1 : 0);
  const mastery: QuestionStat['mastery'] = isCorrect ? 'mastered' : 'learning';

  const next: PersistedProgress = {
    ...prev,
    todayDate: today,
    todayAnswered: (sameDay ? prev.todayAnswered : 0) + 1,
    todayMastered: (sameDay ? prev.todayMastered : 0) + (!wasMastered && isCorrect ? 1 : 0),
    questionStats: {
      ...prev.questionStats,
      [questionId]: {
        attempts,
        correct,
        lastCorrect: isCorrect,
        lastAttemptAt: Date.now(),
        mastery,
      },
    },
  };
  saveProgress(next);
  return next;
}

export function recordExamBatch(
  prev: PersistedProgress,
  results: Array<{ questionId: string; isCorrect: boolean }>,
  historyEntry: ExamHistoryEntry
): PersistedProgress {
  let state = prev;
  for (const item of results) {
    state = recordQuestionAttempt(state, item.questionId, item.isCorrect);
  }
  const next: PersistedProgress = {
    ...state,
    history: [historyEntry, ...state.history].slice(0, 40),
  };
  saveProgress(next);
  return next;
}

export function saveEssayProgress(
  prev: PersistedProgress,
  essayId: string,
  update: Partial<EssayProgress>
): PersistedProgress {
  const existing = prev.essayStats[essayId] ?? {
    draft: '',
    status: 'new' as const,
    updatedAt: Date.now(),
  };
  const next: PersistedProgress = {
    ...prev,
    essayStats: {
      ...prev.essayStats,
      [essayId]: {
        ...existing,
        ...update,
        updatedAt: Date.now(),
      },
    },
  };
  saveProgress(next);
  return next;
}
