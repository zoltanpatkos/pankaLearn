import type { JSX, ReactNode } from 'react'
import type { Hue } from './TaskShell'

const HUE_BG: Record<Hue, string> = {
  yellow: 'bg-yellow-400',
  blue:   'bg-blue-500',
  purple: 'bg-purple-600',
  green:  'bg-green-500',
}

const HUE_INK: Record<Hue, string> = {
  yellow: 'text-yellow-900',
  blue:   'text-blue-900',
  purple: 'text-purple-900',
  green:  'text-green-900',
}

interface Props {
  hue: Hue
  title: string
  onBack: () => void
  onRepeat: () => void
  children: ReactNode
}

export function ScreenShell({ hue, title, onBack, onRepeat, children }: Props): JSX.Element {
  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none ${HUE_BG[hue]}`}>

      {/* Header strip — on the hue background, no white panel */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-4 z-10">
        <button
          onClick={onBack}
          style={{ boxShadow: 'var(--sh-1)' }}
          className="w-14 h-14 rounded-full bg-white/85 flex items-center justify-center text-2xl flex-shrink-0 active:scale-90 transition-transform"
          aria-label="Vissza a kertbe"
        >
          🌳
        </button>

        <div className={`flex-1 text-center text-[22px] font-semibold ${HUE_INK[hue]}`}>
          {title}
        </div>

        <button
          onClick={onRepeat}
          style={{ boxShadow: 'var(--sh-1)' }}
          className="w-14 h-14 rounded-full bg-white/85 flex items-center justify-center text-2xl flex-shrink-0 active:scale-90 transition-transform"
          aria-label="Mondd újra"
        >
          🔊
        </button>
      </div>

      {/* Body — below header */}
      <div className="absolute top-[80px] left-0 right-0 bottom-0 flex flex-col">
        {children}
      </div>

    </div>
  )
}
