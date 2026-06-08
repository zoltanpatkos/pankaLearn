import { useState } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakTPR, speakEnglish, speakEnglishPraise } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { TPR_VERBS, POINTER_TASKS, type VerbEntry, type PointerTask } from '../data/englishData'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'tpr' | 'pointer'
type Phase = 'select' | 'game' | 'round-end'

const TASKS_PER_ROUND = 5
const STREAK_REWARD = 3

const HU_MICRO_PRAISES = ['Szuper!', 'Brávó!', 'Remek!', 'Zseniális!', 'Nagyon jó!', 'Fantasztikus!', 'Tökéletes!']
const maybePraise = (): void =>
  Math.random() < 0.5
    ? speakEnglishPraise()
    : speak(HU_MICRO_PRAISES[Math.floor(Math.random() * HU_MICRO_PRAISES.length)])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function EnglishModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]       = useState<Phase>('select')
  const [gameType, setGameType] = useState<GameType>('tpr')
  const [taskIndex, setTaskIndex] = useState(0)
  const [streak, setStreak]     = useState(0)

  // TPR state
  const [tprTask, setTprTask] = useState<VerbEntry | null>(null)

  // Pointer state
  const [pointerTask, setPointerTask]       = useState<PointerTask | null>(null)
  const [options, setOptions]               = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [pointerResult, setPointerResult]   = useState<'idle' | 'correct' | 'wrong'>('idle')

  const { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
  })

  // ── Task starters ─────────────────────────────────────────────────────────

  const startTPRTask = (v: VerbEntry): void => {
    setTprTask(v)
    const command = v.verb.charAt(0).toUpperCase() + v.verb.slice(1) + '!'
    speakTPR(command, v.hungarian)
  }

  const startPointerTask = (t: PointerTask): void => {
    setPointerTask(t)
    setOptions(shuffle([t.correctEmoji, ...t.distractors]))
    setSelectedOption(null)
    setPointerResult('idle')
    speakTPR(t.englishQuestion, t.hungarianQuestion)
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = (gt: GameType): void => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    setStreak(0)
    setPhase('game')
    if (gt === 'tpr') startTPRTask(pickRandom(TPR_VERBS))
    else startPointerTask(pickRandom(POINTER_TASKS))
  }

  const handleTPRDone = (): void => {
    const newStreak = streak + 1
    setStreak(newStreak)
    if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
    else { triggerMicro(); maybePraise() }

    const nextIdx = taskIndex + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); setPhase('round-end') }, 900)
    } else {
      setTimeout(() => {
        setTaskIndex(nextIdx)
        startTPRTask(pickRandom(TPR_VERBS))
      }, 900)
    }
  }

  const handleOptionTap = (emoji: string): void => {
    if (pointerResult !== 'idle' || !pointerTask) return
    setSelectedOption(emoji)

    if (emoji === pointerTask.correctEmoji) {
      setPointerResult('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
      else { triggerMicro(); maybePraise() }

      const nextIdx = taskIndex + 1
      if (nextIdx >= TASKS_PER_ROUND) {
        setTimeout(() => { triggerMedium(); setPhase('round-end') }, 2000)
      } else {
        setTimeout(() => {
          setTaskIndex(nextIdx)
          startPointerTask(pickRandom(POINTER_TASKS))
        }, 2000)
      }
    } else {
      setPointerResult('wrong')
      setStreak(0)
      triggerError()
      setTimeout(() => {
        setSelectedOption(null)
        setPointerResult('idle')
      }, 1400)
    }
  }

  const handleRepeat = (): void => {
    unlockAudio()
    if (gameType === 'tpr' && tprTask) {
      speakEnglish(tprTask.verb.charAt(0).toUpperCase() + tprTask.verb.slice(1) + '!')
    } else if (pointerTask) {
      speakEnglish(pointerTask.englishQuestion)
    }
  }

  const handleRoundEnd = (again: boolean): void => {
    unlockAudio()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    onRoundComplete(unlocked)
    if (unlocked) speak('Új ruha vár rád a szekrényben!')

    if (again) {
      setTaskIndex(0)
      setStreak(0)
      setPhase('game')
      if (gameType === 'tpr') startTPRTask(pickRandom(TPR_VERBS))
      else startPointerTask(pickRandom(POINTER_TASKS))
    } else {
      onBack()
    }
  }

  const handleBack = (): void => {
    unlockAudio()
    speak('Visszamegyünk a kertbe!')
    setTimeout(onBack, 600)
  }

  // ── Progress dots ─────────────────────────────────────────────────────────

  const ProgressDots = (): JSX.Element => (
    <div className="flex gap-2 flex-1 justify-center">
      {Array.from({ length: TASKS_PER_ROUND }, (_, i) => (
        <div
          key={i}
          className={[
            'w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-300',
            i < taskIndex   ? 'bg-yellow-400 border-yellow-300 scale-110' :
            i === taskIndex ? 'bg-white scale-110' : 'bg-white/30',
          ].join(' ')}
        />
      ))}
    </div>
  )

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-cyan-500 via-sky-500 to-blue-400 flex flex-col">
        <div className="flex items-center px-4 pt-4 gap-3">
          <button
            onClick={handleBack}
            className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-cyan-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform"
          >
            ← Kert
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow flex-1 text-center pr-16">
            ✈️ Angol
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8 px-8 pb-8">
          <div className="w-36 h-36 drop-shadow-xl">
            <Illustration />
          </div>
          <p className="text-white font-bold text-2xl text-center drop-shadow">
            Melyik játékot választod?
          </p>
          <div className="flex gap-5 w-full max-w-sm">
            <button
              onClick={() => handleStart('tpr')}
              className="flex-1 flex flex-col items-center gap-3 bg-cyan-400 active:bg-cyan-300 rounded-3xl py-6 shadow-2xl border-4 border-cyan-300 active:scale-95 transition-transform"
            >
              <span className="text-5xl leading-none">🏃</span>
              <span className="text-cyan-900 font-bold text-xl text-center">Cselekedj!</span>
              <span className="text-cyan-800 text-sm text-center px-2">Mozdulj a szóra!</span>
            </button>
            <button
              onClick={() => handleStart('pointer')}
              className="flex-1 flex flex-col items-center gap-3 bg-blue-400 active:bg-blue-300 rounded-3xl py-6 shadow-2xl border-4 border-blue-300 active:scale-95 transition-transform"
            >
              <span className="text-5xl leading-none">👆</span>
              <span className="text-blue-900 font-bold text-xl text-center">Mutasd meg!</span>
              <span className="text-blue-800 text-sm text-center px-2">Koppints a képre!</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ROUND-END ─────────────────────────────────────────────────────────────

  if (phase === 'round-end') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-cyan-500 to-blue-500 flex flex-col items-center justify-center gap-8 px-8">
        <div
          className="text-[10rem] leading-none"
          style={{ animation: 'star-pop 1s ease-out forwards' }}
        >
          ✈️
        </div>
        <p className="text-white font-bold text-3xl text-center drop-shadow-lg">
          {mascot.name} szerint<br />szuper voltál!
        </p>
        <div
          className="w-40 h-40 drop-shadow-2xl"
          style={{ animation: 'bounce-dance 0.5s ease-in-out infinite' }}
        >
          <Illustration />
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => handleRoundEnd(true)}
            className="bg-yellow-400 active:bg-yellow-300 active:scale-95 text-yellow-900 font-bold text-2xl rounded-3xl py-5 shadow-2xl border-4 border-yellow-300 transition-transform"
          >
            🔄 Még egy kör!
          </button>
          <button
            onClick={() => handleRoundEnd(false)}
            className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-xl rounded-3xl py-4 shadow-xl border-4 border-white/40 transition-transform"
          >
            🌳 Vissza a kertbe
          </button>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </div>
    )
  }

  // ── TPR GAME ──────────────────────────────────────────────────────────────

  if (gameType === 'tpr' && tprTask) {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-cyan-500 via-sky-400 to-blue-300 flex flex-col">
        <div className="flex items-center px-4 pt-4 gap-3 flex-shrink-0">
          <button
            onClick={handleBack}
            className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-cyan-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform"
          >
            ← Kert
          </button>
          <ProgressDots />
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50 shadow flex-shrink-0">
            <Illustration />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 min-h-0">

          {/* Verb display: emoji dominant, Hungarian primary, English ghost */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-7xl leading-none">{tprTask.emoji}</span>
            <p className="text-white font-bold text-3xl text-center drop-shadow-lg">
              {tprTask.hungarian}
            </p>
            <p className="text-white/40 font-normal text-sm text-center tracking-widest uppercase">
              {tprTask.verb}
            </p>
          </div>

          {/* Repeat */}
          <button
            onClick={handleRepeat}
            className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-lg rounded-2xl px-5 py-2.5 border-2 border-white/40 transition-transform shadow flex-shrink-0"
          >
            🔊 Mondd újra
          </button>

          {/* Done button */}
          <button
            onClick={handleTPRDone}
            className="w-full max-w-sm bg-green-400 active:bg-green-300 active:scale-95 text-green-900 font-black text-2xl rounded-3xl py-6 shadow-2xl border-4 border-green-300 transition-transform flex-shrink-0"
          >
            ✓ Megcsináltam!
          </button>
        </div>

        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </div>
    )
  }

  // ── POINTER GAME ──────────────────────────────────────────────────────────

  if (!pointerTask) return <div className="w-screen h-screen bg-blue-500" />

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-blue-500 via-sky-400 to-cyan-300 flex flex-col">
      <div className="flex items-center px-4 pt-4 gap-3 flex-shrink-0">
        <button
          onClick={handleBack}
          className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-blue-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform"
        >
          ← Kert
        </button>
        <ProgressDots />
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50 shadow flex-shrink-0">
          <Illustration />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 min-h-0">

        {/* Repeat */}
        <button
          onClick={handleRepeat}
          className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-lg rounded-2xl px-5 py-2.5 border-2 border-white/40 transition-transform shadow flex-shrink-0"
        >
          🔊 Mondd újra
        </button>

        {/* 3 option cards — emoji only, no text */}
        <div className="flex gap-4 w-full max-w-sm flex-shrink-0">
          {options.map((emoji, i) => {
            const isSelected = selectedOption === emoji
            const isCorrect  = emoji === pointerTask.correctEmoji
            let cardClass = 'bg-white border-white/80 active:bg-gray-100 active:scale-90'
            if (isSelected && isCorrect)  cardClass = 'bg-green-400 border-green-300 scale-105'
            if (isSelected && !isCorrect) cardClass = 'bg-red-400 border-red-300'
            if (pointerResult !== 'idle' && !isSelected) cardClass += ' opacity-40'
            return (
              <button
                key={i}
                onClick={() => handleOptionTap(emoji)}
                disabled={pointerResult !== 'idle'}
                style={{ animation: isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none' }}
                className={[
                  'flex-1 h-32 rounded-3xl border-4 flex items-center justify-center',
                  'shadow-xl transition-all duration-200',
                  cardClass,
                ].join(' ')}
              >
                <span className="text-6xl leading-none">{emoji}</span>
              </button>
            )
          })}
        </div>

        {/* Spacer placeholder so justify-between works */}
        <div className="flex-shrink-0 h-4" />
      </div>

      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </div>
  )
}
