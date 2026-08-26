import { useEffect, useRef, useState, useCallback } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, isMuted, setMuted } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { Tree } from '../components/Tree'
import { PankaAvatarDressable } from '../components/PankaAvatarDressable'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import type { EquippedItems } from '../lib/wardrobe'
import { getStats, resetStats, type PerformanceStats } from '../lib/adaptive'

interface Props {
  mascotId: MascotId
  equippedItems: EquippedItems
  mathFlowers: number
  readingFlowers: number
  englishFlowers: number
  writingFlowers: number
  onOpenWardrobe: () => void
  onOpenMath: () => void
  onOpenReading: () => void
  onOpenEnglish: () => void
  onOpenWriting: () => void
  onOpenParentLock: () => void
  onMascotReset: () => void
}

type TreeLevel = 0 | 1 | 2 | 3 | 4

function clampTreeLevel(n: number): TreeLevel {
  if (n <= 0) return 0
  if (n >= 4) return 4
  return n as TreeLevel
}

// ── House-shaped module button ─────────────────────────────────
interface HouseButtonProps {
  emoji: string
  label: string
  bodyColor: string
  roofColor: string
  inkColor: string
  onClick: () => void
}

function HouseButton({ emoji, label, bodyColor, roofColor, inkColor, onClick }: HouseButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center active:scale-90 transition-transform duration-100"
    >
      {/* Roof triangle */}
      <div
        style={{
          width: 0, height: 0,
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: `20px solid ${roofColor}`,
        }}
      />
      {/* Body */}
      <div
        className="w-full rounded-b-[14px] flex flex-col items-center justify-end gap-1 pb-3 pt-2"
        style={{ background: bodyColor, boxShadow: 'var(--sh-1)', minHeight: '86px' }}
      >
        <span className="text-4xl leading-none">{emoji}</span>
        <span className="text-xs font-semibold" style={{ color: inkColor }}>{label}</span>
      </div>
    </button>
  )
}

// ── Flower bed: 4×2 grid of up to 8 flowers ───────────────────
function FlowerBed({ count, emoji }: { count: number; emoji: string }): JSX.Element {
  return (
    <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-px items-end justify-items-center py-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className={`text-base leading-none transition-opacity duration-500 ${i < count ? 'opacity-100' : 'opacity-0'}`}
          style={{ animationName: i === count - 1 ? 'flower-bloom' : 'none', animationDuration: '0.5s' }}
        >
          {emoji}
        </span>
      ))}
    </div>
  )
}

// ── Debug overlay ─────────────────────────────────────────────
function ago(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  return `${Math.floor(s / 3600)}h`
}

function DebugOverlay({ onClose }: { onClose: () => void }): JSX.Element {
  const [stats, setStats] = useState<PerformanceStats>(getStats)

  const handleReset = () => {
    resetStats()
    setStats({})
  }

  const taskTypes = Object.keys(stats)

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <span className="font-mono text-sm font-bold">🐛 Adaptive Debug</span>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="bg-red-700 active:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded"
          >
            Reset all
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 active:bg-gray-500 text-white text-xs font-bold px-3 py-1.5 rounded"
          >
            ✕ Close
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-white bg-gray-950">
        {taskTypes.length === 0 && (
          <p className="text-gray-500 italic">No data yet — play some rounds first.</p>
        )}
        {taskTypes.map(tt => (
          <div key={tt} className="mb-4">
            <p className="text-yellow-400 font-bold mb-1">{tt}</p>
            {Object.entries(stats[tt]).map(([id, s]) => (
              <p key={id} className="text-gray-300 pl-2 leading-relaxed">
                <span className="text-white">{id}</span>
                {'  '}
                <span className="text-green-400">{s.successes}/{s.attempts}</span>
                {'  '}
                <span className={s.weight > 1.5 ? 'text-red-400' : s.weight < 0.6 ? 'text-blue-400' : 'text-gray-400'}>
                  w:{s.weight.toFixed(2)}
                </span>
                {'  '}
                <span className="text-gray-500">{ago(s.lastSeen)} ago</span>
                {'  '}
                {s.lastResult ? '✓' : '✗'}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Cloud SVG ─────────────────────────────────────────────────
function Cloud({ className }: { className: string }): JSX.Element {
  return (
    <svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="50" rx="38" ry="24" fill="white" opacity="0.92" />
      <ellipse cx="80" cy="46" rx="36" ry="22" fill="white" opacity="0.92" />
      <ellipse cx="60" cy="36" rx="34" ry="28" fill="white" opacity="0.92" />
      <ellipse cx="105" cy="52" rx="28" ry="20" fill="white" opacity="0.92" />
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────
export function Garden({
  mascotId, equippedItems,
  mathFlowers, readingFlowers, englishFlowers, writingFlowers,
  onOpenWardrobe, onOpenMath, onOpenReading, onOpenEnglish, onOpenWriting,
  onOpenParentLock, onMascotReset,
}: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [muted, setMutedState] = useState(isMuted())
  const [showDebug, setShowDebug] = useState(false)
  const parentLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [treeLevel, setTreeLevel] = useState<TreeLevel>(
    clampTreeLevel(Number(localStorage.getItem('treeLevel')) || 0)
  )

  const handleTreeLevelUp = (): void => {
    setTreeLevel(prev => {
      const next = clampTreeLevel(prev + 1)
      localStorage.setItem('treeLevel', String(next))
      return next
    })
  }

  const { activeReward, rewardKey } = useRewards({ onTreeLevelUp: handleTreeLevelUp })

  useEffect(() => {
    speak(mascot.gardenSpeech)
  }, [mascotId]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = (): void => {
    unlockAudio()
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) speak(mascot.gardenSpeech)
  }

  // Parent lock: 3 s long press on tree trunk
  const handleTreePointerDown = useCallback(() => {
    parentLockTimer.current = setTimeout(() => {
      navigator.vibrate?.(40)
      unlockAudio()
      onOpenParentLock()
    }, 3000)
  }, [onOpenParentLock])

  const handleTreePointerCancel = useCallback(() => {
    if (parentLockTimer.current) { clearTimeout(parentLockTimer.current); parentLockTimer.current = null }
  }, [])

  const handleMascotTap = useCallback(() => {
    tapCount.current += 1
    if (tapTimer.current) clearTimeout(tapTimer.current)

    if (tapCount.current >= 5) {
      tapCount.current = 0
      setShowDebug(true)
      return
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0
      speak('Új barátot választasz?')
      onMascotReset()
    }, 300)
  }, [onMascotReset])

  // Daily chip: count modules with ≥ 1 flower
  const dailyDots = [mathFlowers, readingFlowers, writingFlowers, englishFlowers].filter(f => f > 0).length

  return (
    <>
    <div className="relative w-screen h-screen overflow-hidden select-none">

      {/* ── Sky ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-white" />

      {/* ── Clouds ── */}
      <Cloud className="absolute w-36 top-[4%] left-[12%] opacity-90" />
      <Cloud className="absolute w-52 top-[6%] left-[42%] opacity-75" />
      <Cloud className="absolute w-28 top-[3%] right-[18%] opacity-85" />

      {/* ── Grass (multi-layer) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%]">
        <div className="absolute inset-0 bg-green-800" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-800 mt-10" />
        <svg viewBox="0 0 1280 36" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-10">
          <path d="M0 26 Q80 6 160 26 Q240 46 320 26 Q400 6 480 26 Q560 46 640 26 Q720 6 800 26 Q880 46 960 26 Q1040 6 1120 26 Q1200 46 1280 26 L1280 36 L0 36 Z" fill="#16a34a"/>
        </svg>
        <svg viewBox="0 0 1280 28" preserveAspectRatio="none" className="absolute w-full h-8" style={{ top: '0.9rem' }}>
          <path d="M0 18 Q60 4 120 18 Q180 32 240 18 Q300 4 360 18 Q420 32 480 18 Q540 4 600 18 Q660 32 720 18 Q780 4 840 18 Q900 32 960 18 Q1020 4 1080 18 Q1140 32 1200 18 Q1240 8 1280 18 L1280 28 L0 28 Z" fill="#4ade80" opacity="0.75"/>
        </svg>
      </div>

      {/* ── Tree — center, 3 s long press unlocks parent settings ── */}
      <div
        className="absolute bottom-[34%] left-1/2 -translate-x-1/2"
        onPointerDown={handleTreePointerDown}
        onPointerUp={handleTreePointerCancel}
        onPointerLeave={handleTreePointerCancel}
        onContextMenu={e => e.preventDefault()}
      >
        <Tree level={treeLevel} />
      </div>

      {/* ── Bottom zone: flower beds + house strip (left of Panka kuckó) ── */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5" style={{ right: '156px' }}>

        {/* Flower beds — one per module, directly above their house */}
        <div className="flex gap-2">
          <FlowerBed count={mathFlowers}    emoji="🌷" />
          <FlowerBed count={readingFlowers} emoji="🌻" />
          <FlowerBed count={writingFlowers} emoji="🌹" />
          <FlowerBed count={englishFlowers} emoji="🌺" />
        </div>

        {/* House strip — 4 module houses */}
        <div className="flex gap-2">
          <HouseButton
            emoji="🔢" label="Matek"
            bodyColor="#fbbf24" roofColor="#d97706" inkColor="#78350f"
            onClick={() => { unlockAudio(); onOpenMath() }}
          />
          <HouseButton
            emoji="📚" label="Olvasás"
            bodyColor="#3b82f6" roofColor="#1d4ed8" inkColor="#ffffff"
            onClick={() => { unlockAudio(); onOpenReading() }}
          />
          <HouseButton
            emoji="✏️" label="Írás"
            bodyColor="#8b5cf6" roofColor="#5b21b6" inkColor="#ffffff"
            onClick={() => { unlockAudio(); onOpenWriting() }}
          />
          <HouseButton
            emoji="✈️" label="Angol"
            bodyColor="#22c55e" roofColor="#15803d" inkColor="#ffffff"
            onClick={() => { unlockAudio(); onOpenEnglish() }}
          />
        </div>

      </div>

      {/* ── Panka kuckó (right side, bottom) ── */}
      <div className="absolute right-3 bottom-3 flex items-end gap-2 z-30">

        {/* Panka avatar */}
        <div className="w-20 h-44">
          <PankaAvatarDressable equipped={equippedItems} />
        </div>

        {/* Wardrobe button + mascot mini (stacked) */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => { unlockAudio(); onOpenWardrobe() }}
            style={{ background: 'linear-gradient(to bottom,#a78bfa,#7c3aed)', boxShadow: 'var(--sh-1)' }}
            className="w-14 h-[70px] rounded-[14px] flex items-center justify-center text-2xl active:scale-90 transition-transform"
            aria-label="Ruhatár"
          >
            👗
          </button>

          {/* Mascot mini: tap → swap (5× rapid → debug) */}
          <button
            onClick={handleMascotTap}
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/60 bg-white/20 active:scale-90 transition-transform"
          >
            <Illustration />
          </button>
        </div>

      </div>

      {/* ── Volume + daily progress (top-left) ── */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <button
          onClick={toggleMute}
          style={{ boxShadow: 'var(--sh-1)' }}
          className="w-14 h-14 rounded-full bg-white/80 active:bg-white flex items-center justify-center text-2xl active:scale-90 transition-transform"
          aria-label={muted ? 'Hang be' : 'Hang ki'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        {/* Daily progress chip: 4 flower dots, filled = modules with ≥ 1 flower */}
        <div className="flex items-center gap-1 bg-white/70 rounded-full px-3 py-1.5" style={{ boxShadow: 'var(--sh-1)' }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`text-lg leading-none transition-opacity duration-300 ${i < dailyDots ? 'opacity-100' : 'opacity-25'}`}>
              🌸
            </span>
          ))}
        </div>
      </div>

      {/* ── Reward overlay ── */}
      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />

    </div>

    {showDebug && <DebugOverlay onClose={() => setShowDebug(false)} />}
    </>
  )
}
