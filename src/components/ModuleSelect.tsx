import type { JSX } from 'react'
import { ScreenShell } from './ScreenShell'
import type { Hue } from './TaskShell'

const HUE_INK: Record<Hue, string> = {
  yellow: 'text-yellow-900',
  blue:   'text-blue-900',
  purple: 'text-purple-900',
  green:  'text-green-900',
}

interface CardOption {
  emoji: string
  label: string
  sublabel: string
  onClick: () => void
  special?: boolean
}

interface Props {
  hue: Hue
  title: string
  Illustration: () => JSX.Element
  cards: CardOption[]
  onBack: () => void
  onRepeat: () => void
}

export function ModuleSelect({ hue, title, Illustration, cards, onBack, onRepeat }: Props): JSX.Element {
  return (
    <ScreenShell hue={hue} title={title} onBack={onBack} onRepeat={onRepeat}>
      <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pb-6">

        {/* Mascot stamp — round white circle */}
        <div
          className="w-28 h-28 rounded-full bg-white flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: 'var(--sh-1)' }}
        >
          <div className="w-20 h-20">
            <Illustration />
          </div>
        </div>

        {/* Question */}
        <p className={`text-[24px] font-bold text-center leading-snug ${HUE_INK[hue]}`}>
          Melyik játékot választod?
        </p>

        {/* Game cards — 2 cols, rows as needed */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={card.onClick}
              style={{
                borderRadius: 'var(--r-card)',
                gridColumn: cards.length % 2 === 1 && i === cards.length - 1 ? 'span 2' : undefined,
                ...(card.special
                  ? {
                      background: 'linear-gradient(155deg, #fef3c7 0%, #fde68a 45%, #fbbf24 100%)',
                      border: '3px solid #d97706',
                      boxShadow: '0 0 0 3px #fffbeb, 0 6px 18px rgba(217,119,6,0.35)',
                    }
                  : { background: 'white', boxShadow: 'var(--sh-1)' }),
              }}
              className={`relative flex flex-col items-center gap-2 px-3 active:scale-95 transition-transform duration-100 ${cards.length <= 2 ? 'py-7' : 'py-5'}`}
            >
              {card.special && (
                <span
                  style={{ boxShadow: 'var(--sh-1)' }}
                  className="absolute -top-2 -right-2 bg-amber-600 text-white text-[11px] font-bold rounded-full px-2.5 py-1"
                >
                  ⭐ Haladó
                </span>
              )}
              <span className="text-5xl leading-none">{card.emoji}</span>
              <span className={`text-[18px] font-bold leading-tight text-center ${card.special ? 'text-amber-900' : 'text-gray-800'}`}>{card.label}</span>
              <span className={`text-[12px] font-medium text-center leading-tight px-1 ${card.special ? 'text-amber-800' : 'text-gray-500'}`}>{card.sublabel}</span>
            </button>
          ))}
        </div>

      </div>
    </ScreenShell>
  )
}
