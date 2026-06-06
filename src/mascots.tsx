import type { JSX } from 'react'

export type MascotId = 'balamber' | 'kifli' | 'bolyhos'

export interface Mascot {
  id: MascotId
  name: string
  animal: string
  catchphrase: string
  intro: string
  confirmSpeech: string
  gardenSpeech: string
  cardBg: string
  Illustration: () => JSX.Element
}

function DogIllustration(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Floppy left ear */}
      <ellipse cx="50" cy="85" rx="22" ry="32" fill="#D97706" transform="rotate(-18 50 85)" />
      <ellipse cx="50" cy="87" rx="13" ry="21" fill="#FDE68A" transform="rotate(-18 50 87)" />
      {/* Floppy right ear */}
      <ellipse cx="150" cy="85" rx="22" ry="32" fill="#D97706" transform="rotate(18 150 85)" />
      <ellipse cx="150" cy="87" rx="13" ry="21" fill="#FDE68A" transform="rotate(18 150 87)" />
      {/* Head */}
      <circle cx="100" cy="112" r="74" fill="#F59E0B" />
      {/* Rosy cheeks */}
      <circle cx="65" cy="130" r="18" fill="#FCA5A5" opacity="0.4" />
      <circle cx="135" cy="130" r="18" fill="#FCA5A5" opacity="0.4" />
      {/* White eye areas */}
      <circle cx="76" cy="100" r="19" fill="white" />
      <circle cx="124" cy="100" r="19" fill="white" />
      {/* Pupils */}
      <circle cx="79" cy="102" r="12" fill="#1C1917" />
      <circle cx="127" cy="102" r="12" fill="#1C1917" />
      {/* Eye shine */}
      <circle cx="84" cy="96" r="4.5" fill="white" />
      <circle cx="132" cy="96" r="4.5" fill="white" />
      {/* Snout */}
      <ellipse cx="100" cy="132" rx="28" ry="19" fill="#FDE68A" />
      {/* Nose */}
      <ellipse cx="100" cy="122" rx="11" ry="8" fill="#1C1917" />
      <ellipse cx="97" cy="120" rx="3.5" ry="2" fill="#78716C" opacity="0.5" />
      {/* Smile */}
      <path d="M78 135 Q100 154 122 135" stroke="#1C1917" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="100" cy="152" rx="13" ry="10" fill="#F87171" />
      <path d="M100 143 L100 161" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CatIllustration(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Left pointed ear */}
      <polygon points="36,98 58,36 84,98" fill="#A855F7" />
      <polygon points="47,92 60,50 75,92" fill="#F0ABFC" />
      {/* Right pointed ear */}
      <polygon points="164,98 142,36 116,98" fill="#A855F7" />
      <polygon points="153,92 140,50 125,92" fill="#F0ABFC" />
      {/* Head */}
      <circle cx="100" cy="120" r="72" fill="#C084FC" />
      {/* Eye areas (green) */}
      <ellipse cx="74" cy="108" rx="18" ry="20" fill="#D1FAE5" />
      <ellipse cx="126" cy="108" rx="18" ry="20" fill="#D1FAE5" />
      {/* Slit pupils */}
      <ellipse cx="74" cy="109" rx="7" ry="17" fill="#1C1917" />
      <ellipse cx="126" cy="109" rx="7" ry="17" fill="#1C1917" />
      {/* Eye shine */}
      <circle cx="79" cy="102" r="4" fill="white" />
      <circle cx="131" cy="102" r="4" fill="white" />
      {/* Nose */}
      <polygon points="100,130 92,137 108,137" fill="#FDA4AF" />
      {/* Mouth */}
      <path d="M92 137 Q100 144 108 137" stroke="#1C1917" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="100" y1="130" x2="100" y2="137" stroke="#1C1917" strokeWidth="1.5" />
      {/* Whiskers left */}
      <line x1="10" y1="128" x2="84" y2="133" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
      <line x1="10" y1="136" x2="84" y2="136" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
      <line x1="10" y1="144" x2="84" y2="139" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
      {/* Whiskers right */}
      <line x1="190" y1="128" x2="116" y2="133" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
      <line x1="190" y1="136" x2="116" y2="136" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
      <line x1="190" y1="144" x2="116" y2="139" stroke="white" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
    </svg>
  )
}

function BeeIllustration(): JSX.Element {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Antennae */}
      <line x1="80" y1="30" x2="62" y2="8" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
      <circle cx="59" cy="5" r="6" fill="#F97316" />
      <line x1="120" y1="30" x2="138" y2="8" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
      <circle cx="141" cy="5" r="6" fill="#F97316" />
      {/* Upper wings */}
      <ellipse cx="38" cy="90" rx="34" ry="19" fill="#BAE6FD" opacity="0.85" transform="rotate(-25 38 90)" />
      <ellipse cx="162" cy="90" rx="34" ry="19" fill="#BAE6FD" opacity="0.85" transform="rotate(25 162 90)" />
      {/* Lower wings */}
      <ellipse cx="46" cy="116" rx="25" ry="14" fill="#BAE6FD" opacity="0.65" transform="rotate(-15 46 116)" />
      <ellipse cx="154" cy="116" rx="25" ry="14" fill="#BAE6FD" opacity="0.65" transform="rotate(15 154 116)" />
      {/* Body */}
      <ellipse cx="100" cy="158" rx="30" ry="36" fill="#FCD34D" />
      <rect x="72" y="142" width="56" height="11" rx="5" fill="#1C1917" opacity="0.75" />
      <rect x="72" y="159" width="56" height="11" rx="5" fill="#1C1917" opacity="0.75" />
      {/* Head */}
      <circle cx="100" cy="74" r="46" fill="#FCD34D" />
      {/* Cheeks */}
      <circle cx="66" cy="88" r="11" fill="#FCA5A5" opacity="0.55" />
      <circle cx="134" cy="88" r="11" fill="#FCA5A5" opacity="0.55" />
      {/* Eyes */}
      <circle cx="81" cy="66" r="15" fill="white" />
      <circle cx="119" cy="66" r="15" fill="white" />
      <circle cx="83" cy="68" r="9.5" fill="#1C1917" />
      <circle cx="121" cy="68" r="9.5" fill="#1C1917" />
      <circle cx="87" cy="63" r="3.5" fill="white" />
      <circle cx="125" cy="63" r="3.5" fill="white" />
      {/* Smile */}
      <path d="M78 84 Q100 98 122 84" stroke="#1C1917" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export const MASCOTS: Mascot[] = [
  {
    id: 'balamber',
    name: 'Balambér',
    animal: 'kutya',
    catchphrase: 'Vau-vau, megcsináljuk!',
    intro: 'Szia, én Balambér vagyok, és imádok tanulni veled! Vau-vau, megcsináljuk!',
    confirmSpeech: 'Biztos ezt választod? Balambér lesz a barátod!',
    gardenSpeech: 'Szia Panka! Balambér vagyok, és együtt tanulunk! Vau-vau!',
    cardBg: 'from-orange-400 to-yellow-300',
    Illustration: DogIllustration,
  },
  {
    id: 'kifli',
    name: 'Kifli',
    animal: 'cica',
    catchphrase: 'Nyau, együtt menni fog!',
    intro: 'Szia, én Kifli vagyok! Nyau, együtt menni fog, meglátod!',
    confirmSpeech: 'Biztos ezt választod? Kifli lesz a barátod!',
    gardenSpeech: 'Szia Panka! Kifli vagyok, és itt vagyok veled! Nyau!',
    cardBg: 'from-purple-400 to-pink-300',
    Illustration: CatIllustration,
  },
  {
    id: 'bolyhos',
    name: 'Bolyhos',
    animal: 'méhecske',
    catchphrase: 'Bzzz, dolgozzunk!',
    intro: 'Szia, én Bolyhos vagyok! Bzzz, és együtt mindent megcsinálunk!',
    confirmSpeech: 'Biztos ezt választod? Bolyhos lesz a barátod!',
    gardenSpeech: 'Szia Panka! Bolyhos vagyok, és készen állok tanulni veled! Bzzz!',
    cardBg: 'from-yellow-400 to-amber-300',
    Illustration: BeeIllustration,
  },
]
