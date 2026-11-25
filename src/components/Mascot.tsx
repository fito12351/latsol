import React from 'react';

/**
 * Giant purple blob mascot forming the curved top-left hero backdrop on the Dashboard,
 * gripping the Mint Total card with one hand and waving with the other — faithful to Worly.
 */
export const DashboardMascotHero: React.FC = () => (
  <svg
    viewBox="0 0 420 265"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 265,
      pointerEvents: 'none',
      zIndex: 1,
    }}
    aria-hidden="true"
  >
    {/* Oversized purple blob dome */}
    <ellipse cx="148" cy="94" rx="206" ry="158" fill="#654CE5" />

    {/* Expressive tall white oval eyes */}
    <ellipse cx="212" cy="112" rx="14" ry="20" fill="#FFFFFF" />
    <ellipse cx="238" cy="116" rx="14" ry="20" fill="#FFFFFF" />
    {/* Pupils looking cheerfully slightly down toward cards */}
    <circle cx="214" cy="115" r="6" fill="#18181B" />
    <circle cx="239" cy="119" r="6" fill="#18181B" />
    <circle cx="212" cy="112" r="2" fill="#FFFFFF" />
    <circle cx="237" cy="116" r="2" fill="#FFFFFF" />

    {/* Playful curved smile */}
    <path
      d="M204 148C210 160 227 161 235 151"
      stroke="#18181B"
      strokeWidth="6.5"
      strokeLinecap="round"
    />

    {/* Left stick arm reaching down to grip the top of the Mint card */}
    <path
      d="M148 148C105 140 72 154 66 196"
      stroke="#18181B"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    {/* 3-fingered gripping hand */}
    <path
      d="M55 190C59 198 63 200 66 196M66 196C68 202 72 203 76 198M66 196C62 204 66 208 71 205"
      stroke="#18181B"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Right stick arm waving cheerfully */}
    <path
      d="M276 164C308 171 334 156 346 126"
      stroke="#18181B"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    {/* Waving 3-fingered hand */}
    <path
      d="M346 126L337 114M346 126L349 111M346 126L359 120"
      stroke="#18181B"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Signature L-shaped stick legs ("J L") standing right beneath the main purple button or stacked quiz card.
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
    {/* Left leg pointing left */}
    <path
      d="M34 0V36H12"
      stroke="#18181B"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right leg pointing right */}
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
    {/* Running arms */}
    <path d="M16 24L9 19" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M41 22L48 16" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" />
    {/* Running legs */}
    <path d="M24 37L17 45L12 43" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 36L40 44L46 42" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Peeking purple mascot on sub-screens (Subjects, Bank Soal, Quiz, Result).
 */
export const PeekingMascot: React.FC<{
  mood?: 'happy' | 'thinking' | 'celebrate' | 'encourage';
  variant?: 'list' | 'quiz' | 'result';
}> = ({ mood = 'happy', variant = 'list' }) => {
  const height = variant === 'quiz' ? 210 : 180;
  return (
    <svg
      viewBox="0 0 420 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {/* Purple blob peeking from upper-right */}
      <ellipse cx="315" cy="86" rx="146" ry="122" fill="#654CE5" />

      {/* Eyes */}
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

      {/* Mouth */}
      {mood === 'encourage' ? (
        <path d="M262 114C268 110 278 110 284 114" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
      ) : mood === 'thinking' ? (
        <ellipse cx="274" cy="113" rx="6" ry="4.5" fill="#18181B" />
      ) : (
        <path d="M258 110C264 121 280 122 287 112" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
      )}

      {/* Left arm waving cleanly above headings */}
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

      {/* Right arm gripping edge */}
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
  );
};
