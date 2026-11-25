import React, { useState } from 'react';
import { ChevronLeft, RotateCcw, Home, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { PeekingMascot } from './Mascot';
import type { QuizFinishedPayload } from './QuizScreen';

interface ResultScreenProps {
  result: QuizFinishedPayload;
  onHome: () => void;
  onRetry: () => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}d` : `${s} detik`;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onHome, onRetry }) => {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const total = result.questions.length;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const q of result.questions) {
    const ans = result.answers[q.id];
    if (!ans) skipped++;
    else if (ans === q.answer) correct++;
    else wrong++;
  }

  const score = Math.round((correct / Math.max(1, total)) * 100);
  const mood = score >= 75 ? 'celebrate' : score >= 50 ? 'happy' : 'encourage';

  const visibleQuestions = result.questions.filter((q) => {
    const ans = result.answers[q.id];
    const isCorrect = ans === q.answer;
    if (filter === 'wrong') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <PeekingMascot mood={mood} variant="result" />

      <header className="sub-header">
        <button type="button" className="back-btn" onClick={onHome}>
          <ChevronLeft size={20} strokeWidth={2.4} />
          <span>Beranda</span>
        </button>
      </header>

      <div className="screen-body">
        <span
          className="status-pill"
          style={{
            background: result.subject.accentColor,
            color: 'var(--ink)',
            alignSelf: 'flex-start',
            marginBottom: 6,
          }}
        >
          {result.subject.name} · {result.mode === 'cbt' ? 'CBT' : 'Santai'}
        </span>

        <h1 className="page-title" style={{ marginTop: 2, marginBottom: 12 }}>
          {score >= 85
            ? 'Mantap sekali!'
            : score >= 70
            ? 'Hasil bagus!'
            : 'Yuk ulang lagi!'}
        </h1>

        {/* Score Summary Bento */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            className="bento-card"
            style={{
              background: score >= 70 ? 'var(--lime)' : 'var(--sky)',
              minHeight: 126,
            }}
          >
            <span className="bento-label">Nilai Akhir</span>
            <div className="bento-kpi" style={{ fontSize: 48, margin: '2px 0' }}>
              {score}
            </div>
            <span className="bento-pill" style={{ alignSelf: 'flex-start' }}>
              {formatDuration(result.durationSeconds)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: 'var(--mint)',
                borderRadius: 15,
                padding: '10px 13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>Benar</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{correct}</span>
            </div>
            <div
              style={{
                flex: 1,
                background: 'var(--pink)',
                borderRadius: 15,
                padding: '10px 13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>Salah / Kosong</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{wrong + skipped}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <button type="button" className="action-btn action-btn-sky" onClick={onRetry}>
            <RotateCcw size={16} strokeWidth={2.5} /> Ulangi
          </button>
          <button type="button" className="action-btn action-btn-purple" onClick={onHome}>
            <Home size={16} strokeWidth={2.5} /> Beranda
          </button>
        </div>

        {/* Pembahasan Header & Filter */}
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
          Pembahasan Soal
        </div>

        <div className="filter-row">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Semua ({total})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'wrong' ? 'active' : ''}`}
            onClick={() => setFilter('wrong')}
          >
            Salah/Kosong ({wrong + skipped})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'correct' ? 'active-lime' : ''}`}
            onClick={() => setFilter('correct')}
          >
            Benar ({correct})
          </button>
        </div>

        {/* Review Cards */}
        <div className="card-stack">
          {visibleQuestions.map((q) => {
            const userAns = result.answers[q.id];
            const isCorrect = userAns === q.answer;
            const correctOpt = q.options.find((o) => o.key === q.answer);
            const userOpt = q.options.find((o) => o.key === userAns);

            return (
              <div
                key={q.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 16,
                  padding: '14px 15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="q-badge">NO. {q.number}</span>
                  {isCorrect ? (
                    <span
                      className="status-pill status-mastered"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <CheckCircle2 size={12} /> BENAR
                    </span>
                  ) : userAns ? (
                    <span
                      className="status-pill"
                      style={{
                        background: 'var(--coral)',
                        color: 'var(--ink)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <XCircle size={12} /> SALAH
                    </span>
                  ) : (
                    <span
                      className="status-pill status-new"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <MinusCircle size={12} /> KOSONG
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.48, whiteSpace: 'pre-line' }}>
                  {q.prompt}
                </div>

                <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {userOpt && !isCorrect && (
                    <div style={{ color: '#9e241b', fontWeight: 600 }}>
                      Jawabanmu: {userOpt.key}. {userOpt.text}
                    </div>
                  )}
                  <div style={{ color: '#1b5e20', fontWeight: 700 }}>
                    Kunci: {correctOpt?.key}. {correctOpt?.text}
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-paper)',
                    borderRadius: 11,
                    padding: '9px 11px',
                    fontSize: 12.8,
                    lineHeight: 1.5,
                    color: 'var(--ink)',
                  }}
                >
                  <strong>Pembahasan:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
