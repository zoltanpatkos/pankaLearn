import type { JSX } from 'react'
import type { EquippedItems } from '../lib/wardrobe'

interface Props {
  equipped: EquippedItems
  className?: string
}

// ── Hair Back ─────────────────────────────────────────────────────────────────

function HairBackDefault(): JSX.Element {
  return (
    <g>
      <path d="M28 58 Q20 108 22 172 Q36 184 46 168 Q50 118 50 58" fill="#92400e" />
      <path d="M102 58 Q110 108 108 172 Q94 184 84 168 Q80 118 80 58" fill="#7c2d12" />
    </g>
  )
}

function HairBackPigtails(): JSX.Element {
  return (
    <g>
      <path d="M30 58 Q22 76 24 90" stroke="#92400e" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q108 76 106 90" stroke="#7c2d12" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M16 92 Q6 136 10 184 Q18 196 28 184 Q34 136 38 92 Z" fill="#92400e" />
      <path d="M114 92 Q124 136 120 184 Q112 196 102 184 Q96 136 92 92 Z" fill="#7c2d12" />
    </g>
  )
}

function HairBackPonytail(): JSX.Element {
  return (
    <g>
      <path d="M30 58 Q22 44 34 28" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q108 44 96 28" stroke="#7c2d12" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M52 22 Q65 14 78 22 Q86 60 80 122 Q65 130 50 122 Q44 60 52 22 Z" fill="#92400e" />
    </g>
  )
}

function HairBackBraid(): JSX.Element {
  return (
    <g>
      <path d="M30 58 Q22 76 28 92" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q108 76 102 92" stroke="#7c2d12" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="65" cy="100" rx="14" ry="12" fill="#92400e" />
      <ellipse cx="65" cy="120" rx="13" ry="12" fill="#7c2d12" />
      <ellipse cx="65" cy="140" rx="14" ry="12" fill="#92400e" />
      <ellipse cx="65" cy="160" rx="13" ry="12" fill="#7c2d12" />
      <ellipse cx="65" cy="178" rx="12" ry="11" fill="#92400e" />
      <ellipse cx="65" cy="193" rx="9" ry="8" fill="#7c2d12" />
    </g>
  )
}

function HairBackWavy(): JSX.Element {
  return (
    <g>
      <path d="M28 58 Q12 88 16 124 Q20 152 12 180 Q22 200 32 176 Q36 148 32 120 Q44 86 44 58" fill="#92400e" />
      <path d="M102 58 Q118 88 114 124 Q110 152 118 180 Q108 200 98 176 Q94 148 98 120 Q86 86 86 58" fill="#7c2d12" />
    </g>
  )
}

function HairBackBun(): JSX.Element {
  return (
    <g>
      {/* Hair swept upward from sides toward bun */}
      <path d="M30 58 Q26 42 40 28 Q52 18 65 14" stroke="#92400e" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q104 42 90 28 Q78 18 65 14" stroke="#7c2d12" strokeWidth="11" fill="none" strokeLinecap="round" />
      {/* Bun */}
      <circle cx="65" cy="12" r="13" fill="#92400e" />
    </g>
  )
}

function HairBackBunFlowers(): JSX.Element {
  return (
    <g>
      {/* Same as HairBackBun */}
      <path d="M30 58 Q26 42 40 28 Q52 18 65 14" stroke="#92400e" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q104 42 90 28 Q78 18 65 14" stroke="#7c2d12" strokeWidth="11" fill="none" strokeLinecap="round" />
      <circle cx="65" cy="12" r="13" fill="#92400e" />
    </g>
  )
}

function HairBackPigtailsColored(): JSX.Element {
  return (
    <g>
      {/* Left pigtail attachment */}
      <path d="M30 58 Q22 76 24 90" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Right pigtail attachment */}
      <path d="M100 58 Q108 76 106 90" stroke="#7c2d12" strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Left braid — alternating dark/light segments */}
      <ellipse cx="15" cy="100" rx="9" ry="11" fill="#92400e" />
      <ellipse cx="15" cy="121" rx="8" ry="10" fill="#b45309" />
      <ellipse cx="15" cy="141" rx="9" ry="10" fill="#92400e" />
      <ellipse cx="15" cy="161" rx="8" ry="10" fill="#b45309" />
      <ellipse cx="15" cy="180" rx="7" ry="9" fill="#92400e" />
      {/* Right braid */}
      <ellipse cx="115" cy="100" rx="9" ry="11" fill="#7c2d12" />
      <ellipse cx="115" cy="121" rx="8" ry="10" fill="#a16207" />
      <ellipse cx="115" cy="141" rx="9" ry="10" fill="#7c2d12" />
      <ellipse cx="115" cy="161" rx="8" ry="10" fill="#a16207" />
      <ellipse cx="115" cy="180" rx="7" ry="9" fill="#7c2d12" />
    </g>
  )
}

function HairBackBraidBow(): JSX.Element {
  return (
    <g>
      {/* Same as HairBackBraid */}
      <path d="M30 58 Q22 76 28 92" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M100 58 Q108 76 102 92" stroke="#7c2d12" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="65" cy="100" rx="14" ry="12" fill="#92400e" />
      <ellipse cx="65" cy="120" rx="13" ry="12" fill="#7c2d12" />
      <ellipse cx="65" cy="140" rx="14" ry="12" fill="#92400e" />
      <ellipse cx="65" cy="160" rx="13" ry="12" fill="#7c2d12" />
      <ellipse cx="65" cy="178" rx="12" ry="11" fill="#92400e" />
      <ellipse cx="65" cy="193" rx="9" ry="8" fill="#7c2d12" />
    </g>
  )
}

function HairBackMessy(): JSX.Element {
  return (
    <g>
      {/* Wild wavy hair — wider and more jagged than wavy */}
      <path d="M26 58 Q8 82 10 118 Q14 148 6 178 Q18 202 30 174 Q38 144 30 118 Q42 82 44 58" fill="#92400e" />
      <path d="M104 58 Q122 82 120 118 Q116 148 124 178 Q112 202 100 174 Q92 144 100 118 Q88 82 86 58" fill="#7c2d12" />
      {/* Spikes sticking up */}
      <path d="M42 36 Q38 18 44 10 Q50 20 48 36" fill="#92400e" />
      <path d="M88 36 Q92 18 86 10 Q80 20 82 36" fill="#7c2d12" />
      <path d="M65 28 Q62 12 65 4 Q68 12 65 28" fill="#92400e" />
    </g>
  )
}

function renderHairBack(hairId: string): JSX.Element {
  if (hairId === 'hair-pigtails')        return <HairBackPigtails />
  if (hairId === 'hair-ponytail')        return <HairBackPonytail />
  if (hairId === 'hair-braid')           return <HairBackBraid />
  if (hairId === 'hair-wavy')            return <HairBackWavy />
  if (hairId === 'hair-bun')             return <HairBackBun />
  if (hairId === 'hair-bun-flowers')     return <HairBackBunFlowers />
  if (hairId === 'hair-pigtails-colored') return <HairBackPigtailsColored />
  if (hairId === 'hair-braid-bow')       return <HairBackBraidBow />
  if (hairId === 'hair-messy')           return <HairBackMessy />
  return <HairBackDefault />
}

// ── Hair Front ────────────────────────────────────────────────────────────────

function HairFrontDefault(): JSX.Element {
  return (
    <g>
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />
      <polygon points="44,22 56,32 44,42" fill="#7c3aed" />
      <polygon points="86,22 74,32 86,42" fill="#6d28d9" />
      <circle cx="65" cy="32" r="9" fill="#9333ea" />
      <circle cx="65" cy="32" r="4" fill="#a855f7" />
    </g>
  )
}

function HairFrontPigtails(): JSX.Element {
  return (
    <g>
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />
      <circle cx="22" cy="92" r="7" fill="#e879f9" />
      <circle cx="108" cy="92" r="7" fill="#e879f9" />
    </g>
  )
}

function HairFrontPonytail(): JSX.Element {
  return (
    <g>
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="7" ry="16" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="7" ry="16" fill="#7c2d12" />
      <circle cx="65" cy="22" r="9" fill="#e879f9" />
      <circle cx="65" cy="22" r="5" fill="#f9a8d4" />
    </g>
  )
}

function HairFrontBraid(): JSX.Element {
  return (
    <g>
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />
      <ellipse cx="65" cy="197" rx="7" ry="4" fill="#7c3aed" />
    </g>
  )
}

function HairFrontWavy(): JSX.Element {
  return (
    <g>
      <path d="M27 52 Q28 22 65 18 Q102 22 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="10" ry="22" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="10" ry="22" fill="#7c2d12" />
    </g>
  )
}

function HairFrontBun(): JSX.Element {
  return (
    <g>
      {/* Front hairline */}
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      {/* Side strips (hair pulled back tight) */}
      <ellipse cx="29" cy="64" rx="8" ry="14" fill="#92400e" />
      <ellipse cx="101" cy="64" rx="8" ry="14" fill="#7c2d12" />
      {/* Bun on top — front view */}
      <circle cx="65" cy="12" r="13" fill="#7c2d12" />
      {/* Scrunchie at base of bun */}
      <ellipse cx="65" cy="23" rx="10" ry="4" fill="#e879f9" />
      {/* Bun highlight */}
      <circle cx="61" cy="9" r="4" fill="#a16207" opacity="0.35" />
    </g>
  )
}

function HairFrontBunFlowers(): JSX.Element {
  return (
    <g>
      {/* Front hairline */}
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      {/* Side strips */}
      <ellipse cx="29" cy="64" rx="8" ry="14" fill="#92400e" />
      <ellipse cx="101" cy="64" rx="8" ry="14" fill="#7c2d12" />
      {/* Bun on top */}
      <circle cx="65" cy="12" r="13" fill="#7c2d12" />
      {/* Scrunchie */}
      <ellipse cx="65" cy="23" rx="10" ry="4" fill="#e879f9" />
      {/* Flowers above bun */}
      {/* Pink flower at left */}
      <circle cx="55" cy="6" r="4" fill="#f9a8d4" />
      <circle cx="55" cy="6" r="2" fill="#fbbf24" />
      {/* Purple flower at center */}
      <circle cx="65" cy="2" r="4" fill="#c084fc" />
      <circle cx="65" cy="2" r="2" fill="#fbbf24" />
      {/* Teal flower at right */}
      <circle cx="75" cy="6" r="4" fill="#5eead4" />
      <circle cx="75" cy="6" r="2" fill="#fbbf24" />
    </g>
  )
}

function HairFrontPigtailsColored(): JSX.Element {
  return (
    <g>
      {/* Hairline */}
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />
      {/* Hair ties — orange left, cyan right */}
      <circle cx="22" cy="92" r="7" fill="#f97316" />
      <circle cx="108" cy="92" r="7" fill="#06b6d4" />
      {/* End ties at bottom of braids */}
      <circle cx="15" cy="186" r="5" fill="#7c3aed" />
      <circle cx="115" cy="186" r="5" fill="#7c3aed" />
    </g>
  )
}

function HairFrontBraidBow(): JSX.Element {
  return (
    <g>
      {/* Same hairline as braid */}
      <path d="M27 52 Q28 24 65 20 Q102 24 103 52" fill="#92400e" />
      <ellipse cx="29" cy="66" rx="9" ry="20" fill="#92400e" />
      <ellipse cx="101" cy="66" rx="9" ry="20" fill="#7c2d12" />
      {/* End of braid */}
      <ellipse cx="65" cy="197" rx="7" ry="4" fill="#7c3aed" />
      {/* Big bow at end of braid */}
      <polygon points="50,201 65,207 50,213" fill="#e879f9" />
      <polygon points="80,201 65,207 80,213" fill="#e879f9" />
      <circle cx="65" cy="207" r="5" fill="#f0abfc" />
    </g>
  )
}

function HairFrontMessy(): JSX.Element {
  return (
    <g>
      {/* Irregular hairline */}
      <path d="M25 54 Q24 28 42 20 Q55 16 65 18 Q75 16 88 20 Q106 28 105 54" fill="#92400e" />
      {/* Wide side pieces */}
      <ellipse cx="27" cy="68" rx="11" ry="24" fill="#92400e" />
      <ellipse cx="103" cy="68" rx="11" ry="24" fill="#7c2d12" />
      {/* Spikes sticking up above hairline */}
      <path d="M44 22 Q40 10 46 4 Q50 12 50 22" fill="#92400e" />
      <path d="M86 22 Q90 10 84 4 Q80 12 80 22" fill="#7c2d12" />
      <path d="M64 20 Q62 8 65 2 Q68 8 66 20" fill="#92400e" />
    </g>
  )
}

function renderHairFront(hairId: string): JSX.Element {
  if (hairId === 'hair-pigtails')         return <HairFrontPigtails />
  if (hairId === 'hair-ponytail')         return <HairFrontPonytail />
  if (hairId === 'hair-braid')            return <HairFrontBraid />
  if (hairId === 'hair-wavy')             return <HairFrontWavy />
  if (hairId === 'hair-bun')              return <HairFrontBun />
  if (hairId === 'hair-bun-flowers')      return <HairFrontBunFlowers />
  if (hairId === 'hair-pigtails-colored') return <HairFrontPigtailsColored />
  if (hairId === 'hair-braid-bow')        return <HairFrontBraidBow />
  if (hairId === 'hair-messy')            return <HairFrontMessy />
  return <HairFrontDefault />
}

// ── Outfits ───────────────────────────────────────────────────────────────────

function OutfitDefault(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#7c3aed" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#7c3aed" />
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="#c084fc" />
      <path d="M48 122 Q65 114 82 122 L80 138 Q65 130 50 138 Z" fill="#e879f9" />
      <path d="M60 100 Q65 96 70 100 L68 108 Q65 105 62 108 Z" fill="#f0abfc" />
    </g>
  )
}

function OutfitPrincess(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#d97706" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#d97706" />
      <path d="M26 148 Q16 178 20 212 Q65 228 110 212 Q114 178 104 148 Q65 164 26 148 Z" fill="#f472b6" />
      <path d="M32 156 Q26 180 30 208 Q65 220 100 208 Q104 180 98 156 Q65 168 32 156 Z" fill="#fda4af" opacity="0.5" />
      <polygon points="44,177 47,184 44,191 41,184" fill="#fbbf24" />
      <polygon points="79,168 82,175 79,182 76,175" fill="#fbbf24" />
      <polygon points="60,198 63,205 60,212 57,205" fill="#fbbf24" />
      <path d="M42 122 Q44 96 65 90 Q86 96 88 122 L90 148 Q65 156 40 148 Z" fill="#fbbf24" />
      <path d="M48 116 Q65 108 82 116 L80 130 Q65 122 50 130 Z" fill="#fde68a" />
    </g>
  )
}

function OutfitBallerina(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#f472b6" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#f472b6" />
      <path d="M44 122 Q46 98 65 92 Q84 98 86 122 L84 152 Q65 158 46 152 Z" fill="#fce7f3" />
      <ellipse cx="65" cy="170" rx="48" ry="16" fill="#fbcfe8" />
      <ellipse cx="65" cy="178" rx="44" ry="14" fill="#fce7f3" />
      <ellipse cx="65" cy="185" rx="40" ry="12" fill="#f9a8d4" />
      <path d="M36 182 Q32 200 36 212 Q65 222 94 212 Q98 200 94 182" fill="#fbcfe8" opacity="0.65" />
      <path d="M42 150 Q65 158 88 150 L90 161 Q65 169 40 161 Z" fill="#f472b6" />
      <polygon points="58,152 65,158 58,164" fill="#be185d" />
      <polygon points="72,152 65,158 72,164" fill="#be185d" />
      <circle cx="65" cy="158" r="4" fill="#f472b6" />
    </g>
  )
}

function OutfitSporty(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#e5e7eb" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#e5e7eb" />
      <path d="M36 168 Q32 196 36 212 Q65 220 94 212 Q98 196 94 168 Z" fill="#fbbf24" />
      <path d="M36 176 Q65 181 94 176 L94 184 Q65 189 36 184 Z" fill="#3b82f6" />
      <path d="M40 122 Q42 98 65 92 Q88 98 90 122 L90 168 Q65 174 40 168 Z" fill="#3b82f6" />
      <path d="M40 145 Q65 150 90 145 L90 155 Q65 160 40 155 Z" fill="#fbbf24" />
      <line x1="65" y1="108" x2="65" y2="126" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="108" x2="70" y2="108" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function OutfitLadybug(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#1c1917" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#1c1917" />
      <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L96 212 Q65 224 34 212 Z" fill="#ef4444" />
      <line x1="65" y1="90" x2="65" y2="210" stroke="#1c1917" strokeWidth="5" />
      <circle cx="46" cy="132" r="11" fill="#1c1917" />
      <circle cx="84" cy="132" r="11" fill="#1c1917" />
      <circle cx="44" cy="160" r="10" fill="#1c1917" />
      <circle cx="86" cy="160" r="10" fill="#1c1917" />
      <circle cx="48" cy="187" r="9" fill="#1c1917" />
      <circle cx="82" cy="187" r="9" fill="#1c1917" />
      <path d="M46 118 Q65 110 84 118 L82 130 Q65 122 48 130 Z" fill="#fca5a5" />
    </g>
  )
}

function OutfitFairy(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#7dd3fc" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#7dd3fc" />
      <ellipse cx="14" cy="142" rx="18" ry="34" fill="#bae6fd" opacity="0.85" />
      <ellipse cx="116" cy="142" rx="18" ry="34" fill="#bae6fd" opacity="0.85" />
      <ellipse cx="18" cy="180" rx="13" ry="22" fill="#7dd3fc" opacity="0.75" />
      <ellipse cx="112" cy="180" rx="13" ry="22" fill="#7dd3fc" opacity="0.75" />
      <ellipse cx="14" cy="134" rx="10" ry="18" fill="white" opacity="0.4" />
      <ellipse cx="116" cy="134" rx="10" ry="18" fill="white" opacity="0.4" />
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="#bae6fd" />
      <path d="M44 120 Q65 113 86 120 L84 140 Q65 134 46 140 Z" fill="white" opacity="0.55" />
      <circle cx="52" cy="150" r="3" fill="#38bdf8" />
      <circle cx="78" cy="157" r="3" fill="#38bdf8" />
      <circle cx="60" cy="178" r="3" fill="#38bdf8" />
      <circle cx="80" cy="188" r="2.5" fill="#38bdf8" />
    </g>
  )
}

function OutfitBee(): JSX.Element {
  return (
    <g>
      <defs>
        <clipPath id="bee-clip">
          <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L96 212 Q65 224 34 212 Z" />
        </clipPath>
      </defs>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#1c1917" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#1c1917" />
      {/* Wings */}
      <ellipse cx="16" cy="128" rx="18" ry="30" fill="#bae6fd" opacity="0.80" />
      <ellipse cx="114" cy="128" rx="18" ry="30" fill="#bae6fd" opacity="0.80" />
      <ellipse cx="16" cy="128" rx="10" ry="18" fill="white" opacity="0.4" />
      <ellipse cx="114" cy="128" rx="10" ry="18" fill="white" opacity="0.4" />
      {/* Yellow body */}
      <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L96 212 Q65 224 34 212 Z" fill="#fbbf24" />
      {/* Black stripes clipped to body */}
      <g clipPath="url(#bee-clip)">
        <rect x="30" y="136" width="70" height="15" fill="#1c1917" />
        <rect x="30" y="162" width="70" height="15" fill="#1c1917" />
        <rect x="30" y="188" width="70" height="15" fill="#1c1917" />
      </g>
      {/* Collar */}
      <path d="M44 116 Q65 109 86 116 L84 130 Q65 123 46 130 Z" fill="#1c1917" />
    </g>
  )
}

function OutfitTurtle(): JSX.Element {
  return (
    <g>
      <defs>
        <clipPath id="turtle-shell-clip">
          <ellipse cx="65" cy="158" rx="28" ry="33" />
        </clipPath>
      </defs>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#15803d" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#15803d" />
      {/* Body — light green */}
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="#bbf7d0" />
      {/* Shell base */}
      <ellipse cx="65" cy="158" rx="28" ry="33" fill="#84cc16" />
      {/* Shell scute pattern */}
      <g clipPath="url(#turtle-shell-clip)" stroke="#4d7c0f" strokeWidth="1.6" fill="none">
        <line x1="65" y1="125" x2="65" y2="191" />
        <line x1="37" y1="158" x2="93" y2="158" />
        <line x1="42" y1="132" x2="88" y2="132" />
        <line x1="42" y1="184" x2="88" y2="184" />
        <line x1="37" y1="143" x2="93" y2="173" />
        <line x1="93" y1="143" x2="37" y2="173" />
      </g>
      {/* Shell border */}
      <ellipse cx="65" cy="158" rx="28" ry="33" fill="none" stroke="#4d7c0f" strokeWidth="2.5" />
      {/* Highlight */}
      <ellipse cx="54" cy="141" rx="9" ry="6" fill="white" opacity="0.22" />
      {/* Collar */}
      <path d="M46 118 Q65 110 84 118 L82 130 Q65 122 48 130 Z" fill="#86efac" />
    </g>
  )
}

function OutfitSwimsuit(): JSX.Element {
  return (
    <g>
      {/* Bare legs below swimsuit */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#fde68a" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#fde68a" />
      {/* One-piece swimsuit body */}
      <path d="M44 118 Q46 96 65 90 Q84 96 86 118 L88 202 Q65 210 42 202 Z" fill="#e879f9" />
      {/* Horizontal stripes */}
      <path d="M44 132 L86 132 L87 144 Q65 148 43 144 Z" fill="#a855f7" />
      <path d="M44 158 L86 158 L87 170 Q65 174 43 170 Z" fill="#a855f7" />
      {/* Shoulder straps */}
      <rect x="53" y="90" width="7" height="26" rx="3" fill="#c026d3" />
      <rect x="70" y="90" width="7" height="26" rx="3" fill="#c026d3" />
      {/* Neck detail */}
      <path d="M60 90 Q65 86 70 90" stroke="#c026d3" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function OutfitDolphin(): JSX.Element {
  return (
    <g>
      {/* Dolphin tail fins at bottom */}
      <path d="M48 212 Q30 224 20 240 Q30 246 44 236 Q54 226 60 216" fill="#0284c7" />
      <path d="M82 212 Q100 224 110 240 Q100 246 86 236 Q76 226 70 216" fill="#0284c7" />
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#0284c7" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#0284c7" />
      {/* Main body */}
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="#38bdf8" />
      {/* Side fins */}
      <path d="M36 148 Q14 138 12 158 Q16 170 36 164 Z" fill="#0284c7" />
      <path d="M94 148 Q116 138 118 158 Q114 170 94 164 Z" fill="#0284c7" />
      {/* Belly highlight */}
      <ellipse cx="65" cy="158" rx="18" ry="28" fill="#7dd3fc" opacity="0.5" />
      {/* Dorsal fin on top */}
      <polygon points="61,90 65,73 69,90" fill="#0284c7" />
      {/* Collar */}
      <path d="M46 118 Q65 110 84 118 L82 130 Q65 122 48 130 Z" fill="#0ea5e9" />
    </g>
  )
}

function OutfitPajama(): JSX.Element {
  return (
    <g>
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#a78bfa" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#a78bfa" />
      {/* Body */}
      <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L100 212 Q65 222 30 212 Z" fill="#c4b5fd" />
      {/* Stars on body */}
      <polygon points="48,135 50,128 52,135 46,131 54,131" fill="#7c3aed" opacity="0.7" />
      <polygon points="74,150 76,143 78,150 72,146 80,146" fill="#7c3aed" opacity="0.7" />
      <polygon points="54,170 56,163 58,170 52,166 60,166" fill="#7c3aed" opacity="0.7" />
      <polygon points="76,185 78,178 80,185 74,181 82,181" fill="#7c3aed" opacity="0.7" />
      <polygon points="48,195 50,188 52,195 46,191 54,191" fill="#7c3aed" opacity="0.7" />
      {/* V-neck collar */}
      <path d="M54 92 L65 105 L76 92" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="65" cy="112" r="2.5" fill="#7c3aed" />
      <circle cx="65" cy="124" r="2.5" fill="#7c3aed" />
      <circle cx="65" cy="136" r="2.5" fill="#7c3aed" />
    </g>
  )
}

function OutfitRaincoat(): JSX.Element {
  return (
    <g>
      {/* Hood — outer ring visible around face */}
      <circle cx="65" cy="55" r="47" fill="#fbbf24" />
      <circle cx="65" cy="55" r="40" fill="#fde68a" />
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#a16207" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#a16207" />
      {/* Body */}
      <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L100 212 Q65 222 30 212 Z" fill="#fbbf24" />
      {/* Collar */}
      <path d="M48 115 Q65 108 82 115 L80 128 Q65 121 50 128 Z" fill="#f59e0b" />
      {/* Center button line */}
      <line x1="65" y1="115" x2="65" y2="210" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Buttons */}
      <circle cx="65" cy="130" r="3" fill="#d97706" />
      <circle cx="65" cy="148" r="3" fill="#d97706" />
      <circle cx="65" cy="166" r="3" fill="#d97706" />
      {/* Pockets */}
      <rect x="36" y="168" width="18" height="14" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      <rect x="76" y="168" width="18" height="14" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </g>
  )
}

function OutfitSnowsuit(): JSX.Element {
  return (
    <g>
      {/* Hood — outer ring visible around face */}
      <circle cx="65" cy="55" r="48" fill="#818cf8" />
      <circle cx="65" cy="55" r="40" fill="#a5b4fc" />
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#4f46e5" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#4f46e5" />
      {/* Padded body — slightly wider */}
      <path d="M28 115 Q30 88 65 83 Q100 88 102 115 L106 212 Q65 224 24 212 Z" fill="#818cf8" />
      {/* Collar */}
      <path d="M46 110 Q65 102 84 110 L82 124 Q65 116 48 124 Z" fill="#a5b4fc" />
      {/* Padding seams */}
      <path d="M30 142 Q65 148 100 142" stroke="#6366f1" strokeWidth="2" fill="none" />
      <path d="M28 168 Q65 174 102 168" stroke="#6366f1" strokeWidth="2" fill="none" />
      <path d="M28 194 Q65 200 102 194" stroke="#6366f1" strokeWidth="2" fill="none" />
      {/* Zipper */}
      <line x1="65" y1="108" x2="65" y2="210" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 3" />
    </g>
  )
}

function OutfitBalletBlue(): JSX.Element {
  return (
    <g>
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#7dd3fc" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#7dd3fc" />
      <path d="M44 122 Q46 98 65 92 Q84 98 86 122 L84 152 Q65 158 46 152 Z" fill="#bae6fd" />
      <ellipse cx="65" cy="170" rx="48" ry="16" fill="#7dd3fc" />
      <ellipse cx="65" cy="178" rx="44" ry="14" fill="#bae6fd" />
      <ellipse cx="65" cy="185" rx="40" ry="12" fill="#38bdf8" />
      <path d="M36 182 Q32 200 36 212 Q65 222 94 212 Q98 200 94 182" fill="#7dd3fc" opacity="0.65" />
      <path d="M42 150 Q65 158 88 150 L90 161 Q65 169 40 161 Z" fill="#0ea5e9" />
      {/* Ribbon detail */}
      <polygon points="58,152 65,158 58,164" fill="#0369a1" />
      <polygon points="72,152 65,158 72,164" fill="#0369a1" />
      <circle cx="65" cy="158" r="4" fill="#0ea5e9" />
    </g>
  )
}

function OutfitSoccer(): JSX.Element {
  return (
    <g>
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#1e40af" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#1e40af" />
      {/* Shorts */}
      <path d="M36 172 Q32 200 36 212 Q65 222 94 212 Q98 200 94 172 Z" fill="#1e3a8a" />
      {/* Center line on shorts */}
      <line x1="65" y1="172" x2="65" y2="212" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Jersey body */}
      <path d="M36 90 Q38 88 65 87 Q92 88 94 90 L94 172 Q65 178 36 172 Z" fill="#3b82f6" />
      {/* Dark collar */}
      <path d="M48 90 Q65 84 82 90 L80 100 Q65 94 50 100 Z" fill="#1e40af" />
      {/* White horizontal stripe */}
      <path d="M36 130 Q65 134 94 130 L94 144 Q65 148 36 144 Z" fill="white" />
      {/* Number 7 */}
      <text x="65" y="168" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">7</text>
    </g>
  )
}

function OutfitDoctor(): JSX.Element {
  return (
    <g>
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#d1d5db" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#d1d5db" />
      {/* White coat body */}
      <path d="M34 120 Q36 92 65 87 Q94 92 96 120 L100 212 Q65 222 30 212 Z" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
      {/* Lapel V */}
      <path d="M54 92 L46 120 L65 112 L84 120 L76 92" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
      <path d="M54 92 L65 112 L76 92" fill="white" />
      {/* Coat edge lines */}
      <line x1="65" y1="112" x2="65" y2="212" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Breast pocket */}
      <rect x="74" y="122" width="14" height="10" rx="2" fill="none" stroke="#d1d5db" strokeWidth="1.2" />
      <line x1="81" y1="122" x2="81" y2="118" stroke="#d1d5db" strokeWidth="1.2" />
      {/* Stethoscope */}
      <path d="M52 100 Q44 115 46 132 Q48 148 58 148 Q68 148 68 138" stroke="#6b7280" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="68" cy="136" r="5" fill="none" stroke="#6b7280" strokeWidth="2" />
    </g>
  )
}

function OutfitChef(): JSX.Element {
  return (
    <g>
      {/* Chef hat (at outfit layer, appears above head circle which is at y=20) */}
      {/* Hat cylinder */}
      <rect x="46" y="4" width="38" height="20" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      {/* Hat brim */}
      <rect x="40" y="20" width="50" height="6" rx="3" fill="#e5e7eb" />
      {/* Hat top puff */}
      <ellipse cx="65" cy="6" rx="18" ry="6" fill="white" />
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#6b7280" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#6b7280" />
      {/* Apron body */}
      <path d="M36 122 Q38 96 65 90 Q92 96 94 122 L100 212 Q65 222 30 212 Z" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      {/* Blue stripes on apron */}
      <path d="M34 136 Q65 140 96 136 L96 148 Q65 152 34 148 Z" fill="#bfdbfe" opacity="0.7" />
      <path d="M34 162 Q65 166 96 162 L96 174 Q65 178 34 174 Z" fill="#bfdbfe" opacity="0.7" />
      <path d="M34 188 Q65 192 100 188 L100 200 Q65 204 30 200 Z" fill="#bfdbfe" opacity="0.7" />
      {/* Bib detail at top */}
      <path d="M48 114 Q65 108 82 114 L80 130 Q65 124 50 130 Z" fill="#dbeafe" />
      {/* Pocket */}
      <rect x="36" y="150" width="16" height="12" rx="3" fill="none" stroke="#93c5fd" strokeWidth="1.2" />
    </g>
  )
}

function OutfitAstronaut(): JSX.Element {
  return (
    <g>
      {/* Helmet ring around face */}
      <circle cx="65" cy="54" r="46" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      {/* Inner helmet transparent area — will be covered by head render */}
      <circle cx="65" cy="54" r="38" fill="#bfdbfe" opacity="0.3" />
      {/* Feet */}
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#cbd5e1" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#cbd5e1" />
      {/* Orange collar ellipse */}
      <ellipse cx="65" cy="96" rx="32" ry="9" fill="#ea580c" />
      {/* White suit body — wider */}
      <path d="M28 115 Q30 90 65 85 Q100 90 102 115 L106 212 Q65 224 24 212 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Orange accent bands */}
      <path d="M30 138 Q65 144 100 138 L100 148 Q65 154 30 148 Z" fill="#ea580c" />
      <path d="M28 178 Q65 184 102 178 L102 188 Q65 194 28 188 Z" fill="#ea580c" />
      {/* Control panel on chest */}
      <rect x="50" y="154" width="30" height="20" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="57" cy="162" r="3" fill="#ef4444" />
      <circle cx="65" cy="162" r="3" fill="#22c55e" />
      <circle cx="73" cy="162" r="3" fill="#fbbf24" />
      <rect x="54" y="167" width="22" height="4" rx="2" fill="#94a3b8" />
    </g>
  )
}

function OutfitMermaid(): JSX.Element {
  return (
    <g>
      {/* Mermaid tail covers legs area entirely */}
      {/* Main tail body */}
      <path d="M34 168 Q28 200 30 230 Q45 248 65 250 Q85 248 100 230 Q102 200 96 168 Q65 178 34 168 Z" fill="#0e7490" />
      {/* Scale pattern */}
      <ellipse cx="48" cy="182" rx="9" ry="6" fill="#0891b2" opacity="0.7" />
      <ellipse cx="65" cy="185" rx="9" ry="6" fill="#0891b2" opacity="0.7" />
      <ellipse cx="82" cy="182" rx="9" ry="6" fill="#0891b2" opacity="0.7" />
      <ellipse cx="44" cy="200" rx="8" ry="5" fill="#0891b2" opacity="0.7" />
      <ellipse cx="60" cy="203" rx="8" ry="5" fill="#0891b2" opacity="0.7" />
      <ellipse cx="76" cy="203" rx="8" ry="5" fill="#0891b2" opacity="0.7" />
      <ellipse cx="92" cy="200" rx="8" ry="5" fill="#0891b2" opacity="0.7" />
      <ellipse cx="50" cy="218" rx="7" ry="5" fill="#0891b2" opacity="0.6" />
      <ellipse cx="65" cy="222" rx="7" ry="5" fill="#0891b2" opacity="0.6" />
      <ellipse cx="80" cy="218" rx="7" ry="5" fill="#0891b2" opacity="0.6" />
      {/* Fin at bottom */}
      <path d="M40 238 Q25 256 18 268 Q34 262 50 248" fill="#0369a1" />
      <path d="M90 238 Q105 256 112 268 Q96 262 80 248" fill="#0369a1" />
      {/* Crop top / seashell top */}
      <path d="M40 118 Q42 96 65 90 Q88 96 90 118 L90 168 Q65 174 40 168 Z" fill="#06b6d4" />
      {/* Shell detail on top */}
      <ellipse cx="56" cy="130" rx="10" ry="8" fill="#0891b2" />
      <ellipse cx="74" cy="130" rx="10" ry="8" fill="#0891b2" />
      <line x1="52" y1="124" x2="60" y2="136" stroke="#0e7490" strokeWidth="1" />
      <line x1="56" y1="122" x2="56" y2="138" stroke="#0e7490" strokeWidth="1" />
      <line x1="60" y1="124" x2="52" y2="136" stroke="#0e7490" strokeWidth="1" />
      <line x1="70" y1="124" x2="78" y2="136" stroke="#0e7490" strokeWidth="1" />
      <line x1="74" y1="122" x2="74" y2="138" stroke="#0e7490" strokeWidth="1" />
      <line x1="78" y1="124" x2="70" y2="136" stroke="#0e7490" strokeWidth="1" />
      {/* Glitter dots */}
      <circle cx="46" cy="158" r="2" fill="#a5f3fc" />
      <circle cx="62" cy="148" r="2" fill="#a5f3fc" />
      <circle cx="78" cy="155" r="2" fill="#a5f3fc" />
      <circle cx="55" cy="170" r="1.5" fill="#a5f3fc" />
      <circle cx="75" cy="168" r="1.5" fill="#a5f3fc" />
    </g>
  )
}

function renderOutfit(outfitId: string): JSX.Element {
  if (outfitId === 'outfit-princess')    return <OutfitPrincess />
  if (outfitId === 'outfit-ballerina')   return <OutfitBallerina />
  if (outfitId === 'outfit-sporty')      return <OutfitSporty />
  if (outfitId === 'outfit-ladybug')     return <OutfitLadybug />
  if (outfitId === 'outfit-fairy')       return <OutfitFairy />
  if (outfitId === 'outfit-bee')         return <OutfitBee />
  if (outfitId === 'outfit-dino')        return <OutfitTurtle />
  if (outfitId === 'outfit-swimsuit')    return <OutfitSwimsuit />
  if (outfitId === 'outfit-dolphin')     return <OutfitDolphin />
  if (outfitId === 'outfit-pajama')      return <OutfitPajama />
  if (outfitId === 'outfit-raincoat')    return <OutfitRaincoat />
  if (outfitId === 'outfit-snowsuit')    return <OutfitSnowsuit />
  if (outfitId === 'outfit-ballet-blue') return <OutfitBalletBlue />
  if (outfitId === 'outfit-soccer')      return <OutfitSoccer />
  if (outfitId === 'outfit-doctor')      return <OutfitDoctor />
  if (outfitId === 'outfit-chef')        return <OutfitChef />
  if (outfitId === 'outfit-astronaut')   return <OutfitAstronaut />
  if (outfitId === 'outfit-mermaid')     return <OutfitMermaid />
  return <OutfitDefault />
}

// ── Footwear ──────────────────────────────────────────────────────────────────

function FootwearSneakers(): JSX.Element {
  return (
    <g>
      {/* Left sneaker */}
      <ellipse cx="54" cy="251" rx="15" ry="8" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
      <ellipse cx="54" cy="256" rx="15" ry="5" fill="#9ca3af" />
      <path d="M42 250 L50 247 M56 247 L65 249" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Right sneaker */}
      <ellipse cx="76" cy="251" rx="15" ry="8" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
      <ellipse cx="76" cy="256" rx="15" ry="5" fill="#9ca3af" />
      <path d="M64 250 L72 247 M78 247 L87 249" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function FootwearHeels(): JSX.Element {
  return (
    <g>
      {/* Left heel */}
      <ellipse cx="56" cy="251" rx="13" ry="6" fill="#dc2626" />
      <ellipse cx="56" cy="255" rx="13" ry="4" fill="#b91c1c" />
      <rect x="41" y="249" width="3" height="9" rx="1" fill="#b91c1c" />
      {/* Right heel */}
      <ellipse cx="78" cy="251" rx="13" ry="6" fill="#dc2626" />
      <ellipse cx="78" cy="255" rx="13" ry="4" fill="#b91c1c" />
      <rect x="88" y="249" width="3" height="9" rx="1" fill="#b91c1c" />
    </g>
  )
}

function FootwearBoots(): JSX.Element {
  return (
    <g>
      {/* Left boot shaft */}
      <rect x="41" y="224" width="26" height="30" rx="7" fill="#92400e" />
      {/* Left boot toe */}
      <ellipse cx="54" cy="254" rx="14" ry="7" fill="#78350f" />
      {/* Right boot shaft */}
      <rect x="63" y="224" width="26" height="30" rx="7" fill="#92400e" />
      {/* Right boot toe */}
      <ellipse cx="76" cy="254" rx="14" ry="7" fill="#78350f" />
    </g>
  )
}

function FootwearSlippers(): JSX.Element {
  return (
    <g>
      {/* Left slipper */}
      <ellipse cx="54" cy="250" rx="16" ry="9" fill="#fda4af" />
      <ellipse cx="54" cy="257" rx="16" ry="6" fill="#fb7185" />
      {/* Fluffy top highlight */}
      <ellipse cx="54" cy="248" rx="10" ry="5" fill="#fecdd3" opacity="0.75" />
      {/* Right slipper */}
      <ellipse cx="76" cy="250" rx="16" ry="9" fill="#fda4af" />
      <ellipse cx="76" cy="257" rx="16" ry="6" fill="#fb7185" />
      <ellipse cx="76" cy="248" rx="10" ry="5" fill="#fecdd3" opacity="0.75" />
    </g>
  )
}

function FootwearSocks(): JSX.Element {
  return (
    <g>
      {/* Left sock */}
      <rect x="41" y="230" width="26" height="28" rx="8" fill="#f87171" />
      <ellipse cx="54" cy="256" rx="14" ry="7" fill="#ef4444" />
      {/* Polka dots on left */}
      <circle cx="50" cy="236" r="3" fill="white" opacity="0.8" />
      <circle cx="60" cy="240" r="3" fill="white" opacity="0.8" />
      <circle cx="48" cy="248" r="3" fill="white" opacity="0.8" />
      <circle cx="58" cy="252" r="2.5" fill="white" opacity="0.8" />
      {/* Right sock */}
      <rect x="63" y="230" width="26" height="28" rx="8" fill="#f87171" />
      <ellipse cx="76" cy="256" rx="14" ry="7" fill="#ef4444" />
      {/* Polka dots on right */}
      <circle cx="72" cy="236" r="3" fill="white" opacity="0.8" />
      <circle cx="82" cy="240" r="3" fill="white" opacity="0.8" />
      <circle cx="70" cy="248" r="3" fill="white" opacity="0.8" />
      <circle cx="80" cy="252" r="2.5" fill="white" opacity="0.8" />
    </g>
  )
}

function FootwearBalletShoes(): JSX.Element {
  return (
    <g>
      {/* Left ballet shoe */}
      <ellipse cx="54" cy="251" rx="15" ry="7" fill="#fda4af" />
      <ellipse cx="54" cy="256" rx="14" ry="5" fill="#fb7185" />
      {/* Left bow */}
      <polygon points="46,248 54,252 46,256" fill="#be123c" />
      <polygon points="62,248 54,252 62,256" fill="#be123c" />
      <circle cx="54" cy="252" r="3" fill="#fda4af" />
      {/* Right ballet shoe */}
      <ellipse cx="76" cy="251" rx="15" ry="7" fill="#fda4af" />
      <ellipse cx="76" cy="256" rx="14" ry="5" fill="#fb7185" />
      {/* Right bow */}
      <polygon points="68,248 76,252 68,256" fill="#be123c" />
      <polygon points="84,248 76,252 84,256" fill="#be123c" />
      <circle cx="76" cy="252" r="3" fill="#fda4af" />
    </g>
  )
}

function FootwearRainBoots(): JSX.Element {
  return (
    <g>
      {/* Left rain boot */}
      <rect x="41" y="224" width="26" height="30" rx="7" fill="#4ade80" />
      <ellipse cx="54" cy="254" rx="14" ry="7" fill="#22c55e" />
      {/* Dots on left boot */}
      <circle cx="50" cy="232" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="60" cy="238" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="48" cy="244" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="59" cy="250" r="2.5" fill="#86efac" opacity="0.8" />
      {/* Right rain boot */}
      <rect x="63" y="224" width="26" height="30" rx="7" fill="#4ade80" />
      <ellipse cx="76" cy="254" rx="14" ry="7" fill="#22c55e" />
      {/* Dots on right boot */}
      <circle cx="72" cy="232" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="82" cy="238" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="70" cy="244" r="3" fill="#86efac" opacity="0.8" />
      <circle cx="81" cy="250" r="2.5" fill="#86efac" opacity="0.8" />
    </g>
  )
}

function renderFootwear(footwearId: string): JSX.Element | null {
  if (footwearId === 'footwear-sneakers')     return <FootwearSneakers />
  if (footwearId === 'footwear-heels')        return <FootwearHeels />
  if (footwearId === 'footwear-boots')        return <FootwearBoots />
  if (footwearId === 'footwear-slippers')     return <FootwearSlippers />
  if (footwearId === 'footwear-socks')        return <FootwearSocks />
  if (footwearId === 'footwear-ballet-shoes') return <FootwearBalletShoes />
  if (footwearId === 'footwear-rain-boots')   return <FootwearRainBoots />
  // footwear-barefoot → bare leg rects already rendered, no overlay needed
  return null
}

// ── Accessories ───────────────────────────────────────────────────────────────

function AccessoryCrown(): JSX.Element {
  return (
    <g>
      <path d="M38 30 L41 16 L50 25 L58 12 L65 20 L72 12 L80 25 L89 16 L92 30 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <rect x="38" y="28" width="54" height="7" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="50" cy="21" r="4" fill="#ef4444" />
      <circle cx="65" cy="16" r="4.5" fill="#a855f7" />
      <circle cx="80" cy="21" r="4" fill="#22c55e" />
    </g>
  )
}

function AccessoryGlasses(): JSX.Element {
  return (
    <g>
      <circle cx="51" cy="57" r="12" fill="none" stroke="#ec4899" strokeWidth="2.5" />
      <circle cx="79" cy="57" r="12" fill="none" stroke="#ec4899" strokeWidth="2.5" />
      <line x1="63" y1="57" x2="67" y2="57" stroke="#ec4899" strokeWidth="2.5" />
      <line x1="39" y1="57" x2="33" y2="59" stroke="#ec4899" strokeWidth="2" />
      <line x1="91" y1="57" x2="97" y2="59" stroke="#ec4899" strokeWidth="2" />
    </g>
  )
}

function AccessoryHeadband(): JSX.Element {
  return (
    <g>
      <path d="M28 44 Q30 28 65 25 Q100 28 102 44" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round" />
      <circle cx="65" cy="26" r="8" fill="#f472b6" />
      <circle cx="65" cy="26" r="4" fill="#fbbf24" />
    </g>
  )
}

function AccessoryBowRed(): JSX.Element {
  return (
    <g>
      <polygon points="44,22 56,32 44,42" fill="#ef4444" />
      <polygon points="86,22 74,32 86,42" fill="#dc2626" />
      <circle cx="65" cy="32" r="9" fill="#f87171" />
      <circle cx="65" cy="32" r="4" fill="#ef4444" />
    </g>
  )
}

function AccessoryBowBlue(): JSX.Element {
  return (
    <g>
      <polygon points="44,22 56,32 44,42" fill="#3b82f6" />
      <polygon points="86,22 74,32 86,42" fill="#2563eb" />
      <circle cx="65" cy="32" r="9" fill="#60a5fa" />
      <circle cx="65" cy="32" r="4" fill="#3b82f6" />
    </g>
  )
}

function AccessoryCatEars(): JSX.Element {
  return (
    <g>
      {/* Left ear */}
      <polygon points="32,30 24,4 50,16" fill="#e879f9" />
      <polygon points="34,27 29,8 47,17" fill="#fdf4ff" />
      {/* Right ear */}
      <polygon points="98,30 106,4 80,16" fill="#e879f9" />
      <polygon points="96,27 101,8 83,17" fill="#fdf4ff" />
    </g>
  )
}

function AccessoryBaseballCap(): JSX.Element {
  return (
    <g>
      {/* Cap body */}
      <path d="M27 44 Q27 14 65 10 Q103 14 103 44 Q90 50 65 50 Q40 50 27 44 Z" fill="#2563eb" />
      {/* Visor */}
      <path d="M22 44 Q65 52 108 44 L106 50 Q65 58 24 50 Z" fill="#1d4ed8" />
      {/* Button */}
      <circle cx="65" cy="12" r="4" fill="#1e40af" />
    </g>
  )
}

function AccessoryNecklace(): JSX.Element {
  return (
    <g>
      <path d="M46 100 Q65 112 84 100" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="65" cy="113" r="5" fill="#fbbf24" />
      <circle cx="65" cy="113" r="3" fill="#fde68a" />
      <circle cx="65" cy="113" r="1.5" fill="#d97706" />
    </g>
  )
}

function AccessoryUmbrella(): JSX.Element {
  return (
    <g>
      {/* Stick */}
      <line x1="22" y1="173" x2="20" y2="106" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      {/* Canopy */}
      <path d="M2 106 Q20 84 38 106" fill="#a855f7" />
      <path d="M2 106 Q20 94 38 106" fill="#7c3aed" opacity="0.45" />
      <line x1="2" y1="106" x2="38" y2="106" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Ribs */}
      <line x1="20" y1="86" x2="2" y2="106" stroke="#7c3aed" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="86" x2="38" y2="106" stroke="#7c3aed" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="86" x2="20" y2="106" stroke="#7c3aed" strokeWidth="1" opacity="0.6" />
      {/* Handle curve */}
      <path d="M22 173 Q12 178 12 186 Q12 192 20 192" stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function AccessoryBag(): JSX.Element {
  return (
    <g>
      {/* Shoulder strap */}
      <path d="M82 103 Q104 118 102 168" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Bag body */}
      <rect x="88" y="167" width="28" height="22" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      {/* Flap */}
      <path d="M88 167 Q102 161 116 167 L116 175 Q102 171 88 175 Z" fill="#f59e0b" />
      {/* Clasp */}
      <circle cx="102" cy="174" r="3" fill="#d97706" />
    </g>
  )
}

function AccessorySunglasses(): JSX.Element {
  const L = "M51,69 C40,64 38,56 38,53 C38,48 42,46 46,46 C49,46 51,49 51,49 C51,49 53,46 56,46 C60,46 64,48 64,53 C64,56 62,64 51,69 Z"
  const R = "M79,69 C68,64 66,56 66,53 C66,48 70,46 74,46 C77,46 79,49 79,49 C79,49 81,46 84,46 C88,46 92,48 92,53 C92,56 90,64 79,69 Z"
  return (
    <g>
      {/* Tinted heart lenses */}
      <path d={L} fill="#fef08a" opacity="0.65" />
      <path d={R} fill="#fef08a" opacity="0.65" />
      {/* Frames */}
      <path d={L} fill="none" stroke="#1c1917" strokeWidth="2.5" />
      <path d={R} fill="none" stroke="#1c1917" strokeWidth="2.5" />
      {/* Bridge */}
      <line x1="64" y1="52" x2="66" y2="52" stroke="#1c1917" strokeWidth="2.5" />
      {/* Temples */}
      <line x1="38" y1="53" x2="32" y2="56" stroke="#1c1917" strokeWidth="2" />
      <line x1="92" y1="53" x2="98" y2="56" stroke="#1c1917" strokeWidth="2" />
      {/* Lens shine */}
      <path d="M43 50 Q46 47 49 49" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M71 50 Q74 47 77 49" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
    </g>
  )
}

function AccessoryRing(): JSX.Element {
  return (
    <g>
      {/* Ring on the waving right hand (hand at cx=117 cy=80) */}
      {/* Placed on the index finger area ~cy=65 */}
      <circle cx="117" cy="65" r="4.5" fill="none" stroke="#fbbf24" strokeWidth="3" />
      {/* Gem */}
      <circle cx="117" cy="62" r="2.5" fill="#a855f7" />
      <circle cx="117" cy="62" r="1" fill="#e879f9" />
    </g>
  )
}

function AccessoryWinterHat(): JSX.Element {
  return (
    <g>
      {/* Hat body (covers top of head) */}
      <path d="M27 46 Q27 16 65 10 Q103 16 103 46 Q90 52 65 52 Q40 52 27 46 Z" fill="#dc2626" />
      {/* Ribbed cuff */}
      <rect x="27" y="40" width="76" height="12" rx="6" fill="#b91c1c" />
      {/* Rib lines */}
      <line x1="40" y1="40" x2="40" y2="52" stroke="#991b1b" strokeWidth="1.5" opacity="0.6" />
      <line x1="53" y1="40" x2="53" y2="52" stroke="#991b1b" strokeWidth="1.5" opacity="0.6" />
      <line x1="65" y1="40" x2="65" y2="52" stroke="#991b1b" strokeWidth="1.5" opacity="0.6" />
      <line x1="77" y1="40" x2="77" y2="52" stroke="#991b1b" strokeWidth="1.5" opacity="0.6" />
      <line x1="90" y1="40" x2="90" y2="52" stroke="#991b1b" strokeWidth="1.5" opacity="0.6" />
      {/* Pom-pom */}
      <circle cx="65" cy="8" r="9" fill="#fbbf24" />
      <circle cx="62" cy="5" r="3.5" fill="#fef08a" opacity="0.65" />
    </g>
  )
}

function AccessorySwimRing(): JSX.Element {
  return (
    <g>
      {/* Swim ring: thick stroke on ellipse = donut/ring shape */}
      <ellipse cx="65" cy="170" rx="38" ry="13" fill="none" stroke="#f97316" strokeWidth="13" />
      {/* Yellow stripe overlay */}
      <ellipse cx="65" cy="170" rx="38" ry="13" fill="none" stroke="#fbbf24" strokeWidth="5" strokeDasharray="19 14" />
      {/* Blue stripe */}
      <ellipse cx="65" cy="170" rx="38" ry="13" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="19 14" strokeDashoffset="16" />
    </g>
  )
}

function AccessoryBracelet(): JSX.Element {
  return (
    <g>
      {/* Bracelet on left wrist (cx=22 cy=173) */}
      <ellipse cx="22" cy="173" rx="12" ry="5" fill="none" stroke="#d97706" strokeWidth="3" />
      {/* Colorful beads */}
      <circle cx="12" cy="171" r="3" fill="#ef4444" />
      <circle cx="16" cy="168" r="3" fill="#fbbf24" />
      <circle cx="22" cy="168" r="3" fill="#22c55e" />
      <circle cx="28" cy="168" r="3" fill="#3b82f6" />
      <circle cx="32" cy="171" r="3" fill="#e879f9" />
    </g>
  )
}

function AccessoryWatch(): JSX.Element {
  return (
    <g>
      {/* Watch band on right wrist area (near cx=117 cy=74) */}
      <ellipse cx="117" cy="74" rx="14" ry="5" fill="none" stroke="#374151" strokeWidth="5" />
      {/* Watch face */}
      <circle cx="117" cy="74" r="7" fill="#f9fafb" stroke="#374151" strokeWidth="1.5" />
      {/* Clock hands */}
      <line x1="117" y1="74" x2="117" y2="69" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="117" y1="74" x2="121" y2="74" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  )
}

function AccessoryScarf(): JSX.Element {
  return (
    <g>
      {/* Scarf wrapped around neck */}
      <path d="M36 100 Q65 96 94 100 L94 114 Q65 118 36 114 Z" fill="#ef4444" />
      {/* Yellow stripe on scarf */}
      <path d="M36 105 Q65 101 94 105 L94 109 Q65 113 36 109 Z" fill="#fbbf24" opacity="0.7" />
      {/* Hanging tail on left */}
      <path d="M40 114 Q34 132 38 155" stroke="#ef4444" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M40 114 Q34 132 38 155" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 5" />
      {/* Tail end fringe */}
      <line x1="34" y1="152" x2="32" y2="158" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="154" x2="36" y2="160" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="154" x2="42" y2="160" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

function AccessoryGloves(): JSX.Element {
  return (
    <g>
      {/* Left glove */}
      <circle cx="22" cy="173" r="12" fill="#7c3aed" />
      {/* Right glove — hand circle + fingers */}
      <circle cx="117" cy="80" r="14" fill="#7c3aed" />
      {/* Fingers in purple (matching the skin finger paths) */}
      <path d="M111 73 Q108 65 112 60" stroke="#5b21b6" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M111 73 Q108 65 112 60" stroke="#7c3aed" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke="#5b21b6" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke="#7c3aed" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke="#5b21b6" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke="#7c3aed" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function AccessoryTiara(): JSX.Element {
  return (
    <g>
      {/* Gold band */}
      <rect x="36" y="32" width="58" height="5" rx="2.5" fill="#fbbf24" />
      {/* Three small points */}
      <polygon points="55,32 58,22 61,32" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <polygon points="62,32 65,18 68,32" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <polygon points="69,32 72,22 75,32" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      {/* Gems on points */}
      <circle cx="58" cy="24" r="3" fill="#a855f7" />
      <circle cx="65" cy="20" r="3.5" fill="#ec4899" />
      <circle cx="72" cy="24" r="3" fill="#a855f7" />
    </g>
  )
}

function AccessoryButterflyWings(): JSX.Element {
  return (
    <g>
      {/* Upper left wing */}
      <path d="M35 130 Q18 118 4 128 Q2 148 14 158 Q26 164 35 155 Z" fill="#f0abfc" opacity="0.85" stroke="#a855f7" strokeWidth="1.2" />
      {/* Lower left wing */}
      <path d="M35 160 Q18 162 14 178 Q16 192 28 192 Q36 188 35 175 Z" fill="#e879f9" opacity="0.85" stroke="#a855f7" strokeWidth="1.2" />
      {/* Upper right wing */}
      <path d="M95 130 Q112 118 126 128 Q128 148 116 158 Q104 164 95 155 Z" fill="#f0abfc" opacity="0.85" stroke="#a855f7" strokeWidth="1.2" />
      {/* Lower right wing */}
      <path d="M95 160 Q112 162 116 178 Q114 192 102 192 Q94 188 95 175 Z" fill="#e879f9" opacity="0.85" stroke="#a855f7" strokeWidth="1.2" />
      {/* Wing veins — left upper */}
      <path d="M35 142 Q22 132 12 136" stroke="#c026d3" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M35 148 Q20 148 10 154" stroke="#c026d3" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Wing veins — right upper */}
      <path d="M95 142 Q108 132 118 136" stroke="#c026d3" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M95 148 Q110 148 120 154" stroke="#c026d3" strokeWidth="0.8" fill="none" opacity="0.6" />
    </g>
  )
}

function AccessoryFlowerGarland(): JSX.Element {
  return (
    <g>
      {/* Green vine */}
      <path d="M42 108 Q65 115 88 108" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Flower 1 — red */}
      <circle cx="46" cy="107" r="5" fill="#fca5a5" />
      <circle cx="46" cy="107" r="2.5" fill="#fbbf24" />
      {/* Flower 2 — purple */}
      <circle cx="55" cy="112" r="5" fill="#d8b4fe" />
      <circle cx="55" cy="112" r="2.5" fill="#fbbf24" />
      {/* Flower 3 — pink center */}
      <circle cx="65" cy="114" r="5" fill="#f9a8d4" />
      <circle cx="65" cy="114" r="2.5" fill="#fbbf24" />
      {/* Flower 4 — orange */}
      <circle cx="75" cy="112" r="5" fill="#fed7aa" />
      <circle cx="75" cy="112" r="2.5" fill="#fbbf24" />
      {/* Flower 5 — teal */}
      <circle cx="84" cy="107" r="5" fill="#99f6e4" />
      <circle cx="84" cy="107" r="2.5" fill="#fbbf24" />
    </g>
  )
}

function AccessorySantaHat(): JSX.Element {
  return (
    <g>
      {/* White brim */}
      <rect x="28" y="36" width="74" height="10" rx="5" fill="white" />
      {/* Red hat body — slightly tilted right */}
      <path d="M34 44 Q52 40 70 24 Q76 14 80 6 Q86 10 84 20 Q78 38 96 44 Z" fill="#dc2626" />
      {/* White pompom at tip */}
      <circle cx="80" cy="6" r="7" fill="white" />
    </g>
  )
}

function AccessoryBunnyEars(): JSX.Element {
  return (
    <g>
      {/* Pink headband */}
      <path d="M30 42 Q32 30 65 28 Q98 30 100 42" fill="none" stroke="#fda4af" strokeWidth="6" strokeLinecap="round" />
      {/* Left ear outer */}
      <ellipse cx="40" cy="12" rx="8" ry="18" fill="white" stroke="#fda4af" strokeWidth="1.5" />
      {/* Left ear inner */}
      <ellipse cx="40" cy="12" rx="4" ry="13" fill="#fda4af" />
      {/* Right ear outer */}
      <ellipse cx="90" cy="12" rx="8" ry="18" fill="white" stroke="#fda4af" strokeWidth="1.5" />
      {/* Right ear inner */}
      <ellipse cx="90" cy="12" rx="4" ry="13" fill="#fda4af" />
    </g>
  )
}

function AccessoryPartyHat(): JSX.Element {
  return (
    <g>
      {/* Hat cone */}
      <path d="M35 34 L65 4 L95 34 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      {/* Stripes on hat */}
      <path d="M40 30 Q65 8 90 30" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M44 34 Q65 18 86 34" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.8" />
      {/* Glitter dots */}
      <circle cx="58" cy="16" r="2" fill="#fbbf24" />
      <circle cx="72" cy="20" r="2" fill="#22c55e" />
      <circle cx="65" cy="10" r="2" fill="#38bdf8" />
      <circle cx="55" cy="26" r="1.5" fill="#ec4899" />
      <circle cx="75" cy="26" r="1.5" fill="#ef4444" />
      {/* Gold frilly base */}
      <path d="M33 34 Q42 40 51 34 Q60 40 69 34 Q78 40 87 34 Q96 40 97 34" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Elastic band line */}
      <path d="M35 34 Q50 42 65 44 Q80 42 95 34" stroke="#d97706" strokeWidth="1" fill="none" strokeDasharray="3 2" opacity="0.6" />
    </g>
  )
}

function renderAccessory(accessoryId: string): JSX.Element | null {
  if (accessoryId === 'accessory-crown')           return <AccessoryCrown />
  if (accessoryId === 'accessory-glasses')         return <AccessoryGlasses />
  if (accessoryId === 'accessory-headband')        return <AccessoryHeadband />
  if (accessoryId === 'accessory-bow-red')         return <AccessoryBowRed />
  if (accessoryId === 'accessory-bow-blue')        return <AccessoryBowBlue />
  if (accessoryId === 'accessory-cat-ears')        return <AccessoryCatEars />
  if (accessoryId === 'accessory-baseball-cap')    return <AccessoryBaseballCap />
  if (accessoryId === 'accessory-necklace')        return <AccessoryNecklace />
  if (accessoryId === 'accessory-umbrella')        return <AccessoryUmbrella />
  if (accessoryId === 'accessory-bag')             return <AccessoryBag />
  if (accessoryId === 'accessory-sunglasses')      return <AccessorySunglasses />
  if (accessoryId === 'accessory-ring')            return <AccessoryRing />
  if (accessoryId === 'accessory-winter-hat')      return <AccessoryWinterHat />
  if (accessoryId === 'accessory-swim-ring')       return <AccessorySwimRing />
  if (accessoryId === 'accessory-bracelet')        return <AccessoryBracelet />
  if (accessoryId === 'accessory-watch')           return <AccessoryWatch />
  if (accessoryId === 'accessory-scarf')           return <AccessoryScarf />
  if (accessoryId === 'accessory-gloves')          return <AccessoryGloves />
  if (accessoryId === 'accessory-tiara')           return <AccessoryTiara />
  if (accessoryId === 'accessory-butterfly-wings') return <AccessoryButterflyWings />
  if (accessoryId === 'accessory-flower-garland')  return <AccessoryFlowerGarland />
  if (accessoryId === 'accessory-santa-hat')       return <AccessorySantaHat />
  if (accessoryId === 'accessory-bunny-ears')      return <AccessoryBunnyEars />
  if (accessoryId === 'accessory-party-hat')       return <AccessoryPartyHat />
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

const SKIN    = '#FFE0BD'
const OUTLINE = '#2D1810'

export function PankaAvatarDressable({
  equipped,
  className = 'w-full h-full drop-shadow-lg',
}: Props): JSX.Element {
  return (
    <svg viewBox="0 0 130 260" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Head gradient — light from upper-left, warm shadow at edges */}
        <radialGradient id="pav-head" cx="40%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="#FFF6EC" />
          <stop offset="65%"  stopColor="#FFE0BD" />
          <stop offset="100%" stopColor="#D4A070" />
        </radialGradient>
      </defs>

      {/* 1. Hair back */}
      {renderHairBack(equipped.hair)}

      {/* 2. Legs — chibi: shorter, outlined */}
      <rect x="44" y="212" width="20" height="38" rx="10" fill={SKIN} stroke={OUTLINE} strokeWidth="1.5" />
      <rect x="66" y="212" width="20" height="38" rx="10" fill={SKIN} stroke={OUTLINE} strokeWidth="1.5" />

      {/* 3. Outfit */}
      {renderOutfit(equipped.outfit)}

      {/* 4. Footwear */}
      {renderFootwear(equipped.footwear)}

      {/* 5. Left arm — dark outline under, skin color on top */}
      <path d="M38 128 Q26 152 23 170" stroke={OUTLINE} strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M38 128 Q26 152 23 170" stroke={SKIN}    strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="173" r="11" fill={SKIN} stroke={OUTLINE} strokeWidth="1.5" />

      {/* 6. Right arm waving — dark outline under, skin on top */}
      <path d="M92 128 Q110 106 116 84" stroke={OUTLINE} strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M92 128 Q110 106 116 84" stroke={SKIN}    strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="117" cy="80" r="13" fill={SKIN} stroke={OUTLINE} strokeWidth="1.5" />
      {/* Fingers — outlined */}
      <path d="M111 73 Q108 65 112 60" stroke={OUTLINE} strokeWidth="7"   fill="none" strokeLinecap="round" />
      <path d="M111 73 Q108 65 112 60" stroke={SKIN}    strokeWidth="5"   fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke={OUTLINE} strokeWidth="7"   fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke={SKIN}    strokeWidth="5"   fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke={OUTLINE} strokeWidth="7"   fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke={SKIN}    strokeWidth="5"   fill="none" strokeLinecap="round" />

      {/* 7. Neck */}
      <rect x="57" y="87" width="16" height="16" rx="6" fill={SKIN} stroke={OUTLINE} strokeWidth="1.5" />

      {/* 8. Head — gradient fill, dark outline */}
      <circle cx="65" cy="58" r="38" fill="url(#pav-head)" stroke={OUTLINE} strokeWidth="1.5" />
      {/* Subtle chin shadow */}
      <ellipse cx="65" cy="91" rx="22" ry="6" fill="#C48040" opacity="0.15" />

      {/* 9. Face */}

      {/* Blush — behind eyes */}
      <circle cx="39" cy="69" r="12" fill="#fca5a5" opacity="0.38" />
      <circle cx="91" cy="69" r="12" fill="#fca5a5" opacity="0.38" />

      {/* Left eye */}
      <ellipse cx="51" cy="57" rx="12" ry="9" fill="white" stroke={OUTLINE} strokeWidth="1" />
      <circle  cx="53" cy="58" r="7"  fill="#1C1008" />
      <circle  cx="53" cy="58" r="4.5" fill="#5C3010" />
      <circle  cx="56" cy="55" r="2.5" fill="white" />
      <circle  cx="50" cy="61" r="1.2" fill="white" opacity="0.6" />
      {/* Eyelid arc + lashes */}
      <path d="M39 52 Q51 45 63 52" stroke={OUTLINE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="41" y1="53" x2="38" y2="48" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="61" y1="53" x2="64" y2="48" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />

      {/* Right eye */}
      <ellipse cx="79" cy="57" rx="12" ry="9" fill="white" stroke={OUTLINE} strokeWidth="1" />
      <circle  cx="81" cy="58" r="7"  fill="#1C1008" />
      <circle  cx="81" cy="58" r="4.5" fill="#5C3010" />
      <circle  cx="84" cy="55" r="2.5" fill="white" />
      <circle  cx="78" cy="61" r="1.2" fill="white" opacity="0.6" />
      {/* Eyelid arc + lashes */}
      <path d="M67 52 Q79 45 91 52" stroke={OUTLINE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="69" y1="53" x2="66" y2="48" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="89" y1="53" x2="92" y2="48" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />

      {/* Nose — two soft dots */}
      <circle cx="62" cy="69" r="2"   fill="#B06030" opacity="0.5" />
      <circle cx="68" cy="69" r="2"   fill="#B06030" opacity="0.5" />

      {/* Mouth */}
      <path d="M52 70 Q65 80 78 70" stroke={OUTLINE} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* 10. Hair front */}
      {renderHairFront(equipped.hair)}

      {/* 11. Accessory (topmost) */}
      {renderAccessory(equipped.accessory)}
    </svg>
  )
}
