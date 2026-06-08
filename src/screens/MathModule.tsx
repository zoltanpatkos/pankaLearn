import { useState, useRef, useCallback } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, getArticle } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { DotPattern } from '../components/DotPattern'
import { useRewards } from '../hooks/useRewards'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'counting' | 'subitizing'
type Phase = 'select' | 'game' | 'round-end'

const TASKS_PER_ROUND = 5
const STREAK_REWARD = 3
const FLASH_MS = 1500

const EMOJI_SETS: { name: string; plural: string; items: string[] }[] = [
  { name: 'macska',   plural: 'macska',  items: ['🐱','🐱','🐱','🐱','🐱'] },
  { name: 'kutya',    plural: 'kutya',   items: ['🐶','🐶','🐶','🐶','🐶'] },
  { name: 'béka',     plural: 'béka',    items: ['🐸','🐸','🐸','🐸','🐸'] },
  { name: 'pillangó', plural: 'pillangó',items: ['🦋','🦋','🦋','🦋','🦋'] },
  { name: 'méh',      plural: 'méh',     items: ['🐝','🐝','🐝','🐝','🐝'] },
  { name: 'alma',     plural: 'alma',    items: ['🍎','🍎','🍎','🍎','🍎'] },
  { name: 'banán',    plural: 'banán',   items: ['🍌','🍌','🍌','🍌','🍌'] },
  { name: 'szamóca',  plural: 'szamóca', items: ['🍓','🍓','🍓','🍓','🍓'] },
  { name: 'narancs',  plural: 'narancs', items: ['🍊','🍊','🍊','🍊','🍊'] },
  { name: 'virág',    plural: 'virág',   items: ['🌸','🌸','🌸','🌸','🌸'] },
]

interface ScatterPos { top: string; left: string; rotate: string }

// Pre-spread zones ensure no overlap even with jitter — no collision detection needed
const SCATTER_ZONES: [number, number][] = [
  [10, 15], [60, 15], [35, 47], [12, 61], [62, 61],
  [30, 74], [58, 74], [78, 36], [3, 36], [42, 26],
  [20, 36], [72, 57], [38, 72], [16, 72], [62, 38],
]

function makeScatterPositions(count: number): ScatterPos[] {
  return SCATTER_ZONES.slice(0, Math.min(count, SCATTER_ZONES.length)).map(([bx, by]) => ({
    top:    `${Math.max(5, Math.min(by + (Math.random() - 0.5) * 10, 80))}%`,
    left:   `${Math.max(3, Math.min(bx + (Math.random() - 0.5) * 10, 82))}%`,
    rotate: `${(Math.random() - 0.5) * 30}deg`,
  }))
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function makeAnswers(correct: number, maxVal: number): number[] {
  const distractors = shuffle(
    Array.from({ length: maxVal }, (_, i) => i + 1).filter(n => n !== correct)
  ).slice(0, 3)
  return shuffle([correct, ...distractors])
}

const HU_NUMS = ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc', 'tíz']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface TaskState {
  correct: number
  answers: number[]
  emojiSet: typeof EMOJI_SETS[0]
  positions: ScatterPos[]
}

function generateTask(gameType: GameType): TaskState {
  const maxVal = gameType === 'counting' ? 10 : 5
  const correct = Math.floor(Math.random() * maxVal) + 1
  return {
    correct,
    answers: makeAnswers(correct, maxVal),
    emojiSet: gameType === 'counting' ? pickRandom(EMOJI_SETS) : EMOJI_SETS[0],
    positions: makeScatterPositions(correct),
  }
}

export function MathModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase] = useState<Phase>('select')
  const [gameType, setGameType] = useState<GameType>('counting')
  const [taskIndex, setTaskIndex] = useState(0)
  const [task, setTask] = useState<TaskState | null>(null)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [flashVisible, setFlashVisible] = useState(false)
  const [answersVisible, setAnswersVisible] = useState(false)
  const answering = useRef(false)

  const { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
  })

  const startTask = useCallback((t: TaskState, idx: number, gt: GameType): void => {
    setTask(t)
    setSelected(null)
    answering.current = false

    if (gt === 'subitizing') {
      setFlashVisible(true)
      setAnswersVisible(false)
      speak(`Ez ${getArticle(String(idx + 1))} ${idx + 1}. feladat! Hány pötty villan fel?`)
      setTimeout(() => {
        setFlashVisible(false)
        setAnswersVisible(true)
      }, FLASH_MS)
    } else {
      setFlashVisible(false)
      setAnswersVisible(true)
      speak(`Ez ${getArticle(String(idx + 1))} ${idx + 1}. feladat! Hány ${t.emojiSet.plural} van itt?`)
    }
  }, [])

  const handleStart = (gt: GameType): void => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    setStreak(0)
    const t = generateTask(gt)
    setPhase('game')
    startTask(t, 0, gt)
  }

  const handleAnswer = (n: number): void => {
    if (answering.current || selected !== null) return
    answering.current = true
    setSelected(n)

    if (!task) return

    if (n === task.correct) {
      const newStreak = streak + 1
      setStreak(newStreak)

      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) {
        triggerSmall()
      } else {
        triggerMicro()
      }

      const nextIdx = taskIndex + 1
      if (nextIdx >= TASKS_PER_ROUND) {
        setTimeout(() => {
          triggerMedium()
          setPhase('round-end')
        }, 900)
      } else {
        setTimeout(() => {
          setTaskIndex(nextIdx)
          const next = generateTask(gameType)
          startTask(next, nextIdx, gameType)
        }, 900)
      }
    } else {
      setStreak(0)
      triggerError()
      setTimeout(() => {
        setSelected(null)
        answering.current = false
        startTask(task, taskIndex, gameType)
      }, 1400)
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
      const t = generateTask(gameType)
      setPhase('game')
      startTask(t, 0, gameType)
    } else {
      onBack()
    }
  }

  const handleBack = (): void => {
    unlockAudio()
    speak('Visszamegyünk a kertbe?')
    setTimeout(onBack, 600)
  }

  // ── SELECT phase ──────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-indigo-500 via-indigo-400 to-purple-400 flex flex-col">
        <div className="flex items-center px-4 pt-4 gap-3">
          <button
            onClick={handleBack}
            className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-indigo-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform"
          >
            ← Kert
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow flex-1 text-center pr-16">
            🔢 Matek
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
              onClick={() => handleStart('counting')}
              className="flex-1 flex flex-col items-center gap-3 bg-yellow-400 active:bg-yellow-300 rounded-3xl py-6 shadow-2xl border-4 border-yellow-300 active:scale-95 transition-transform"
            >
              <span className="text-6xl leading-none">🐱</span>
              <span className="text-yellow-900 font-bold text-xl leading-tight text-center">Számolj!</span>
              <span className="text-yellow-800 text-sm text-center px-2">Számold meg a képeket!</span>
            </button>

            <button
              onClick={() => handleStart('subitizing')}
              className="flex-1 flex flex-col items-center gap-3 bg-emerald-400 active:bg-emerald-300 rounded-3xl py-6 shadow-2xl border-4 border-emerald-300 active:scale-95 transition-transform"
            >
              <span className="text-6xl leading-none">⚡</span>
              <span className="text-emerald-900 font-bold text-xl leading-tight text-center">Villám!</span>
              <span className="text-emerald-800 text-sm text-center px-2">Nézd meg a pöttyöket!</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ROUND-END phase ───────────────────────────────────────────────────────
  if (phase === 'round-end') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-violet-500 to-fuchsia-500 flex flex-col items-center justify-center gap-8 px-8">
        <div
          className="text-[10rem] leading-none"
          style={{ animation: 'star-pop 1s ease-out forwards' }}
        >
          ⭐
        </div>
        <p className="text-white font-bold text-3xl text-center drop-shadow-lg">
          {mascot.name} szerint<br />fantasztikus voltál!
        </p>
        <div className="w-40 h-40 drop-shadow-2xl"
          style={{ animation: 'bounce-dance 0.5s ease-in-out infinite' }}>
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

  // ── GAME phase ────────────────────────────────────────────────────────────
  if (!task) return <div className="w-screen h-screen bg-indigo-500" />

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-indigo-500 via-indigo-400 to-purple-400 flex flex-col">

      {/* Header */}
      <div className="flex items-center px-4 pt-4 gap-3 flex-shrink-0">
        <button
          onClick={handleBack}
          className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-indigo-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform"
        >
          ← Kert
        </button>

        {/* Progress dots */}
        <div className="flex gap-2 flex-1 justify-center">
          {Array.from({ length: TASKS_PER_ROUND }, (_, i) => (
            <div
              key={i}
              className={[
                'w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-300',
                i < taskIndex ? 'bg-yellow-400 border-yellow-300 scale-110' :
                i === taskIndex ? 'bg-white scale-110' : 'bg-white/30',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Mascot mini */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50 shadow flex-shrink-0">
          <Illustration />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 min-h-0">

        {/* Question text */}
        <p className="text-white font-bold text-2xl text-center drop-shadow leading-snug px-4 flex-shrink-0">
          {gameType === 'counting'
            ? `Hány ${task.emojiSet.plural} van itt?`
            : 'Hány pötty villan fel?'}
        </p>

        {/* Items / dots area */}
        <div className="flex-1 flex items-center justify-center w-full min-h-0 relative">

          {gameType === 'subitizing' && (
            <div
              className="transition-opacity duration-300"
              style={{ opacity: flashVisible ? 1 : 0, pointerEvents: 'none' }}
            >
              <DotPattern count={task.correct as 1|2|3|4|5} size={200} />
            </div>
          )}

          {gameType === 'counting' && (
            <div className="relative w-full" style={{ height: '220px' }}>
              {task.positions.map((pos, i) => (
                <span
                  key={i}
                  className="absolute text-5xl leading-none select-none"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: `rotate(${pos.rotate})`,
                  }}
                >
                  {task.emojiSet.items[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answer buttons */}
        <div
          className="grid grid-cols-2 gap-3 w-full max-w-sm flex-shrink-0 transition-opacity duration-300"
          style={{ opacity: answersVisible ? 1 : 0, pointerEvents: answersVisible ? 'auto' : 'none' }}
        >
          {task.answers.map(n => {
            const isSelected = selected === n
            const isCorrect  = n === task.correct
            let bg = 'bg-white active:bg-gray-100'
            if (isSelected && isCorrect)  bg = 'bg-green-400 border-green-300'
            if (isSelected && !isCorrect) bg = 'bg-red-400 border-red-300'
            const anim = isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none'

            return (
              <button
                key={n}
                onClick={() => handleAnswer(n)}
                disabled={selected !== null}
                style={{ animation: anim }}
                className={[
                  'flex flex-col items-center justify-center gap-1',
                  'rounded-3xl py-4 shadow-xl border-4 border-white/60',
                  'transition-transform active:scale-90 duration-100',
                  bg,
                  selected !== null && !isSelected ? 'opacity-50' : '',
                ].join(' ')}
              >
                <span className="text-4xl font-black text-indigo-900 leading-none">{n}</span>
                <span className="text-base font-bold text-indigo-700">{HU_NUMS[n]}</span>
              </button>
            )
          })}
        </div>

      </div>

      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </div>
  )
}
