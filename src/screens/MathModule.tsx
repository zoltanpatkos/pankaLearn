import { useState, useRef, useCallback } from 'react'
import type { JSX } from 'react'
import confetti from 'canvas-confetti'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakChained } from '../lib/tts'
import { selectNextItem, recordAttempt, getItemWeight, loadStagedLevel, advanceStagedLevel, type StagedLevelState } from '../lib/adaptive'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { DotPattern } from '../components/DotPattern'
import { ModuleSelect } from '../components/ModuleSelect'
import { TaskShell } from '../components/TaskShell'
import { AnswerButton } from '../components/AnswerButton'
import { useRewards } from '../hooks/useRewards'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'counting' | 'subitizing' | 'dienes' | 'balance' | 'tenPlus' | 'addition' | 'subtraction'
type Phase = 'select' | 'game'

const TASKS_PER_ROUND = 5
const STREAK_REWARD   = 3
const FLASH_MS        = 1500

// ── Counting / subitizing ─────────────────────────────────────────────────────

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

const SCATTER_ZONES: [number, number][] = [
  [10, 15], [60, 15], [35, 47], [12, 61], [62, 61],
  [30, 74], [58, 74], [78, 36], [3, 36],  [42, 26],
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
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeAnswers(correct: number, maxVal: number): number[] {
  const distractors = shuffle(
    Array.from({ length: maxVal }, (_, i) => i + 1).filter(n => n !== correct)
  ).slice(0, 3)
  return shuffle([correct, ...distractors])
}

const HU_NUMS = [
  '', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc', 'tíz',
  'tizenegy', 'tizenkettő', 'tizenhárom', 'tizennégy', 'tizenöt',
  'tizenhat', 'tizenhét', 'tizennyolc', 'tizenkilenc', 'húsz',
]

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

interface TaskState {
  correct: number
  answers: number[]
  emojiSet: typeof EMOJI_SETS[0]
  positions: ScatterPos[]
}

function pickCount(gameType: GameType): number {
  const maxVal = gameType === 'counting' ? (Number(localStorage.getItem('mathMaxCount')) || 10) : 5
  const taskType = gameType === 'counting' ? 'math.counting' : 'math.subitizing'
  return selectNextItem(taskType, Array.from({ length: maxVal }, (_, i) => i + 1), n => `count_${n}`)
}

function generateTask(gameType: GameType, correct: number): TaskState {
  const maxVal = gameType === 'counting' ? (Number(localStorage.getItem('mathMaxCount')) || 10) : 5
  return {
    correct,
    answers: makeAnswers(correct, maxVal),
    emojiSet: gameType === 'counting' ? pickRandom(EMOJI_SETS) : EMOJI_SETS[0],
    positions: makeScatterPositions(correct),
  }
}

// ── Dienes (Cuisenaire rods) ──────────────────────────────────────────────────

const CUISENAIRE: readonly string[] = [
  '#d1d5db', '#ef4444', '#86efac', '#c084fc', '#fbbf24',
  '#4ade80', '#92400e', '#9f1239', '#3b82f6', '#f97316',
]
const U     = 32  // px per unit
const ROD_H = 42  // px rod height

interface DienesTask { target: number; available: number[] }
interface RodItem    { value: number; id: number; used: boolean }

function generateDienesTask(target: number): DienesTask {
  const weight = getItemWeight('math.dienes', `${target}`)
  const level: 1 | 2 | 3 = weight >= 2.0 ? 1 : weight >= 0.7 ? 2 : 3
  const pairs: [number, number][] = []
  for (let a = 1; a <= Math.floor(target / 2); a++) pairs.push([a, target - a])
  const [a, b] = pairs[Math.floor(Math.random() * pairs.length)]
  const distractorPool = Array.from({ length: 10 }, (_, i) => i + 1)
    .filter(n => n !== a && n !== b && n < target)
  const distractors = shuffle(distractorPool).slice(0, level === 1 ? 1 : 2)
  return { target, available: shuffle([a, b, ...distractors]) }
}

function pickDienesTarget(): number {
  return selectNextItem('math.dienes', Array.from({ length: 9 }, (_, i) => i + 2), t => `${t}`)
}

function RodBar({ value, green = false, placed = false, unit = U }: { value: number; green?: boolean; placed?: boolean; unit?: number }): JSX.Element {
  const color = green ? '#4ade80' : CUISENAIRE[value - 1]
  return (
    <div style={{ display: 'flex', height: ROD_H, borderRadius: placed ? 0 : 7, overflow: 'hidden',
      border: placed ? 'none' : '2px solid rgba(0,0,0,0.20)',
      boxShadow: placed ? 'none' : '0 2px 6px rgba(0,0,0,0.14)', flexShrink: 0 }}>
      {Array.from({ length: value }, (_, i) => (
        <div key={i} style={{
          width: unit, height: '100%', flexShrink: 0,
          background: color,
          borderRight: i < value - 1 ? '1px solid rgba(0,0,0,0.10)' : 'none',
          transition: 'background 0.35s',
        }} />
      ))}
    </div>
  )
}

// ── Balance scale (Mérleg) ────────────────────────────────────────────────────

const BALANCE_EMOJIS = ['🍌', '🍎', '🌸', '⭐']

interface BalanceTask {
  target: number
  emoji: string
  cardOptions: number[]
}

function generateBalanceTask(target: number): BalanceTask {
  const weight = getItemWeight('math.balance', `${target}`)
  const level: 1 | 2 | 3 = weight >= 2.0 ? 1 : weight >= 0.7 ? 2 : 3
  const all = Array.from({ length: target }, (_, i) => i + 1)
  const cardOptions = level === 1 ? all.filter(n => n <= 2) : level === 2 ? all.filter(n => n <= 5) : all
  return {
    target,
    emoji: pickRandom(BALANCE_EMOJIS),
    cardOptions: cardOptions.length > 0 ? cardOptions : [1],
  }
}

function pickBalanceTarget(): number {
  return selectNextItem('math.balance', Array.from({ length: 9 }, (_, i) => i + 2), t => `${t}`)
}

function BalanceScale({ leftW, rightW }: { leftW: number; rightW: number }): JSX.Element {
  const angle   = Math.max(-16, Math.min(16, (leftW - rightW) * 2.4))
  const balanced = leftW === rightW && leftW > 0
  const rightBadgeColor = balanced ? '#22c55e' : rightW > leftW ? '#ef4444' : '#64748b'
  return (
    <svg viewBox="0 0 280 195" style={{ width: '100%', maxWidth: 310, height: 'auto' }}>
      {/* Fixed: pole + base */}
      <rect x="137" y="70" width="6" height="100" rx="3" fill="#92400e" />
      <polygon points="140,170 118,192 162,192" fill="#78350f" />
      <rect x="114" y="188" width="52" height="6" rx="3" fill="#6b3f00" />
      {/* Pivot */}
      <circle cx="140" cy="70" r="9" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      {/* Rotating assembly */}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '140px 70px',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)' }}>
        {/* Beam */}
        <rect x="26" y="63" width="228" height="13" rx="6" fill="#92400e" stroke="#78350f" strokeWidth="1" />
        {/* Left chain + pan */}
        <line x1="42" y1="76" x2="42" y2="138" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="42" cy="143" rx="38" ry="10" fill={balanced ? '#fde68a' : '#fbbf24'} stroke="#d97706" strokeWidth="1.5" />
        {/* Right chain + pan */}
        <line x1="238" y1="76" x2="238" y2="138" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="238" cy="143" rx="38" ry="10" fill={balanced ? '#fde68a' : '#fbbf24'} stroke="#d97706" strokeWidth="1.5" />
        {/* Left weight badge */}
        <circle cx="42" cy="118" r="19" fill="#3b82f6" opacity="0.92" />
        <text x="42" y="124" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16">{leftW}</text>
        {/* Right weight badge */}
        <circle cx="238" cy="118" r="19" fill={rightBadgeColor} opacity="0.92" />
        <text x="238" y="124" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16">{rightW > 0 ? rightW : '?'}</text>
      </g>
    </svg>
  )
}

function emojiRow(emoji: string, count: number): string {
  if (count === 0) return ''
  if (count <= 8) return emoji.repeat(count)
  return `${emoji.repeat(5)}+${count - 5}`
}

// ── TenPlus (10-en felül) ──────────────────────────────────────────────────────

type TenPlusView = 'object' | 'rod'

interface TenPlusRecognitionTask {
  mode: 'recognition'
  target: number
  small: number
  view: TenPlusView
  answers: number[]
  emoji: string
}

interface TenPlusAssemblyTask {
  mode: 'assembly'
  target: number
}

type TenPlusTask = TenPlusRecognitionTask | TenPlusAssemblyTask

const TEN_PLUS_LEVEL_KEY = 'tenPlusLevelState'
const TEN_PLUS_ROD_UNIT  = 22

function loadTenPlusLevel(): StagedLevelState {
  return loadStagedLevel(TEN_PLUS_LEVEL_KEY)
}

// Called after each successfully completed tenPlus task — steps the level up
// once at least 5 tasks were done at the current level and mastery is high enough.
function advanceTenPlusLevel(): StagedLevelState {
  return advanceStagedLevel(TEN_PLUS_LEVEL_KEY, 'math.tenPlus')
}

function makeAnswersInRange(correct: number, min: number, max: number): number[] {
  const distractors = shuffle(
    Array.from({ length: max - min + 1 }, (_, i) => i + min).filter(n => n !== correct)
  ).slice(0, 3)
  return shuffle([correct, ...distractors])
}

function pickTenPlusView(level: 1 | 2): TenPlusView {
  const objectChance = level === 1 ? 0.6 : 0.4
  return Math.random() < objectChance ? 'object' : 'rod'
}

function pickTenPlusTarget(level: 1 | 2 | 3, suffix: string): number {
  // Capped at 19, not 20 — the assembly screen only offers 1-9 as the "smaller" rod,
  // and 20 (= 10 + 10) can't be built from a rod smaller than the fixed ten-rod.
  const range = level === 1 ? [11, 12, 13, 14, 15] : Array.from({ length: 9 }, (_, i) => i + 11)
  return selectNextItem('math.tenPlus', range, t => `${t}_${suffix}`)
}

function generateTenPlusTask(level: 1 | 2 | 3): TenPlusTask {
  if (level === 3) {
    const target = pickTenPlusTarget(3, 'assembly')
    return { mode: 'assembly', target }
  }
  const view = pickTenPlusView(level)
  const target = pickTenPlusTarget(level, view)
  const maxAnswer = level === 1 ? 15 : 19
  return {
    mode: 'recognition',
    target,
    small: target - 10,
    view,
    answers: makeAnswersInRange(target, 11, maxAnswer),
    emoji: pickRandom(EMOJI_SETS).items[0],
  }
}

function tenPlusItemId(task: TenPlusTask): string {
  return task.mode === 'assembly' ? `${task.target}_assembly` : `${task.target}_${task.view}`
}

function tenPlusQuestion(task: TenPlusTask): string {
  if (task.mode === 'assembly') return 'Melyik rúd illik a tízes mellé, hogy pont kiadja?'
  return task.view === 'object'
    ? `Tíz a dobozban, és ${HU_NUMS[task.small]} kívül — hány összesen?`
    : `Tíz meg ${HU_NUMS[task.small]}?`
}

// ── Addition / Subtraction ──────────────────────────────────────────────────

// [addendMin, addendMax, sumMin, sumMax] per level
const ADDITION_RANGES: Record<1 | 2 | 3, [number, number, number, number]> = {
  1: [1, 3, 2, 5],
  2: [2, 6, 6, 10],
  3: [3, 9, 11, 15],
}

// [aMin, aMax, bMin, bMax] per level — result = a - b, always >= 1
const SUBTRACTION_RANGES: Record<1 | 2 | 3, [number, number, number, number]> = {
  1: [3, 5, 1, 3],
  2: [6, 8, 2, 4],
  3: [10, 12, 3, 5],
}

function additionPairs(level: 1 | 2 | 3): [number, number][] {
  const [aMin, aMax, sMin, sMax] = ADDITION_RANGES[level]
  const pairs: [number, number][] = []
  for (let a = aMin; a <= aMax; a++) {
    for (let b = a; b <= aMax; b++) {
      if (a + b >= sMin && a + b <= sMax) pairs.push([a, b])
    }
  }
  return pairs
}

function subtractionPairs(level: 1 | 2 | 3): [number, number][] {
  const [aMin, aMax, bMin, bMax] = SUBTRACTION_RANGES[level]
  const pairs: [number, number][] = []
  for (let a = aMin; a <= aMax; a++) {
    for (let b = bMin; b <= bMax; b++) {
      if (b < a) pairs.push([a, b])
    }
  }
  return pairs
}

// Distractors close to the correct result (±1, ±2) so the answer can't be
// found by elimination against wildly different numbers.
function makeCloseAnswers(correct: number): number[] {
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2].filter(n => n >= 1)
  return shuffle([correct, ...shuffle(candidates).slice(0, 3)])
}

const ADDITION_LEVEL_KEY    = 'additionLevelState'
const SUBTRACTION_LEVEL_KEY = 'subtractionLevelState'

function loadAdditionLevel(): StagedLevelState { return loadStagedLevel(ADDITION_LEVEL_KEY) }
function advanceAdditionLevel(): StagedLevelState { return advanceStagedLevel(ADDITION_LEVEL_KEY, 'math.addition') }
function loadSubtractionLevel(): StagedLevelState { return loadStagedLevel(SUBTRACTION_LEVEL_KEY) }
function advanceSubtractionLevel(): StagedLevelState { return advanceStagedLevel(SUBTRACTION_LEVEL_KEY, 'math.subtraction') }

interface AdditionTask { a: number; b: number; sum: number; emoji: string; plural: string; answers: number[] }
interface SubtractionTask { a: number; b: number; result: number; emoji: string; answers: number[] }

function generateAdditionTask(level: 1 | 2 | 3): AdditionTask {
  const pairs = additionPairs(level)
  const [a, b] = selectNextItem('math.addition', pairs, ([x, y]) => `${x}_${y}`)
  const sum = a + b
  const set = pickRandom(EMOJI_SETS)
  return { a, b, sum, emoji: set.items[0], plural: set.plural, answers: makeCloseAnswers(sum) }
}

function generateSubtractionTask(level: 1 | 2 | 3): SubtractionTask {
  const pairs = subtractionPairs(level)
  const [a, b] = selectNextItem('math.subtraction', pairs, ([x, y]) => `${x}_${y}`)
  return { a, b, result: a - b, emoji: pickRandom(EMOJI_SETS).items[0], answers: makeCloseAnswers(a - b) }
}

function EmojiGroup({ emoji, count, dimLast = 0 }: { emoji: string; count: number; dimLast?: number }): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1 justify-center items-center" style={{ maxWidth: 160 }}>
      {Array.from({ length: count }, (_, i) => {
        const isRemoved = i >= count - dimLast
        return (
          <span key={i} className="relative inline-flex text-4xl leading-none" style={{
            opacity: isRemoved ? 0.3 : 1,
            transition: 'opacity 0.5s ease-in',
          }}>
            {emoji}
            {isRemoved && (
              <span aria-hidden="true" style={{
                position: 'absolute', left: '-8%', right: '-8%', top: '50%', height: 3,
                background: '#dc2626', borderRadius: 2, transform: 'translateY(-50%) rotate(-10deg)',
              }} />
            )}
          </span>
        )
      })}
    </div>
  )
}

function OperatorSign({ symbol, color }: { symbol: string; color: string }): JSX.Element {
  return <span className="font-black leading-none flex-shrink-0" style={{ fontSize: 44, color }}>{symbol}</span>
}

function QuestionCard(): JSX.Element {
  return (
    <div className="flex items-center justify-center flex-shrink-0" style={{
      width: 56, height: 56, borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)', background: 'white',
    }}>
      <span className="font-black text-yellow-900" style={{ fontSize: 32 }}>?</span>
    </div>
  )
}

function NumberCard({ value }: { value: number }): JSX.Element {
  return (
    <div className="flex items-center justify-center flex-shrink-0" style={{
      width: 56, height: 56, borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)', background: 'white',
    }}>
      <span className="font-black text-yellow-900" style={{ fontSize: 32 }}>{value}</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MathModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot      = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]         = useState<Phase>('select')
  const [gameType, setGameType]   = useState<GameType>('counting')
  const [taskIndex, setTaskIndex] = useState(0)
  const [streak, setStreak]       = useState(0)

  // Counting/subitizing state
  const [task, setTask]                     = useState<TaskState | null>(null)
  const [selected, setSelected]             = useState<number | null>(null)
  const [flashVisible, setFlashVisible]     = useState(false)
  const [answersVisible, setAnswersVisible] = useState(false)
  const answering = useRef(false)

  // Dienes state
  const [dienesTask, setDienesTask]     = useState<DienesTask | null>(null)
  const [rodPool, setRodPool]           = useState<RodItem[]>([])
  const [placedRods, setPlacedRods]     = useState<number[]>([])
  const [dienesResult, setDienesResult] = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Balance state
  const [balanceTask, setBalanceTask]     = useState<BalanceTask | null>(null)
  const [rightCards, setRightCards]       = useState<number[]>([])
  const [balanceResult, setBalanceResult] = useState<'idle' | 'correct'>('idle')
  const balanceFailed = useRef(false)

  // TenPlus state
  const [tenPlusTask, setTenPlusTask]     = useState<TenPlusTask | null>(null)
  const [tenPlusSelected, setTenPlusSelected] = useState<number | null>(null)
  const [tenPlusPlaced, setTenPlusPlaced] = useState<number | null>(null)
  const [tenPlusResult, setTenPlusResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const tenPlusAnswering = useRef(false)

  // Addition state
  const [additionTask, setAdditionTask]         = useState<AdditionTask | null>(null)
  const [additionSelected, setAdditionSelected] = useState<number | null>(null)
  const additionAnswering = useRef(false)

  // Subtraction state
  const [subtractionTask, setSubtractionTask]                 = useState<SubtractionTask | null>(null)
  const [subtractionSelected, setSubtractionSelected]         = useState<number | null>(null)
  const [subtractionRemoving, setSubtractionRemoving]         = useState(false)
  const [subtractionAnswersVisible, setSubtractionAnswersVisible] = useState(false)
  const subtractionAnswering = useRef(false)

  const MATH_CONFETTI_COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#d97706', '#fffbeb']

  const { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
    confettiColors: MATH_CONFETTI_COLORS,
  })

  // ── Shared helpers ────────────────────────────────────────────────────────

  const callRoundComplete = (): void => {
    unlockAudio()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    if (gameType === 'tenPlus') {
      void confetti({ particleCount: 120, spread: 80, origin: { x: 0.5, y: 0.45 }, colors: MATH_CONFETTI_COLORS })
      setTimeout(() => {
        void confetti({ particleCount: 120, spread: 90, origin: { x: 0.5, y: 0.4 }, colors: MATH_CONFETTI_COLORS })
      }, 250)
      const parts = ['Hú, te már 7 éves feladatot oldottál meg! Fantasztikus!']
      if (unlocked) parts.push('Új ruha vár rád a szekrényben!')
      speakChained(parts)
    } else if (unlocked) {
      speak('Új ruha vár rád a szekrényben!')
    }
    onRoundComplete(unlocked)
  }

  const advanceTask = (newStreak: number, delay: number, next: () => void): void => {
    if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
    else triggerMicro()
    const nextIdx = taskIndex + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); callRoundComplete() }, delay)
    } else {
      setTimeout(() => { setTaskIndex(nextIdx); next() }, delay)
    }
  }

  // ── Counting / subitizing ─────────────────────────────────────────────────

  const startTask = useCallback((t: TaskState, gt: GameType): void => {
    setTask(t)
    setSelected(null)
    answering.current = false
    if (gt === 'subitizing') {
      setFlashVisible(true)
      setAnswersVisible(false)
      speak('Hány pötty villan fel?')
      setTimeout(() => { setFlashVisible(false); setAnswersVisible(true) }, FLASH_MS)
    } else {
      setFlashVisible(false)
      setAnswersVisible(true)
      speak(`Hány ${t.emojiSet.plural} van itt?`)
    }
  }, [])

  const handleAnswer = (n: number): void => {
    if (answering.current || selected !== null || !task) return
    answering.current = true
    setSelected(n)
    const taskType = gameType === 'counting' ? 'math.counting' : 'math.subitizing'
    if (n === task.correct) {
      recordAttempt(taskType, `count_${task.correct}`, true)
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 900, () => {
        const next = generateTask(gameType, pickCount(gameType))
        startTask(next, gameType)
      })
    } else {
      recordAttempt(taskType, `count_${task.correct}`, false)
      setStreak(0); triggerError()
      setTimeout(() => { setSelected(null); answering.current = false; startTask(task, gameType) }, 1400)
    }
  }

  // ── Dienes ────────────────────────────────────────────────────────────────

  const startDienesTask = useCallback((target: number): void => {
    const dt = generateDienesTask(target)
    setDienesTask(dt)
    setRodPool(dt.available.map((v, i) => ({ value: v, id: i, used: false })))
    setPlacedRods([])
    setDienesResult('idle')
    speak('Melyik két rúd ér ki ennyire?')
  }, [])

  const handleRodTap = (rodId: number): void => {
    if (dienesResult !== 'idle' || !dienesTask) return
    const rod = rodPool.find(r => r.id === rodId)
    if (!rod || rod.used || placedRods.length >= 2) return
    const newPlaced = [...placedRods, rod.value]
    setRodPool(prev => prev.map(r => r.id === rodId ? { ...r, used: true } : r))
    setPlacedRods(newPlaced)
    if (newPlaced.length < 2) return
    const sum = newPlaced[0] + newPlaced[1]
    if (sum === dienesTask.target) {
      setDienesResult('correct')
      const [a, b] = newPlaced
      speak(`${HU_NUMS[a]} meg ${HU_NUMS[b]}, az ${HU_NUMS[dienesTask.target]}! Pont kiadja!`)
      recordAttempt('math.dienes', `${dienesTask.target}`, true)
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 1800, () => startDienesTask(pickDienesTarget()))
    } else {
      setDienesResult('wrong')
      speak(sum < dienesTask.target ? 'Még nem ér ki! Próbáld mással!' : 'Túl hosszú lett! Próbáld mással!')
      recordAttempt('math.dienes', `${dienesTask.target}`, false)
      setStreak(0); triggerError()
      setTimeout(() => {
        setPlacedRods([])
        setRodPool(prev => prev.map(r => ({ ...r, used: false })))
        setDienesResult('idle')
      }, 1400)
    }
  }

  // ── Balance ───────────────────────────────────────────────────────────────

  const startBalanceTask = useCallback((target: number): void => {
    const bt = generateBalanceTask(target)
    setBalanceTask(bt)
    setRightCards([])
    setBalanceResult('idle')
    balanceFailed.current = false
    speak(`Tedd egyensúlyba a mérleget! ${HU_NUMS[target]} ${bt.emoji} van a bal oldalon.`)
  }, [])

  const handleAddCard = (value: number): void => {
    if (balanceResult !== 'idle' || !balanceTask) return
    const newCards = [...rightCards, value]
    const newSum = newCards.reduce((a, b) => a + b, 0)
    setRightCards(newCards)
    if (newSum === balanceTask.target) {
      setBalanceResult('correct')
      const combo = [...newCards].sort((a, b) => a - b)
      const comboStr = combo.map(n => HU_NUMS[n] ?? n).join(' meg ')
      speak(`Igen! Egyensúlyban vagyunk! ${comboStr}, az ${HU_NUMS[balanceTask.target]}!`)
      recordAttempt('math.balance', `${balanceTask.target}`, true)
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 2000, () => startBalanceTask(pickBalanceTarget()))
    } else if (newSum > balanceTask.target && !balanceFailed.current) {
      balanceFailed.current = true
      recordAttempt('math.balance', `${balanceTask.target}`, false)
      setStreak(0)
    }
  }

  const handleRemoveCard = (idx: number): void => {
    if (balanceResult !== 'idle') return
    setRightCards(prev => prev.filter((_, i) => i !== idx))
  }

  const handleBalanceHint = (): void => {
    if (!balanceTask) return
    const rightSum = rightCards.reduce((a, b) => a + b, 0)
    const needed = balanceTask.target - rightSum
    if (!balanceFailed.current) { balanceFailed.current = true; setStreak(0); recordAttempt('math.balance', `${balanceTask.target}`, false) }
    if (needed > 0)      speak(`Próbálj ${HU_NUMS[needed] ?? needed} ${balanceTask.emoji}t hozzáadni!`)
    else if (needed < 0) speak(`Vegyél el ${HU_NUMS[-needed] ?? -needed} ${balanceTask.emoji}t!`)
    else                 speak('Egyensúlyban vagy! Szuper!')
  }

  // ── TenPlus ───────────────────────────────────────────────────────────────

  const startTenPlusTask = useCallback((level: 1 | 2 | 3, isFirst = false): void => {
    const t = generateTenPlusTask(level)
    setTenPlusTask(t)
    setTenPlusSelected(null)
    setTenPlusPlaced(null)
    setTenPlusResult('idle')
    tenPlusAnswering.current = false
    const question = tenPlusQuestion(t)
    if (isFirst) speakChained(['Ez a nagy gyerekek feladata! Megpróbálod?', question])
    else speak(question)
  }, [])

  const handleTenPlusAnswer = (n: number): void => {
    if (tenPlusAnswering.current || tenPlusSelected !== null || !tenPlusTask || tenPlusTask.mode !== 'recognition') return
    tenPlusAnswering.current = true
    setTenPlusSelected(n)
    const itemId = tenPlusItemId(tenPlusTask)
    if (n === tenPlusTask.target) {
      recordAttempt('math.tenPlus', itemId, true)
      speak(`Tíz meg ${HU_NUMS[tenPlusTask.small]}, az ${HU_NUMS[tenPlusTask.target]}!`)
      const { level } = advanceTenPlusLevel()
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 1400, () => startTenPlusTask(level))
    } else {
      recordAttempt('math.tenPlus', itemId, false)
      setStreak(0); triggerError()
      setTimeout(() => {
        setTenPlusSelected(null)
        tenPlusAnswering.current = false
        speak(tenPlusQuestion(tenPlusTask))
      }, 1400)
    }
  }

  const handleTenPlusRodTap = (value: number): void => {
    if (tenPlusResult !== 'idle' || !tenPlusTask || tenPlusTask.mode !== 'assembly') return
    setTenPlusPlaced(value)
    const itemId = tenPlusItemId(tenPlusTask)
    if (10 + value === tenPlusTask.target) {
      setTenPlusResult('correct')
      speak(`Tíz meg ${HU_NUMS[value]}, az ${HU_NUMS[tenPlusTask.target]}!`)
      recordAttempt('math.tenPlus', itemId, true)
      const { level } = advanceTenPlusLevel()
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 1800, () => startTenPlusTask(level))
    } else {
      setTenPlusResult('wrong')
      recordAttempt('math.tenPlus', itemId, false)
      setStreak(0); triggerError()
      setTimeout(() => {
        setTenPlusPlaced(null)
        setTenPlusResult('idle')
      }, 1400)
    }
  }

  // ── Addition ──────────────────────────────────────────────────────────────

  const startAdditionTask = useCallback((level: 1 | 2 | 3): void => {
    const t = generateAdditionTask(level)
    setAdditionTask(t)
    setAdditionSelected(null)
    additionAnswering.current = false
    speak(`Hány ${t.plural} van összesen?`)
  }, [])

  const handleAdditionAnswer = (n: number): void => {
    if (additionAnswering.current || additionSelected !== null || !additionTask) return
    additionAnswering.current = true
    setAdditionSelected(n)
    const itemId = `${additionTask.a}_${additionTask.b}`
    if (n === additionTask.sum) {
      recordAttempt('math.addition', itemId, true)
      speak(`${HU_NUMS[additionTask.a]} meg ${HU_NUMS[additionTask.b]} az ${HU_NUMS[additionTask.sum]}!`)
      const { level } = advanceAdditionLevel()
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 1600, () => startAdditionTask(level))
    } else {
      recordAttempt('math.addition', itemId, false)
      setStreak(0); triggerError()
      setTimeout(() => { setAdditionSelected(null); additionAnswering.current = false }, 1400)
    }
  }

  // ── Subtraction ───────────────────────────────────────────────────────────

  const startSubtractionTask = useCallback((level: 1 | 2 | 3): void => {
    const t = generateSubtractionTask(level)
    setSubtractionTask(t)
    setSubtractionSelected(null)
    setSubtractionRemoving(false)
    setSubtractionAnswersVisible(false)
    subtractionAnswering.current = false
    speak(`${HU_NUMS[t.a]} mínusz ${HU_NUMS[t.b]}. Hány marad?`)
    setTimeout(() => setSubtractionRemoving(true), 600)
    setTimeout(() => setSubtractionAnswersVisible(true), 1300)
  }, [])

  const handleSubtractionAnswer = (n: number): void => {
    if (subtractionAnswering.current || subtractionSelected !== null || !subtractionTask) return
    subtractionAnswering.current = true
    setSubtractionSelected(n)
    const itemId = `${subtractionTask.a}_${subtractionTask.b}`
    if (n === subtractionTask.result) {
      recordAttempt('math.subtraction', itemId, true)
      speak(`${HU_NUMS[subtractionTask.a]} mínusz ${HU_NUMS[subtractionTask.b]}, az ${HU_NUMS[subtractionTask.result]}!`)
      const { level } = advanceSubtractionLevel()
      const ns = streak + 1; setStreak(ns)
      advanceTask(ns, 1600, () => startSubtractionTask(level))
    } else {
      recordAttempt('math.subtraction', itemId, false)
      setStreak(0); triggerError()
      setTimeout(() => { setSubtractionSelected(null); subtractionAnswering.current = false }, 1400)
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleStart = (gt: GameType): void => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    setStreak(0)
    setPhase('game')
    if (gt === 'dienes') {
      startDienesTask(pickDienesTarget())
    } else if (gt === 'balance') {
      startBalanceTask(pickBalanceTarget())
    } else if (gt === 'tenPlus') {
      startTenPlusTask(loadTenPlusLevel().level, true)
    } else if (gt === 'addition') {
      startAdditionTask(loadAdditionLevel().level)
    } else if (gt === 'subtraction') {
      startSubtractionTask(loadSubtractionLevel().level)
    } else {
      startTask(generateTask(gt, pickCount(gt)), gt)
    }
  }

  const handleBack = (): void => {
    unlockAudio(); speak('Visszamegyünk a kertbe?'); setTimeout(onBack, 600)
  }

  const handleRepeat = (): void => {
    unlockAudio()
    if (gameType === 'dienes' && dienesTask) {
      speak(`Melyik két rúd ér ki ennyire? ${HU_NUMS[dienesTask.target]}`)
    } else if (gameType === 'balance' && balanceTask) {
      speak(`${HU_NUMS[balanceTask.target]} ${balanceTask.emoji} van a bal oldalon. Tedd egyensúlyba!`)
    } else if (gameType === 'tenPlus' && tenPlusTask) {
      speak(tenPlusQuestion(tenPlusTask))
    } else if (gameType === 'addition' && additionTask) {
      speak(`Hány ${additionTask.plural} van összesen?`)
    } else if (gameType === 'subtraction' && subtractionTask) {
      speak(`${HU_NUMS[subtractionTask.a]} mínusz ${HU_NUMS[subtractionTask.b]}. Hány marad?`)
    } else if (task) {
      speak(gameType === 'counting' ? `Hány ${task.emojiSet.plural} van itt?` : 'Hány pötty villan fel?')
    }
  }

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ModuleSelect
        hue="yellow"
        title="🔢 Matek"
        Illustration={Illustration}
        cards={[
          { emoji: '🐱', label: 'Számolj!', sublabel: 'Számold meg a képeket!', onClick: () => handleStart('counting') },
          { emoji: '⚡', label: 'Villám!',  sublabel: 'Nézd meg a pöttyöket!',  onClick: () => handleStart('subitizing') },
          { emoji: '🧱', label: 'Rudak!',   sublabel: 'Melyik kettő ér ki?',    onClick: () => handleStart('dienes') },
          { emoji: '⚖️', label: 'Mérleg!',  sublabel: 'Tedd egyensúlyba!',      onClick: () => handleStart('balance') },
          { emoji: '🌟', label: '10-en felül', sublabel: '(7 éveseknek!)', special: true, onClick: () => handleStart('tenPlus') },
          { emoji: '➕', label: 'Összeadás', sublabel: 'Adjuk össze!', onClick: () => handleStart('addition') },
          { emoji: '➖', label: 'Kivonás',   sublabel: 'Vegyünk el!',   onClick: () => handleStart('subtraction') },
        ]}
        onBack={handleBack}
        onRepeat={() => speak('Melyik játékot választod?')}
      />
    )
  }

  // ── DIENES ────────────────────────────────────────────────────────────────

  if (gameType === 'dienes' && dienesTask) {
    const isCorrect = dienesResult === 'correct'
    const isWrong   = dienesResult === 'wrong'
    const trackW    = dienesTask.target * U
    return (
      <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <p className="text-yellow-900 font-bold text-[22px] text-center flex-shrink-0">
            Melyik két rúd ér ki ennyire?
          </p>

          <div className="flex flex-col items-start gap-2 flex-shrink-0">
            <div className="flex flex-col items-start gap-1">
              <span className="text-yellow-700 font-semibold text-xs ml-1">Cél:</span>
              <span className="text-yellow-900 font-bold leading-none ml-1" style={{ fontSize: 44 }}>{dienesTask.target}</span>
              <RodBar value={dienesTask.target} />
            </div>
            <p className="text-yellow-700 font-semibold text-xs ml-1 mt-2">Rakd ki:</p>
            <div className="flex items-center gap-3">
              <div style={{
                width: trackW, height: ROD_H,
                border: `2px dashed ${isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#d97706'}`,
                borderRadius: 8, display: 'flex', alignItems: 'center', padding: 0,
                overflow: 'hidden', gap: 0,
                animation: isWrong ? 'shake-no 0.4s ease-out' : 'none',
                boxShadow: isCorrect ? '0 0 0 3px #4ade80' : 'none',
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}>
                {placedRods.map((val, i) => <RodBar key={i} value={val} green={isCorrect} placed />)}
              </div>
              {placedRods.length > 0 && (
                <span className="font-bold leading-none" style={{
                  fontSize: 44,
                  color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#78350f',
                  transition: 'color 0.25s',
                }}>
                  {placedRods.reduce((a, b) => a + b, 0)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-end flex-shrink-0 pb-2">
            {rodPool.map(rod => (
              <button key={rod.id} onClick={() => { unlockAudio(); handleRodTap(rod.id) }}
                disabled={rod.used || dienesResult !== 'idle'}
                className="active:scale-90 transition-transform duration-100 flex flex-col items-center gap-1"
                style={{ opacity: rod.used ? 0.15 : 1, transition: 'opacity 0.2s' }}>
                <RodBar value={rod.value} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#78350f' }}>{rod.value}</span>
              </button>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── BALANCE ───────────────────────────────────────────────────────────────

  if (gameType === 'balance' && balanceTask) {
    const rightSum  = rightCards.reduce((a, b) => a + b, 0)
    const overflow  = rightSum > balanceTask.target

    return (
      <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-4 px-4">

          <p className="text-yellow-900 font-bold text-[20px] text-center flex-shrink-0">
            Tedd egyensúlyba a mérleget!
          </p>

          {/* Emoji rows above scale */}
          <div className="flex w-full justify-around items-end flex-shrink-0 px-2">
            <div className="flex flex-col items-center gap-1">
              <p className="text-yellow-800 font-semibold text-xs">Bal oldal</p>
              <p className="text-2xl leading-tight text-center" style={{ maxWidth: 130, wordBreak: 'break-all' }}>
                {emojiRow(balanceTask.emoji, balanceTask.target)}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-yellow-800 font-semibold text-xs">Jobb oldal — koppints a törléshez</p>
              <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: 150 }}>
                {rightCards.length === 0 ? (
                  <span className="text-2xl text-gray-400 leading-tight">─</span>
                ) : rightCards.map((val, idx) => (
                  <button key={idx}
                    onClick={() => { unlockAudio(); handleRemoveCard(idx) }}
                    disabled={balanceResult !== 'idle'}
                    className="flex items-center gap-0.5 active:bg-red-100 active:scale-90 transition-all rounded-lg px-2 py-1"
                    style={{ background: overflow ? '#fee2e2' : '#fef9c3', boxShadow: 'var(--sh-1)' }}>
                    <span className="text-xl leading-none">{val <= 4 ? balanceTask.emoji.repeat(val) : `${balanceTask.emoji}×${val}`}</span>
                    <span className="text-red-400 text-xs font-bold ml-0.5">✕</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Balance scale SVG */}
          <div className="flex justify-center w-full flex-shrink-0">
            <BalanceScale leftW={balanceTask.target} rightW={rightSum} />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 w-full flex-shrink-0">
            {/* Card buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {balanceTask.cardOptions.map(val => (
                <button key={val}
                  onClick={() => { unlockAudio(); handleAddCard(val) }}
                  disabled={balanceResult !== 'idle'}
                  style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)' }}
                  className="flex flex-col items-center gap-0.5 bg-white px-3 py-2 active:scale-90 transition-transform duration-100">
                  <span className="text-yellow-900 font-bold text-lg leading-none">+{val}</span>
                  <span className="text-base leading-none">{val <= 3 ? balanceTask.emoji.repeat(val) : `${balanceTask.emoji}×${val}`}</span>
                </button>
              ))}
            </div>
            {/* Hint button */}
            {balanceResult === 'idle' && (
              <button onClick={() => { unlockAudio(); handleBalanceHint() }}
                className="self-center bg-amber-100 active:bg-amber-200 text-amber-800 font-semibold text-sm rounded-full px-5 py-2 active:scale-95 transition-transform">
                🤔 Segíts!
              </button>
            )}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── TENPLUS ───────────────────────────────────────────────────────────────

  if (gameType === 'tenPlus' && tenPlusTask) {
    const haladoHeader = (
      <span className="text-amber-600 font-bold text-xs tracking-wide flex-shrink-0">⭐ Haladó szint ⭐</span>
    )

    if (tenPlusTask.mode === 'recognition') {
      return (
        <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
          <div className="flex flex-col items-center justify-between h-full py-4 px-4">

            {haladoHeader}

            <p className="text-yellow-900 font-bold text-2xl text-center leading-snug px-2 flex-shrink-0">
              {tenPlusQuestion(tenPlusTask)}
            </p>

            <div className="flex-1 flex items-center justify-center w-full min-h-0">
              {tenPlusTask.view === 'rod' ? (
                <div className="flex items-end gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-yellow-700 font-semibold text-xs">10</span>
                    <RodBar value={10} unit={TEN_PLUS_ROD_UNIT} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-yellow-700 font-semibold text-xs">{tenPlusTask.small}</span>
                    <RodBar value={tenPlusTask.small} unit={TEN_PLUS_ROD_UNIT} />
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-yellow-700 font-semibold text-xs">10</span>
                    <div className="grid grid-cols-5 gap-1 p-2 rounded-xl" style={{ border: '2px solid #d97706', background: '#fffbeb' }}>
                      {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className="text-2xl leading-none">{tenPlusTask.emoji}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-yellow-700 font-semibold text-xs">{tenPlusTask.small}</span>
                    <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: 110 }}>
                      {Array.from({ length: tenPlusTask.small }, (_, i) => (
                        <span key={i} className="text-2xl leading-none">{tenPlusTask.emoji}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full flex-shrink-0">
              {tenPlusTask.answers.map(n => (
                <AnswerButton key={n} hue="yellow"
                  state={tenPlusSelected === n ? (n === tenPlusTask.target ? 'correct' : 'wrong') : 'idle'}
                  onClick={() => handleTenPlusAnswer(n)}
                  className={['flex flex-col items-center justify-center gap-1 min-h-[80px]',
                    tenPlusSelected !== null && tenPlusSelected !== n ? 'opacity-50' : ''].join(' ')}>
                  <span className="text-4xl font-bold leading-none">{n}</span>
                  <span className="text-base font-bold opacity-80">{HU_NUMS[n]}</span>
                </AnswerButton>
              ))}
            </div>

          </div>
          <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
        </TaskShell>
      )
    }

    // Assembly (level 3)
    const isCorrect = tenPlusResult === 'correct'
    const isWrong   = tenPlusResult === 'wrong'
    return (
      <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          {haladoHeader}

          <p className="text-yellow-900 font-bold text-[22px] text-center flex-shrink-0">
            {tenPlusQuestion(tenPlusTask)}
          </p>

          <div className="flex flex-col items-start gap-2 flex-shrink-0">
            <div className="flex flex-col items-start gap-1">
              <span className="text-yellow-700 font-semibold text-xs ml-1">Cél:</span>
              <span className="text-yellow-900 font-bold leading-none ml-1" style={{ fontSize: 44 }}>{tenPlusTask.target}</span>
              <RodBar value={tenPlusTask.target} unit={TEN_PLUS_ROD_UNIT} />
            </div>
            <p className="text-yellow-700 font-semibold text-xs ml-1 mt-2">Rakd ki:</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center" style={{
                border: `2px dashed ${isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#d97706'}`,
                borderRadius: 8, height: ROD_H, overflow: 'hidden',
                animation: isWrong ? 'shake-no 0.4s ease-out' : 'none',
                boxShadow: isCorrect ? '0 0 0 3px #4ade80' : 'none',
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}>
                <RodBar value={10} unit={TEN_PLUS_ROD_UNIT} green={isCorrect} placed />
                {tenPlusPlaced !== null && <RodBar value={tenPlusPlaced} unit={TEN_PLUS_ROD_UNIT} green={isCorrect} placed />}
              </div>
              {tenPlusPlaced !== null && (
                <span className="font-bold leading-none" style={{
                  fontSize: 44,
                  color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#78350f',
                  transition: 'color 0.25s',
                }}>
                  {10 + tenPlusPlaced}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center items-end flex-shrink-0 pb-2">
            {Array.from({ length: 9 }, (_, i) => i + 1).map(v => (
              <button key={v} onClick={() => { unlockAudio(); handleTenPlusRodTap(v) }}
                disabled={tenPlusResult !== 'idle'}
                className="active:scale-90 transition-transform duration-100 flex flex-col items-center gap-1">
                <RodBar value={v} unit={TEN_PLUS_ROD_UNIT} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#78350f' }}>{v}</span>
              </button>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── ADDITION ──────────────────────────────────────────────────────────────

  if (gameType === 'addition' && additionTask) {
    return (
      <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <p className="text-yellow-900 font-bold text-2xl text-center leading-snug px-2 flex-shrink-0">
            Hány {additionTask.plural} van összesen?
          </p>

          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <EmojiGroup emoji={additionTask.emoji} count={additionTask.a} />
              <OperatorSign symbol="+" color="#16a34a" />
              <EmojiGroup emoji={additionTask.emoji} count={additionTask.b} />
              <OperatorSign symbol="=" color="#2563eb" />
              <QuestionCard />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full flex-shrink-0">
            {additionTask.answers.map(n => (
              <AnswerButton key={n} hue="yellow"
                state={additionSelected === n ? (n === additionTask.sum ? 'correct' : 'wrong') : 'idle'}
                onClick={() => handleAdditionAnswer(n)}
                className={['flex flex-col items-center justify-center gap-1 min-h-[80px]',
                  additionSelected !== null && additionSelected !== n ? 'opacity-50' : ''].join(' ')}>
                <span className="text-4xl font-bold leading-none">{n}</span>
                <span className="text-base font-bold opacity-80">{HU_NUMS[n]}</span>
              </AnswerButton>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── SUBTRACTION ───────────────────────────────────────────────────────────

  if (gameType === 'subtraction' && subtractionTask) {
    return (
      <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <p className="text-yellow-900 font-bold text-2xl text-center leading-snug px-2 flex-shrink-0">
            {HU_NUMS[subtractionTask.a]} mínusz {HU_NUMS[subtractionTask.b]}. Hány marad?
          </p>

          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <EmojiGroup emoji={subtractionTask.emoji} count={subtractionTask.a}
                dimLast={subtractionRemoving ? subtractionTask.b : 0} />
              <OperatorSign symbol="−" color="#dc2626" />
              <NumberCard value={subtractionTask.b} />
              <OperatorSign symbol="=" color="#2563eb" />
              <QuestionCard />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full flex-shrink-0 transition-opacity duration-300"
            style={{ opacity: subtractionAnswersVisible ? 1 : 0, pointerEvents: subtractionAnswersVisible ? 'auto' : 'none' }}>
            {subtractionTask.answers.map(n => (
              <AnswerButton key={n} hue="yellow"
                state={subtractionSelected === n ? (n === subtractionTask.result ? 'correct' : 'wrong') : 'idle'}
                onClick={() => handleSubtractionAnswer(n)}
                className={['flex flex-col items-center justify-center gap-1 min-h-[80px]',
                  subtractionSelected !== null && subtractionSelected !== n ? 'opacity-50' : ''].join(' ')}>
                <span className="text-4xl font-bold leading-none">{n}</span>
                <span className="text-base font-bold opacity-80">{HU_NUMS[n]}</span>
              </AnswerButton>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── COUNTING / SUBITIZING ─────────────────────────────────────────────────

  if (!task) return <div className="w-screen h-screen bg-yellow-400" />

  return (
    <TaskShell hue="yellow" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
      <div className="flex flex-col items-center justify-between h-full py-5 px-4">

        <p className="text-yellow-900 font-bold text-2xl text-center leading-snug px-2 flex-shrink-0">
          {gameType === 'counting' ? `Hány ${task.emojiSet.plural} van itt?` : 'Hány pötty villan fel?'}
        </p>

        <div className="flex-1 flex items-center justify-center w-full min-h-0 relative">
          {gameType === 'subitizing' && (
            <div className="transition-opacity duration-300" style={{ opacity: flashVisible ? 1 : 0, pointerEvents: 'none' }}>
              <DotPattern count={task.correct as 1|2|3|4|5} size={200} />
            </div>
          )}
          {gameType === 'counting' && (
            <div className="relative w-full" style={{ height: '220px' }}>
              {task.positions.map((pos, i) => (
                <span key={i} className="absolute text-5xl leading-none select-none"
                  style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate})` }}>
                  {task.emojiSet.items[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full flex-shrink-0 transition-opacity duration-300"
          style={{ opacity: answersVisible ? 1 : 0, pointerEvents: answersVisible ? 'auto' : 'none' }}>
          {task.answers.map(n => (
            <AnswerButton key={n} hue="yellow"
              state={selected === n ? (n === task.correct ? 'correct' : 'wrong') : 'idle'}
              onClick={() => handleAnswer(n)}
              className={['flex flex-col items-center justify-center gap-1 min-h-[80px]',
                selected !== null && selected !== n ? 'opacity-50' : ''].join(' ')}>
              <span className="text-4xl font-bold leading-none">{n}</span>
              <span className="text-base font-bold opacity-80">{HU_NUMS[n]}</span>
            </AnswerButton>
          ))}
        </div>

      </div>
      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </TaskShell>
  )
}
