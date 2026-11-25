import React from 'react';
import { ArrowUpRight, Plus, RotateCcw, BookOpen } from 'lucide-react';
import {
  DashboardMascotHero,
  DesktopMascotFigure,
  MascotLegs,
  MiniRunningMascot,
} from './Mascot';
import type { PersistedProgress, SubjectData } from '../types/cbt';

interface HomeScreenProps {
  subjects: SubjectData[];
  progress: PersistedProgress;
  onOpenBankSoal: (filter: 'all' | 'learning' | 'mastered') => void;
  onOpenSubjects: (defaultMode?: 'cbt' | 'practice' | 'essay') => void;
  onQuickStart: () => void;
  onResetProgress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  subjects,
  progress,
  onOpenBankSoal,
  onOpenSubjects,
  onQuickStart,
  onResetProgress,
}) => {
  const allQuestions = subjects.flatMap((s) => s.questions);
  const totalPG = allQuestions.length;
  const totalEssay = subjects.reduce((acc, s) => acc + s.essays.length, 0);

  let masteredCount = 0;
  let learningCount = 0;

  for (const q of allQuestions) {
    const st = progress.questionStats[q.id];
    if (!st) continue;
    if (st.mastery === 'mastered') masteredCount++;
    else learningCount++;
  }

  const remainingToLearn = totalPG - masteredCount;
  const accuracyPct =
    masteredCount + learningCount > 0
      ? Math.round((masteredCount / (masteredCount + learningCount)) * 100)
      : 0;

  const latestHistory = progress.history[0];

  return (
    <div className="home-screen">
      <DashboardMascotHero />

      {/* Top Brand Lockup */}
      <header className="home-top-bar">
        <div className="brand-lockup">
          <span className="wordmark">latsol</span>
          <span className="brand-tagline">
            Latihan PSAS XII
            <br />
            lebih mudah
          </span>
        </div>

        <button
          type="button"
          className="icon-ghost-btn"
          onClick={onResetProgress}
          title="Reset progres latihan"
          aria-label="Reset progres latihan"
        >
          <RotateCcw size={18} strokeWidth={2.2} />
        </button>
      </header>

      {/* Main Layout: 1-col on Phone/Portrait, 2-col Editorial Hero on Tablet Landscape & Laptop */}
      <div className="home-main-layout">
        {/* Desktop/Laptop Mascot Left Column */}
        <aside className="home-desktop-mascot-col">
          <div className="desktop-mascot-card">
            <DesktopMascotFigure mood={masteredCount > 0 ? 'celebrate' : 'happy'} size={172} />
            <h2>Siap hadapi PSAS XII?</h2>
            <p>
              Latihan simulasi CBT berwaktu, mode belajar santai dengan pembahasan instan, dan bank soal lengkap dari seluruh 12 mapel.
            </p>
            <div className="desktop-mascot-badges">
              <span className="desktop-mascot-badge">{totalPG} Pilihan Ganda</span>
              <span className="desktop-mascot-badge">{totalEssay} Uraian</span>
              <span className="desktop-mascot-badge">100% Offline</span>
            </div>
          </div>
          <div style={{ marginTop: -2, pointerEvents: 'none' }}>
            <MascotLegs />
          </div>
        </aside>

        {/* Right Column (or full width on mobile): 2x2 Worly Pastel Bento Grid + CTA */}
        <main className="home-bento-wrap">
          <div className="bento-grid">
            {/* Mint Card: Total Soal */}
            <button
              type="button"
              className="bento-card bento-card-mint"
              onClick={() => onOpenBankSoal('all')}
            >
              <div className="bento-top-row">
                <span className="bento-label">Total soal</span>
                <span className="bento-arrow">
                  <ArrowUpRight size={17} strokeWidth={2.2} />
                </span>
              </div>
              <div className="bento-kpi">{totalPG}</div>
              <div className="bento-pills-row">
                <div className="bento-delta-col">
                  <span className="bento-pill">+{subjects.length}</span>
                  <span className="bento-delta-sub">mapel</span>
                </div>
                <div className="bento-delta-col">
                  <span className="bento-pill">+{totalEssay}</span>
                  <span className="bento-delta-sub">uraian</span>
                </div>
              </div>
            </button>

            {/* Sky Blue Card: Belajar */}
            <button
              type="button"
              className="bento-card bento-card-sky"
              onClick={() => onOpenBankSoal('learning')}
            >
              <div className="bento-top-row">
                <span className="bento-label">Belajar</span>
                <span className="bento-arrow">
                  <ArrowUpRight size={17} strokeWidth={2.2} />
                </span>
              </div>
              <div className="bento-kpi">{remainingToLearn}</div>
              <div className="bento-pills-row">
                <div className="bento-delta-col">
                  <span className="bento-pill">+{progress.todayAnswered}</span>
                  <span className="bento-delta-sub">hari ini</span>
                </div>
                <div className="bento-delta-col">
                  <span className="bento-pill">{learningCount}</span>
                  <span className="bento-delta-sub">diulang</span>
                </div>
              </div>
            </button>

            {/* Lime Card: Dikuasai */}
            <button
              type="button"
              className="bento-card bento-card-lime"
              onClick={() => onOpenBankSoal('mastered')}
            >
              <div className="bento-top-row">
                <span className="bento-label">Dikuasai</span>
                <span className="bento-arrow">
                  <ArrowUpRight size={17} strokeWidth={2.2} />
                </span>
              </div>
              <div className="bento-kpi">{masteredCount}</div>
              <div className="bento-pills-row">
                <div className="bento-delta-col">
                  <span className="bento-pill">+{progress.todayMastered}</span>
                  <span className="bento-delta-sub">hari ini</span>
                </div>
                <div className="bento-delta-col">
                  <span className="bento-pill">{accuracyPct}%</span>
                  <span className="bento-delta-sub">akurasi</span>
                </div>
              </div>
            </button>

            {/* Pink Card: Mulai CBT */}
            <button
              type="button"
              className="bento-card bento-card-pink"
              onClick={onQuickStart}
            >
              <div className="bento-top-row" style={{ justifyContent: 'flex-end' }}>
                <MiniRunningMascot />
              </div>
              <div>
                <div className="bento-start-title">
                  Mulai
                  <br />
                  latihan
                </div>
                <div className="bento-start-sub">CBT & Santai</div>
              </div>
            </button>
          </div>

          {/* Full-width Bold Purple CTA Button */}
          <button
            type="button"
            className="primary-purple-btn"
            onClick={() => onOpenSubjects('cbt')}
          >
            <span>Pilih mata pelajaran</span>
            <Plus size={22} strokeWidth={2.6} />
          </button>

          {/* Signature Mascot Stick Legs underneath CTA (Mobile only; desktop shows under mascot card) */}
          <div className="home-legs-wrap">
            <MascotLegs />
          </div>

          {/* Quick Strip: Latest Session or Essay Shortcut */}
          {latestHistory ? (
            <button
              type="button"
              className="home-quick-strip"
              onClick={() => onOpenSubjects('cbt')}
            >
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--ink-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  Sesi terakhir · {latestHistory.mode === 'cbt' ? 'CBT' : 'Santai'}
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2 }}>
                  {latestHistory.subjectName}
                </div>
              </div>
              <span
                className={`status-pill ${
                  latestHistory.score >= 75 ? 'status-mastered' : 'status-learning'
                }`}
                style={{ fontSize: 13, padding: '6px 11px' }}
              >
                Skor {latestHistory.score}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="home-quick-strip"
              onClick={() => onOpenSubjects('essay')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: 'var(--purple-soft)',
                    color: 'var(--purple-dark)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={17} strokeWidth={2.2} />
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Latihan Soal Uraian / Esai</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>
                    {totalEssay} soal lengkap dengan kunci & rubrik
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} color="var(--ink-muted)" />
            </button>
          )}
        </main>
      </div>

      <footer className="home-footer">
        <strong>PSAS 1 2025/2026</strong> · SMAN 6 Purworejo · Kelas XII MIPA
      </footer>
    </div>
  );
};
