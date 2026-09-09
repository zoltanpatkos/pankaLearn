import { useState, useEffect, useRef } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakTPR, speakEnglish, speakEnglishPraise, speakEnglishTwice, speakEnglishSuccess } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { playAudio } from '../lib/audioPlayer'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { TPR_VERBS, POINTER_TASKS, SAY_IT_WORDS, OPPOSITE_PAIRS, getMemoryCategories, type VerbEntry, type PointerTask, type SayItWord, type OppositePair } from '../data/englishData'
import { selectNextItem, recordAttempt, getItemWeight } from '../lib/adaptive'
import { ModuleSelect } from '../components/ModuleSelect'
import { TaskShell } from '../components/TaskShell'
import { AnswerButton } from '../components/AnswerButton'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'tpr' | 'pointer' | 'sayit' | 'feedmonster' | 'memory' | 'opposites' | 'prepositions'
type Phase = 'select' | 'game'
type SayItPhase = 'waiting' | 'listening' | 'correct' | 'wrong'
type MonsterMood = 'hungry' | 'eating' | 'satisfied' | 'yuck'

const TASKS_PER_ROUND = 5
const STREAK_REWARD = 3

const maybePraise = (): void => speakEnglishPraise()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Feed-the-Monster data ─────────────────────────────────────────────────────

interface FeedTask {
  id: string
  english: string
  hungarian: string
  targets: Array<{ emoji: string; name: string }>
}

interface FeedItem {
  emoji: string
  name: string
  isTarget: boolean
  uid: string
  eaten: boolean
  shaking: boolean
}

const FEED_TASKS_1: FeedTask[] = [
  { id: 'apple',  english: "I'm hungry! I want an apple.",  hungarian: 'Éhes vagyok! Almát szeretnék.',         targets: [{ emoji: '🍎', name: 'apple' }] },
  { id: 'banana', english: "I'm hungry! I want a banana.",  hungarian: 'Éhes vagyok! Banánt szeretnék.',        targets: [{ emoji: '🍌', name: 'banana' }] },
  { id: 'milk',   english: "I'm thirsty! I want milk.",     hungarian: 'Szomjas vagyok! Tejet szeretnék.',      targets: [{ emoji: '🥛', name: 'milk' }] },
  { id: 'cookie', english: "I'm hungry! I want a cookie.",  hungarian: 'Éhes vagyok! Sütit szeretnék.',         targets: [{ emoji: '🍪', name: 'a cookie' }] },
  { id: 'carrot', english: "I'm hungry! I want a carrot.",  hungarian: 'Éhes vagyok! Sárgarépát szeretnék.',    targets: [{ emoji: '🥕', name: 'a carrot' }] },
]

const FEED_TASKS_2: FeedTask[] = [
  { id: 'apple_banana',      english: "I'm hungry! I want an apple and a banana.",      hungarian: 'Éhes vagyok! Almát és banánt szeretnék.',              targets: [{ emoji: '🍎', name: 'apple' }, { emoji: '🍌', name: 'banana' }] },
  { id: 'milk_cookie',       english: "I'm hungry! I want milk and a cookie.",          hungarian: 'Éhes vagyok! Tejet és sütit szeretnék.',               targets: [{ emoji: '🥛', name: 'milk' }, { emoji: '🍪', name: 'a cookie' }] },
  { id: 'carrot_tomato',     english: "I'm hungry! I want a carrot and a tomato.",      hungarian: 'Éhes vagyok! Sárgarépát és paradicsomot szeretnék.',   targets: [{ emoji: '🥕', name: 'a carrot' }, { emoji: '🍅', name: 'a tomato' }] },
  { id: 'orange_grape',      english: "I'm hungry! I want an orange and some grapes.",  hungarian: 'Éhes vagyok! Narancsot és szőlőt szeretnék.',           targets: [{ emoji: '🍊', name: 'an orange' }, { emoji: '🍇', name: 'grapes' }] },
  { id: 'strawberry_banana', english: "I'm hungry! I want a strawberry and a banana.",  hungarian: 'Éhes vagyok! Epret és banánt szeretnék.',              targets: [{ emoji: '🍓', name: 'a strawberry' }, { emoji: '🍌', name: 'banana' }] },
]

const ALL_FEED_TASKS = [...FEED_TASKS_1, ...FEED_TASKS_2]

const FEED_DISTRACTORS = [
  { emoji: '🧀', name: 'cheese' },
  { emoji: '🥦', name: 'broccoli' },
  { emoji: '🍐', name: 'a pear' },
  { emoji: '🥒', name: 'a cucumber' },
]

function buildFeedItems(task: FeedTask): FeedItem[] {
  const weight = getItemWeight('english.feedmonster', task.id)
  const distractorCount = task.targets.length === 1 && weight >= 2.0 ? 1 : 2
  const distractors = shuffle(FEED_DISTRACTORS).slice(0, distractorCount)
  return shuffle([
    ...task.targets.map((t, i) => ({ emoji: t.emoji, name: t.name, isTarget: true,  uid: `t${i}_${t.emoji}`, eaten: false, shaking: false })),
    ...distractors.map((d, i) => ({ emoji: d.emoji, name: d.name, isTarget: false, uid: `d${i}_${d.emoji}`, eaten: false, shaking: false })),
  ])
}

// ── Memory (Párosítsd) data ───────────────────────────────────────────────────

interface MemoryCard {
  id: string
  pairId: string
  type: 'image' | 'sound'
  word: string
  emoji: string
  flipped: boolean
  matched: boolean
}

function buildMemoryCards(): MemoryCard[] {
  const categories = getMemoryCategories()
  const category = categories[Math.floor(Math.random() * categories.length)]
  const selected = shuffle(category.items).slice(0, 4)
  return shuffle([
    ...selected.map(item => ({ id: `img_${item.word}`, pairId: item.word, type: 'image' as const, word: item.word, emoji: item.emoji, flipped: false, matched: false })),
    ...selected.map(item => ({ id: `snd_${item.word}`, pairId: item.word, type: 'sound' as const, word: item.word, emoji: item.emoji, flipped: false, matched: false })),
  ])
}

// ── Opposites data ─────────────────────────────────────────────────────────────

interface OppositeCombo { pair: OppositePair; forward: boolean }

const OPPOSITE_COMBOS: OppositeCombo[] = OPPOSITE_PAIRS.flatMap(pair => [
  { pair, forward: true },
  { pair, forward: false },
])

function oppositeComboId(c: OppositeCombo): string {
  return `${c.pair.a}_${c.pair.b}_${c.forward ? 'forward' : 'backward'}`
}

interface OppositeTask {
  id: string
  startWord: string; startHu: string; startEmoji: string
  pair: OppositePair
  correctWord: string; correctHu: string; correctEmoji: string
  distractorEmoji: string
}

function generateOppositeTask(): OppositeTask {
  const combo = selectNextItem('english.opposites', OPPOSITE_COMBOS, oppositeComboId)
  const { pair, forward } = combo
  const start   = forward ? { w: pair.a, hu: pair.aHu, e: pair.aEmoji } : { w: pair.b, hu: pair.bHu, e: pair.bEmoji }
  const correct = forward ? { w: pair.b, hu: pair.bHu, e: pair.bEmoji } : { w: pair.a, hu: pair.aHu, e: pair.aEmoji }
  const distractorPool = OPPOSITE_PAIRS.filter(p => p !== pair)
  const dp = distractorPool[Math.floor(Math.random() * distractorPool.length)]
  const distractorEmoji = Math.random() < 0.5 ? dp.aEmoji : dp.bEmoji
  return {
    id: oppositeComboId(combo),
    startWord: start.w, startHu: start.hu, startEmoji: start.e,
    pair, correctWord: correct.w, correctHu: correct.hu, correctEmoji: correct.e,
    distractorEmoji,
  }
}

function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1) }

// Plays each part in order via the pre-generated Azure clips (Howler),
// falling back to live Web Speech per-part if a clip is missing — see
// playAudio() in audioPlayer.ts. A short gap between clips reads more
// naturally than back-to-back playback.
async function playSequence(parts: { text: string; lang: 'hu-HU' | 'en-GB' }[], pauseMs = 400): Promise<void> {
  for (let i = 0; i < parts.length; i++) {
    await playAudio(parts[i].text, parts[i].lang)
    if (i < parts.length - 1) await new Promise<void>(resolve => setTimeout(resolve, pauseMs))
  }
}

// ── Prepositions data ─────────────────────────────────────────────────────────

type Preposition = 'on' | 'under' | 'in' | 'nextTo' | 'behind'
type PrepItem = 'ball' | 'cat' | 'apple'
type PrepRef  = 'box' | 'chair' | 'bowl'

interface PrepScene { item: PrepItem; ref: PrepRef; position: Preposition }

// Only the object/position combinations that read unambiguously as a
// simple flat illustration (a cat "in" a chair, or an apple "behind" a
// bowl, wouldn't).
const PREP_SCENES: PrepScene[] = [
  { item: 'ball',  ref: 'box',   position: 'on' },
  { item: 'ball',  ref: 'box',   position: 'under' },
  { item: 'ball',  ref: 'box',   position: 'in' },
  { item: 'ball',  ref: 'box',   position: 'nextTo' },
  { item: 'ball',  ref: 'box',   position: 'behind' },
  { item: 'cat',   ref: 'chair', position: 'on' },
  { item: 'cat',   ref: 'chair', position: 'under' },
  { item: 'cat',   ref: 'chair', position: 'nextTo' },
  { item: 'apple', ref: 'bowl',  position: 'in' },
  { item: 'apple', ref: 'bowl',  position: 'nextTo' },
  { item: 'apple', ref: 'bowl',  position: 'on' },
]

const ALL_PREPOSITIONS: Preposition[] = ['on', 'under', 'in', 'nextTo', 'behind']

const PREP_EN: Record<Preposition, string>   = { on: 'on', under: 'under', in: 'in', nextTo: 'next to', behind: 'behind' }
const PREP_CARD: Record<Preposition, string> = { on: 'ON', under: 'UNDER', in: 'IN', nextTo: 'NEXT TO', behind: 'BEHIND' }
const ITEM_EN: Record<PrepItem, string> = { ball: 'ball', cat: 'cat', apple: 'apple' }
const ITEM_HU: Record<PrepItem, string> = { ball: 'labda', cat: 'cica', apple: 'alma' }
const REF_EN: Record<PrepRef, string>   = { box: 'box', chair: 'chair', bowl: 'bowl' }

// Hard-coded per (reference object, preposition) — avoids generating
// Hungarian case-suffixes (e.g. dobozban/székben/tálban vowel harmony)
// programmatically, same reasoning as the subtraction task's TTS.
const PREP_PHRASE_HU: Record<PrepRef, Record<Preposition, string>> = {
  box:   { on: 'a doboz tetején', under: 'a doboz alatt', in: 'a dobozban', nextTo: 'a doboz mellett', behind: 'a doboz mögött' },
  chair: { on: 'a szék tetején',  under: 'a szék alatt',  in: 'a székben',  nextTo: 'a szék mellett',  behind: 'a szék mögött' },
  bowl:  { on: 'a tál tetején',   under: 'a tál alatt',   in: 'a tálban',   nextTo: 'a tál mellett',   behind: 'a tál mögött' },
}

function prepSceneId(s: PrepScene): string { return `${s.item}_${s.position}` }

interface PrepTask { id: string; scene: PrepScene; correct: Preposition; distractor: Preposition }

function generatePrepTask(): PrepTask {
  const scene = selectNextItem('english.prepositions', PREP_SCENES, prepSceneId)
  const otherPreps = ALL_PREPOSITIONS.filter(p => p !== scene.position)
  const distractor = otherPreps[Math.floor(Math.random() * otherPreps.length)]
  return { id: prepSceneId(scene), scene, correct: scene.position, distractor }
}

// ── Prepositions illustration (flat SVG shapes, no emoji — spatial
// relationships aren't legible as emoji at this size) ─────────────────────────

const REF_SIZE: Record<PrepRef, { w: number; h: number }> = {
  box:   { w: 92, h: 62 },
  chair: { w: 70, h: 104 },
  bowl:  { w: 112, h: 50 },
}

function BoxShape(): JSX.Element {
  return (
    <g>
      <rect x={-46} y={-31} width={92} height={62} rx={4} fill="#b45309" stroke="#78350f" strokeWidth={3} />
      <rect x={-46} y={-31} width={92} height={16} rx={4} fill="#92400e" stroke="#78350f" strokeWidth={3} />
      <line x1={0} y1={-31} x2={0} y2={31} stroke="#78350f" strokeWidth={2} opacity={0.4} />
    </g>
  )
}

function ChairShape(): JSX.Element {
  return (
    <g>
      <rect x={-30} y={-52} width={10} height={55} rx={3} fill="#92400e" stroke="#78350f" strokeWidth={2} />
      <rect x={-33} y={0} width={66} height={12} rx={3} fill="#b45309" stroke="#78350f" strokeWidth={2} />
      <rect x={-30} y={12} width={7} height={40} fill="#78350f" />
      <rect x={23} y={12} width={7} height={40} fill="#78350f" />
    </g>
  )
}

function BowlShape(): JSX.Element {
  return (
    <g>
      <path d="M -56,-6 Q -56,26 0,26 Q 56,26 56,-6 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth={3} />
      <ellipse cx={0} cy={-6} rx={56} ry={10} fill="#f3f4f6" stroke="#9ca3af" strokeWidth={3} />
    </g>
  )
}

function BallShape(): JSX.Element {
  return (
    <g>
      <circle r={20} fill="#f97316" stroke="#c2410c" strokeWidth={3} />
      <ellipse cx={-6} cy={-6} rx={6} ry={4} fill="#fed7aa" opacity={0.8} />
    </g>
  )
}

function CatShape(): JSX.Element {
  return (
    <g>
      <ellipse cx={0} cy={8} rx={20} ry={16} fill="#f97316" stroke="#c2410c" strokeWidth={2.5} />
      <circle cx={0} cy={-14} r={14} fill="#f97316" stroke="#c2410c" strokeWidth={2.5} />
      <polygon points="-12,-24 -4,-8 -18,-10" fill="#f97316" stroke="#c2410c" strokeWidth={2} />
      <polygon points="12,-24 4,-8 18,-10" fill="#f97316" stroke="#c2410c" strokeWidth={2} />
      <circle cx={-5} cy={-14} r={2} fill="#1e293b" />
      <circle cx={5} cy={-14} r={2} fill="#1e293b" />
      <path d="M -3,-9 Q 0,-6 3,-9" stroke="#1e293b" strokeWidth={1.5} fill="none" />
    </g>
  )
}

function AppleShape(): JSX.Element {
  return (
    <g>
      <circle r={16} fill="#ef4444" stroke="#b91c1c" strokeWidth={2.5} />
      <path d="M 0,-16 Q 4,-24 10,-22" stroke="#78350f" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <ellipse cx={8} cy={-20} rx={5} ry={3} fill="#4ade80" transform="rotate(30 8 -20)" />
    </g>
  )
}

function PrepIllustration({ item, refType, position }: { item: PrepItem; refType: PrepRef; position: Preposition }): JSX.Element {
  const size = REF_SIZE[refType]
  const RefComp  = refType === 'box' ? BoxShape : refType === 'chair' ? ChairShape : BowlShape
  const ItemComp = item === 'ball' ? BallShape : item === 'cat' ? CatShape : AppleShape
  const itemR = item === 'cat' ? 22 : item === 'ball' ? 20 : 16

  let ix = 0, iy = 0, itemBehindRef = false
  if (position === 'on') {
    iy = -size.h / 2 - itemR + 6
  } else if (position === 'under') {
    iy = size.h / 2 - 6
    itemBehindRef = true
  } else if (position === 'in') {
    iy = refType === 'bowl' ? -2 : 0
  } else if (position === 'nextTo') {
    ix = size.w / 2 + itemR + 16
    iy = size.h / 2 - itemR * 0.7
  } else if (position === 'behind') {
    // Center the item right at the ref's edge so roughly half of it peeks
    // out from behind — placing it fully inside the ref's bounding box
    // would hide it completely once the ref is drawn on top.
    ix = size.w / 2
    iy = -size.h * 0.15
    itemBehindRef = true
  }

  return (
    <svg viewBox="0 0 240 200" style={{ width: '100%', maxWidth: 280, height: 'auto' }}>
      <g transform="translate(120, 100)">
        {itemBehindRef && <g transform={`translate(${ix}, ${iy})`}><ItemComp /></g>}
        <RefComp />
        {!itemBehindRef && <g transform={`translate(${ix}, ${iy})`}><ItemComp /></g>}
      </g>
    </svg>
  )
}

// ── Monster SVG ───────────────────────────────────────────────────────────────

function Monster({ mood }: { mood: MonsterMood }): JSX.Element {
  const happy = mood === 'satisfied'
  const yuck  = mood === 'yuck'

  return (
    <svg viewBox="0 0 160 178" width="180" height="200"
      style={{ filter: 'drop-shadow(0 8px 20px rgba(168,85,247,0.4))' }}>
      {/* Body */}
      <ellipse cx="80" cy="93" rx="66" ry="72" fill="#a855f7" />
      {/* Belly highlight */}
      <ellipse cx="80" cy="108" rx="43" ry="39" fill="#c084fc" opacity="0.4" />
      {/* Horns */}
      <ellipse cx="44" cy="32" rx="11" ry="16" fill="#7e22ce" transform="rotate(-18 44 32)" />
      <ellipse cx="116" cy="32" rx="11" ry="16" fill="#7e22ce" transform="rotate(18 116 32)" />

      {/* Eyes */}
      {happy ? (
        /* Happy curved eyes */
        <>
          <path d="M 38,72 Q 54,58 70,72" stroke="#1e293b" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 90,72 Q 106,58 122,72" stroke="#1e293b" strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="54" cy="73" r={yuck ? 14 : 19} fill="white" />
          <circle cx="106" cy="73" r={yuck ? 14 : 19} fill="white" />
          {yuck ? (
            <>
              <ellipse cx="54" cy="75" rx="9" ry="6" fill="#1e293b" />
              <ellipse cx="106" cy="75" rx="9" ry="6" fill="#1e293b" />
              {/* Furrowed brows */}
              <path d="M 36,60 Q 54,68 72,60" stroke="#7e22ce" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 88,60 Q 106,68 124,60" stroke="#7e22ce" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="57" cy="75" r="11" fill="#1e293b" />
              <circle cx="109" cy="75" r="11" fill="#1e293b" />
              <circle cx="61" cy="71" r="4" fill="white" />
              <circle cx="113" cy="71" r="4" fill="white" />
            </>
          )}
        </>
      )}

      {/* Mouth */}
      {happy ? (
        <path d="M 46,138 Q 80,158 114,138" stroke="#7e22ce" strokeWidth="3.5" fill="#f472b6" strokeLinecap="round" />
      ) : yuck ? (
        <>
          <path d="M 38,128 Q 80,170 122,128" fill="#0f172a" />
          {[49, 63, 77, 91, 105].map(x => <rect key={x} x={x} y={128} width={11} height={10} rx={2} fill="white" />)}
          {/* Tongue drooping out */}
          <path d="M 65,150 Q 80,175 95,150 Q 95,165 80,168 Q 65,165 65,150 Z" fill="#f43f5e" />
        </>
      ) : (
        <>
          {/* Wide open hungry/eating mouth */}
          <path d="M 34,126 Q 80,174 126,126" fill="#0f172a" />
          {[45, 60, 75, 90, 105].map(x => <rect key={x} x={x} y={126} width={12} height={11} rx={3} fill="white" />)}
          <ellipse cx="80" cy="157" rx="24" ry="13" fill="#f43f5e" />
          {mood === 'eating' && (
            <ellipse cx="80" cy="148" rx="18" ry="8" fill="white" opacity="0.35" />
          )}
        </>
      )}
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EnglishModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]         = useState<Phase>('select')
  const [gameType, setGameType]   = useState<GameType>('tpr')
  const [taskIndex, setTaskIndex] = useState(0)
  const [streak, setStreak]       = useState(0)

  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) return
    if (!navigator.permissions) { setSpeechSupported(true); return }
    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then(status => { if (status.state !== 'denied') setSpeechSupported(true) })
      .catch(() => setSpeechSupported(true))
  }, [])

  // TPR state
  const [tprTask, setTprTask] = useState<VerbEntry | null>(null)

  // Pointer state
  const [pointerTask, setPointerTask]       = useState<PointerTask | null>(null)
  const [options, setOptions]               = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [pointerResult, setPointerResult]   = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Say-it state
  const [sayItTask, setSayItTask]   = useState<SayItWord | null>(null)
  const [sayItPhase, setSayItPhase] = useState<SayItPhase>('waiting')
  const [heardText, setHeardText]   = useState('')
  const recognitionRef = useRef<any>(null)

  // Feed-monster state
  const [feedTask, setFeedTask]       = useState<FeedTask | null>(null)
  const [feedItems, setFeedItems]     = useState<FeedItem[]>([])
  const [monsterMood, setMonsterMood] = useState<MonsterMood>('hungry')
  const lastYuckRef = useRef<string>('')

  // Memory state
  const [memoryCards, setMemoryCards]   = useState<MemoryCard[]>([])
  const [flippedIds, setFlippedIds]     = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const memoryLocked = useRef(false)

  // Opposites state
  const [oppositeTask, setOppositeTask]         = useState<OppositeTask | null>(null)
  const [oppositeOptions, setOppositeOptions]   = useState<string[]>([])
  const [oppositeSelected, setOppositeSelected] = useState<string | null>(null)
  const [oppositeResult, setOppositeResult]     = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Prepositions state
  const [prepTask, setPrepTask]         = useState<PrepTask | null>(null)
  const [prepOptions, setPrepOptions]   = useState<Preposition[]>([])
  const [prepSelected, setPrepSelected] = useState<Preposition | null>(null)
  const [prepResult, setPrepResult]     = useState<'idle' | 'correct' | 'wrong'>('idle')

  const { activeReward, rewardKey, triggerMicro, triggerSmall, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
    confettiColors: ['#22c55e', '#4ade80', '#86efac', '#15803d', '#dcfce7'],
  })

  // ── Shared ────────────────────────────────────────────────────────────────

  const callRoundComplete = (): void => {
    unlockAudio()
    recognitionRef.current?.abort()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    if (unlocked) speak('Új ruha vár rád a szekrényben!')
    onRoundComplete(unlocked)
  }

  const handleBack = (): void => {
    recognitionRef.current?.abort()
    unlockAudio()
    speak('Visszamegyünk a kertbe!')
    setTimeout(onBack, 600)
  }

  // ── TPR ──────────────────────────────────────────────────────────────────

  const startTPRTask = (v: VerbEntry): void => {
    setTprTask(v)
    speakTPR(v.verb.charAt(0).toUpperCase() + v.verb.slice(1) + '!', v.hungarian)
  }

  const handleTPRDone = (): void => {
    if (tprTask) recordAttempt('english.tpr', tprTask.verb, true)
    const newStreak = streak + 1
    setStreak(newStreak)
    if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
    else { triggerMicro(); maybePraise() }
    const nextIdx = taskIndex + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); callRoundComplete() }, 900)
    } else {
      setTimeout(() => {
        setTaskIndex(nextIdx)
        startTPRTask(selectNextItem('english.tpr', TPR_VERBS, v => v.verb))
      }, 900)
    }
  }

  // ── Pointer ───────────────────────────────────────────────────────────────

  const startPointerTask = (t: PointerTask): void => {
    setPointerTask(t)
    setOptions(shuffle([t.correctEmoji, ...t.distractors]))
    setSelectedOption(null)
    setPointerResult('idle')
    speakTPR(t.englishQuestion, t.hungarianQuestion)
  }

  const handleOptionTap = (emoji: string): void => {
    if (pointerResult !== 'idle' || !pointerTask) return
    setSelectedOption(emoji)
    if (emoji === pointerTask.correctEmoji) {
      recordAttempt('english.listenPoint', pointerTask.id, true)
      setPointerResult('correct')
      const newStreak = streak + 1; setStreak(newStreak)
      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
      else { triggerMicro(); maybePraise() }
      const nextIdx = taskIndex + 1
      if (nextIdx >= TASKS_PER_ROUND) {
        setTimeout(() => { triggerMedium(); callRoundComplete() }, 2000)
      } else {
        setTimeout(() => {
          setTaskIndex(nextIdx)
          startPointerTask(selectNextItem('english.listenPoint', POINTER_TASKS, t => t.id))
        }, 2000)
      }
    } else {
      recordAttempt('english.listenPoint', pointerTask.id, false)
      setPointerResult('wrong'); setStreak(0); triggerError()
      setTimeout(() => { setSelectedOption(null); setPointerResult('idle') }, 1400)
    }
  }

  // ── Say-it ────────────────────────────────────────────────────────────────

  const startSayItTask = (w: SayItWord): void => {
    setSayItTask(w); setSayItPhase('waiting'); setHeardText('')
    speakEnglishTwice(w.word)
  }

  const startListening = (): void => {
    const task = sayItTask
    if (!task) return
    unlockAudio()
    recognitionRef.current?.abort()
    setHeardText(''); setSayItPhase('listening')
    speak('Mondd hangosan!')
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    let attempt = 0
    const MAX_ATTEMPTS = 2
    const tryOnce = (): void => {
      attempt++
      const recognition = new SR()
      recognition.lang = 'en-US'; recognition.continuous = false
      recognition.interimResults = false; recognition.maxAlternatives = 5
      recognitionRef.current = recognition
      let settled = false, retrying = false
      const timer = setTimeout(() => {
        if (settled) return
        if (attempt < MAX_ATTEMPTS) { retrying = true; recognition.abort(); tryOnce() }
        else recognition.stop()
      }, 5000)
      recognition.onresult = (event: any): void => {
        settled = true; clearTimeout(timer)
        const alts: string[] = Array.from(event.results[0] as any).map((r: any) => r.transcript.toLowerCase().trim())
        const heard = alts[0] ?? ''; setHeardText(heard)
        const isCorrect = alts.some(alt => task.accepted.some(a => alt === a || alt.includes(a) || a.includes(alt)))
        recordAttempt('english.sayit', task.word, isCorrect)
        if (isCorrect) {
          setSayItPhase('correct')
          const ns = streak + 1; setStreak(ns)
          speakEnglishSuccess(task.word)
          if (ns >= STREAK_REWARD && ns % STREAK_REWARD === 0) triggerSmall(); else triggerMicro()
          const nextIdx = taskIndex + 1
          if (nextIdx >= TASKS_PER_ROUND) {
            setTimeout(() => { triggerMedium(); callRoundComplete() }, 1800)
          } else {
            setTimeout(() => { setTaskIndex(nextIdx); startSayItTask(selectNextItem('english.sayit', SAY_IT_WORDS, w => w.word)) }, 1800)
          }
        } else {
          setSayItPhase('wrong'); setStreak(0); triggerError()
          setTimeout(() => setSayItPhase('waiting'), 2200)
        }
      }
      recognition.onerror = (event: any): void => {
        clearTimeout(timer)
        if (event.error === 'aborted') return
        settled = true; setHeardText('__error__'); setSayItPhase('wrong'); triggerError()
        setTimeout(() => setSayItPhase('waiting'), 2200)
      }
      recognition.onend = (): void => {
        if (settled || retrying) return
        setSayItPhase(prev => (prev === 'listening' ? 'wrong' : prev))
      }
      recognition.start()
    }
    setTimeout(tryOnce, 1000)
  }

  // ── Feed Monster ──────────────────────────────────────────────────────────

  const startFeedTask = (task: FeedTask): void => {
    setFeedTask(task)
    setFeedItems(buildFeedItems(task))
    setMonsterMood('hungry')
    speakTPR(task.english, task.hungarian)
  }

  const handleFeedTap = (uid: string): void => {
    if (monsterMood !== 'hungry' || !feedTask) return
    const item = feedItems.find(fi => fi.uid === uid)
    if (!item || item.eaten) return

    if (item.isTarget) {
      const remainingTargets = feedItems.filter(fi => fi.isTarget && !fi.eaten && fi.uid !== uid).length
      setMonsterMood('eating')
      setFeedItems(prev => prev.map(fi => fi.uid === uid ? { ...fi, eaten: true } : fi))
      if (remainingTargets === 0) {
        speakEnglish(`Hmmm... ${item.name}!`)
      } else {
        speakEnglish(`Yes! ${item.name}!`)
      }
      if (remainingTargets === 0) {
        setMonsterMood('satisfied')
        recordAttempt('english.feedmonster', feedTask.id, true)
        const ns = streak + 1; setStreak(ns)
        if (ns >= STREAK_REWARD && ns % STREAK_REWARD === 0) triggerSmall(); else triggerMicro()
        const nextIdx = taskIndex + 1
        if (nextIdx >= TASKS_PER_ROUND) {
          setTimeout(() => { triggerMedium(); callRoundComplete() }, 2200)
        } else {
          setTimeout(() => {
            setTaskIndex(nextIdx)
            startFeedTask(selectNextItem('english.feedmonster', ALL_FEED_TASKS, t => t.id))
          }, 2200)
        }
      } else {
        setTimeout(() => setMonsterMood('hungry'), 900)
      }
    } else {
      setMonsterMood('yuck')
      setFeedItems(prev => prev.map(fi => fi.uid === uid ? { ...fi, shaking: true } : fi))
      const YUCKS = ["Eww!", "Blah!", "No no no!"]
      const pool = YUCKS.filter(y => y !== lastYuckRef.current)
      const yuck = pool[Math.floor(Math.random() * pool.length)]
      lastYuckRef.current = yuck
      speakEnglish(`${yuck} I don't want ${item.name}!`)
      setTimeout(() => {
        setFeedItems(prev => prev.map(fi => fi.uid === uid ? { ...fi, shaking: false } : fi))
        setMonsterMood('hungry')
      }, 2000)
    }
  }

  // ── Memory ───────────────────────────────────────────────────────────────────

  const startMemoryGame = (): void => {
    setMemoryCards(buildMemoryCards())
    setFlippedIds([])
    setMatchedPairs(0)
    memoryLocked.current = false
    speak('Keress párokat! Fordíts fel egy képkártyát és egy hangkártyát!')
  }

  const handleCardTap = (id: string): void => {
    if (memoryLocked.current) return
    const card = memoryCards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (flippedIds.length >= 2) return

    if (card.type === 'sound') {
      const w = card.word
      speakEnglish(w.charAt(0).toUpperCase() + w.slice(1) + '!')
    }

    const newFlipped = [...flippedIds, id]
    setMemoryCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlippedIds(newFlipped)

    if (newFlipped.length < 2) return

    memoryLocked.current = true
    const firstId  = newFlipped[0]
    const firstCard = memoryCards.find(c => c.id === firstId)!

    if (firstCard.pairId === card.pairId) {
      const w = card.word
      speakEnglish(`Great! ${w.charAt(0).toUpperCase() + w.slice(1)}!`)
      recordAttempt('english.memory', card.pairId, true)
      triggerSmall()
      const newCount = matchedPairs + 1

      setTimeout(() => {
        setMemoryCards(prev => prev.map(c =>
          c.id === firstId || c.id === id ? { ...c, matched: true } : c
        ))
        setMatchedPairs(newCount)
        setFlippedIds([])
        memoryLocked.current = false

        if (newCount >= 4) {
          setTimeout(() => {
            triggerMedium()
            speakTPR('You found all the pairs! Amazing!', 'Megtaláltad az összes párt!')
            setTimeout(callRoundComplete, 2800)
          }, 400)
        }
      }, 600)
    } else {
      setTimeout(() => {
        setMemoryCards(prev => prev.map(c =>
          c.id === firstId || c.id === id ? { ...c, flipped: false } : c
        ))
        setFlippedIds([])
        memoryLocked.current = false
      }, 1000)
    }
  }

  // ── Opposites ─────────────────────────────────────────────────────────────

  const startOppositeTask = (): void => {
    const t = generateOppositeTask()
    setOppositeTask(t)
    setOppositeOptions(shuffle([t.correctEmoji, t.distractorEmoji]))
    setOppositeSelected(null)
    setOppositeResult('idle')
    void playSequence([
      { text: `Find the opposite! ${capitalize(t.startWord)}!`, lang: 'en-GB' },
      { text: `Keresd az ellentétét! ${capitalize(t.startHu)}!`, lang: 'hu-HU' },
    ])
  }

  const handleOppositeTap = (emoji: string): void => {
    if (oppositeResult !== 'idle' || !oppositeTask) return
    setOppositeSelected(emoji)
    if (emoji === oppositeTask.correctEmoji) {
      recordAttempt('english.opposites', oppositeTask.id, true)
      setOppositeResult('correct')
      const ns = streak + 1; setStreak(ns)
      // Reward hook fires first — it queues a generic Web Speech praise via
      // speak(); playAudio() (inside playSequence) cancels that before it's
      // audible, so only this task's own confirmation sequence plays.
      if (ns >= STREAK_REWARD && ns % STREAK_REWARD === 0) triggerSmall(); else triggerMicro()
      const nextIdx = taskIndex + 1
      // Advance once the confirmation sequence actually finishes playing
      // rather than after a guessed delay.
      playSequence([
        { text: `${capitalize(oppositeTask.correctWord)}!`, lang: 'en-GB' },
        { text: `${oppositeTask.pair.a} and ${oppositeTask.pair.b} — opposites!`, lang: 'en-GB' },
        { text: `Igen! ${oppositeTask.pair.aHu} és ${oppositeTask.pair.bHu} — ellentétek!`, lang: 'hu-HU' },
      ]).then(() => {
        setTimeout(() => {
          if (nextIdx >= TASKS_PER_ROUND) { triggerMedium(); callRoundComplete() }
          else { setTaskIndex(nextIdx); startOppositeTask() }
        }, 600)
      })
    } else {
      recordAttempt('english.opposites', oppositeTask.id, false)
      setOppositeResult('wrong'); setStreak(0); triggerError()
      setTimeout(() => { setOppositeSelected(null); setOppositeResult('idle') }, 1400)
    }
  }

  // ── Prepositions ──────────────────────────────────────────────────────────

  const startPrepTask = (): void => {
    const t = generatePrepTask()
    setPrepTask(t)
    setPrepOptions(shuffle([t.correct, t.distractor]))
    setPrepSelected(null)
    setPrepResult('idle')
    const { item, ref } = t.scene
    void playSequence([
      { text: `Where is the ${ITEM_EN[item]}?`, lang: 'en-GB' },
      { text: `Is it ${PREP_EN[t.correct]} the ${REF_EN[ref]}, or ${PREP_EN[t.distractor]} the ${REF_EN[ref]}?`, lang: 'en-GB' },
      { text: `Hol van ${ITEM_HU[item]}? ${PREP_PHRASE_HU[ref][t.correct]}, vagy ${PREP_PHRASE_HU[ref][t.distractor]}?`, lang: 'hu-HU' },
    ])
  }

  const handlePrepTap = (prep: Preposition): void => {
    if (prepResult !== 'idle' || !prepTask) return
    setPrepSelected(prep)
    const { item, ref } = prepTask.scene
    if (prep === prepTask.correct) {
      recordAttempt('english.prepositions', prepTask.id, true)
      setPrepResult('correct')
      const ns = streak + 1; setStreak(ns)
      // Reward hook first (see handleOppositeTap for why) — playAudio's
      // leading cancel() below silences its generic praise before it's heard.
      if (ns >= STREAK_REWARD && ns % STREAK_REWARD === 0) triggerSmall(); else triggerMicro()
      const nextIdx = taskIndex + 1
      playSequence([
        { text: `Yes! ${capitalize(PREP_EN[prepTask.correct])}!`, lang: 'en-GB' },
        { text: `${capitalize(ITEM_EN[item])} is ${PREP_EN[prepTask.correct]} the ${REF_EN[ref]}!`, lang: 'en-GB' },
        { text: `Igen! ${capitalize(ITEM_HU[item])} ${PREP_PHRASE_HU[ref][prepTask.correct]} van!`, lang: 'hu-HU' },
      ]).then(() => {
        setTimeout(() => {
          if (nextIdx >= TASKS_PER_ROUND) { triggerMedium(); callRoundComplete() }
          else { setTaskIndex(nextIdx); startPrepTask() }
        }, 600)
      })
    } else {
      recordAttempt('english.prepositions', prepTask.id, false)
      setPrepResult('wrong'); setStreak(0); triggerError()
      setTimeout(() => { setPrepSelected(null); setPrepResult('idle') }, 1400)
    }
  }

  // ── handleRepeat / handleStart ─────────────────────────────────────────────

  const handleRepeat = (): void => {
    unlockAudio()
    if (gameType === 'tpr' && tprTask) {
      speakEnglish(tprTask.verb.charAt(0).toUpperCase() + tprTask.verb.slice(1) + '!')
    } else if (gameType === 'pointer' && pointerTask) {
      speakEnglish(pointerTask.englishQuestion)
    } else if (gameType === 'sayit' && sayItTask) {
      speakEnglishTwice(sayItTask.word)
    } else if (gameType === 'feedmonster' && feedTask) {
      speakTPR(feedTask.english, feedTask.hungarian)
    } else if (gameType === 'memory') {
      speak('Keress párokat! Fordíts fel egy képkártyát és egy hangkártyát!')
    } else if (gameType === 'opposites' && oppositeTask) {
      void playSequence([
        { text: `Find the opposite! ${capitalize(oppositeTask.startWord)}!`, lang: 'en-GB' },
        { text: `Keresd az ellentétét! ${capitalize(oppositeTask.startHu)}!`, lang: 'hu-HU' },
      ])
    } else if (gameType === 'prepositions' && prepTask) {
      const { item, ref } = prepTask.scene
      void playSequence([
        { text: `Where is the ${ITEM_EN[item]}?`, lang: 'en-GB' },
        { text: `Is it ${PREP_EN[prepTask.correct]} the ${REF_EN[ref]}, or ${PREP_EN[prepTask.distractor]} the ${REF_EN[ref]}?`, lang: 'en-GB' },
        { text: `Hol van ${ITEM_HU[item]}? ${PREP_PHRASE_HU[ref][prepTask.correct]}, vagy ${PREP_PHRASE_HU[ref][prepTask.distractor]}?`, lang: 'hu-HU' },
      ])
    }
  }

  const handleStart = (gt: GameType): void => {
    unlockAudio(); setGameType(gt); setTaskIndex(0); setStreak(0); setPhase('game')
    if      (gt === 'tpr')         startTPRTask(selectNextItem('english.tpr', TPR_VERBS, v => v.verb))
    else if (gt === 'pointer')     startPointerTask(selectNextItem('english.listenPoint', POINTER_TASKS, t => t.id))
    else if (gt === 'sayit')       startSayItTask(selectNextItem('english.sayit', SAY_IT_WORDS, w => w.word))
    else if (gt === 'feedmonster') startFeedTask(selectNextItem('english.feedmonster', ALL_FEED_TASKS, t => t.id))
    else if (gt === 'memory')      startMemoryGame()
    else if (gt === 'opposites')   startOppositeTask()
    else if (gt === 'prepositions') startPrepTask()
  }

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    const cards: { emoji: string; label: string; sublabel: string; onClick: () => void }[] = [
      { emoji: '🏃', label: 'Cselekedj!',  sublabel: 'Mozdulj a szóra!',       onClick: () => handleStart('tpr') },
      { emoji: '👆', label: 'Mutasd meg!', sublabel: 'Koppints a képre!',       onClick: () => handleStart('pointer') },
      { emoji: '👾', label: 'Etesd meg!',  sublabel: 'Etess szörnyet angolul!', onClick: () => handleStart('feedmonster') },
      { emoji: '🎴', label: 'Párosítsd!', sublabel: 'Kép + hang párok!',       onClick: () => handleStart('memory') },
    ]
    cards.push({ emoji: '🔄', label: 'Ellentétek', sublabel: 'Opposites', onClick: () => handleStart('opposites') })
    cards.push({ emoji: '📦', label: 'Hol van?', sublabel: 'on, under, in...', onClick: () => handleStart('prepositions') })
    if (speechSupported) {
      cards.push({ emoji: '🎤', label: 'Mondd ki!', sublabel: 'Szólj angolul!', onClick: () => handleStart('sayit') })
    }
    return (
      <ModuleSelect hue="green" title="✈️ Angol" Illustration={Illustration}
        cards={cards} onBack={handleBack} onRepeat={() => speak('Melyik játékot választod?')} />
    )
  }

  // ── TPR GAME ──────────────────────────────────────────────────────────────

  if (gameType === 'tpr' && tprTask) {
    return (
      <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-6 px-4">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-7xl leading-none">{tprTask.emoji}</span>
            <p className="text-green-900 font-bold text-3xl text-center">{tprTask.hungarian}</p>
            <p className="text-gray-400 font-normal text-sm text-center tracking-widest uppercase">{tprTask.verb}</p>
          </div>
          <button onClick={handleRepeat} className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform flex-shrink-0">
            🔊 Mondd újra
          </button>
          <AnswerButton hue="green" state="idle" onClick={handleTPRDone} className="w-full flex items-center justify-center py-6 text-2xl font-bold">
            ✓ Megcsináltam!
          </AnswerButton>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── SAY-IT GAME ───────────────────────────────────────────────────────────

  if (gameType === 'sayit' && sayItTask) {
    const micLabel =
      sayItPhase === 'listening' ? 'Hallgatom...'
      : sayItPhase === 'correct' ? 'Helyes! 🎉'
      : sayItPhase === 'wrong'   ? 'Próbáld újra!'
      : 'Nyomd meg és mondd ki!'
    const micBg =
      sayItPhase === 'correct'     ? '#22c55e'
      : sayItPhase === 'wrong'     ? '#ef4444'
      : sayItPhase === 'listening' ? '#f97316'
      : 'linear-gradient(to bottom, #4ade80, #16a34a)'
    return (
      <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-6 px-4">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <span className="text-8xl leading-none">{sayItTask.emoji}</span>
            <p className="text-green-900 font-bold text-4xl tracking-widest uppercase">{sayItTask.word}</p>
          </div>
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <button onClick={startListening} disabled={sayItPhase === 'listening' || sayItPhase === 'correct'}
              style={{ background: micBg, boxShadow: sayItPhase === 'listening' ? '0 0 0 14px rgba(249,115,22,0.22), var(--sh-1)' : 'var(--sh-1)',
                animation: sayItPhase === 'listening' ? 'card-pulse 0.9s ease-in-out infinite' : 'none' }}
              className="w-28 h-28 rounded-full flex items-center justify-center text-5xl transition-all duration-300 active:scale-90 disabled:opacity-80">
              {sayItPhase === 'correct' ? '✓' : sayItPhase === 'wrong' ? '✗' : '🎤'}
            </button>
            <p className={['text-base font-semibold text-center min-h-[1.5rem]',
              sayItPhase === 'correct' ? 'text-green-600' : sayItPhase === 'wrong' ? 'text-red-500'
              : sayItPhase === 'listening' ? 'text-orange-500' : 'text-gray-500'].join(' ')}>{micLabel}</p>
            {(sayItPhase === 'correct' || sayItPhase === 'wrong') && (
              <p className="text-sm text-gray-500 text-center font-medium">
                {heardText === '__error__' ? 'Ezt hallottam: (nem érkezett hang)' : heardText === '' ? 'Nem hallottalak. Próbáld hangosabban!' : `Ezt hallottam: „${heardText}"`}
              </p>
            )}
          </div>
          <button onClick={handleRepeat} className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform flex-shrink-0">
            🔊 Hallgasd meg újra
          </button>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── FEED MONSTER GAME ─────────────────────────────────────────────────────

  if (gameType === 'feedmonster' && feedTask) {
    return (
      <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-4 px-4">

          {/* Monster with mood animations */}
          <div className="flex-shrink-0"
            style={{ animation: monsterMood === 'eating' ? 'card-pulse 0.35s ease-out' : monsterMood === 'yuck' ? 'shake-no 0.45s ease-out' : 'none' }}>
            <Monster mood={monsterMood} />
          </div>

          {/* Speech bubble */}
          <div className="bg-white rounded-2xl px-4 py-2.5 flex-shrink-0 mx-2"
            style={{ boxShadow: 'var(--sh-1)', maxWidth: '96%' }}>
            <p className="text-green-900 font-medium text-sm text-center italic leading-snug">
              "{feedTask.english}"
            </p>
          </div>

          {/* Food item cards */}
          <div className="flex flex-wrap gap-4 justify-center flex-shrink-0 pb-2">
            {feedItems.map(item => item.eaten ? null : (
              <button key={item.uid}
                onClick={() => { unlockAudio(); handleFeedTap(item.uid) }}
                disabled={monsterMood !== 'hungry'}
                style={{
                  borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                  animation: item.shaking ? 'shake-no 0.5s ease-out' : 'none',
                  opacity: monsterMood !== 'hungry' ? 0.55 : 1,
                  transition: 'opacity 0.25s',
                }}
                className="w-[104px] h-[104px] bg-white flex items-center justify-center active:scale-90 transition-transform duration-100">
                <span style={{ fontSize: 58, lineHeight: 1 }}>{item.emoji}</span>
              </button>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── MEMORY GAME ───────────────────────────────────────────────────────────

  if (gameType === 'memory' && memoryCards.length > 0) {
    return (
      <TaskShell hue="green" progressIndex={matchedPairs} total={4} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-4 px-3">

          <p className="text-green-900 font-bold text-[19px] text-center flex-shrink-0">
            Kép + hang = pár! 🎴
          </p>

          {/* 4×2 card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%' }}
            className="flex-1 content-center">
            {memoryCards.map(card => {
              const revealed = card.flipped || card.matched
              return (
                <div key={card.id}
                  onClick={() => { unlockAudio(); handleCardTap(card.id) }}
                  style={{ height: 118, perspective: '700px', cursor: revealed ? 'default' : 'pointer' }}>
                  {/* Flip container */}
                  <div style={{
                    width: '100%', height: '100%', position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    {/* Back face (face-down pattern) */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                      background: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 28, opacity: 0.45 }}>✦</span>
                    </div>
                    {/* Front face (content) */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: 'var(--r-card)',
                      boxShadow: card.matched ? '0 0 0 3px #4ade80, var(--sh-1)' : 'var(--sh-1)',
                      background: card.matched ? '#dcfce7' : 'white',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 3,
                      transition: 'background 0.3s, box-shadow 0.3s',
                    }}>
                      {card.type === 'image' ? (
                        <span style={{ fontSize: 48, lineHeight: 1 }}>{card.emoji}</span>
                      ) : (
                        <>
                          <span style={{ fontSize: 34, lineHeight: 1 }}>🔊</span>
                          {card.matched && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d',
                              textTransform: 'uppercase', letterSpacing: 1 }}>
                              {card.word}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pairs found indicator */}
          <p className="text-green-700 font-semibold text-sm flex-shrink-0">
            {matchedPairs} / 4 pár megvan
          </p>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── OPPOSITES GAME ────────────────────────────────────────────────────────

  if (gameType === 'opposites' && oppositeTask) {
    return (
      <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-6 px-4">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-8xl leading-none">{oppositeTask.startEmoji}</span>
            <p className="text-green-900 font-bold text-2xl text-center uppercase tracking-widest">{oppositeTask.startWord}</p>
            <p className="text-green-700 font-semibold text-base text-center">Find the opposite!</p>
          </div>
          <div className="flex gap-4 w-full flex-shrink-0">
            {oppositeOptions.map((emoji, i) => {
              const isSelected = oppositeSelected === emoji
              const isCorrect  = emoji === oppositeTask.correctEmoji
              let cardClass = 'bg-gray-50 border-gray-200 active:bg-gray-100 active:scale-90'
              if (isSelected && isCorrect)  cardClass = 'bg-green-400 border-green-300 scale-105'
              if (isSelected && !isCorrect) cardClass = 'bg-red-400 border-red-300'
              if (oppositeResult !== 'idle' && !isSelected) cardClass += ' opacity-40'
              return (
                <button key={i} onClick={() => { unlockAudio(); handleOppositeTap(emoji) }} disabled={oppositeResult !== 'idle'}
                  style={{ animation: isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)' }}
                  className={['flex-1 h-32 border-4 flex items-center justify-center transition-all duration-200', cardClass].join(' ')}>
                  <span className="text-6xl leading-none">{emoji}</span>
                </button>
              )
            })}
          </div>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── PREPOSITIONS GAME ─────────────────────────────────────────────────────

  if (gameType === 'prepositions' && prepTask) {
    return (
      <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">
          <p className="text-green-900 font-bold text-xl text-center leading-snug px-2 flex-shrink-0">
            Where is the {ITEM_EN[prepTask.scene.item]}?
          </p>
          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            <PrepIllustration item={prepTask.scene.item} refType={prepTask.scene.ref} position={prepTask.scene.position} />
          </div>
          <div className="flex gap-4 w-full flex-shrink-0">
            {prepOptions.map((prep, i) => {
              const isSelected = prepSelected === prep
              const isCorrect  = prep === prepTask.correct
              let cardClass = 'bg-gray-50 border-gray-200 active:bg-gray-100 active:scale-90'
              if (isSelected && isCorrect)  cardClass = 'bg-green-400 border-green-300 scale-105'
              if (isSelected && !isCorrect) cardClass = 'bg-red-400 border-red-300'
              if (prepResult !== 'idle' && !isSelected) cardClass += ' opacity-40'
              return (
                <button key={i} onClick={() => { unlockAudio(); handlePrepTap(prep) }} disabled={prepResult !== 'idle'}
                  style={{ animation: isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)' }}
                  className={['flex-1 h-24 border-4 flex items-center justify-center transition-all duration-200', cardClass].join(' ')}>
                  <span className="text-2xl font-black text-green-900 tracking-wide">{PREP_CARD[prep]}</span>
                </button>
              )
            })}
          </div>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── POINTER GAME ──────────────────────────────────────────────────────────

  if (!pointerTask) return <div className="w-screen h-screen bg-green-500" />

  return (
    <TaskShell hue="green" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
      <div className="flex flex-col items-center justify-between h-full py-6 px-4">
        <button onClick={handleRepeat} className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform flex-shrink-0">
          🔊 Mondd újra
        </button>
        <div className="flex gap-4 w-full flex-shrink-0">
          {options.map((emoji, i) => {
            const isSelected = selectedOption === emoji
            const isCorrect  = emoji === pointerTask.correctEmoji
            let cardClass = 'bg-gray-50 border-gray-200 active:bg-gray-100 active:scale-90'
            if (isSelected && isCorrect)  cardClass = 'bg-green-400 border-green-300 scale-105'
            if (isSelected && !isCorrect) cardClass = 'bg-red-400 border-red-300'
            if (pointerResult !== 'idle' && !isSelected) cardClass += ' opacity-40'
            return (
              <button key={i} onClick={() => handleOptionTap(emoji)} disabled={pointerResult !== 'idle'}
                style={{ animation: isSelected && !isCorrect ? 'shake-no 0.5s ease-out' : 'none', borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)' }}
                className={['flex-1 h-32 border-4 flex items-center justify-center transition-all duration-200', cardClass].join(' ')}>
                <span className="text-6xl leading-none">{emoji}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-shrink-0 h-4" />
      </div>
      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </TaskShell>
  )
}
