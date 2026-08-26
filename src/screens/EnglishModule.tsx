import { useState, useEffect, useRef } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakTPR, speakEnglish, speakEnglishPraise, speakEnglishTwice, speakEnglishSuccess } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { TPR_VERBS, POINTER_TASKS, SAY_IT_WORDS, getMemoryCategories, type VerbEntry, type PointerTask, type SayItWord } from '../data/englishData'
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

type GameType = 'tpr' | 'pointer' | 'sayit' | 'feedmonster' | 'memory'
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
    }
  }

  const handleStart = (gt: GameType): void => {
    unlockAudio(); setGameType(gt); setTaskIndex(0); setStreak(0); setPhase('game')
    if      (gt === 'tpr')         startTPRTask(selectNextItem('english.tpr', TPR_VERBS, v => v.verb))
    else if (gt === 'pointer')     startPointerTask(selectNextItem('english.listenPoint', POINTER_TASKS, t => t.id))
    else if (gt === 'sayit')       startSayItTask(selectNextItem('english.sayit', SAY_IT_WORDS, w => w.word))
    else if (gt === 'feedmonster') startFeedTask(selectNextItem('english.feedmonster', ALL_FEED_TASKS, t => t.id))
    else if (gt === 'memory')      startMemoryGame()
  }

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    const cards: { emoji: string; label: string; sublabel: string; onClick: () => void }[] = [
      { emoji: '🏃', label: 'Cselekedj!',  sublabel: 'Mozdulj a szóra!',       onClick: () => handleStart('tpr') },
      { emoji: '👆', label: 'Mutasd meg!', sublabel: 'Koppints a képre!',       onClick: () => handleStart('pointer') },
      { emoji: '👾', label: 'Etesd meg!',  sublabel: 'Etess szörnyet angolul!', onClick: () => handleStart('feedmonster') },
      { emoji: '🎴', label: 'Párosítsd!', sublabel: 'Kép + hang párok!',       onClick: () => handleStart('memory') },
    ]
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
