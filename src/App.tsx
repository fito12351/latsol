import React, { useEffect, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SUBJECTS } from './data/subjects';
import { HomeScreen } from './components/HomeScreen';
import { SubjectPickerScreen, type StartSessionConfig } from './components/SubjectPickerScreen';
import { QuizScreen, type QuizFinishedPayload } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { BankSoalScreen } from './components/BankSoalScreen';
import { EssayScreen } from './components/EssayScreen';
import {
  createEmptyProgress,
  loadProgress,
  recordExamBatch,
  recordQuestionAttempt,
  saveEssayProgress,
  saveProgress,
} from './utils/storage';
import type { MCQuestion, OptionKey, PersistedProgress, SubjectData } from './types/cbt';

type RouteState =
  | { name: 'home' }
  | { name: 'subjects'; defaultMode: 'cbt' | 'practice' | 'essay' }
  | { name: 'bank'; filter: 'all' | 'learning' | 'mastered' }
  | { name: 'quiz'; subject: SubjectData; mode: 'cbt' | 'practice'; questions: MCQuestion[]; lastConfig?: StartSessionConfig }
  | { name: 'result'; payload: QuizFinishedPayload; lastConfig?: StartSessionConfig }
  | { name: 'essay'; subject: SubjectData };

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

function prepareQuestions(config: StartSessionConfig): MCQuestion[] {
  let list = [...config.subject.questions];
  if (config.shuffleQuestions) {
    list = shuffleArray(list);
  }
  if (config.limit !== 'all' && config.limit < list.length) {
    list = list.slice(0, config.limit);
  }
  if (config.shuffleOptions) {
    list = list.map((q) => {
      const shuffled = shuffleArray(q.options);
      let newAnswer: OptionKey = q.answer;
      const remapped = shuffled.map((opt, idx) => {
        const key = KEYS[idx] ?? opt.key;
        if (opt.key === q.answer) newAnswer = key;
        return { ...opt, key };
      });
      return { ...q, options: remapped, answer: newAnswer };
    });
  }
  return list;
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<RouteState>({ name: 'home' });
  const [progress, setProgress] = useState<PersistedProgress>(() => loadProgress());
  const [showResetSheet, setShowResetSheet] = useState(false);

  // Configure native StatusBar & Android hardware back button
  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#654CE5' }).catch(() => {});

    const listenerPromise = CapApp.addListener('backButton', () => {
      setRoute((prev) => {
        if (prev.name === 'home') {
          CapApp.exitApp().catch(() => {});
          return prev;
        }
        return { name: 'home' };
      });
    });

    return () => {
      listenerPromise.then((h) => h.remove()).catch(() => {});
    };
  }, []);

  const handleStartQuiz = (config: StartSessionConfig) => {
    const qs = prepareQuestions(config);
    setRoute({
      name: 'quiz',
      subject: config.subject,
      mode: config.mode,
      questions: qs,
      lastConfig: config,
    });
  };

  const handlePracticeCustomList = (title: string, questions: MCQuestion[], accentColor: string) => {
    const virtualSubject: SubjectData = {
      id: 'custom-drill',
      name: title,
      shortName: 'LAT',
      group: 'umum',
      schedule: 'Latihan Khusus',
      durationMinutes: Math.max(15, questions.length * 2),
      accentColor,
      questions,
      essays: [],
    };
    setRoute({
      name: 'quiz',
      subject: virtualSubject,
      mode: 'practice',
      questions,
    });
  };

  const handleFinishQuiz = (payload: QuizFinishedPayload, lastConfig?: StartSessionConfig) => {
    let correctCount = 0;
    const batch: Array<{ questionId: string; isCorrect: boolean }> = [];
    for (const q of payload.questions) {
      const userAns = payload.answers[q.id];
      const ok = userAns === q.answer;
      if (ok) correctCount++;
      if (userAns) {
        batch.push({ questionId: q.id, isCorrect: ok });
      }
    }
    const score = Math.round((correctCount / Math.max(1, payload.questions.length)) * 100);
    const entry = {
      id: `hist-${Date.now()}`,
      subjectId: payload.subject.id,
      subjectName: payload.subject.name,
      mode: payload.mode,
      score,
      correctCount,
      totalCount: payload.questions.length,
      durationSeconds: payload.durationSeconds,
      completedAt: Date.now(),
    };

    if (payload.mode === 'cbt') {
      setProgress((prev) => recordExamBatch(prev, batch, entry));
    } else {
      // Practice mode already recorded each question attempt immediately; only append history
      setProgress((prev) => {
        const next = { ...prev, history: [entry, ...prev.history].slice(0, 40) };
        saveProgress(next);
        return next;
      });
    }

    setRoute({ name: 'result', payload, lastConfig });
  };

  const handleResetProgress = () => {
    const fresh = createEmptyProgress();
    saveProgress(fresh);
    setProgress(fresh);
    setShowResetSheet(false);
  };

  return (
    <div className="app-shell">
      {route.name === 'home' && (
        <HomeScreen
          subjects={SUBJECTS}
          progress={progress}
          onOpenBankSoal={(filter) => setRoute({ name: 'bank', filter })}
          onOpenSubjects={(defaultMode = 'cbt') => setRoute({ name: 'subjects', defaultMode })}
          onQuickStart={() => setRoute({ name: 'subjects', defaultMode: 'cbt' })}
          onResetProgress={() => setShowResetSheet(true)}
        />
      )}

      {route.name === 'subjects' && (
        <SubjectPickerScreen
          subjects={SUBJECTS}
          progress={progress}
          initialMode={route.defaultMode}
          onBack={() => setRoute({ name: 'home' })}
          onStartQuiz={handleStartQuiz}
          onStartEssay={(subject) => setRoute({ name: 'essay', subject })}
        />
      )}

      {route.name === 'bank' && (
        <BankSoalScreen
          subjects={SUBJECTS}
          progress={progress}
          initialFilter={route.filter}
          onBack={() => setRoute({ name: 'home' })}
          onPracticeList={handlePracticeCustomList}
        />
      )}

      {route.name === 'quiz' && (
        <QuizScreen
          subject={route.subject}
          mode={route.mode}
          questions={route.questions}
          onExit={() => setRoute({ name: 'home' })}
          onPracticeAnswer={(qId, ok) =>
            setProgress((prev) => recordQuestionAttempt(prev, qId, ok))
          }
          onFinish={(payload) => handleFinishQuiz(payload, route.lastConfig)}
        />
      )}

      {route.name === 'result' && (
        <ResultScreen
          result={route.payload}
          onHome={() => setRoute({ name: 'home' })}
          onRetry={() => {
            if (route.lastConfig) {
              handleStartQuiz(route.lastConfig);
            } else {
              setRoute({
                name: 'quiz',
                subject: route.payload.subject,
                mode: route.payload.mode,
                questions: route.payload.questions,
              });
            }
          }}
        />
      )}

      {route.name === 'essay' && (
        <EssayScreen
          subject={route.subject}
          progress={progress}
          onBack={() => setRoute({ name: 'subjects', defaultMode: 'essay' })}
          onUpdateEssay={(essayId, update) =>
            setProgress((prev) => saveEssayProgress(prev, essayId, update))
          }
        />
      )}

      {showResetSheet && (
        <div className="sheet-backdrop" onClick={() => setShowResetSheet(false)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Reset progres latihan?</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              Semua riwayat skor CBT, status soal dikuasai, dan catatan uraian di perangkat ini akan dihapus.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                className="action-btn action-btn-sky"
                onClick={() => setShowResetSheet(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="action-btn"
                style={{ background: 'var(--coral)' }}
                onClick={handleResetProgress}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
