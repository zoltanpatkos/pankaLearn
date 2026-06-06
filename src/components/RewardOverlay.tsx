import type { JSX } from 'react'
import type { RewardType } from '../hooks/useRewards'
import { MASCOTS, type MascotId } from '../mascots'

interface Props {
  type: RewardType
  rewardKey: number
  mascotId: MascotId
}

export function RewardOverlay({ type, rewardKey, mascotId }: Props): JSX.Element | null {
  if (!type || type === 'error') return null

  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">

      {type === 'micro' && (
        <span
          key={rewardKey}
          className="text-[7rem] leading-none select-none"
          style={{ animation: 'star-pop 0.9s ease-out forwards' }}
        >
          ⭐
        </span>
      )}

      {type === 'medium' && (
        <div
          key={rewardKey}
          className="flex gap-4 items-end"
          style={{ animation: 'flower-bloom 0.65s ease-out forwards' }}
        >
          <span className="text-7xl select-none">🌸</span>
          <span className="text-8xl select-none">🌺</span>
          <span className="text-7xl select-none">🌼</span>
        </div>
      )}

      {type === 'big' && (
        <div key={rewardKey} className="flex flex-col items-center gap-3">
          <div
            className="w-44 h-44"
            style={{ animation: 'bounce-dance 0.45s ease-in-out infinite' }}
          >
            <Illustration />
          </div>
          <span
            className="text-6xl select-none"
            style={{ animation: 'star-pop 0.9s ease-out 0.4s backwards' }}
          >
            🎉
          </span>
        </div>
      )}

    </div>
  )
}
