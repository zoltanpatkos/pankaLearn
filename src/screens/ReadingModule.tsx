import { useState, useRef } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakChained, speakSyllabified } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { READING_WORDS, type WordEntry } from '../data/readingWords'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'clapper' | 'assembler'
type Phase = 'select' | 'game' | 'round-end'

const TASKS_PER_ROUND = 5
const STREAK_REWARD = 3

const LEVEL1_ALL      = READING_WORDS.filter(w => w.level === 1)
const LEVEL1_MULTI    = LEVEL1_ALL.filter(w => w.syllables.length >= 2)

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

interface CardState { syllable: string; placed: boolean }

export function ReadingModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]       = useState<Phase>('select')
  const [gameType, setGameType] = useState<GameType>('clapper')
  const [taskIndex, setTaskIndex] = useState(0)
  const [task, setTask]         = useState<WordEntry | null>(null)
  const [streak, setStreak]     = useState(0)

  // Clapper state
  const [selectedCount, setSelectedCount] = useState<number | null>(null)
  const answering = useRef(false)

  // Assembler state
  const [cards, setCards]           = useState<CardState[]>([])
  const [assembled, setAssembled]   = useState<string[]>([])
  const [assemblerResult, setAssemblerResult] = useState<'idle' | 'correct' | 'wrong'>('idle')

  const { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
    confettiColors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#dbeafe'],
  })

  // ── Task starters ─────────────────────────────────────────────────────────

  const startClapperTask = (t: WordEntry, idx: number): void => {
    setTask(t)
    setSelectedCount(null)
    answering.current = false
    speakChained([`${idx + 1}.`, 'szó! Hány részből áll?'])
    setTimeout(() => speakSyllabified(t.syllables, t.word), 1400)
  }

  const startAssemblerTask = (t: WordEntry, idx: number): void => {
    setTask(t)
    setCards(shuffle(t.syllables.map(s => ({ syllable: s, placed: false }))))
    setAssembled([])
    setAssemblerResult('idle')
    speakChained([`${idx + 1}.`, 'szó! Rakd össze!'])
    setTimeout(() => speakSyllabified(t.syllables, t.word), 1400)
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = (gt: GameType): void => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    setStreak(0)
    const t = pickRandom(gt === 'clapper' ? LEVEL1_ALL : LEVEL1_MULTI)
    setPhase('game')
    if (gt === 'clapper') startClapperTask(t, 0)
    else startAssemblerTask(t, 0)
  }

  const handleClapperAnswer = (n: number): void => {
    if (answering.current || selectedCount !== null || !task) return
    answering.current = true
    setSelectedCount(n)

    if (n === task.syllables.length) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
      else triggerMicro()

      const nextIdx = taskIndex + 1
      if (nextIdx >= TASKS_PER_ROUND) {
        setTimeout(() => { triggerMedium(); setPhase('round-end') }, 900)
      } else {
        setTimeout(() => {
          setTaskIndex(nextIdx)
          startClapperTask(pickRandom(LEVEL1_ALL), nextIdx)
        }, 900)
      }
    } else {
      setStreak(0)
      triggerError()
      setTimeout(() => {
        setSelectedCount(null)
        answering.current = false
      }, 1400)
    }
  }

  const handleCardTap = (cardIdx: number): void => {
    if (assemblerResult !== 'idle' || !task || cards[cardIdx].placed) return

    const newAssembled = [...assembled, cards[cardIdx].syllable]
    setCards(prev => prev.map((c, i) => i === cardIdx ? { ...c, placed: true } : c))
    setAssembled(newAssembled)

    if (newAssembled.length < task.syllables.length) return

    const isCorrect = newAssembled.every((s, i) => s === task.syllables[i])
    if (isCorrect) {
      setAssemblerResult('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
      else triggerMicro()
      speak(task.word)

      const nextIdx = taskIndex + 1
      if (nextIdx >= TASKS_PER_ROUND) {
        setTimeout(() => { triggerMedium(); setPhase('round-end') }, 1200)
      } else {
        setTimeout(() => {
          setTaskIndex(nextIdx)
          startAssemblerTask(pickRandom(LEVEL1_MULTI), nextIdx)
        }, 1200)
      }
    } else {
      setAssemblerResult('wrong')
      setStreak(0)
      triggerError()
      const resetSyllables = [...task.syllables]
      setTimeout(() => {
        setCards(shuffle(resetSyllables.map(s => ({ syllable: s, placed: false }))))
        setAssembled([])
        setAssemblerResult('idle')
      }, 1400)
    }
  }

  const handleRepeat = (): void => {
    if (!task) return
    unlockAudio()
    speakSyllabified(task.syllables, task.word)
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
      const pool = gameType === 'clapper' ? LEVEL1_ALL : LEVEL1_MULTI
      const t = pickRandom(pool)
      setPhase('game')
      if (gameType === 'clapper') startClapperTask(t, 0)
      else startAssemblerTask(t, 0)
    } else {
      onBack()
    }
  }

  const handleBack = (): void => {
    unlockAudio()
    speak('Visszamegyünk a kertbe!')
    setTimeout(onBack, 600)
  }

  // ── Progress dots (shared) ────────────────────────────────────────────────

  const ProgressDots = (): JSX.Element => (
    <div className="flex gap-2 flex-1 justify-center">
      {Array.from({ length: TASKS_PER_ROUND }, (_, i) => (
        <div
          key={i}
          className={[
            'w-7 h-7 rounded-full border-2 transition-all duration-300',
            i < taskIndex  ? 'bg-blue-400 border-blue-300 scale-110' :
            i === taskIndex ? 'bg-blue-500 border-blue-400 scale-110' : 'bg-gray-200 border-gray-300',
          ].join(' ')}
        />
      ))}
    </div>
  )

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-blue-500 via-blue-400 to-sky-300 flex flex-col">
        <div className="mx-3 mt-3 bg-white/90 rounded-2xl shadow-lg flex items-center px-3 py-2.5 gap-3">
          <button
            onClick={handleBack}
            className="bg-blue-100 active:bg-blue-200 rounded-xl px-3 py-2 text-blue-900 font-bold text-base border border-blue-300 active:scale-95 transition-transform"
          >
            ← Kert
          </button>
          <h1 className="text-2xl font-black text-blue-800 drop-shadow-sm flex-1 text-center">
            📚 Olvasás
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
              onClick={() => handleStart('clapper')}
              className="flex-1 flex flex-col items-center gap-3 bg-yellow-400 active:bg-yellow-300 rounded-3xl py-6 shadow-2xl border-4 border-yellow-300 active:scale-95 transition-transform"
            >
              <span className="text-6xl leading-none">👏</span>
              <span className="text-yellow-900 font-bold text-xl text-center">Tapsolj!</span>
              <span className="text-yellow-800 text-sm text-center px-2">Hány részből áll?</span>
            </button>
            <button
              onClick={() => handleStart('assembler')}
              className="flex-1 flex flex-col items-center gap-3 bg-emerald-400 active:bg-emerald-300 rounded-3xl py-6 shadow-2xl border-4 border-emerald-300 active:scale-95 transition-transform"
            >
              <span className="text-6xl leading-none">🧩</span>
              <span className="text-blue-900 font-bold text-xl text-center">Rakd össze!</span>
              <span className="text-emerald-800 text-sm text-center px-2">Rakd össze!</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ROUND-END ─────────────────────────────────────────────────────────────

  if (phase === 'round-end') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-blue-600 to-sky-500 flex flex-col items-center justify-center gap-8 px-8">
        <div className="relative flex items-center justify-center w-72 h-52">
          <span className="absolute top-1 left-6 text-5xl select-none" style={{ animation: 'star-pop 0.7s ease-out 0.3s both' }}>⭐</span>
          <span className="absolute top-2 right-6 text-4xl select-none" style={{ animation: 'star-pop 0.7s ease-out 0.5s both' }}>✨</span>
          <span className="absolute bottom-1 left-10 text-4xl select-none" style={{ animation: 'star-pop 0.7s ease-out 0.6s both' }}>⭐</span>
          <span className="absolute bottom-0 right-10 text-5xl select-none" style={{ animation: 'star-pop 0.7s ease-out 0.45s both' }}>✨</span>
          <div className="text-[11rem] leading-none select-none" style={{ animation: 'star-pop 1s ease-out forwards', filter: 'drop-shadow(0 0 30px #60a5fa)' }}>🌻</div>
        </div>
        <p className="text-white font-bold text-3xl text-center drop-shadow-lg">
          {mascot.name} szerint<br />fantasztikus voltál!
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

  if (!task) return <div className="w-screen h-screen bg-blue-500" />

  // ── CLAPPER ───────────────────────────────────────────────────────────────

  if (gameType === 'clapper') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-blue-500 via-blue-400 to-sky-300 flex flex-col">

        <div className="mx-3 mt-3 bg-white/90 rounded-2xl shadow-lg flex items-center px-3 py-2.5 gap-3 flex-shrink-0">
          <button
            onClick={handleBack}
            className="bg-blue-100 active:bg-blue-200 rounded-xl px-3 py-2 text-blue-900 font-bold text-base border border-blue-300 active:scale-95 transition-transform"
          >
            ← Kert
          </button>
          <ProgressDots />
          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-blue-100 shadow flex-shrink-0">
            <Illustration />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-between py-2 px-4 min-h-0">

          {/* Word display */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-6xl leading-none">{task.emoji}</span>
            <p className="text-white font-black text-3xl text-center tracking-widest drop-shadow-lg">
              {task.syllables.join(' · ')}
            </p>
            <p className="text-white/80 font-bold text-lg text-center drop-shadow">
              Hány részből áll?
            </p>
          </div>

          {/* Repeat button */}
          <button
            onClick={handleRepeat}
            className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-lg rounded-2xl px-5 py-2 border-2 border-white/40 transition-transform shadow flex-shrink-0"
          >
            🔊 Mondd újra
          </button>

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-sm flex-shrink-0">
            {[1, 2, 3, 4].map(n => {
              const isSelected = selectedCount === n
              const isCorrect  = n === task.syllables.length
              let bg = 'bg-blue-500 active:bg-blue-600 border-blue-400'
              if (isSelected && isCorrect)  bg = 'bg-green-500 border-green-400'
              if (isSelected && !isCorrect) bg = 'bg-red-500 border-red-400'
              const anim = isSelected && isCorrect  ? 'correct-answer 0.4s ease-out'
                : isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none'
              return (
                <button
                  key={n}
                  onClick={() => handleClapperAnswer(n)}
                  disabled={selectedCount !== null}
                  style={{ animation: anim }}
                  className={[
                    'flex items-center justify-center rounded-3xl min-h-[80px] shadow-xl border-4',
                    'transition-transform active:scale-90 duration-100',
                    bg,
                    selectedCount !== null && !isSelected ? 'opacity-50' : '',
                  ].join(' ')}
                >
                  <span className="text-4xl font-black text-white leading-none">{n}</span>
                </button>
              )
            })}
          </div>
        </div>

        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </div>
    )
  }

  // ── ASSEMBLER ─────────────────────────────────────────────────────────────

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-blue-500 via-sky-400 to-blue-300 flex flex-col">

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

      <div className="flex-1 flex flex-col items-center justify-between py-3 px-4 min-h-0">

        {/* Emoji + repeat */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <span className="text-6xl leading-none">{task.emoji}</span>
          <button
            onClick={handleRepeat}
            className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-lg rounded-2xl px-5 py-2 border-2 border-white/40 transition-transform shadow"
          >
            🔊 Mondd újra
          </button>
        </div>

        {/* Assembled slots */}
        <div className="flex gap-2 justify-center flex-shrink-0">
          {task.syllables.map((_, i) => (
            <div
              key={i}
              style={{ animation: assemblerResult === 'wrong' && i < assembled.length ? 'shake-no 0.4s ease-out' : 'none' }}
              className={[
                'min-w-[64px] h-14 rounded-2xl border-4 flex items-center justify-center transition-all duration-200',
                i < assembled.length
                  ? assemblerResult === 'correct'
                    ? 'bg-green-400 border-green-300 shadow-lg'
                    : assemblerResult === 'wrong'
                      ? 'bg-red-400 border-red-300'
                      : 'bg-white border-white/80 shadow-lg'
                  : 'bg-white/20 border-white/40 border-dashed',
              ].join(' ')}
            >
              {i < assembled.length && (
                <span className="text-2xl font-black text-blue-900">{assembled[i]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Syllable cards */}
        <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => handleCardTap(i)}
              disabled={card.placed || assemblerResult !== 'idle'}
              className={[
                'min-w-[80px] h-20 rounded-3xl border-4 flex items-center justify-center shadow-xl',
                'transition-all duration-200',
                card.placed
                  ? 'bg-white/10 border-white/10 opacity-20 cursor-default'
                  : 'bg-white border-white/80 active:bg-gray-100 active:scale-90',
              ].join(' ')}
            >
              {!card.placed && (
                <span className="text-2xl font-black text-blue-900">{card.syllable}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </div>
  )
}
