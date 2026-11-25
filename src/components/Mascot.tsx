import React from 'react';

/**
 * Giant purple blob mascot forming the curved top-left hero backdrop on Mobile Dashboard.
 */
export const DashboardMascotHero: React.FC = () => (
  <div className="home-mobile-hero-bg" aria-hidden="true">
    <svg
      viewBox="0 0 420 265"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        maxWidth: 520,
        height: 265,
        display: 'block',
      }}
    >
      <ellipse cx="148" cy="94" rx="206" ry="158" fill="#654CE5" />
      <ellipse cx="212" cy="112" rx="14" ry="20" fill="#FFFFFF" />
      <ellipse cx="238" cy="116" rx="14" ry="20" fill="#FFFFFF" />
      <circle cx="214" cy="115" r="6" fill="#18181B" />
      <circle cx="239" cy="119" r="6" fill="#18181B" />
      <circle cx="212" cy="112" r="2" fill="#FFFFFF" />
      <circle cx="237" cy="116" r="2" fill="#FFFFFF" />
      <path
        d="M204 148C210 160 227 161 235 151"
        stroke="#18181B"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M148 148C105 140 72 154 66 196"
        stroke="#18181B"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M55 190C59 198 63 200 66 196M66 196C68 202 72 203 76 198M66 196C62 204 66 208 71 205"
        stroke="#18181B"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M276 164C308 171 334 156 346 126"
        stroke="#18181B"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M346 126L337 114M346 126L349 111M346 126L359 120"
        stroke="#18181B"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

/**
 * Centered cheerful mascot face + waving arms for the Desktop/Tablet Hero Panel & Sidebar.
 */
export const DesktopMascotFigure: React.FC<{
  mood?: 'happy' | 'thinking' | 'celebrate' | 'encourage';
  size?: number;
}> = ({ mood = 'happy', size = 160 }) => (
  <svg
    width={size}
    height={Math.round(size * 0.72)}
    viewBox="0 0 240 172"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Subtle lighter purple aura */}
    <circle cx="120" cy="88" r="68" fill="#7862EE" />

    {/* Tall white oval eyes */}
    <ellipse cx="105" cy="76" rx="14" ry="21" fill="#FFFFFF" />
    <ellipse cx="135" cy="76" rx="14" ry="21" fill="#FFFFFF" />

    {mood === 'celebrate' ? (
      <>
        <path d="M98 76C101 69 109 69 112 76" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M128 76C131 69 139 69 142 76" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx={mood === 'thinking' ? 108 : 107} cy={mood === 'thinking' ? 72 : 79} r="6.2" fill="#18181B" />
        <circle cx={mood === 'thinking' ? 138 : 137} cy={mood === 'thinking' ? 72 : 79} r="6.2" fill="#18181B" />
        <circle cx={mood === 'thinking' ? 106 : 105} cy={mood === 'thinking' ? 69 : 76} r="2.2" fill="#FFFFFF" />
        <circle cx={mood === 'thinking' ? 136 : 135} cy={mood === 'thinking' ? 69 : 76} r="2.2" fill="#FFFFFF" />
      </>
    )}

    {/* Mouth */}
    {mood === 'encourage' ? (
      <path d="M106 116C113 111 127 111 134 116" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />
    ) : mood === 'thinking' ? (
      <ellipse cx="120" cy="114" rx="7" ry="5" fill="#18181B" />
    ) : (
      <path d="M103 110C111 124 129 124 137 110" stroke="#18181B" strokeWidth="6.5" strokeLinecap="round" />
    )}

    {/* Left waving arm */}
    <path d="M62 98C38 96 24 80 18 56" stroke="#18181B" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M18 56L10 45M18 56L21 42M18 56L30 49" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />

    {/* Right waving arm */}
    <path d="M178 98C202 96 216 80 222 56" stroke="#18181B" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M222 56L230 45M222 56L219 42M222 56L210 49" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
  </svg>
);

/**
 * Signature L-shaped stick legs ("J L") standing right beneath the main purple button or mascot card.
 */
export const MascotLegs: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <svg
    width={compact ? 84 : 96}
    height={compact ? 34 : 44}
    viewBox="0 0 96 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M34 0V36H12"
      stroke="#18181B"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62 0V36H84"
      stroke="#18181B"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Tiny running mascot doodle in the corner of the pink "Mulai CBT" bento card.
 */
export const MiniRunningMascot: React.FC = () => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="29" cy="24" r="13" fill="#F8F6EE" stroke="#18181B" strokeWidth="2.5" />
    <ellipse cx="26" cy="22" rx="2.6" ry="4" fill="#18181B" />
    <ellipse cx="33" cy="22" rx="2.6" ry="4" fill="#18181B" />
    <path d="M26 29C28 31.5 31 31.5 33 29" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 24L9 19" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M41 22L48 16" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M24 37L17 45L12 43" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 36L40 44L46 42" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Peeking purple mascot on sub-screens (Subjects, Bank Soal, Quiz mobile, Result).
 */
export const PeekingMascot: React.FC<{
  mood?: 'happy' | 'thinking' | 'celebrate' | 'encourage';
  variant?: 'list' | 'quiz' | 'result';
}> = ({ mood = 'happy', variant = 'list' }) => {
  const height = variant === 'quiz' ? 210 : 180;
  return (
    <div className="peeking-mascot-anchor" aria-hidden="true">
      <svg
        viewBox="0 0 420 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height,
          display: 'block',
        }}
      >
        <ellipse cx="315" cy="86" rx="146" ry="122" fill="#654CE5" />
        <ellipse cx="264" cy="78" rx="12.5" ry="18" fill="#FFFFFF" />
        <ellipse cx="289" cy="82" rx="12.5" ry="18" fill="#FFFFFF" />

        {mood === 'celebrate' ? (
          <>
            <path d="M258 78C261 72 267 72 270 78" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
            <path d="M283 82C286 76 292 76 295 82" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={mood === 'thinking' ? 267 : 265} cy={mood === 'thinking' ? 75 : 81} r="5.5" fill="#18181B" />
            <circle cx={mood === 'thinking' ? 292 : 290} cy={mood === 'thinking' ? 79 : 85} r="5.5" fill="#18181B" />
          </>
        )}

        {mood === 'encourage' ? (
          <path d="M262 114C268 110 278 110 284 114" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <ellipse cx="274" cy="113" rx="6" ry="4.5" fill="#18181B" />
        ) : (
          <path d="M258 110C264 121 280 122 287 112" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
        )}

        <path
          d="M202 88C178 86 160 72 150 52"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M150 52L141 42M150 52L152 39M150 52L161 45"
          stroke="#18181B"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="M342 122C368 128 386 142 388 168"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M379 166C382 172 386 173 388 168M388 168C391 174 396 174 398 168"
          stroke="#18181B"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
