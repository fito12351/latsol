import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  Clock,
  Flag,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
} from 'lucide-react';
import { MascotLegs, PeekingMascot } from './Mascot';
import { hapticError, hapticSuccess, hapticTap } from '../utils/haptics';
import type { MCQuestion, OptionKey, SubjectData } from '../types/cbt';

export interface QuizFinishedPayload {
  subject: SubjectData;
  mode: 'cbt' | 'practice';
  questions: MCQuestion[];
  answers: Record<string, OptionKey>;
  flagged: Record<string, boolean>;
  durationSeconds: number;
}

interface QuizScreenProps {
  subject: SubjectData;
  mode: 'cbt' | 'practice';
  questions: MCQuestion[];
  onExit: () => void;
  onFinish: (payload: QuizFinishedPayload) => void;
  onPracticeAnswer?: (questionId: string, isCorrect: boolean) => void;
}

function formatSeconds(sec: number): string {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rem = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  subject,
  mode,
  questions,
  onExit,
  onFinish,
  onPracticeAnswer,
}) => {
  const totalSecondsAllowed = Math.max(
    5 * 60,
    Math.round((subject.durationMinutes * 60 * questions.length) / Math.max(1, subject.questions.length))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(totalSecondsAllowed);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [expandedPassage, setExpandedPassage] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  const currentQ = questions[currentIndex];
  const selectedKey = answers[currentQ.id];
  const isFlagged = Boolean(flagged[currentQ.id]);
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  useEffect(() => {
    setExpandedPassage(false);
  }, [currentIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((e) => e + 1);
      if (mode === 'cbt') {
        setSecondsLeft((s) => {
          if (s <= 1) {
            window.clearInterval(timer);
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode === 'cbt' && secondsLeft === 0) {
      onFinish({
        subject,
        mode,
        questions,
        answers,
        flagged,
        durationSeconds: elapsedSeconds,
      });
    }
  }, [mode, secondsLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const mascotMood = useMemo(() => {
    if (mode === 'practice' && selectedKey) {
      return selectedKey === currentQ.answer ? 'celebrate' : 'encourage';
    }
    if (isFlagged) return 'thinking';
    return 'happy';
  }, [mode, selectedKey, currentQ.answer, isFlagged]);

  const handleSelectOption = (key: OptionKey) => {
    if (mode === 'practice' && selectedKey) {
      // Already answered in practice mode
      return;
    }
    const nextAnswers = { ...answers, [currentQ.id]: key };
    setAnswers(nextAnswers);
    if (mode === 'practice') {
      const ok = key === currentQ.answer;
      if (ok) hapticSuccess();
      else hapticError();
      onPracticeAnswer?.(currentQ.id, ok);
    } else {
      hapticTap();
    }
  };

  const toggleFlag = () => {
    hapticTap();
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const submitNow = () => {
    onFinish({
      subject,
      mode,
      questions,
      answers,
      flagged,
      durationSeconds: elapsedSeconds,
    });
  };

  const handleNextOrFinish = () => {
    hapticTap();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (mode === 'cbt' && answeredCount < questions.length) {
        setShowConfirmFinish(true);
      } else {
        submitNow();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      hapticTap();
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="quiz-screen">
      <PeekingMascot mood={mascotMood} variant="quiz" />

      {/* Top Navigation & Slim Lime Progress Bar */}
      <header className="quiz-top">
        <div className="quiz-top-row">
          <button type="button" className="back-btn" onClick={onExit}>
            <ChevronLeft size={20} strokeWidth={2.4} />
            <span>Keluar</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {mode === 'cbt' ? (
              <span className={`timer-pill ${secondsLeft < 300 ? 'urgent' : ''}`}>
                <Clock size={14} strokeWidth={2.3} />
                {formatSeconds(secondsLeft)}
              </span>
            ) : (
              <span className="timer-pill" style={{ background: 'var(--sky-soft)' }}>
                Santai
              </span>
            )}
            <button
              type="button"
              className="map-trigger-btn"
              onClick={() => setShowMap(true)}
            >
              <LayoutGrid size={14} strokeWidth={2.3} />
              <span>
                {currentIndex + 1}/{questions.length}
              </span>
            </button>
          </div>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      {/* Stacked Cream Question Card */}
      <main className="quiz-card-area">
        <div className="stacked-card-outer">
          <article className="question-card">
            <div className="q-meta-row">
              <span className="q-badge">
                {subject.shortName} · NO. {currentQ.number}
              </span>

              <button
                type="button"
                className={`flag-btn ${isFlagged ? 'flagged' : ''}`}
                onClick={toggleFlag}
              >
                <Flag size={13} strokeWidth={2.4} />
                <span>{isFlagged ? 'Ragu' : 'Tandai'}</span>
              </button>
            </div>

            {/* Optional Reading Passage */}
            {currentQ.passage && (
              <div className="passage-box">
                <div className="passage-header">
                  <span>{currentQ.passageTitle || 'Kutipan Teks'}</span>
                  <button
                    type="button"
                    onClick={() => setExpandedPassage((v) => !v)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      color: 'var(--purple-dark)',
                      fontWeight: 700,
                      fontSize: 11.5,
                    }}
                  >
                    {expandedPassage ? (
                      <>
                        Ringkas <ChevronUp size={13} />
                      </>
                    ) : (
                      <>
                        Perluas <ChevronDown size={13} />
                      </>
                    )}
                  </button>
                </div>
                <div className={`passage-text ${expandedPassage ? 'expanded' : ''}`}>
                  {currentQ.passage}
                </div>
              </div>
            )}

            {/* Optional Figure Image */}
            {currentQ.image && (
              <div className="q-figure-wrap">
                <img
                  src={`.${currentQ.image}`}
                  alt={currentQ.imageCaption || `Gambar soal nomor ${currentQ.number}`}
                  className="q-figure-img"
                  onClick={() => setZoomedImg(`.${currentQ.image}`)}
                />
                <span className="q-figure-hint">
                  <ZoomIn size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  Ketuk gambar untuk perbesar
                </span>
              </div>
            )}

            {/* Optional Data Table */}
            {currentQ.table && (
              <div className="q-table-wrap">
                <table className="q-table">
                  <thead>
                    <tr>
                      {currentQ.table.headers.map((h, idx) => (
                        <th key={idx}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQ.table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Question Prompt */}
            <div className="q-prompt">{currentQ.prompt}</div>

            {/* Options A-E */}
            <div className="options-list">
              {currentQ.options.map((opt) => {
                let stateClass = '';
                if (mode === 'cbt') {
                  if (selectedKey === opt.key) stateClass = 'selected';
                } else if (selectedKey) {
                  if (opt.key === currentQ.answer) stateClass = 'correct';
                  else if (opt.key === selectedKey) stateClass = 'wrong';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={`option-btn ${stateClass}`}
                    onClick={() => handleSelectOption(opt.key)}
                  >
                    <span className="option-key">{opt.key}</span>
                    <span className="option-text">
                      {opt.image ? (
                        <img
                          src={`.${opt.image}`}
                          alt={`Pilihan ${opt.key}`}
                          style={{ maxHeight: 42, display: 'block', marginBottom: opt.text ? 4 : 0 }}
                        />
                      ) : null}
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation in Practice Mode */}
            {mode === 'practice' && selectedKey && (
              <div
                className={`explanation-card ${
                  selectedKey === currentQ.answer ? '' : 'wrong-exp'
                }`}
              >
                <div className="explanation-title">
                  {selectedKey === currentQ.answer ? (
                    <>
                      <CheckCircle2 size={15} /> Jawaban Tepat! ({currentQ.answer})
                    </>
                  ) : (
                    <>
                      <XCircle size={15} /> Kunci Jawaban: {currentQ.answer}
                    </>
                  )}
                </div>
                <div>{currentQ.explanation}</div>
              </div>
            )}
          </article>
        </div>

        {/* Mascot Legs under the stacked card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 18, marginTop: 2 }}>
          <MascotLegs compact />
        </div>
      </main>

      {/* Dual Chunky Pastel Action Bar (Worly Learn / Know) */}
      <footer className="quiz-bottom-bar">
        <button
          type="button"
          className="action-btn action-btn-sky"
          disabled={currentIndex === 0}
          onClick={handlePrev}
        >
          <span>◁ Sebelumnya</span>
        </button>

        <button
          type="button"
          className="action-btn action-btn-lime"
          onClick={handleNextOrFinish}
        >
          <span>
            {currentIndex === questions.length - 1 ? 'Selesai ▷' : 'Lanjut ▷'}
          </span>
        </button>
      </footer>

      {/* Question Number Map Bottom Sheet */}
      {showMap && (
        <div className="sheet-backdrop" onClick={() => setShowMap(false)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Navigasi Nomor</h3>
                <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 2 }}>
                  Terjawab {answeredCount} dari {questions.length} soal
                </div>
              </div>
              <button type="button" onClick={() => setShowMap(false)} aria-label="Tutup">
                <X size={20} />
              </button>
            </div>

            <div className="num-grid">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]);
                const isF = Boolean(flagged[q.id]);
                const isCurr = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`num-cell ${isF ? 'flagged' : isAnswered ? 'answered' : ''} ${
                      isCurr ? 'current' : ''
                    }`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMap(false);
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                fontSize: 11.5,
                color: 'var(--ink-muted)',
                justifyContent: 'center',
              }}
            >
              <span>🟩 Terjawab</span>
              <span>🟨 Ragu-ragu</span>
              <span>⬜ Belum</span>
            </div>

            <button
              type="button"
              className="primary-purple-btn"
              style={{ justifyContent: 'center', marginTop: 2 }}
              onClick={() => {
                setShowMap(false);
                setShowConfirmFinish(true);
              }}
            >
              Kumpulkan & Lihat Skor
            </button>
          </div>
        </div>
      )}

      {/* Confirm Submit Dialog */}
      {showConfirmFinish && (
        <div className="sheet-backdrop" onClick={() => setShowConfirmFinish(false)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Selesaikan sesi ini?</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              Kamu sudah menjawab <strong>{answeredCount}</strong> dari{' '}
              <strong>{questions.length}</strong> soal.
              {answeredCount < questions.length
                ? ` Masih ada ${questions.length - answeredCount} soal yang belum diisi.`
                : ' Semua soal sudah terisi!'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                className="action-btn action-btn-sky"
                onClick={() => setShowConfirmFinish(false)}
              >
                Cek lagi
              </button>
              <button
                type="button"
                className="action-btn action-btn-purple"
                onClick={submitNow}
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Figure Lightbox */}
      {zoomedImg && (
        <div className="lightbox-backdrop" onClick={() => setZoomedImg(null)}>
          <img src={zoomedImg} alt="Perbesar gambar soal" className="lightbox-img" />
          <button
            type="button"
            style={{
              marginTop: 14,
              background: '#FFFFFF',
              color: '#18181B',
              padding: '9px 18px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13.5,
            }}
            onClick={() => setZoomedImg(null)}
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
};
