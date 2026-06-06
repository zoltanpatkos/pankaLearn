import { useEffect, useRef, useState } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, isMuted, setMuted } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { Tree } from '../components/Tree'
import { PankaAvatar } from '../components/PankaAvatar'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'

interface Props {
  mascotId: MascotId
}

interface ModuleButtonProps {
  emoji: string
  label: string
  bg: string
  active: boolean
  onClick: () => void
}

function ModuleButton({ emoji, label, bg, active, onClick }: ModuleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-col items-center justify-center gap-1.5',
        'rounded-3xl shadow-2xl px-4 py-3 min-w-[120px] min-h-[100px]',
        'border-4 border-white/30',
        'transition-transform active:scale-90 duration-100',
        bg,
        active ? '' : 'opacity-55',
      ].join(' ')}
    >
      <span className="text-5xl leading-none">{emoji}</span>
      <span className="text-white font-bold text-lg drop-shadow leading-tight">{label}</span>
      {!active && (
        <span className="text-white/85 text-xs bg-black/25 rounded-full px-2 py-0.5 leading-tight">
          Hamarosan
        </span>
      )}
    </button>
  )
}

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="50" rx="38" ry="24" fill="white" opacity="0.92" />
      <ellipse cx="80" cy="46" rx="36" ry="22" fill="white" opacity="0.92" />
      <ellipse cx="60" cy="36" rx="34" ry="28" fill="white" opacity="0.92" />
      <ellipse cx="105" cy="52" rx="28" ry="20" fill="white" opacity="0.92" />
    </svg>
  )
}

function GardenFlower({ x, emoji, size }: { x: string; emoji: string; size: string }) {
  return (
    <span className={`absolute select-none ${size}`} style={{ bottom: '28%', left: x }}>
      {emoji}
    </span>
  )
}

type TreeLevel = 0 | 1 | 2 | 3 | 4

function clampTreeLevel(n: number): TreeLevel {
  if (n <= 0) return 0
  if (n >= 4) return 4
  return n as TreeLevel
}

export function Garden({ mascotId }: Props) {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [muted, setMutedState] = useState(isMuted())
  const [treeLevel, setTreeLevel] = useState<TreeLevel>(
    clampTreeLevel(Number(localStorage.getItem('treeLevel')) || 0)
  )
  const demoRunning = useRef(false)

  const handleTreeLevelUp = (): void => {
    setTreeLevel(prev => {
      const next = clampTreeLevel(prev + 1)
      localStorage.setItem('treeLevel', String(next))
      return next
    })
  }

  const { activeReward, rewardKey, triggerMicro, triggerMedium, triggerBig } = useRewards({
    onTreeLevelUp: handleTreeLevelUp,
  })

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

  const handleModuleClick = (name: string, active: boolean): void => {
    unlockAudio()
    if (active) {
      speak(`Menjünk ${name}ozni!`)
    } else {
      speak(`${name} hamarosan jön!`)
    }
  }

  const handleDemo = (): void => {
    if (demoRunning.current) return
    demoRunning.current = true
    unlockAudio()
    triggerMicro()
    setTimeout(() => triggerMedium(), 2000)
    setTimeout(() => triggerBig(), 4000)
    setTimeout(() => { demoRunning.current = false }, 5600)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">

      {/* ── Sky ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200" />

      {/* ── Clouds ── */}
      <Cloud className="absolute w-36 top-[4%] left-[12%] opacity-90" />
      <Cloud className="absolute w-52 top-[6%] left-[42%] opacity-75" />
      <Cloud className="absolute w-28 top-[3%] right-[18%] opacity-85" />

      {/* ── Ground / grass wave ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%]">
        <svg
          viewBox="0 0 1280 30"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-8"
        >
          <path
            d="M0 22 Q80 4 160 22 Q240 40 320 22 Q400 4 480 22 Q560 40 640 22 Q720 4 800 22 Q880 40 960 22 Q1040 4 1120 22 Q1200 40 1280 22 L1280 30 L0 30 Z"
            fill="#4ade80"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-700 mt-6" />
      </div>

      {/* ── Decorative flowers in grass ── */}
      <GardenFlower x="18%" emoji="🌸" size="text-3xl" />
      <GardenFlower x="28%" emoji="🌼" size="text-2xl" />
      <GardenFlower x="62%" emoji="🌺" size="text-3xl" />
      <GardenFlower x="72%" emoji="🌻" size="text-2xl" />
      <GardenFlower x="48%" emoji="🌷" size="text-xl" />

      {/* ── Tree (center) ── */}
      <div className="absolute bottom-[34%] left-1/2 -translate-x-1/2">
        <Tree level={treeLevel} />
      </div>

      {/* ── Panka avatar (right side) ── */}
      <div className="absolute bottom-[26%] right-[14%] w-24 h-48 lg:w-32 lg:h-64">
        <PankaAvatar />
      </div>

      {/* ── TOP LEFT: Matek (active) ── */}
      <div className="absolute top-5 left-5">
        <ModuleButton
          emoji="🏪"
          label="Matek"
          bg="bg-indigo-500"
          active
          onClick={() => handleModuleClick('Matek', true)}
        />
      </div>

      {/* ── BOTTOM CENTER: Demo button (temporary, will go behind parental lock) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleDemo}
          className="bg-yellow-400 active:bg-yellow-300 active:scale-95 text-yellow-900 font-bold text-xl rounded-3xl px-8 py-4 shadow-2xl border-4 border-yellow-500 transition-transform whitespace-nowrap"
        >
          🎉 Jutalom teszt
        </button>
      </div>

      {/* ── TOP RIGHT: Volume + Olvasás stacked ── */}
      <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
        <button
          onClick={toggleMute}
          className="bg-white/80 active:bg-white rounded-2xl w-14 h-14 flex items-center justify-center text-2xl shadow-lg border-2 border-white/50"
          aria-label={muted ? 'Hang be' : 'Hang ki'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <ModuleButton
          emoji="📚"
          label="Olvasás"
          bg="bg-amber-500"
          active={false}
          onClick={() => handleModuleClick('Olvasás', false)}
        />
      </div>

      {/* ── BOTTOM LEFT: Írás + Mascot mini stacked ── */}
      <div className="absolute bottom-5 left-5 flex flex-col items-center gap-2">
        <ModuleButton
          emoji="✏️"
          label="Írás"
          bg="bg-rose-500"
          active={false}
          onClick={() => handleModuleClick('Írás', false)}
        />
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 bg-white/20">
          <Illustration />
        </div>
      </div>

      {/* ── BOTTOM RIGHT: Angol ── */}
      <div className="absolute bottom-5 right-5">
        <ModuleButton
          emoji="✈️"
          label="Angol"
          bg="bg-cyan-500"
          active={false}
          onClick={() => handleModuleClick('Angol', false)}
        />
      </div>

      {/* ── Reward overlay ── */}
      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />

    </div>
  )
}
