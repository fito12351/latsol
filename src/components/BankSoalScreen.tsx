import React, { useMemo, useState } from 'react';
import { ChevronLeft, Search, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { PeekingMascot } from './Mascot';
import type { MCQuestion, PersistedProgress, SubjectData } from '../types/cbt';

interface BankSoalScreenProps {
  subjects: SubjectData[];
  progress: PersistedProgress;
  initialFilter: 'all' | 'learning' | 'mastered';
  onBack: () => void;
  onPracticeList: (title: string, questions: MCQuestion[], accentColor: string) => void;
}

export const BankSoalScreen: React.FC<BankSoalScreenProps> = ({
  subjects,
  progress,
  initialFilter,
  onBack,
  onPracticeList,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>(
    initialFilter
  );
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(40);

  const flatItems = useMemo(() => {
    return subjects.flatMap((subject) =>
      subject.questions.map((question) => {
        const st = progress.questionStats[question.id];
        const status: 'new' | 'learning' | 'mastered' = st ? st.mastery : 'new';
        return { subject, question, status };
      })
    );
  }, [subjects, progress.questionStats]);

  const counts = useMemo(() => {
    let newCount = 0;
    let learningCount = 0;
    let masteredCount = 0;
    for (const item of flatItems) {
      if (subjectFilter !== 'all' && item.subject.id !== subjectFilter) continue;
      if (item.status === 'new') newCount++;
      else if (item.status === 'learning') learningCount++;
      else masteredCount++;
    }
    return {
      all: newCount + learningCount + masteredCount,
      new: newCount,
      learning: learningCount,
      mastered: masteredCount,
    };
  }, [flatItems, subjectFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flatItems.filter((item) => {
      if (subjectFilter !== 'all' && item.subject.id !== subjectFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (q) {
        const hay = `${item.subject.name} ${item.question.prompt} ${item.question.topic ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [flatItems, subjectFilter, statusFilter, query]);

  const handleDrillFiltered = () => {
    const qs = filtered.slice(0, 30).map((f) => f.question);
    if (qs.length === 0) return;
    const label =
      statusFilter === 'learning'
        ? 'Ulang Soal Sulit'
        : statusFilter === 'mastered'
        ? 'Review Dikuasai'
        : 'Latihan Bank Soal';
    onPracticeList(label, qs, '#A1D7F4');
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
        <h1 className="page-title">Bank Soal</h1>

        {/* Search bar (Worly My Words style) */}
        <div className="search-box">
          <Search size={17} color="var(--ink-muted)" />
          <input
            type="text"
            placeholder="Cari soal, materi, atau mapel..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleLimit(40);
            }}
          />
        </div>

        {/* Status Filter Pills */}
        <div className="filter-row">
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Semua ({counts.all})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'new' ? 'active' : ''}`}
            onClick={() => setStatusFilter('new')}
          >
            Baru ({counts.new})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'learning' ? 'active' : ''}`}
            onClick={() => setStatusFilter('learning')}
          >
            Diulang ({counts.learning})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'mastered' ? 'active-lime' : ''}`}
            onClick={() => setStatusFilter('mastered')}
          >
            Dikuasai ({counts.mastered})
          </button>
        </div>

        {/* Subject horizontal chips */}
        <div className="filter-row" style={{ marginTop: -4 }}>
          <button
            type="button"
            className={`filter-pill ${subjectFilter === 'all' ? 'active-purple' : ''}`}
            onClick={() => setSubjectFilter('all')}
          >
            Semua Mapel
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`filter-pill ${subjectFilter === s.id ? 'active-purple' : ''}`}
              onClick={() => setSubjectFilter(s.id)}
            >
              {s.shortName}
            </button>
          ))}
        </div>

        {/* Quick drill button */}
        {filtered.length > 0 && (
          <button
            type="button"
            className="primary-purple-btn"
            style={{ marginTop: 0, marginBottom: 14, padding: '13px 16px', fontSize: 15 }}
            onClick={handleDrillFiltered}
          >
            <span>
              {filtered.length > 30
                ? 'Latih 30 soal teratas'
                : `Latih ${filtered.length} soal ini`}
            </span>
            <Play size={17} fill="currentColor" />
          </button>
        )}

        {/* Question Rows */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--line)',
              borderRadius: 16,
              padding: 24,
              textAlign: 'center',
              color: 'var(--ink-muted)',
              fontSize: 14,
            }}
          >
            Belum ada soal di filter ini.
          </div>
        ) : (
          <div className="card-stack">
            {filtered.slice(0, visibleLimit).map(({ subject, question, status }) => {
              const isOpen = expandedId === question.id;
              const ansOpt = question.options.find((o) => o.key === question.answer);

              return (
                <div
                  key={question.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--line)',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '13px 14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 10,
                      textAlign: 'left',
                    }}
                    onClick={() => setExpandedId(isOpen ? null : question.id)}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: 'var(--ink-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: 4,
                        }}
                      >
                        {subject.name} · No. {question.number}
                        {question.topic ? ` · ${question.topic}` : ''}
                      </div>
                      <div
                        style={{
                          fontSize: 13.8,
                          fontWeight: 600,
                          lineHeight: 1.42,
                          display: '-webkit-box',
                          WebkitLineClamp: isOpen ? 99 : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {question.prompt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span
                        className={`status-pill ${
                          status === 'mastered'
                            ? 'status-mastered'
                            : status === 'learning'
                            ? 'status-learning'
                            : 'status-new'
                        }`}
                      >
                        {status === 'mastered' ? 'PAHAM' : status === 'learning' ? 'ULANG' : 'BARU'}
                      </span>
                      {isOpen ? <ChevronUp size={16} color="var(--ink-muted)" /> : <ChevronDown size={16} color="var(--ink-muted)" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        borderTop: '1px solid var(--line)',
                        padding: '12px 14px 14px',
                        background: 'var(--bg-paper)',
                        fontSize: 13.2,
                        lineHeight: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {question.image && (
                        <img
                          src={`.${question.image}`}
                          alt={`Gambar soal ${question.number}`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: 180,
                            objectFit: 'contain',
                            background: '#fff',
                            padding: 6,
                            borderRadius: 10,
                            border: '1px solid var(--line)',
                          }}
                        />
                      )}
                      <div>
                        <strong>Kunci ({question.answer}):</strong> {ansOpt?.text}
                      </div>
                      <div style={{ color: 'var(--ink-muted)' }}>
                        <strong style={{ color: 'var(--ink)' }}>Pembahasan:</strong>{' '}
                        {question.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length > visibleLimit && (
              <button
                type="button"
                className="action-btn action-btn-sky"
                onClick={() => setVisibleLimit((v) => v + 40)}
              >
                Tampilkan lebih banyak ({filtered.length - visibleLimit} tersisa)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
