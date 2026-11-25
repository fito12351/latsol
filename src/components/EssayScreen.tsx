import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { MascotLegs, PeekingMascot } from './Mascot';
import type { EssayProgress, PersistedProgress, SubjectData } from '../types/cbt';

interface EssayScreenProps {
  subject: SubjectData;
  progress: PersistedProgress;
  onBack: () => void;
  onUpdateEssay: (essayId: string, update: Partial<EssayProgress>) => void;
}

export const EssayScreen: React.FC<EssayScreenProps> = ({
  subject,
  progress,
  onBack,
  onUpdateEssay,
}) => {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const essay = subject.essays[index];
  const saved = progress.essayStats[essay.id];
  const isShown = Boolean(revealed[essay.id]);
  const pct = Math.round(((index + 1) / Math.max(1, subject.essays.length)) * 100);

  return (
    <div className="quiz-screen">
      <PeekingMascot mood={saved?.status === 'mastered' ? 'celebrate' : 'happy'} variant="quiz" />

      <header className="quiz-top">
        <div className="quiz-top-row">
          <button type="button" className="back-btn" onClick={onBack}>
            <ChevronLeft size={20} strokeWidth={2.4} />
            <span>Kembali</span>
          </button>
          <span className="timer-pill" style={{ background: subject.accentColor }}>
            Uraian {index + 1}/{subject.essays.length}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <main className="quiz-card-area">
        <div className="stacked-card-outer">
          <article className="question-card">
            <div className="q-meta-row">
              <span className="q-badge">
                {subject.shortName} · URAIAN {essay.number}
              </span>
              {saved?.status === 'mastered' && (
                <span className="status-pill status-mastered">PAHAM</span>
              )}
              {saved?.status === 'review' && (
                <span className="status-pill status-learning">ULANGI</span>
              )}
            </div>

            {essay.passage && (
              <div className="passage-box">
                <div className="passage-header">
                  <span>{essay.passageTitle || 'Kutipan Teks'}</span>
                </div>
                <div className="passage-text expanded">{essay.passage}</div>
              </div>
            )}

            {essay.image && (
              <div className="q-figure-wrap">
                <img
                  src={`.${essay.image}`}
                  alt={essay.imageCaption || `Gambar uraian ${essay.number}`}
                  className="q-figure-img"
                />
              </div>
            )}

            <div className="q-prompt">{essay.prompt}</div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 6 }}>
                Catatan / Jawabanmu (tersimpan otomatis)
              </div>
              <textarea
                className="essay-textarea"
                placeholder="Tulis kerangka jawaban atau perhitunganmu di sini sebelum membuka kunci..."
                value={saved?.draft ?? ''}
                onChange={(e) => onUpdateEssay(essay.id, { draft: e.target.value })}
              />
            </div>

            <button
              type="button"
              className="primary-purple-btn"
              style={{ marginTop: 0, padding: '12px 16px', fontSize: 14.5 }}
              onClick={() => setRevealed((r) => ({ ...r, [essay.id]: !r[essay.id] }))}
            >
              <span>{isShown ? 'Sembunyikan Kunci Jawaban' : 'Lihat Kunci & Pembahasan'}</span>
              {isShown ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {isShown && (
              <div className="explanation-card">
                <div className="explanation-title">Kunci Jawaban & Pembahasan</div>
                <div style={{ whiteSpace: 'pre-line', marginBottom: 8 }}>{essay.modelAnswer}</div>
                <div
                  style={{
                    fontSize: 12.2,
                    color: 'var(--ink-muted)',
                    borderTop: '1px solid rgba(24,24,27,0.12)',
                    paddingTop: 7,
                  }}
                >
                  <strong>Poin penilaian:</strong> {essay.rubric}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    className="action-btn action-btn-sky"
                    style={{ padding: '10px 10px', fontSize: 13 }}
                    onClick={() => onUpdateEssay(essay.id, { status: 'review' })}
                  >
                    Perlu diulang
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn-lime"
                    style={{ padding: '10px 10px', fontSize: 13 }}
                    onClick={() => onUpdateEssay(essay.id, { status: 'mastered' })}
                  >
                    <Check size={15} /> Sudah paham
                  </button>
                </div>
              </div>
            )}
          </article>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 18, marginTop: 2 }}>
          <MascotLegs compact />
        </div>
      </main>

      <footer className="quiz-bottom-bar">
        <button
          type="button"
          className="action-btn action-btn-sky"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          ◁ Sebelumnya
        </button>
        <button
          type="button"
          className="action-btn action-btn-lime"
          onClick={() => {
            if (index < subject.essays.length - 1) setIndex((i) => i + 1);
            else onBack();
          }}
        >
          {index < subject.essays.length - 1 ? 'Lanjut ▷' : 'Selesai ▷'}
        </button>
      </footer>
    </div>
  );
};
