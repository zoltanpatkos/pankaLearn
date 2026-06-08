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

function renderHairBack(hairId: string): JSX.Element {
  if (hairId === 'hair-pigtails') return <HairBackPigtails />
  if (hairId === 'hair-ponytail') return <HairBackPonytail />
  if (hairId === 'hair-braid')    return <HairBackBraid />
  if (hairId === 'hair-wavy')     return <HairBackWavy />
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

function renderHairFront(hairId: string): JSX.Element {
  if (hairId === 'hair-pigtails') return <HairFrontPigtails />
  if (hairId === 'hair-ponytail') return <HairFrontPonytail />
  if (hairId === 'hair-braid')    return <HairFrontBraid />
  if (hairId === 'hair-wavy')     return <HairFrontWavy />
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

function renderOutfit(outfitId: string): JSX.Element {
  if (outfitId === 'outfit-princess')  return <OutfitPrincess />
  if (outfitId === 'outfit-ballerina') return <OutfitBallerina />
  if (outfitId === 'outfit-sporty')    return <OutfitSporty />
  if (outfitId === 'outfit-ladybug')   return <OutfitLadybug />
  if (outfitId === 'outfit-fairy')     return <OutfitFairy />
  if (outfitId === 'outfit-bee')       return <OutfitBee />
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

function renderFootwear(footwearId: string): JSX.Element | null {
  if (footwearId === 'footwear-sneakers') return <FootwearSneakers />
  if (footwearId === 'footwear-heels')    return <FootwearHeels />
  if (footwearId === 'footwear-boots')    return <FootwearBoots />
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

function renderAccessory(accessoryId: string): JSX.Element | null {
  if (accessoryId === 'accessory-crown')        return <AccessoryCrown />
  if (accessoryId === 'accessory-glasses')      return <AccessoryGlasses />
  if (accessoryId === 'accessory-headband')     return <AccessoryHeadband />
  if (accessoryId === 'accessory-bow-red')      return <AccessoryBowRed />
  if (accessoryId === 'accessory-bow-blue')     return <AccessoryBowBlue />
  if (accessoryId === 'accessory-cat-ears')     return <AccessoryCatEars />
  if (accessoryId === 'accessory-baseball-cap') return <AccessoryBaseballCap />
  if (accessoryId === 'accessory-necklace')     return <AccessoryNecklace />
  if (accessoryId === 'accessory-umbrella')     return <AccessoryUmbrella />
  if (accessoryId === 'accessory-bag')          return <AccessoryBag />
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export function PankaAvatarDressable({
  equipped,
  className = 'w-full h-full drop-shadow-lg',
}: Props): JSX.Element {
  return (
    <svg viewBox="0 0 130 260" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 1. Hair back */}
      {renderHairBack(equipped.hair)}

      {/* 2. Legs */}
      <rect x="44" y="210" width="20" height="44" rx="10" fill="#fde68a" />
      <rect x="66" y="210" width="20" height="44" rx="10" fill="#fde68a" />

      {/* 3. Outfit */}
      {renderOutfit(equipped.outfit)}

      {/* 4. Footwear (on top of outfit feet) */}
      {renderFootwear(equipped.footwear)}

      {/* 5. Left arm down */}
      <path d="M38 128 Q26 152 23 170" stroke="#fde68a" strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="173" r="9" fill="#fde68a" />

      {/* 6. Right arm waving */}
      <path d="M92 128 Q110 106 116 84" stroke="#fde68a" strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="117" cy="80" r="11" fill="#fde68a" />
      <path d="M111 73 Q108 65 112 60" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M117 70 Q115 62 119 57" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M123 73 Q124 65 128 61" stroke="#fde68a" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* 7. Neck */}
      <rect x="57" y="87" width="16" height="16" rx="6" fill="#fde68a" />

      {/* 8. Head */}
      <circle cx="65" cy="58" r="38" fill="#fde68a" />

      {/* 9. Face */}
      <circle cx="52" cy="56" r="9" fill="white" />
      <circle cx="78" cy="56" r="9" fill="white" />
      <circle cx="54" cy="57" r="5.5" fill="#1c1917" />
      <circle cx="80" cy="57" r="5.5" fill="#1c1917" />
      <circle cx="56" cy="55" r="2" fill="white" />
      <circle cx="82" cy="55" r="2" fill="white" />
      <circle cx="42" cy="66" r="9" fill="#fca5a5" opacity="0.4" />
      <circle cx="88" cy="66" r="9" fill="#fca5a5" opacity="0.4" />
      <path d="M52 70 Q65 80 78 70" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* 10. Hair front */}
      {renderHairFront(equipped.hair)}

      {/* 11. Accessory (topmost) */}
      {renderAccessory(equipped.accessory)}
    </svg>
  )
}
