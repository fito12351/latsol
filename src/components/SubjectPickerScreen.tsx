import React, { useMemo, useState } from 'react';
import { ChevronLeft, Search, Clock, Shuffle, Play, FileText } from 'lucide-react';
import { PeekingMascot } from './Mascot';
import type { PersistedProgress, SubjectData, SubjectGroup } from '../types/cbt';

export interface StartSessionConfig {
  subject: SubjectData;
  mode: 'cbt' | 'practice';
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  limit: number | 'all';
}

interface SubjectPickerScreenProps {
  subjects: SubjectData[];
  progress: PersistedProgress;
  initialMode?: 'cbt' | 'practice' | 'essay';
  onBack: () => void;
  onStartQuiz: (config: StartSessionConfig) => void;
  onStartEssay: (subject: SubjectData) => void;
}

export const SubjectPickerScreen: React.FC<SubjectPickerScreenProps> = ({
  subjects,
  progress,
  initialMode = 'cbt',
  onBack,
  onStartQuiz,
  onStartEssay,
}) => {
  const [mode, setMode] = useState<'cbt' | 'practice' | 'essay'>(initialMode);
  const [group, setGroup] = useState<'all' | SubjectGroup>('all');
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [limit, setLimit] = useState<number | 'all'>('all');

  const counts = useMemo(() => {
    return {
      all: subjects.length,
      mipa: subjects.filter((s) => s.group === 'mipa').length,
      bahasa: subjects.filter((s) => s.group === 'bahasa').length,
      umum: subjects.filter((s) => s.group === 'umum').length,
    };
  }, [subjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((s) => {
      if (group !== 'all' && s.group !== group) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.shortName.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [subjects, group, query]);

  const getMasteredForSubject = (subject: SubjectData) => {
    let mastered = 0;
    for (const q of subject.questions) {
      if (progress.questionStats[q.id]?.mastery === 'mastered') mastered++;
    }
    return mastered;
  };

  const getBestScore = (subjectId: string) => {
    const scores = progress.history
      .filter((h) => h.subjectId === subjectId)
      .map((h) => h.score);
    return scores.length > 0 ? Math.max(...scores) : null;
  };

  const handleCardClick = (subject: SubjectData) => {
    if (mode === 'essay') {
      onStartEssay(subject);
      return;
    }
    setSelectedSubject(subject);
    setLimit('all');
  };

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <PeekingMascot mood="happy" variant="list" />

      <header className="sub-header">
        <button type="button" className="back-btn" onClick={onBack}>
          <ChevronLeft size={20} strokeWidth={2.4} />
          <span>Kembali</span>
        </button>
      </header>

      <div className="screen-body">
        <h1 className="page-title">Mata Pelajaran</h1>

        {/* Mode Segmented Switch */}
        <div className="mode-tabs" role="tablist">
          <button
            type="button"
            className={`mode-tab ${mode === 'cbt' ? 'active' : ''}`}
            onClick={() => setMode('cbt')}
          >
            Simulasi CBT
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === 'practice' ? 'active' : ''}`}
            onClick={() => setMode('practice')}
          >
            Latihan Santai
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === 'essay' ? 'active' : ''}`}
            onClick={() => setMode('essay')}
          >
            Uraian / Esai
          </button>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <Search size={17} color="var(--ink-muted)" />
          <input
            type="text"
            placeholder="Cari mata pelajaran..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills (Worly style) */}
        <div className="filter-row">
          <button
            type="button"
            className={`filter-pill ${group === 'all' ? 'active' : ''}`}
            onClick={() => setGroup('all')}
          >
            Semua ({counts.all})
          </button>
          <button
            type="button"
            className={`filter-pill ${group === 'mipa' ? 'active' : ''}`}
            onClick={() => setGroup('mipa')}
          >
            MIPA ({counts.mipa})
          </button>
          <button
            type="button"
            className={`filter-pill ${group === 'bahasa' ? 'active' : ''}`}
            onClick={() => setGroup('bahasa')}
          >
            Bahasa ({counts.bahasa})
          </button>
          <button
            type="button"
            className={`filter-pill ${group === 'umum' ? 'active' : ''}`}
            onClick={() => setGroup('umum')}
          >
            Umum ({counts.umum})
          </button>
        </div>

        {/* Subject List */}
        <div className="card-stack">
          {filtered.map((subject) => {
            const mastered = getMasteredForSubject(subject);
            const best = getBestScore(subject.id);
            const essayMastered = subject.essays.filter(
              (e) => progress.essayStats[e.id]?.status === 'mastered'
            ).length;

            return (
              <button
                key={subject.id}
                type="button"
                className="list-card"
                onClick={() => handleCardClick(subject)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    className="subject-dot"
                    style={{ backgroundColor: subject.accentColor }}
                  >
                    {subject.shortName}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 15.5,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {subject.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--ink-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 2,
                      }}
                    >
                      {mode === 'essay' ? (
                        <>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <FileText size={12} /> {subject.essays.length} uraian
                          </span>
                          <span>· {essayMastered} paham</span>
                        </>
                      ) : (
                        <>
                          <span>{subject.questions.length} PG</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Clock size={12} /> {subject.durationMinutes} mnt
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {mode === 'essay' ? (
                    <span className="status-pill status-learning">BUKA</span>
                  ) : best !== null ? (
                    <span className={`status-pill ${best >= 75 ? 'status-mastered' : 'status-learning'}`}>
                      SKOR {best}
                    </span>
                  ) : (
                    <span className="status-pill status-new">
                      {mastered}/{subject.questions.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Setup Bottom Sheet */}
      {selectedSubject && mode !== 'essay' && (
        <div className="sheet-backdrop" onClick={() => setSelectedSubject(null)}>
          <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div>
              <span
                className="status-pill"
                style={{
                  background: selectedSubject.accentColor,
                  color: 'var(--ink)',
                  marginBottom: 8,
                  display: 'inline-block',
                }}
              >
                {mode === 'cbt' ? 'SIMULASI CBT' : 'LATIHAN SANTAI'}
              </span>
              <h2 style={{ margin: '4px 0 4px', fontSize: 22, fontWeight: 800 }}>
                {selectedSubject.name}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-muted)' }}>
                {mode === 'cbt'
                  ? `Timer ${selectedSubject.durationMinutes} menit, navigasi nomor soal & tombol ragu-ragu. Skor dan pembahasan tampil setelah selesai.`
                  : 'Tanpa timer ketat. Jawaban benar/salah dan pembahasan langsung muncul di setiap nomor.'}
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: 'var(--ink-muted)' }}>
                Jumlah Soal
              </div>
              <div className="setup-chip-row">
                {(['all', 10, 20] as const)
                  .filter((opt) => opt === 'all' || opt < selectedSubject.questions.length)
                  .map((opt) => (
                    <button
                      key={String(opt)}
                      type="button"
                      className={`setup-chip ${limit === opt ? 'active' : ''}`}
                      onClick={() => setLimit(opt)}
                    >
                      {opt === 'all' ? `Semua (${selectedSubject.questions.length})` : `${opt} soal`}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: 'var(--ink-muted)' }}>
                Opsi Pengacakan
              </div>
              <div className="setup-chip-row">
                <button
                  type="button"
                  className={`setup-chip ${shuffleQuestions ? 'active' : ''}`}
                  onClick={() => setShuffleQuestions((v) => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Shuffle size={14} /> Acak urutan soal
                </button>
                <button
                  type="button"
                  className={`setup-chip ${shuffleOptions ? 'active' : ''}`}
                  onClick={() => setShuffleOptions((v) => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Shuffle size={14} /> Acak opsi A–E
                </button>
              </div>
            </div>

            <button
              type="button"
              className="primary-purple-btn"
              style={{ marginTop: 4 }}
              onClick={() =>
                onStartQuiz({
                  subject: selectedSubject,
                  mode,
                  shuffleQuestions,
                  shuffleOptions,
                  limit,
                })
              }
            >
              <span>Mulai {mode === 'cbt' ? 'Simulasi CBT' : 'Latihan'}</span>
              <Play size={19} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
