// The dashboard mascot: a little owl in a mortarboard and round glasses,
// clutching a history book. Purely decorative. The tassel and book cover
// pick up the site theme's accent colour.
export default function ProfessorOwl({ size = 96, className = '' }) {
  return (
    <svg
      className={`professor-owl ${className}`}
      width={size}
      height={size * (130 / 120)}
      viewBox="0 0 120 130"
      aria-hidden="true"
    >
      {/* feet */}
      <path d="M44 121 l-5 6 M48 122 v6 M52 121 l5 6" stroke="#e8902c" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 121 l-5 6 M72 122 v6 M76 121 l5 6" stroke="#e8902c" strokeWidth="3" strokeLinecap="round" />

      {/* body */}
      <ellipse cx="60" cy="88" rx="38" ry="36" fill="#8b5a2b" />
      <ellipse cx="60" cy="96" rx="25" ry="25" fill="#f0d6a8" />
      {/* belly feathers */}
      <path d="M45 88 q4 5 8 0 q4 5 8 0 q4 5 8 0 M41 99 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 M47 110 q4 5 8 0 q4 5 8 0 q4 5 8 0"
        fill="none" stroke="#c9a46e" strokeWidth="2" strokeLinecap="round" />

      {/* wings */}
      <path d="M24 78 q-10 22 4 40 q10 -16 6 -38 z" fill="#6e4420" />
      <path d="M96 78 q10 22 -4 40 q-10 -16 -6 -38 z" fill="#6e4420" />

      {/* history book held in front */}
      <g transform="rotate(-8 60 112)">
        <rect x="40" y="104" width="40" height="16" rx="2.5" fill="var(--yellow)" stroke="#3b2a17" strokeWidth="1.5" />
        <rect x="42" y="106" width="36" height="12" rx="1.5" fill="none" stroke="#3b2a17" strokeOpacity="0.35" />
        <path d="M60 104 v16" stroke="#3b2a17" strokeWidth="1.5" />
        <path d="M48 111 h7 M65 111 h7" stroke="#3b2a17" strokeWidth="1.3" strokeLinecap="round" />
      </g>

      {/* head */}
      <ellipse cx="60" cy="52" rx="36" ry="31" fill="#8b5a2b" />
      {/* ear tufts */}
      <path d="M28 34 l-4 -16 l16 10 z" fill="#6e4420" />
      <path d="M92 34 l4 -16 l-16 10 z" fill="#6e4420" />

      {/* face discs */}
      <circle cx="45" cy="54" r="16" fill="#f5e6c8" />
      <circle cx="75" cy="54" r="16" fill="#f5e6c8" />

      {/* eyes */}
      <g className="professor-owl-eyes">
        <circle cx="45" cy="54" r="9" fill="#fff" />
        <circle cx="75" cy="54" r="9" fill="#fff" />
        <circle cx="46" cy="55" r="5.5" fill="#2a1c0e" />
        <circle cx="74" cy="55" r="5.5" fill="#2a1c0e" />
        <circle cx="48" cy="53" r="1.8" fill="#fff" />
        <circle cx="76" cy="53" r="1.8" fill="#fff" />
      </g>

      {/* round professor glasses */}
      <circle cx="45" cy="54" r="12" fill="none" stroke="#3b2a17" strokeWidth="2.6" />
      <circle cx="75" cy="54" r="12" fill="none" stroke="#3b2a17" strokeWidth="2.6" />
      <path d="M57 53 q3 -3 6 0" fill="none" stroke="#3b2a17" strokeWidth="2.6" />

      {/* beak */}
      <path d="M55 64 l5 10 l5 -10 q-5 -3 -10 0 z" fill="#f2a03d" stroke="#c97a1e" strokeWidth="1" />

      {/* mortarboard */}
      <path d="M38 26 q22 -8 44 0 v8 q-22 -7 -44 0 z" fill="#2b2238" />
      <path d="M60 4 L102 18 L60 32 L18 18 Z" fill="#3a2f4d" stroke="#2b2238" strokeWidth="1.5" />
      <circle cx="60" cy="18" r="2.6" fill="var(--yellow)" />
      <g className="professor-owl-tassel">
        <path d="M60 18 L96 22 V36" fill="none" stroke="var(--yellow)" strokeWidth="2" />
        <path d="M93 36 h6 l-1 9 h-4 z" fill="var(--yellow)" />
      </g>
    </svg>
  )
}
