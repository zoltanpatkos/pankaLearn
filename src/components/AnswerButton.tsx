import type { JSX, ReactNode } from 'react'
import type { Hue } from './TaskShell'

export type AnswerState = 'idle' | 'correct' | 'wrong'

const HUE_BG: Record<Hue, string> = {
  yellow: 'bg-yellow-400',
  blue:   'bg-blue-500',
  purple: 'bg-purple-600',
  green:  'bg-green-500',
}

interface Props {
  hue: Hue
  state?: AnswerState
  onClick?: () => void
  children: ReactNode
  className?: string
}

export function AnswerButton({ hue, state = 'idle', onClick, children, className = '' }: Props): JSX.Element {
  const isCorrect = state === 'correct'
  const isWrong = state === 'wrong'

  return (
    <button
      onClick={state === 'idle' ? onClick : undefined}
      style={{
        borderRadius: 'var(--r-card)',
        boxShadow: isWrong
          ? 'inset 0 0 0 3px #ef4444, var(--sh-1)'
          : 'var(--sh-1)',
        animation: isWrong
          ? 'shake-no 0.4s ease-out'
          : isCorrect
          ? 'correct-answer 0.4s ease-out'
          : 'none',
      }}
      className={[
        'relative text-white font-bold transition-colors duration-150',
        'active:scale-95 transition-transform',
        isCorrect ? 'bg-green-500' : HUE_BG[hue],
        className,
      ].join(' ')}
    >
      {children}
      {isCorrect && (
        <span
          style={{ boxShadow: 'var(--sh-1)' }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-green-500 text-sm font-bold flex items-center justify-center"
        >
          ✓
        </span>
      )}
    </button>
  )
}
