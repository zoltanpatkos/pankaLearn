import { useState, useCallback, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { speak } from '../lib/tts'
import { getRandomPraise } from '../lib/praise'
import { playErrorPitt, playBigMelody } from '../lib/audio'

export type RewardType = 'micro' | 'small' | 'medium' | 'big' | 'error' | null

interface UseRewardsOptions {
  onTreeLevelUp: () => void
}

export interface UseRewardsReturn {
  activeReward: RewardType
  rewardKey: number
  triggerMicro: () => void
  triggerSmall: () => void
  triggerMedium: () => void
  triggerBig: () => void
  triggerError: () => void
}

function fireMediumConfetti(): void {
  void confetti({
    particleCount: 120,
    spread: 80,
    origin: { x: 0.5, y: 0.45 },
    colors: ['#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa'],
  })
}

function fireBigConfetti(): void {
  const fire = (x: number, y: number, count: number, delay: number): void => {
    setTimeout(() => {
      void confetti({
        particleCount: count,
        spread: 110,
        startVelocity: 48,
        origin: { x, y },
        colors: ['#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa', '#fb7185'],
      })
    }, delay)
  }
  fire(0.5, 0.35, 160, 0)
  fire(0.2, 0.5,  100, 350)
  fire(0.8, 0.5,  100, 700)
  fire(0.5, 0.2,   80, 1100)
}

export function useRewards({ onTreeLevelUp }: UseRewardsOptions): UseRewardsReturn {
  const [activeReward, setActiveReward] = useState<RewardType>(null)
  const [rewardKey, setRewardKey] = useState(0)
  const onTreeLevelUpRef = useRef(onTreeLevelUp)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onTreeLevelUpRef.current = onTreeLevelUp
  }, [onTreeLevelUp])

  const activate = useCallback((type: RewardType, duration: number): void => {
    if (clearTimer.current) clearTimeout(clearTimer.current)
    setActiveReward(type)
    setRewardKey(k => k + 1)
    clearTimer.current = setTimeout(() => setActiveReward(null), duration)
  }, [])

  const triggerMicro = useCallback((): void => {
    activate('micro', 1400)
    speak(getRandomPraise('micro'))
  }, [activate])

  const triggerSmall = useCallback((): void => {
    activate('small', 2600)
    speak(getRandomPraise('small'))
  }, [activate])

  const triggerMedium = useCallback((): void => {
    activate('medium', 3200)
    fireMediumConfetti()
    speak(getRandomPraise('medium'))
  }, [activate])

  const triggerBig = useCallback((): void => {
    activate('big', 5500)
    fireBigConfetti()
    playBigMelody()
    onTreeLevelUpRef.current()
    setTimeout(() => speak(getRandomPraise('big')), 700)
  }, [activate])

  const triggerError = useCallback((): void => {
    activate('error', 150)
    playErrorPitt()
    speak(getRandomPraise('error'))
  }, [activate])

  return { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerBig, triggerError }
}
