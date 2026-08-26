import type { JSX, ReactNode } from 'react'

export type Hue = 'yellow' | 'blue' | 'purple' | 'green'

const HUE_BG: Record<Hue, string> = {
  yellow: 'bg-yellow-400',
  blue:   'bg-blue-500',
  purple: 'bg-purple-600',
  green:  'bg-green-500',
}

const HUE_DOT_FULL: Record<Hue, string> = {
  yellow: 'bg-yellow-900',
  blue:   'bg-blue-900',
  purple: 'bg-purple-900',
  green:  'bg-green-900',
}

const HUE_DOT_FAINT: Record<Hue, string> = {
  yellow: 'bg-yellow-900/20',
  blue:   'bg-blue-900/20',
  purple: 'bg-purple-900/20',
  green:  'bg-green-900/20',
}

interface Props {
  hue: Hue
  progressIndex: number  // 0-based current task index
  total: number
  onBack: () => void
  onRepeat: () => void
  children: ReactNode
}

export function TaskShell({ hue, progressIndex, total, onBack, onRepeat, children }: Props): JSX.Element {
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

        <div className="flex-1 flex justify-center items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={[
                'rounded-full transition-all duration-300',
                i < progressIndex
                  ? `w-3 h-3 bg-white opacity-70`
                  : i === progressIndex
                  ? `w-4 h-4 ${HUE_DOT_FULL[hue]}`
                  : `w-3 h-3 ${HUE_DOT_FAINT[hue]}`,
              ].join(' ')}
            />
          ))}
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

      {/* White content card */}
      <div
        style={{ boxShadow: 'var(--sh-1)', borderRadius: 'var(--r-card)' }}
        className="absolute left-4 right-4 top-[80px] bottom-5 bg-white overflow-hidden flex flex-col"
      >
        {children}
      </div>

    </div>
  )
}
