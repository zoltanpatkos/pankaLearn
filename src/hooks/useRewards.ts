import { useState, useCallback, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { speak } from '../lib/tts'
import { getRandomPraise } from '../lib/praise'
import { playErrorPitt, playBigMelody } from '../lib/audio'

export type RewardType = 'micro' | 'small' | 'medium' | 'big' | 'error' | null

interface UseRewardsOptions {
  onTreeLevelUp: () => void
  confettiColors?: string[]
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

const DEFAULT_CONFETTI = ['#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa']

function fireMediumConfetti(colors: string[]): void {
  void confetti({
    particleCount: 120,
    spread: 80,
    origin: { x: 0.5, y: 0.45 },
    colors,
  })
}

function fireBigConfetti(colors: string[]): void {
  const fire = (x: number, y: number, count: number, delay: number): void => {
    setTimeout(() => {
      void confetti({
        particleCount: count,
        spread: 110,
        startVelocity: 48,
        origin: { x, y },
        colors,
      })
    }, delay)
  }
  fire(0.5, 0.35, 160, 0)
  fire(0.2, 0.5,  100, 350)
  fire(0.8, 0.5,  100, 700)
  fire(0.5, 0.2,   80, 1100)
}

export function useRewards({ onTreeLevelUp, confettiColors }: UseRewardsOptions): UseRewardsReturn {
  const [activeReward, setActiveReward] = useState<RewardType>(null)
  const [rewardKey, setRewardKey] = useState(0)
  const onTreeLevelUpRef = useRef(onTreeLevelUp)
  const colorsRef = useRef(confettiColors ?? DEFAULT_CONFETTI)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onTreeLevelUpRef.current = onTreeLevelUp
  }, [onTreeLevelUp])

  useEffect(() => {
    colorsRef.current = confettiColors ?? DEFAULT_CONFETTI
  }, [confettiColors])

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
    fireMediumConfetti(colorsRef.current)
    speak(getRandomPraise('medium'))
  }, [activate])

  const triggerBig = useCallback((): void => {
    activate('big', 5500)
    fireBigConfetti(colorsRef.current)
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
