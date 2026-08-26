import { useState } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import type { Hue } from './TaskShell'

const HUE_BTN: Record<Hue, { bg: string; text: string }> = {
  yellow: { bg: 'bg-yellow-400', text: 'text-yellow-900' },
  blue:   { bg: 'bg-blue-500',   text: 'text-white' },
  purple: { bg: 'bg-purple-600', text: 'text-white' },
  green:  { bg: 'bg-green-500',  text: 'text-white' },
}

const PRAISES = [
  'Szuper voltál!',
  'Fantasztikus!',
  'Menő vagy!',
  'Brávó, brávó!',
  'Klassz!',
  'Te vagy a legjobb!',
  'Mesés!',
  'Nagyon ügyes voltál!',
]

export interface RoundEndState {
  hue: Hue
  flowerEmoji: string
  flowerName: string
  moduleScreen: 'math' | 'reading' | 'writing' | 'english'
  unlockedItemId: string | null
}

interface Props {
  data: RoundEndState
  mascotId: MascotId
  onPlayAgain: () => void
  onStay: () => void
}

export function RoundCompleteOverlay({ data, mascotId, onPlayAgain, onStay }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)])

  const rewardEmoji = data.unlockedItemId ? '👗' : data.flowerEmoji
  const title = data.unlockedItemId
    ? 'Új ruha vár rád a szekrényben!'
    : `Új ${data.flowerName} nőtt a kertedben!`

  const { bg, text } = HUE_BTN[data.hue]

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: 'rgba(0,0,0,0.32)' }}
    >

      {/* Reward object flanked by 2 stars */}
      <div className="flex items-center gap-6">
        <span
          className="text-5xl select-none"
          style={{ animation: 'star-pop 0.8s ease-out 0.1s both' }}
        >⭐</span>

        <div className="flex flex-col items-center gap-4">
          <span
            className="leading-none select-none"
            style={{
              fontSize: '110px',
              filter: 'drop-shadow(0 0 28px rgba(255,255,255,0.55))',
              animation: 'star-pop 0.7s ease-out forwards',
            }}
          >
            {rewardEmoji}
          </span>
          <p className="text-white font-bold text-center leading-tight" style={{ fontSize: '26px' }}>
            {title}
          </p>
        </div>

        <span
          className="text-5xl select-none"
          style={{ animation: 'star-pop 0.8s ease-out 0.3s both' }}
        >⭐</span>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onPlayAgain}
          style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)' }}
          className={`${bg} ${text} font-bold text-xl py-5 text-center active:scale-95 transition-transform`}
        >
          🔄 Még egy kör!
        </button>
        <button
          onClick={onStay}
          style={{ borderRadius: 'var(--r-card)', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)' }}
          className="text-white font-semibold text-base py-4 text-center active:scale-95 transition-transform"
        >
          🌳 Maradok a kertben
        </button>
      </div>

      {/* Mascot + speech bubble bottom-left */}
      <div className="absolute bottom-4 left-4 flex items-end gap-2">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
          <Illustration />
        </div>
        <div
          className="bg-white rounded-[var(--r-card)] px-3 py-2 mb-2 max-w-[180px]"
          style={{ boxShadow: 'var(--sh-1)' }}
        >
          <p className="text-gray-800 font-semibold text-sm leading-snug">{praise}</p>
        </div>
      </div>

    </div>
  )
}
