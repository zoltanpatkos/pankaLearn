import { useState, useRef, useEffect, useCallback } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakEnglishPraise } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { LETTER_DEFS, type LetterDef } from '../data/writingData'
import { buildCursiveLetterDefs, cursiveRuledLines, type CursiveCase } from '../data/cursiveLetterData'

// Letters excluded from orient game — flip-x symmetric (flip-x = normal)
const ORIENT_EXCLUDED = new Set(['I', 'T', 'H', 'O', 'A', 'V', 'M'])
// Letters where rotate-180 = normal — only show 2 options (normal + flip-x)
const ORIENT_2OPTION = new Set(['N', 'S', 'Z'])
const ORIENT_LETTER_DEFS = LETTER_DEFS.filter(l => !ORIENT_EXCLUDED.has(l.letter))
import { selectNextItems, recordAttempt } from '../lib/adaptive'
import { ModuleSelect } from '../components/ModuleSelect'
import { TaskShell } from '../components/TaskShell'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'trace' | 'orient' | 'cursive'
type Phase = 'select' | 'game'
type DirectionResult = 'idle' | 'correct' | 'wrong'

const TASKS_PER_ROUND = 5
const CANVAS_SIZE = 400
// Kötött írás: füzetsorhoz hasonló, széles vászon (a nyomtatott nagybetűk
// négyzet vászna helyett) — a betű mérete a magassághoz igazodik.
const CURSIVE_W = 800
const CURSIVE_H = 340
const DIRECTION_TOLERANCE = 90   // degrees — generous for a 5-year-old
const AUTO_ADVANCE_MS = 1500     // auto-advance after correct direction

const HU_PRAISES = ['Szuper!', 'Brávó!', 'Remek!', 'Zseniális!', 'Nagyon jó!', 'Fantasztikus!']
const maybePraise = (): void =>
  Math.random() < 0.5
    ? speakEnglishPraise()
    : speak(HU_PRAISES[Math.floor(Math.random() * HU_PRAISES.length)])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function computeDirection(pts: { x: number; y: number }[], expectedAngle: number): DirectionResult {
  if (pts.length < 5) return 'idle'
  const dx = pts[4].x - pts[0].x
  const dy = pts[4].y - pts[0].y
  if (Math.sqrt(dx * dx + dy * dy) < 18) return 'idle'
  const actual = Math.atan2(dy, dx) * 180 / Math.PI
  const diff = Math.abs(((actual - expectedAngle + 180) % 360) - 180)
  return diff <= DIRECTION_TOLERANCE ? 'correct' : 'wrong'
}

// ── LetterCanvas (mini canvas for orient game) ────────────────────────────────

type OrientTransform = 'normal' | 'flip-x' | 'rotate-180'

function LetterCanvas({
  def, transform, size,
}: { def: LetterDef; transform: OrientTransform; size: number }): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = size * 0.09
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (transform === 'flip-x') { ctx.translate(size, 0); ctx.scale(-1, 1) }
    else if (transform === 'rotate-180') { ctx.translate(size, size); ctx.scale(-1, -1) }
    def.draw(ctx, size)
    ctx.restore()
  }, [def, transform, size])

  return <canvas ref={ref} width={size} height={size} className="rounded-xl" />
}

// ── Arrow helper ──────────────────────────────────────────────────────────────

function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number, s: number): void {
  const len = s * 0.1
  const rad = (angleDeg * Math.PI) / 180
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rad)
  ctx.strokeStyle = '#9ca3af'
  ctx.lineWidth = s * 0.022
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-len * 0.4, 0); ctx.lineTo(len * 0.4, 0)
  ctx.moveTo(len * 0.05, -len * 0.32); ctx.lineTo(len * 0.4, 0); ctx.lineTo(len * 0.05, len * 0.32)
  ctx.stroke()
  ctx.restore()
}

// ── Main component ────────────────────────────────────────────────────────────

export function WritingModule({ mascotId, lockedWardrobeItems, onBack, onRoundComplete }: Props): JSX.Element {
  const mascot = MASCOTS.find(m => m.id === mascotId) ?? MASCOTS[0]
  const Illustration = mascot.Illustration

  const [phase, setPhase]         = useState<Phase>('select')
  const [gameType, setGameType]   = useState<GameType>('trace')
  const [taskIndex, setTaskIndex] = useState(0)
  const [traceResult, setTraceResult] = useState<DirectionResult>('idle')

  // Orient state
  const [orientOptions, setOrientOptions]   = useState<{ transform: OrientTransform; isCorrect: boolean }[]>([])
  const [orientSelected, setOrientSelected] = useState<number | null>(null)
  const [orientResult, setOrientResult]     = useState<'idle' | 'correct' | 'wrong'>('idle')

  // Refs — updated synchronously to avoid stale closures during pointer events
  const roundLettersRef   = useRef<LetterDef[]>([])
  const gameTypeRef       = useRef<GameType>(gameType)
  const canvasRef         = useRef<HTMLCanvasElement>(null)
  const userStrokesRef    = useRef<{ x: number; y: number }[][]>([])
  const currentStrokeRef  = useRef<{ x: number; y: number }[]>([])
  const isDrawingRef      = useRef(false)
  const directionRef      = useRef<DirectionResult>('idle')  // live direction during stroke
  const traceResultRef    = useRef<DirectionResult>('idle')  // mirrors traceResult state
  const autoAdvanceRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const taskIndexRef      = useRef(0)  // mirrors taskIndex for use inside timeouts
  const cursiveCaseRef    = useRef<CursiveCase>('lower')

  const syncSetTraceResult = (v: DirectionResult) => {
    traceResultRef.current = v
    setTraceResult(v)
  }

  const { activeReward, rewardKey, triggerMicro, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
    confettiColors: ['#9333ea', '#a855f7', '#c084fc', '#6b21a8', '#ede9fe'],
  })

  // Keep refs in sync
  useEffect(() => { taskIndexRef.current = taskIndex }, [taskIndex])
  useEffect(() => { gameTypeRef.current = gameType }, [gameType])

  // ── Canvas draw ─────────────────────────────────────────────────────────────

  const redrawCanvas = useCallback((letter: LetterDef) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const isCursive = gameTypeRef.current === 'cursive'
    const w = isCursive ? CURSIVE_W : CANVAS_SIZE
    const h = isCursive ? CURSIVE_H : CANVAS_SIZE
    const s = h // reference size for line thickness / dot radius — scales with row height
    const ctx = canvas.getContext('2d')!
    const qx = (v: number) => v / 100 * w
    const qy = (v: number) => v / 100 * h
    ctx.clearRect(0, 0, w, h)

    // Ruled baseline guides (kötött írás füzetvonalak) — alap-, közép- és tetővonal,
    // a betűtípus tényleges arányaihoz igazítva (lásd cursiveRuledLines)
    if (isCursive) {
      ctx.save()
      ctx.strokeStyle = '#bfdbfe'
      ctx.lineWidth = Math.max(1, s * 0.004)
      for (const y of cursiveRuledLines()) {
        ctx.beginPath()
        ctx.moveTo(qx(2), qy(y)); ctx.lineTo(qx(98), qy(y))
        ctx.stroke()
      }
      ctx.restore()
    }

    // Template letter (very light gray)
    ctx.save()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = s * 0.082
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    letter.draw(ctx, w, h)
    ctx.restore()

    // Start/end dots + direction arrow — kötött írásnál nincs megbízható
    // irány/kezdőpont-adat (lásd cursiveLetterData.ts), ott ezeket nem rajzoljuk.
    if (!isCursive) {
      // Start dot (green) — nyíl a pötty UTÁN, hogy ne fedje el, ha egymáshoz közel esnek
      ctx.beginPath()
      ctx.arc(qx(letter.startX), qy(letter.startY), s * 0.042, 0, Math.PI * 2)
      ctx.fillStyle = '#22c55e'; ctx.fill()

      // End dot (red)
      ctx.beginPath()
      ctx.arc(qx(letter.endX), qy(letter.endY), s * 0.034, 0, Math.PI * 2)
      ctx.fillStyle = '#ef4444'; ctx.fill()

      for (const arrow of letter.arrows) drawArrow(ctx, qx(arrow.x), qy(arrow.y), arrow.angle, s)
    }

    // Completed user strokes (purple — already committed)
    ctx.save()
    ctx.strokeStyle = '#9333ea'
    ctx.lineWidth = s * 0.06
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const stroke of userStrokesRef.current) {
      if (stroke.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y)
      ctx.stroke()
    }
    ctx.restore()

    // Current in-progress stroke: color reflects live direction
    if (currentStrokeRef.current.length >= 2) {
      const liveColor = directionRef.current === 'correct' ? '#22c55e'
        : directionRef.current === 'wrong' ? '#ef4444'
        : '#9333ea'
      ctx.save()
      ctx.strokeStyle = liveColor
      ctx.lineWidth = s * 0.06
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y)
      for (let i = 1; i < currentStrokeRef.current.length; i++)
        ctx.lineTo(currentStrokeRef.current[i].x, currentStrokeRef.current[i].y)
      ctx.stroke()
      ctx.restore()
    }
  }, [])

  const clearCanvas = useCallback(() => {
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null }
    userStrokesRef.current = []
    currentStrokeRef.current = []
    directionRef.current = 'idle'
    syncSetTraceResult('idle')
    const letter = roundLettersRef.current[taskIndexRef.current]
    if (letter) redrawCanvas(letter)
  }, [redrawCanvas])

  // ── Pointer events ──────────────────────────────────────────────────────────

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Cancel any pending auto-advance — user is drawing again
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null }
    canvasRef.current?.setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    directionRef.current = 'idle'
    syncSetTraceResult('idle')
    currentStrokeRef.current = [getPos(e)]
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const letter = roundLettersRef.current[taskIndexRef.current]
    if (!letter) return
    currentStrokeRef.current.push(getPos(e))
    // Compute live direction for real-time line coloring (no TTS, no state changes).
    // Kötött írásnál nincs megbízható irány-adat (lásd cursiveLetterData.ts),
    // ott a vonal mindig semleges (lila) marad, "Tovább"-bal lép a gyerek.
    directionRef.current = gameTypeRef.current === 'cursive' ? 'idle'
      : computeDirection(currentStrokeRef.current, letter.expectedAngle)
    redrawCanvas(letter)
  }

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    const letter = roundLettersRef.current[taskIndexRef.current]

    if (currentStrokeRef.current.length >= 2) {
      userStrokesRef.current.push([...currentStrokeRef.current])
    }
    currentStrokeRef.current = []

    if (!letter) return
    redrawCanvas(letter)

    // Give direction feedback only once per lift (and only if a real stroke was made)
    const result = directionRef.current
    if (result === 'correct') {
      syncSetTraceResult('correct')
      speak('Szuper indulás!')
      // Schedule auto-advance
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
      autoAdvanceRef.current = setTimeout(() => {
        autoAdvanceRef.current = null
        triggerMicro()
        maybePraise()
        doAdvance(true)
      }, AUTO_ADVANCE_MS)
    } else if (result === 'wrong' && traceResultRef.current !== 'correct') {
      syncSetTraceResult('wrong')
      speak('Próbáld újra!')
      // No auto-reset — user taps "Töröld!" or just keeps drawing
    }
  }

  // ── Task advance ────────────────────────────────────────────────────────────

  const callRoundCompleteRef = useRef<() => void>(() => {})
  callRoundCompleteRef.current = (): void => {
    unlockAudio()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    if (unlocked) speak('Új ruha vár rád a szekrényben!')
    onRoundComplete(unlocked)
  }

  const doAdvance = useCallback((correct: boolean) => {
    const letter = roundLettersRef.current[taskIndexRef.current]
    if (letter) {
      const tt = gameTypeRef.current === 'trace' ? 'writing.tracing'
        : gameTypeRef.current === 'cursive' ? `writing.cursive.${cursiveCaseRef.current}`
        : 'writing.orientation'
      recordAttempt(tt, letter.letter, correct)
    }
    const nextIdx = taskIndexRef.current + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); callRoundCompleteRef.current() }, 900)
    } else {
      setTimeout(() => setTaskIndex(nextIdx), 600)
    }
  }, [triggerMedium])

  const handleTraceNext = () => {
    // Cancel auto-advance if pending
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null }
    const isCorrect = traceResultRef.current === 'correct'
    if (isCorrect) { triggerMicro(); maybePraise() }
    else triggerMicro()
    doAdvance(isCorrect)
  }

  const handleOrientTap = (idx: number) => {
    if (orientResult !== 'idle') return
    setOrientSelected(idx)
    const opt = orientOptions[idx]
    if (opt.isCorrect) {
      setOrientResult('correct')
      triggerMicro(); maybePraise()
      speak(`Igen, így néz ki a ${roundLettersRef.current[taskIndexRef.current]?.letter} betű!`)
      doAdvance(true)
    } else {
      const letter = roundLettersRef.current[taskIndexRef.current]
      if (letter) recordAttempt('writing.orientation', letter.letter, false)
      setOrientResult('wrong')
      triggerError()
      speak('Ez tükörkép! Próbáld a másikat!')
      setTimeout(() => { setOrientSelected(null); setOrientResult('idle') }, 1400)
    }
  }

  // ── Task setup ──────────────────────────────────────────────────────────────

  const setupTraceTask = useCallback((letter: LetterDef) => {
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null }
    userStrokesRef.current = []
    currentStrokeRef.current = []
    directionRef.current = 'idle'
    syncSetTraceResult('idle')
    if (gameTypeRef.current === 'cursive') {
      // Canvas fillText never waits for a webfont on its own — draw too early
      // and it silently falls back to the system font instead of Magyar Script Basic
      // (and never repaints once the real font arrives). Wait for it explicitly.
      document.fonts.load('64px "Magyar Script Basic"').finally(() => redrawCanvas(letter))
    } else {
      setTimeout(() => redrawCanvas(letter), 30)
    }
    // Speak instruction BEFORE drawing becomes active (speak is async, canvas shown after 30ms)
    speak(letter.ttsInstruction)
  }, [redrawCanvas])

  const setupOrientTask = useCallback((letter: LetterDef) => {
    const pool: OrientTransform[] = ORIENT_2OPTION.has(letter.letter)
      ? ['normal', 'flip-x']
      : ['normal', 'flip-x', 'rotate-180']
    const transforms = shuffle(pool)
    setOrientOptions(transforms.map(t => ({ transform: t, isCorrect: t === 'normal' })))
    setOrientSelected(null)
    setOrientResult('idle')
    speak(`Melyik a helyes ${letter.letter} betű?`)
  }, [])

  const prevTaskRef = useRef(-1)
  useEffect(() => {
    if (phase !== 'game') return
    if (taskIndex === prevTaskRef.current) return
    prevTaskRef.current = taskIndex
    const letter = roundLettersRef.current[taskIndex]
    if (!letter) return
    if (gameType === 'trace' || gameType === 'cursive') setupTraceTask(letter)
    else setupOrientTask(letter)
  }, [taskIndex, phase, gameType, setupTraceTask, setupOrientTask])

  // ── Round start / end ───────────────────────────────────────────────────────

  const startRound = (gt: GameType, cursiveCase?: CursiveCase) => {
    unlockAudio()
    setGameType(gt)
    gameTypeRef.current = gt
    cursiveCaseRef.current = cursiveCase ?? 'lower'
    setTaskIndex(0)
    prevTaskRef.current = -1
    const tt = gt === 'trace' ? 'writing.tracing'
      : gt === 'cursive' ? `writing.cursive.${cursiveCase ?? 'lower'}`
      : 'writing.orientation'
    const pool = gt === 'trace' ? LETTER_DEFS
      : gt === 'cursive' ? buildCursiveLetterDefs(cursiveCase ?? 'lower')
      : ORIENT_LETTER_DEFS
    roundLettersRef.current = selectNextItems(tt, pool, l => l.letter, TASKS_PER_ROUND)
    setPhase('game')
    // Setup is handled by the useEffect after state updates flush
  }

  const handleBack = () => { unlockAudio(); speak('Visszamegyünk a kertbe!'); setTimeout(onBack, 600) }

  const handleRepeat = (): void => {
    const letter = roundLettersRef.current[taskIndex]
    if (!letter) return
    unlockAudio()
    if (gameType === 'orient') speak(`Melyik a helyes ${letter.letter} betű?`)
    else speak(letter.ttsInstruction)
  }

  // ── SELECT ──────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ModuleSelect
        hue="purple"
        title="✏️ Írás"
        Illustration={Illustration}
        cards={[
          { emoji: '✏️', label: 'Rajzold!',      sublabel: 'Kövesd az ujjaddal!',   onClick: () => startRound('trace') },
          { emoji: '🔍', label: 'Melyik jó?',    sublabel: 'Mutasd a helyest!',     onClick: () => startRound('orient') },
          { emoji: '🔡', label: 'Kötött írás',   sublabel: 'kisbetű',               onClick: () => startRound('cursive', 'lower') },
          { emoji: '🔠', label: 'Kötött írás',   sublabel: 'NAGYBETŰ',              onClick: () => startRound('cursive', 'upper') },
        ]}
        onBack={handleBack}
        onRepeat={() => speak('Melyik játékot választod?')}
      />
    )
  }

  const currentLetter = roundLettersRef.current[taskIndex]

  // ── TRACE GAME ──────────────────────────────────────────────────────────────

  if ((gameType === 'trace' || gameType === 'cursive') && currentLetter) {
    const isCursive = gameType === 'cursive'
    const borderClass = traceResult === 'correct' ? 'border-green-400'
      : traceResult === 'wrong' ? 'border-red-400'
      : 'border-gray-300'
    const statusText = traceResult === 'correct' ? '✓ Szuper indulás!'
      : traceResult === 'wrong' ? '↻ Próbáld újra!'
      : 'Rajzold!'
    const widthCapClass = isCursive ? 'max-w-[620px]' : 'max-w-[340px]'

    return (
      <TaskShell
        hue="purple"
        progressIndex={taskIndex}
        total={TASKS_PER_ROUND}
        onBack={handleBack}
        onRepeat={handleRepeat}
      >
        <div className="flex flex-col items-center justify-between h-full py-4 px-4">

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-purple-900 font-bold text-5xl">{currentLetter.letter}</span>
            <span className="text-gray-600 text-sm font-semibold bg-gray-100 rounded-xl px-3 py-1">
              {statusText}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={isCursive ? CURSIVE_W : CANVAS_SIZE}
            height={isCursive ? CURSIVE_H : CANVAS_SIZE}
            className={`w-full ${widthCapClass} touch-none rounded-3xl shadow-md border-4 bg-white flex-shrink-0 ${borderClass}`}
            style={{ transition: 'border-color 0.2s', aspectRatio: isCursive ? `${CURSIVE_W} / ${CURSIVE_H}` : '1 / 1' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          <div className={`flex gap-3 w-full ${widthCapClass} flex-shrink-0`}>
            <button onClick={() => { unlockAudio(); clearCanvas() }}
              className="flex-1 bg-gray-100 active:bg-gray-200 active:scale-95 text-gray-700 font-bold text-lg rounded-2xl py-3 border-2 border-gray-300 transition-transform">
              🗑️ Töröld!
            </button>
            <button onClick={() => { unlockAudio(); handleTraceNext() }}
              className="flex-[2] bg-purple-600 active:bg-purple-500 active:scale-95 text-white font-bold text-xl rounded-2xl py-3 border-2 border-purple-400 transition-transform shadow-lg">
              ⏭ Tovább
            </button>
          </div>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </TaskShell>
    )
  }

  // ── ORIENT GAME ─────────────────────────────────────────────────────────────

  if (!currentLetter) return <div className="w-screen h-screen bg-purple-600" />

  return (
    <TaskShell
      hue="purple"
      progressIndex={taskIndex}
      total={TASKS_PER_ROUND}
      onBack={handleBack}
      onRepeat={handleRepeat}
    >
      <div className="flex flex-col items-center justify-center h-full gap-10 px-6">

        <p className="text-purple-900 font-bold text-2xl text-center flex-shrink-0">
          Melyik a jó <span className="text-5xl">{currentLetter.letter}</span> betű?
        </p>

        <div className="flex gap-5 items-center flex-shrink-0">
          {orientOptions.map((opt, i) => {
            const isSel = orientSelected === i
            const isOk  = opt.isCorrect
            let cls = 'border-gray-200 bg-gray-50'
            if (isSel && isOk)   cls = 'border-green-400 bg-green-100 scale-110'
            if (isSel && !isOk)  cls = 'border-red-400 bg-red-100'
            if (orientResult !== 'idle' && !isSel) cls += ' opacity-40'
            return (
              <button key={i}
                onClick={() => { unlockAudio(); handleOrientTap(i) }}
                disabled={orientResult !== 'idle'}
                style={{ animation: isSel && !isOk ? 'shake-no 0.5s ease-out' : 'none' }}
                className={`rounded-3xl border-4 shadow-lg transition-all duration-200 p-1 ${cls}`}
              >
                <LetterCanvas def={currentLetter} transform={opt.transform} size={120} />
              </button>
            )
          })}
        </div>

      </div>
      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </TaskShell>
  )
}
