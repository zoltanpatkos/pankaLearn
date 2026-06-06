import type { JSX } from 'react'

export function PankaAvatar(): JSX.Element {
  return (
    <svg viewBox="0 0 130 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Hair back */}
      <path d="M28 58 Q20 108 22 172 Q36 184 46 168 Q50 118 50 58" fill="#92400e" />
      <path d="M102 58 Q110 108 108 172 Q94 184 84 168 Q80 118 80 58" fill="#7c2d12" />

      {/* Legs */}
      <rect x="44" y="210" width="20" height="44" rx="10" fill="#fde68a" />
      <rect x="66" y="210" width="20" height="44" rx="10" fill="#fde68a" />

      {/* Shoes */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#7c3aed" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#7c3aed" />

      {/* Dress */}
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="#c084fc" />
      {/* Dress collar/yoke */}
      <path d="M48 122 Q65 114 82 122 L80 138 Q65 130 50 138 Z" fill="#e879f9" />
      {/* Dress bow detail */}
      <path d="M60 100 Q65 96 70 100 L68 108 Q65 105 62 108 Z" fill="#f0abfc" />

      {/* Left arm down */}
      <path d="M38 128 Q26 152 23 170" stroke="#fde68a" strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="173" r="9" fill="#fde68a" />

      {/* Right arm raised — waving */}
      <path d="M92 128 Q110 106 116 84" stroke="#fde68a" strokeWidth="15" fill="none" strokeLinecap="round" />
      {/* Waving hand */}
      <circle cx="117" cy="80" r="11" fill="#fde68a" />
      {/* Fingers */}
      <path d="M111 73 Q108 65 112 60" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="57" y="87" width="16" height="16" rx="6" fill="#fde68a" />

      {/* Head */}
      <circle cx="65" cy="58" r="38" fill="#fde68a" />

      {/* Hair front */}
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />

      {/* Eyes */}
      <circle cx="52" cy="56" r="9" fill="white" />
      <circle cx="78" cy="56" r="9" fill="white" />
      <circle cx="54" cy="57" r="5.5" fill="#1c1917" />
      <circle cx="80" cy="57" r="5.5" fill="#1c1917" />
      <circle cx="56" cy="55" r="2" fill="white" />
      <circle cx="82" cy="55" r="2" fill="white" />

      {/* Cheeks */}
      <circle cx="42" cy="66" r="9" fill="#fca5a5" opacity="0.4" />
      <circle cx="88" cy="66" r="9" fill="#fca5a5" opacity="0.4" />

      {/* Smile */}
      <path d="M52 70 Q65 80 78 70" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Purple bow (masni) */}
      <polygon points="44,22 56,32 44,42" fill="#7c3aed" />
      <polygon points="86,22 74,32 86,42" fill="#6d28d9" />
      <circle cx="65" cy="32" r="9" fill="#9333ea" />
      <circle cx="65" cy="32" r="4" fill="#a855f7" />
    </svg>
  )
}
