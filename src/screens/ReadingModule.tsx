import { useState, useRef } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakChained, speakSyllabified } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { ModuleSelect } from '../components/ModuleSelect'
import { TaskShell } from '../components/TaskShell'
import { AnswerButton } from '../components/AnswerButton'
import { READING_WORDS, type WordEntry } from '../data/readingWords'
import { RHYME_PAIRS, type RhymePair } from '../data/rhymeData'
import { LETTER_BUILD_WORDS, type LetterBuildWord } from '../data/letterBuildData'
import { LOWERCASE_LETTERS, type LowercaseLetterEntry } from '../data/lowercaseLetterData'
import { DIGRAPH_WORDS, DIGRAPHS, DIGRAPH_SYLLABLE, type Digraph, type DigraphWord } from '../data/digraphData'
import { selectNextItem, recordAttempt, getItemWeight, loadStagedLevel, advanceStagedLevel } from '../lib/adaptive'
import { playDigraphHint, playAudio } from '../lib/audioPlayer'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'clapper' | 'assembler' | 'rhyme' | 'wordpic' | 'letterbuild' | 'lowercase' | 'digraph'
type Phase = 'select' | 'game'

const TASKS_PER_ROUND = 5
const STREAK_REWARD   = 3

const LEVEL1_ALL   = READING_WORDS.filter(w => w.level === 1)
const LEVEL1_MULTI = LEVEL1_ALL.filter(w => w.syllables.length >= 2)

const LETTER_SOUNDS: Record<string, string> = {
  F: 'Fff', S: 'Sss', M: 'Mmm', N: 'Nnn', L: 'Lll', V: 'Vvv', R: 'Rrr',
  T: 'T', P: 'P', K: 'K', H: 'H', B: 'B',
  A: 'Aaa', E: 'Eee', O: 'Ooo',
}

// Strips Hungarian diacritics for itemId use, e.g. "nyúl" -> "nyul".
function slug(word: string): string {
  return word
    .replace(/[áà]/g, 'a').replace(/[éè]/g, 'e').replace(/[íì]/g, 'i')
    .replace(/[óòöő]/g, 'o').replace(/[úùüű]/g, 'u')
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CardState    { syllable: string; placed: boolean }
interface RhymeOption  { word: string; emoji: string; syllables: string[]; isCorrect: boolean }
interface WordPicOption { entry: WordEntry; isCorrect: boolean }
interface LetterSlot   { letter: string | null; status: 'empty' | 'correct' | 'wrong' }
interface LetterCard   { letter: string; placed: boolean }

export function ReadingModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot      = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]       = useState<Phase>('select')
  const [gameType, setGameType] = useState<GameType>('clapper')
  const [taskIndex, setTaskIndex] = useState(0)
  const [streak, setStreak]     = useState(0)

  // Clapper state
  const [task, setTask]               = useState<WordEntry | null>(null)
  const [selectedCount, setSelectedCount] = useState<number | null>(null)
  const answering = useRef(false)

  // Assembler state
  const [cards, setCards]                     = useState<CardState[]>([])
  const [assembled, setAssembled]             = useState<string[]>([])
  const [assemblerResult, setAssemblerResult] = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Rhyme state
  const [rhymeTask, setRhymeTask]       = useState<RhymePair | null>(null)
  const [rhymeOptions, setRhymeOptions] = useState<RhymeOption[]>([])
  const [rhymeSelected, setRhymeSelected] = useState<number | null>(null)
  const [rhymeResult, setRhymeResult]   = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Word-picture state
  const [wordPicTarget, setWordPicTarget]   = useState<WordEntry | null>(null)
  const [wordPicOptions, setWordPicOptions] = useState<WordPicOption[]>([])
  const [wordPicSelected, setWordPicSelected] = useState<number | null>(null)
  const [wordPicResult, setWordPicResult]   = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Letter-build state
  const [letterBuildWord, setLetterBuildWord]         = useState<LetterBuildWord | null>(null)
  const [letterSlots, setLetterSlots]                 = useState<LetterSlot[]>([])
  const [letterCards, setLetterCards]                 = useState<LetterCard[]>([])
  const [letterBuildScaffold, setLetterBuildScaffold] = useState<1 | 2 | 3>(2)
  const letterBuildLocked = useRef(false)

  // Lowercase-matching state
  const [lowercaseLetter, setLowercaseLetter]     = useState<LowercaseLetterEntry | null>(null)
  const [lowercaseOptions, setLowercaseOptions]   = useState<string[]>([])
  const [lowercaseSelected, setLowercaseSelected] = useState<number | null>(null)
  const [lowercaseResult, setLowercaseResult]     = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Digraph state
  const [digraphTask, setDigraphTask]         = useState<DigraphWord | null>(null)
  const [digraphOptions, setDigraphOptions]   = useState<Digraph[]>([])
  const [digraphSelected, setDigraphSelected] = useState<number | null>(null)
  const [digraphResult, setDigraphResult]     = useState<'idle' | 'correct' | 'wrong'>('idle')

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

  const startRhymeTask = (pair: RhymePair): void => {
    setRhymeTask(pair)
    setRhymeOptions(shuffle([
      { word: pair.correct, emoji: pair.correctEmoji, syllables: pair.correctSyllables, isCorrect: true },
      { word: pair.distractors[0].word, emoji: pair.distractors[0].emoji, syllables: pair.distractors[0].syllables, isCorrect: false },
      { word: pair.distractors[1].word, emoji: pair.distractors[1].emoji, syllables: pair.distractors[1].syllables, isCorrect: false },
    ]))
    setRhymeSelected(null)
    setRhymeResult('idle')
    speak('Mi rímel erre?')
    setTimeout(() => speakSyllabified(pair.promptSyllables, pair.prompt), 1000)
  }

  const startWordPicTask = (target: WordEntry): void => {
    const others   = shuffle(LEVEL1_ALL.filter(w => w.word !== target.word))
    const sameSyl  = others.filter(w => w.syllables.length === target.syllables.length)
    const diffSyl  = others.filter(w => w.syllables.length !== target.syllables.length)
    const [d1, d2] = [...sameSyl, ...diffSyl]
    setWordPicTarget(target)
    setWordPicOptions(shuffle([
      { entry: target, isCorrect: true },
      { entry: d1,     isCorrect: false },
      { entry: d2,     isCorrect: false },
    ]))
    setWordPicSelected(null)
    setWordPicResult('idle')
    speak('Melyik szó illik a képhez?')
    setTimeout(() => speakSyllabified(target.syllables, target.word), 1200)
  }

  const startLetterBuildTask = (word: LetterBuildWord): void => {
    const weight = getItemWeight('reading.letterBuild', word.word)
    const scaffold: 1 | 2 | 3 = weight >= 2.0 ? 1 : weight >= 0.7 ? 2 : 3
    setLetterBuildWord(word)
    setLetterBuildScaffold(scaffold)
    setLetterSlots(word.letters.map(() => ({ letter: null, status: 'empty' as const })))
    setLetterCards(shuffle([
      ...word.letters.map(l => ({ letter: l, placed: false })),
      ...word.distractors.map(l => ({ letter: l, placed: false })),
    ]))
    letterBuildLocked.current = false
    speakChained([...word.letterSounds, word.word])
  }

  const startLowercaseTask = (): void => {
    const level = loadStagedLevel('lowercaseLevelState').level
    const pool = LOWERCASE_LETTERS.filter(l => l.level === level)
    const entry = selectNextItem('reading.lowercase', pool, l => l.lower)
    setLowercaseLetter(entry)
    setLowercaseOptions(shuffle([entry.lower, ...shuffle(entry.distractors).slice(0, 2)]))
    setLowercaseSelected(null)
    setLowercaseResult('idle')
    speak(`Melyik a kis ${entry.upper}?`)
  }

  const startDigraphTask = (): void => {
    const word = selectNextItem('reading.digraph', DIGRAPH_WORDS, w => slug(w.word))
    const otherDigraphs = shuffle(DIGRAPHS.filter(d => d !== word.digraph)).slice(0, 2)
    setDigraphTask(word)
    setDigraphOptions(shuffle([word.digraph, ...otherDigraphs]))
    setDigraphSelected(null)
    setDigraphResult('idle')
    void playDigraphHint(word.word, DIGRAPH_SYLLABLE[word.digraph])
  }

  // ── Shared ────────────────────────────────────────────────────────────────

  const callRoundComplete = (): void => {
    unlockAudio()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    if (unlocked) speak('Új ruha vár rád a szekrényben!')
    onRoundComplete(unlocked)
  }

  const advance = (correct: boolean, tt: string, key: string, delay: number, nextTask: () => void): void => {
    recordAttempt(tt, key, correct)
    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
      else triggerMicro()
    } else {
      setStreak(0)
      triggerError()
    }
    if (!correct) return
    const nextIdx = taskIndex + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); callRoundComplete() }, delay)
    } else {
      setTimeout(() => { setTaskIndex(nextIdx); nextTask() }, delay)
    }
  }

  const handleStart = (gt: GameType): void => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    setStreak(0)
    setPhase('game')
    if (gt === 'clapper') {
      startClapperTask(selectNextItem('reading.syllableCount', LEVEL1_ALL, w => w.word), 0)
    } else if (gt === 'assembler') {
      startAssemblerTask(selectNextItem('reading.syllableAssembly', LEVEL1_MULTI, w => w.word), 0)
    } else if (gt === 'rhyme') {
      startRhymeTask(selectNextItem('reading.rhyme', RHYME_PAIRS, p => p.prompt))
    } else if (gt === 'wordpic') {
      startWordPicTask(selectNextItem('reading.wordPicture', LEVEL1_ALL, w => w.word))
    } else if (gt === 'lowercase') {
      startLowercaseTask()
    } else if (gt === 'digraph') {
      startDigraphTask()
    } else {
      startLetterBuildTask(selectNextItem('reading.letterBuild', LETTER_BUILD_WORDS, w => w.word))
    }
  }

  const handleRepeat = (): void => {
    unlockAudio()
    if ((gameType === 'clapper' || gameType === 'assembler') && task) {
      speakSyllabified(task.syllables, task.word)
    } else if (gameType === 'rhyme' && rhymeTask) {
      speakSyllabified(rhymeTask.promptSyllables, rhymeTask.prompt)
    } else if (gameType === 'wordpic' && wordPicTarget) {
      speakSyllabified(wordPicTarget.syllables, wordPicTarget.word)
    } else if (gameType === 'letterbuild' && letterBuildWord) {
      speakChained([...letterBuildWord.letterSounds, letterBuildWord.word])
    } else if (gameType === 'lowercase' && lowercaseLetter) {
      speak(`Melyik a kis ${lowercaseLetter.upper}?`)
    } else if (gameType === 'digraph' && digraphTask) {
      void playDigraphHint(digraphTask.word, DIGRAPH_SYLLABLE[digraphTask.digraph])
    }
  }

  const handleBack = (): void => {
    unlockAudio()
    speak('Visszamegyünk a kertbe!')
    setTimeout(onBack, 600)
  }

  // ── Clapper handler ───────────────────────────────────────────────────────

  const handleClapperAnswer = (n: number): void => {
    if (answering.current || selectedCount !== null || !task) return
    answering.current = true
    setSelectedCount(n)
    const isCorrect = n === task.syllables.length
    advance(isCorrect, 'reading.syllableCount', task.word, 900,
      () => startClapperTask(selectNextItem('reading.syllableCount', LEVEL1_ALL, w => w.word), taskIndex + 1))
    if (!isCorrect) {
      setTimeout(() => { setSelectedCount(null); answering.current = false }, 1400)
    }
  }

  // ── Assembler handler ─────────────────────────────────────────────────────

  const handleCardTap = (cardIdx: number): void => {
    if (assemblerResult !== 'idle' || !task || cards[cardIdx].placed) return
    const newAssembled = [...assembled, cards[cardIdx].syllable]
    setCards(prev => prev.map((c, i) => i === cardIdx ? { ...c, placed: true } : c))
    setAssembled(newAssembled)
    if (newAssembled.length < task.syllables.length) return

    const isCorrect = newAssembled.every((s, i) => s === task.syllables[i])
    setAssemblerResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) speak(task.word)
    advance(isCorrect, 'reading.syllableAssembly', task.word, 1200,
      () => startAssemblerTask(selectNextItem('reading.syllableAssembly', LEVEL1_MULTI, w => w.word), taskIndex + 1))
    if (!isCorrect) {
      setTimeout(() => {
        setCards(shuffle(task.syllables.map(s => ({ syllable: s, placed: false }))))
        setAssembled([])
        setAssemblerResult('idle')
      }, 1400)
    }
  }

  // ── Rhyme handler ─────────────────────────────────────────────────────────

  const handleRhymeTap = (idx: number): void => {
    if (rhymeResult !== 'idle' || !rhymeTask) return
    setRhymeSelected(idx)
    const opt = rhymeOptions[idx]
    if (opt.isCorrect) {
      setRhymeResult('correct')
      speakChained([rhymeTask.prompt, rhymeTask.correct, 'Rímelnek!'])
      advance(true, 'reading.rhyme', rhymeTask.prompt, 2200,
        () => startRhymeTask(selectNextItem('reading.rhyme', RHYME_PAIRS, p => p.prompt)))
    } else {
      setRhymeResult('wrong')
      recordAttempt('reading.rhyme', rhymeTask.prompt, false)
      setStreak(0)
      triggerError()
      speak('Ez nem rímel! Próbáld a másikat!')
      setTimeout(() => { setRhymeSelected(null); setRhymeResult('idle') }, 1600)
    }
  }

  // ── Letter-build handler ──────────────────────────────────────────────────

  const handleLetterTap = (cardIdx: number): void => {
    if (letterBuildLocked.current || !letterBuildWord) return
    const card = letterCards[cardIdx]
    if (card.placed) return

    const nextSlotIdx = letterSlots.findIndex(s => s.letter === null)
    if (nextSlotIdx === -1) return

    const expectedLetter = letterBuildWord.letters[nextSlotIdx]

    if (card.letter === expectedLetter) {
      setLetterSlots(prev => prev.map((s, i) =>
        i === nextSlotIdx ? { letter: card.letter, status: 'correct' as const } : s))
      setLetterCards(prev => prev.map((c, i) => i === cardIdx ? { ...c, placed: true } : c))

      if (nextSlotIdx === letterBuildWord.letters.length - 1) {
        recordAttempt('reading.letterBuild', letterBuildWord.word, true)
        const newStreak = streak + 1
        setStreak(newStreak)
        if (newStreak >= STREAK_REWARD && newStreak % STREAK_REWARD === 0) triggerSmall()
        else triggerMicro()
        speak(letterBuildWord.word)
        const nextIdx = taskIndex + 1
        if (nextIdx >= TASKS_PER_ROUND) {
          setTimeout(() => { triggerMedium(); callRoundComplete() }, 1500)
        } else {
          setTimeout(() => {
            setTaskIndex(nextIdx)
            startLetterBuildTask(selectNextItem('reading.letterBuild', LETTER_BUILD_WORDS, w => w.word))
          }, 1500)
        }
      }
    } else {
      letterBuildLocked.current = true
      setLetterSlots(prev => prev.map((s, i) =>
        i === nextSlotIdx ? { letter: card.letter, status: 'wrong' as const } : s))
      recordAttempt('reading.letterBuild', letterBuildWord.word, false)
      setStreak(0)
      triggerError()
      if (letterBuildScaffold === 2) {
        speak(`${LETTER_SOUNDS[expectedLetter] ?? expectedLetter}... Ezt a hangot keresd!`)
      } else if (letterBuildScaffold === 3) {
        speak('Próbáld újra!')
      }
      setTimeout(() => {
        setLetterSlots(prev => prev.map((s, i) =>
          i === nextSlotIdx ? { letter: null, status: 'empty' } : s))
        letterBuildLocked.current = false
      }, 900)
    }
  }

  // ── Word-picture handler ──────────────────────────────────────────────────

  const handleWordPicTap = (idx: number): void => {
    if (wordPicResult !== 'idle' || !wordPicTarget) return
    setWordPicSelected(idx)
    const opt = wordPicOptions[idx]
    if (opt.isCorrect) {
      setWordPicResult('correct')
      speakSyllabified(wordPicTarget.syllables, wordPicTarget.word)
      advance(true, 'reading.wordPicture', wordPicTarget.word, 1800,
        () => startWordPicTask(selectNextItem('reading.wordPicture', LEVEL1_ALL, w => w.word)))
    } else {
      setWordPicResult('wrong')
      recordAttempt('reading.wordPicture', wordPicTarget.word, false)
      setStreak(0)
      triggerError()
      speak('Ez nem az! Nézd meg újra a képet!')
      setTimeout(() => speakSyllabified(wordPicTarget.syllables, wordPicTarget.word), 1400)
      setTimeout(() => { setWordPicSelected(null); setWordPicResult('idle') }, 2000)
    }
  }

  // ── Lowercase-matching handler ────────────────────────────────────────────

  const handleLowercaseTap = (idx: number): void => {
    if (lowercaseResult !== 'idle' || !lowercaseLetter) return
    setLowercaseSelected(idx)
    const isCorrect = lowercaseOptions[idx] === lowercaseLetter.lower
    setLowercaseResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      speak(`Igen! Nagy ${lowercaseLetter.upper}, kis ${lowercaseLetter.lower} — ugyanaz a betű!`)
    } else {
      speak(`Próbáld újra! Melyik a kis ${lowercaseLetter.upper}?`)
    }
    advance(isCorrect, 'reading.lowercase', lowercaseLetter.lower, 1600, () => startLowercaseTask())
    if (isCorrect) {
      advanceStagedLevel('lowercaseLevelState', 'reading.lowercase')
    } else {
      setTimeout(() => { setLowercaseSelected(null); setLowercaseResult('idle') }, 1600)
    }
  }

  // ── Digraph handler ────────────────────────────────────────────────────────

  const handleDigraphTap = (idx: number): void => {
    if (digraphResult !== 'idle' || !digraphTask) return
    setDigraphSelected(idx)
    const isCorrect = digraphOptions[idx] === digraphTask.digraph
    setDigraphResult(isCorrect ? 'correct' : 'wrong')
    const syllable = DIGRAPH_SYLLABLE[digraphTask.digraph]
    // advance() first — it synchronously fires the reward hook's generic
    // Web Speech praise; playAudio() below cancels that before it's audible
    // and plays our own Azure clip instead (see audioPlayer.ts).
    advance(isCorrect, 'reading.digraph', slug(digraphTask.word), 1800, () => startDigraphTask())
    if (isCorrect) {
      void playAudio(`Igen! ${syllable} — két betű, egy hang!`, 'hu-HU')
    } else {
      void playAudio(`Próbáld újra! Figyeld a ${syllable} hangot!`, 'hu-HU')
    }
    if (!isCorrect) {
      setTimeout(() => { setDigraphSelected(null); setDigraphResult('idle') }, 1800)
    }
  }

  // ── SELECT ────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ModuleSelect
        hue="blue"
        title="📚 Olvasás"
        Illustration={Illustration}
        cards={[
          { emoji: '👏', label: 'Tapsolj!',     sublabel: 'Hány részből áll?',   onClick: () => handleStart('clapper') },
          { emoji: '🧩', label: 'Rakd össze!',  sublabel: 'Illeszd a szótagot!', onClick: () => handleStart('assembler') },
          { emoji: '🎵', label: 'Rímel!',       sublabel: 'Mi rímel erre?',      onClick: () => handleStart('rhyme') },
          { emoji: '🔍', label: 'Melyik szó?',  sublabel: 'Koppints a szóra!',   onClick: () => handleStart('wordpic') },
          { emoji: '🔤', label: 'Építsd!',      sublabel: 'Rakd ki a betűket!',  onClick: () => handleStart('letterbuild') },
          { emoji: '🔡', label: 'Melyik a kis betű?', sublabel: 'Nagy és kis betű', onClick: () => handleStart('lowercase') },
          { emoji: '🔤', label: 'Két betű, egy hang!', sublabel: 'ny, ty, gy, sz, cs, zs', onClick: () => handleStart('digraph') },
        ]}
        onBack={handleBack}
        onRepeat={() => speak('Melyik játékot választod?')}
      />
    )
  }

  // ── CLAPPER ───────────────────────────────────────────────────────────────

  if (gameType === 'clapper' && task) {
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <span className="text-6xl leading-none">{task.emoji}</span>
            <p className="text-blue-900 font-bold text-3xl text-center tracking-widest">
              {task.syllables.join(' · ')}
            </p>
            <p className="text-blue-700 font-semibold text-lg text-center">Hány részből áll?</p>
          </div>
          <button onClick={handleRepeat}
            className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform flex-shrink-0">
            🔊 Mondd újra
          </button>
          <div className="grid grid-cols-2 gap-3 w-full flex-shrink-0">
            {[1, 2, 3, 4].map(n => (
              <AnswerButton key={n} hue="blue"
                state={selectedCount === n ? (n === task.syllables.length ? 'correct' : 'wrong') : 'idle'}
                onClick={() => handleClapperAnswer(n)}
                className={['flex items-center justify-center min-h-[80px]',
                  selectedCount !== null && selectedCount !== n ? 'opacity-50' : ''].join(' ')}>
                <span className="text-4xl font-bold leading-none">{n}</span>
              </AnswerButton>
            ))}
          </div>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── ASSEMBLER ─────────────────────────────────────────────────────────────

  if (gameType === 'assembler' && task) {
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <span className="text-6xl leading-none">{task.emoji}</span>
            <button onClick={handleRepeat}
              className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform">
              🔊 Mondd újra
            </button>
          </div>
          <div className="flex gap-2 justify-center flex-shrink-0">
            {task.syllables.map((_, i) => (
              <div key={i}
                style={{ animation: assemblerResult === 'wrong' && i < assembled.length ? 'shake-no 0.4s ease-out' : 'none' }}
                className={['min-w-[64px] h-14 rounded-2xl border-4 flex items-center justify-center transition-all duration-200',
                  i < assembled.length
                    ? assemblerResult === 'correct' ? 'bg-green-400 border-green-300 shadow-lg'
                      : assemblerResult === 'wrong'  ? 'bg-red-400 border-red-300'
                      : 'bg-blue-100 border-blue-400 shadow-sm'
                    : 'bg-gray-100 border-gray-300 border-dashed'].join(' ')}>
                {i < assembled.length && <span className="text-2xl font-bold text-blue-900">{assembled[i]}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
            {cards.map((card, i) => (
              <button key={i} onClick={() => handleCardTap(i)}
                disabled={card.placed || assemblerResult !== 'idle'}
                style={{ borderRadius: 'var(--r-card)', boxShadow: card.placed ? 'none' : 'var(--sh-1)' }}
                className={['min-w-[80px] h-20 flex items-center justify-center transition-all duration-200',
                  card.placed ? 'bg-gray-100 border-2 border-gray-200 opacity-20 cursor-default'
                    : 'bg-blue-500 active:bg-blue-400 active:scale-90'].join(' ')}>
                {!card.placed && <span className="text-2xl font-bold text-white">{card.syllable}</span>}
              </button>
            ))}
          </div>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── RHYME ─────────────────────────────────────────────────────────────────

  if (gameType === 'rhyme' && rhymeTask) {
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-7xl leading-none">{rhymeTask.promptEmoji}</span>
            <p className="text-blue-900 font-bold text-4xl tracking-widest">
              {rhymeTask.promptSyllables.join(' · ')}
            </p>
            <p className="text-blue-700 font-semibold text-lg">Mi rímel erre?</p>
          </div>

          <div className="flex gap-3 w-full flex-shrink-0">
            {rhymeOptions.map((opt, i) => {
              const isSel = rhymeSelected === i
              let cls = 'border-gray-200 bg-gray-50'
              if (isSel && opt.isCorrect)  cls = 'border-green-400 bg-green-100 scale-105'
              if (isSel && !opt.isCorrect) cls = 'border-red-400 bg-red-100'
              if (rhymeResult !== 'idle' && !isSel) cls += ' opacity-40'
              return (
                <button key={i}
                  onClick={() => { unlockAudio(); handleRhymeTap(i) }}
                  disabled={rhymeResult !== 'idle'}
                  style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                    animation: isSel && !opt.isCorrect ? 'shake-no 0.5s ease-out' : 'none' }}
                  className={`flex-1 flex flex-col items-center gap-2 py-5 border-4 transition-all duration-200 ${cls}`}>
                  <span className="text-4xl leading-none">{opt.emoji}</span>
                  <span className="text-xl font-bold text-blue-900 tracking-widest">
                    {opt.syllables.join(' · ')}
                  </span>
                </button>
              )
            })}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── WORD-PICTURE ──────────────────────────────────────────────────────────

  if (gameType === 'wordpic' && wordPicTarget) {
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-8xl leading-none">{wordPicTarget.emoji}</span>
            <p className="text-blue-700 font-semibold text-lg">Melyik szó illik a képhez?</p>
          </div>

          <div className="flex flex-col gap-3 w-full flex-shrink-0">
            {wordPicOptions.map((opt, i) => {
              const isSel = wordPicSelected === i
              let cls = 'border-gray-200 bg-gray-50'
              if (isSel && opt.isCorrect)  cls = 'border-green-400 bg-green-100'
              if (isSel && !opt.isCorrect) cls = 'border-red-400 bg-red-100'
              if (wordPicResult !== 'idle' && !isSel) cls += ' opacity-40'
              return (
                <button key={i}
                  onClick={() => { unlockAudio(); handleWordPicTap(i) }}
                  disabled={wordPicResult !== 'idle'}
                  style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                    animation: isSel && !opt.isCorrect ? 'shake-no 0.5s ease-out' : 'none' }}
                  className={`w-full py-5 border-4 flex items-center justify-center transition-all duration-200 ${cls}`}>
                  <span className="text-2xl font-bold text-blue-900 tracking-widest">
                    {opt.entry.syllables.join(' · ')}
                  </span>
                </button>
              )
            })}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── LETTER-BUILD ──────────────────────────────────────────────────────────

  if (gameType === 'letterbuild' && letterBuildWord) {
    const wordUpper = letterBuildWord.word.toUpperCase()
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          {/* Target word emoji or word label */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            {letterBuildWord.emoji
              ? <span className="text-7xl leading-none">{letterBuildWord.emoji}</span>
              : <p className="text-blue-900 font-bold text-4xl tracking-widest">{wordUpper}</p>}
            <button onClick={handleRepeat}
              className="bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-full px-5 py-2.5 active:scale-95 transition-transform">
              🔊 Mondd újra
            </button>
          </div>

          {/* Slots */}
          <div className="flex gap-4 justify-center flex-shrink-0">
            {letterSlots.map((slot, i) => {
              const expectedLetter = letterBuildWord.letters[i]
              const isWrong   = slot.status === 'wrong'
              const isCorrect = slot.status === 'correct'
              const isEmpty   = slot.status === 'empty'
              return (
                <div key={i}
                  style={{
                    animation: isWrong ? 'shake-no 0.4s ease-out' : 'none',
                    borderRadius: 'var(--r-card)',
                    boxShadow: isCorrect ? '0 0 0 4px #4ade80' : isWrong ? '0 0 0 4px #f87171' : 'none',
                  }}
                  className={['w-20 h-20 border-4 flex items-center justify-center transition-all duration-200',
                    isCorrect ? 'bg-green-100 border-green-400'
                    : isWrong ? 'bg-red-100 border-red-400'
                    : 'bg-gray-100 border-dashed border-gray-300'].join(' ')}>
                  {/* Ghost letter for scaffold level 1 */}
                  {isEmpty && letterBuildScaffold === 1 && (
                    <span className="text-4xl font-bold text-gray-300 select-none">{expectedLetter}</span>
                  )}
                  {/* Placed letter */}
                  {slot.letter && (
                    <span className={['text-4xl font-bold select-none',
                      isCorrect ? 'text-green-700' : 'text-red-600'].join(' ')}>
                      {slot.letter}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Letter cards */}
          <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
            {letterCards.map((card, i) => (
              <button key={i}
                onClick={() => { unlockAudio(); handleLetterTap(i) }}
                disabled={card.placed}
                style={{ borderRadius: 'var(--r-card)', boxShadow: card.placed ? 'none' : 'var(--sh-1)' }}
                className={['w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90',
                  card.placed
                    ? 'bg-gray-100 border-2 border-gray-200 opacity-20 cursor-default'
                    : 'bg-blue-500 active:bg-blue-400'].join(' ')}>
                {!card.placed && (
                  <span className="text-3xl font-bold text-white">{card.letter}</span>
                )}
              </button>
            ))}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── LOWERCASE-MATCHING ────────────────────────────────────────────────────

  if (gameType === 'lowercase' && lowercaseLetter) {
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: 'var(--sh-1)' }}>
              <div className="w-10 h-10"><Illustration /></div>
            </div>
            <p className="text-blue-900 font-black leading-none" style={{ fontSize: 96 }}>{lowercaseLetter.upper}</p>
            <p className="text-blue-700 font-semibold text-lg text-center">Melyik a kis betű?</p>
          </div>

          <div className="flex gap-3 w-full flex-shrink-0">
            {lowercaseOptions.map((opt, i) => {
              const isSel = lowercaseSelected === i
              const isCorrectOpt = opt === lowercaseLetter.lower
              let cls = 'border-gray-200 bg-gray-50'
              if (isSel && isCorrectOpt)  cls = 'border-green-400 bg-green-100 scale-105'
              if (isSel && !isCorrectOpt) cls = 'border-red-400 bg-red-100'
              if (lowercaseResult !== 'idle' && !isSel) cls += ' opacity-40'
              return (
                <button key={i}
                  onClick={() => { unlockAudio(); handleLowercaseTap(i) }}
                  disabled={lowercaseResult !== 'idle'}
                  style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                    animation: isSel && !isCorrectOpt ? 'shake-no 0.5s ease-out' : 'none' }}
                  className={`flex-1 flex items-center justify-center py-7 border-4 transition-all duration-200 ${cls}`}>
                  <span className="text-6xl font-bold text-blue-900">{opt}</span>
                </button>
              )
            })}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── DIGRAPH ───────────────────────────────────────────────────────────────

  if (gameType === 'digraph' && digraphTask) {
    const highlightLen = digraphTask.digraph.length
    return (
      <TaskShell hue="blue" progressIndex={taskIndex} total={TASKS_PER_ROUND} onBack={handleBack} onRepeat={handleRepeat}>
        <div className="flex flex-col items-center justify-between h-full py-5 px-4">

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: 'var(--sh-1)' }}>
              <div className="w-10 h-10"><Illustration /></div>
            </div>
            <p className="text-blue-700 font-semibold text-lg text-center">Melyik hangot hallod?</p>
          </div>

          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <span className="text-7xl leading-none">{digraphTask.emoji}</span>
            <p className="text-4xl font-bold tracking-widest">
              <span className="bg-yellow-200 text-blue-900 rounded px-1 uppercase">
                {digraphTask.word.slice(0, highlightLen)}
              </span>
              <span className="text-blue-900">{digraphTask.word.slice(highlightLen)}</span>
            </p>
          </div>

          <div className="flex gap-3 w-full flex-shrink-0">
            {digraphOptions.map((opt, i) => {
              const isSel = digraphSelected === i
              const isCorrectOpt = opt === digraphTask.digraph
              let cls = 'border-gray-200 bg-gray-50'
              if (isSel && isCorrectOpt)  cls = 'border-green-400 bg-green-100 scale-105'
              if (isSel && !isCorrectOpt) cls = 'border-red-400 bg-red-100'
              if (digraphResult !== 'idle' && !isSel) cls += ' opacity-40'
              return (
                <button key={i}
                  onClick={() => { unlockAudio(); handleDigraphTap(i) }}
                  disabled={digraphResult !== 'idle'}
                  style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--sh-1)',
                    animation: isSel && !isCorrectOpt ? 'shake-no 0.5s ease-out' : 'none' }}
                  className={`flex-1 flex items-center justify-center py-7 border-4 transition-all duration-200 ${cls}`}>
                  <span className="text-5xl font-bold text-blue-900 uppercase">{opt}</span>
                </button>
              )
            })}
          </div>

        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  return <div className="w-screen h-screen bg-blue-500" />
}
