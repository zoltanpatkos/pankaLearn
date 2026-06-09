import type { JSX } from 'react'

type TreeLevel = 0 | 1 | 2 | 3 | 4

interface Props {
  level: TreeLevel
}

function Sprout(): JSX.Element {
  return (
    <svg viewBox="0 0 70 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="35" y1="98" x2="35" y2="42" stroke="#65a30d" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 52 Q18 34 22 18 Q38 30 35 52" fill="#86efac" />
      <path d="M35 52 Q52 34 48 18 Q32 30 35 52" fill="#4ade80" />
      <ellipse cx="35" cy="56" rx="5" ry="3" fill="#65a30d" opacity="0.4" />
    </svg>
  )
}

function Bush(): JSX.Element {
  return (
    <svg viewBox="0 0 150 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="64" y="108" width="22" height="30" rx="6" fill="#92400e" />
      <ellipse cx="55" cy="86" rx="40" ry="36" fill="#4ade80" />
      <ellipse cx="95" cy="86" rx="40" ry="36" fill="#22c55e" />
      <ellipse cx="75" cy="65" rx="42" ry="40" fill="#86efac" />
      <circle cx="55" cy="62" r="14" fill="#bbf7d0" opacity="0.45" />
      <circle cx="92" cy="70" r="11" fill="#bbf7d0" opacity="0.35" />
    </svg>
  )
}

function YoungTree(): JSX.Element {
  return (
    <svg viewBox="0 0 170 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="74" y="148" width="22" height="68" rx="7" fill="#92400e" />
      <path d="M74 168 Q52 152 38 142" stroke="#92400e" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M96 168 Q118 152 132 142" stroke="#92400e" strokeWidth="10" fill="none" strokeLinecap="round" />
      <ellipse cx="85" cy="98" rx="66" ry="72" fill="#15803d" />
      <ellipse cx="68" cy="80" rx="46" ry="52" fill="#16a34a" />
      <ellipse cx="104" cy="84" rx="42" ry="48" fill="#22c55e" />
      <ellipse cx="85" cy="62" rx="36" ry="38" fill="#4ade80" />
      <circle cx="70" cy="60" r="16" fill="#86efac" opacity="0.4" />
    </svg>
  )
}

function FullTree(): JSX.Element {
  return (
    <svg viewBox="0 0 210 270" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M94 268 Q90 232 96 188" stroke="#78350f" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M116 268 Q120 232 114 188" stroke="#78350f" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M96 210 Q70 190 52 174" stroke="#92400e" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M114 210 Q140 190 158 174" stroke="#92400e" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M105 194 Q105 165 105 150" stroke="#92400e" strokeWidth="10" fill="none" strokeLinecap="round" />
      <ellipse cx="105" cy="110" rx="92" ry="95" fill="#14532d" />
      <ellipse cx="84" cy="90" rx="68" ry="74" fill="#15803d" />
      <ellipse cx="126" cy="96" rx="62" ry="68" fill="#16a34a" />
      <ellipse cx="105" cy="68" rx="58" ry="62" fill="#22c55e" />
      <ellipse cx="85" cy="58" rx="38" ry="42" fill="#4ade80" />
      <circle cx="82" cy="56" r="20" fill="#86efac" opacity="0.35" />
      <circle cx="122" cy="75" r="16" fill="#86efac" opacity="0.28" />
    </svg>
  )
}

function BloomTree(): JSX.Element {
  return (
    <svg viewBox="0 0 230 295" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M104 292 Q99 254 106 204" stroke="#78350f" strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d="M126 292 Q131 254 124 204" stroke="#78350f" strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d="M106 226 Q76 204 54 184" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M124 226 Q154 204 176 184" stroke="#92400e" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M115 210 Q115 176 115 158" stroke="#92400e" strokeWidth="11" fill="none" strokeLinecap="round" />
      <ellipse cx="115" cy="112" rx="102" ry="104" fill="#14532d" />
      <ellipse cx="92" cy="90" rx="74" ry="80" fill="#15803d" />
      <ellipse cx="138" cy="96" rx="68" ry="74" fill="#16a34a" />
      <ellipse cx="115" cy="68" rx="64" ry="66" fill="#22c55e" />
      {/* Flowers */}
      <circle cx="76" cy="82" r="15" fill="#fce7f3" />
      <circle cx="73" cy="82" r="9" fill="#fbcfe8" />
      <circle cx="76" cy="82" r="4.5" fill="#fbbf24" />
      <circle cx="154" cy="74" r="16" fill="#fce7f3" />
      <circle cx="151" cy="74" r="10" fill="#fbcfe8" />
      <circle cx="154" cy="74" r="5" fill="#fbbf24" />
      <circle cx="115" cy="52" r="14" fill="#fce7f3" />
      <circle cx="112" cy="52" r="8" fill="#fbcfe8" />
      <circle cx="115" cy="52" r="4" fill="#fbbf24" />
      <circle cx="92" cy="60" r="12" fill="#fce7f3" />
      <circle cx="89" cy="60" r="7" fill="#fbcfe8" />
      <circle cx="92" cy="60" r="3.5" fill="#fbbf24" />
      <circle cx="138" cy="104" r="13" fill="#fce7f3" />
      <circle cx="135" cy="104" r="7.5" fill="#fbcfe8" />
      <circle cx="138" cy="104" r="3.5" fill="#fbbf24" />
      {/* Apples */}
      <circle cx="97" cy="120" r="12" fill="#ef4444" />
      <path d="M97 109 Q100 104 103 107" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="119" r="3.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="134" cy="112" r="11" fill="#dc2626" />
      <path d="M134 101 Q137 96 140 99" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="133" cy="111" r="3" fill="#fca5a5" opacity="0.4" />
      <circle cx="62" cy="128" r="10" fill="#ef4444" />
      <path d="M62 118 Q65 113 68 116" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const TREE_COMPONENTS: Record<TreeLevel, () => JSX.Element> = {
  0: Sprout,
  1: Bush,
  2: YoungTree,
  3: FullTree,
  4: BloomTree,
}

const TREE_SIZES: Record<TreeLevel, string> = {
  0: 'w-20 h-24',
  1: 'w-36 h-32',
  2: 'w-48 h-56',
  3: 'w-60 h-72',
  4: 'w-72 h-80',
}

export function Tree({ level }: Props): JSX.Element {
  const TreeComponent = TREE_COMPONENTS[level]
  return (
    <div className={TREE_SIZES[level]}>
      <TreeComponent />
    </div>
  )
}
