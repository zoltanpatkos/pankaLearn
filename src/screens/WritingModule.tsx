import { useState, useRef, useEffect, useCallback } from 'react'
import type { JSX } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak, speakEnglishPraise } from '../lib/tts'
import { unlockAudio } from '../lib/audio'
import { RewardOverlay } from '../components/RewardOverlay'
import { useRewards } from '../hooks/useRewards'
import { LETTER_DEFS, type LetterDef } from '../data/writingData'

interface Props {
  mascotId: MascotId
  lockedWardrobeItems: string[]
  onBack: () => void
  onRoundComplete: (unlockedItemId: string | null) => void
}

type GameType = 'trace' | 'orient'
type Phase = 'select' | 'game' | 'round-end'
type DirectionResult = 'idle' | 'correct' | 'wrong'

const TASKS_PER_ROUND = 5
const CANVAS_SIZE = 400
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
  const canvasRef         = useRef<HTMLCanvasElement>(null)
  const userStrokesRef    = useRef<{ x: number; y: number }[][]>([])
  const currentStrokeRef  = useRef<{ x: number; y: number }[]>([])
  const isDrawingRef      = useRef(false)
  const directionRef      = useRef<DirectionResult>('idle')  // live direction during stroke
  const traceResultRef    = useRef<DirectionResult>('idle')  // mirrors traceResult state
  const autoAdvanceRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const taskIndexRef      = useRef(0)  // mirrors taskIndex for use inside timeouts

  const syncSetTraceResult = (v: DirectionResult) => {
    traceResultRef.current = v
    setTraceResult(v)
  }

  const { activeReward, rewardKey, triggerMicro, triggerMedium, triggerError } = useRewards({
    onTreeLevelUp: () => {},
  })

  // Keep taskIndexRef in sync
  useEffect(() => { taskIndexRef.current = taskIndex }, [taskIndex])

  // ── Canvas draw ─────────────────────────────────────────────────────────────

  const redrawCanvas = useCallback((letter: LetterDef) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = CANVAS_SIZE
    const ctx = canvas.getContext('2d')!
    const q = (v: number) => v / 100 * s
    ctx.clearRect(0, 0, s, s)

    // Template letter (very light gray)
    ctx.save()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = s * 0.082
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    letter.draw(ctx, s)
    ctx.restore()

    // Direction arrows
    for (const arrow of letter.arrows) drawArrow(ctx, q(arrow.x), q(arrow.y), arrow.angle, s)

    // Start dot (green)
    ctx.beginPath()
    ctx.arc(q(letter.startX), q(letter.startY), s * 0.042, 0, Math.PI * 2)
    ctx.fillStyle = '#22c55e'; ctx.fill()

    // End dot (red)
    ctx.beginPath()
    ctx.arc(q(letter.endX), q(letter.endY), s * 0.034, 0, Math.PI * 2)
    ctx.fillStyle = '#ef4444'; ctx.fill()

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
      x: (e.clientX - rect.left) * (CANVAS_SIZE / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_SIZE / rect.height),
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
    // Compute live direction for real-time line coloring (no TTS, no state changes)
    directionRef.current = computeDirection(currentStrokeRef.current, letter.expectedAngle)
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

  const doAdvance = useCallback((correct: boolean) => {
    const nextIdx = taskIndexRef.current + 1
    if (nextIdx >= TASKS_PER_ROUND) {
      setTimeout(() => { triggerMedium(); setPhase('round-end') }, 900)
    } else {
      setTimeout(() => setTaskIndex(nextIdx), 600)
    }
    void correct
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
    setTimeout(() => redrawCanvas(letter), 30)
    // Speak instruction BEFORE drawing becomes active (speak is async, canvas shown after 30ms)
    speak(letter.ttsInstruction)
  }, [redrawCanvas])

  const setupOrientTask = useCallback((letter: LetterDef) => {
    const transforms: OrientTransform[] = shuffle(['normal', 'flip-x', 'rotate-180'] as OrientTransform[])
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
    if (gameType === 'trace') setupTraceTask(letter)
    else setupOrientTask(letter)
  }, [taskIndex, phase, gameType, setupTraceTask, setupOrientTask])

  // ── Round start / end ───────────────────────────────────────────────────────

  const startRound = (gt: GameType) => {
    unlockAudio()
    setGameType(gt)
    setTaskIndex(0)
    prevTaskRef.current = -1
    const letters = shuffle(LETTER_DEFS).slice(0, TASKS_PER_ROUND)
    roundLettersRef.current = letters
    setPhase('game')
    if (gt === 'trace') setupTraceTask(letters[0])
    else setupOrientTask(letters[0])
  }

  const handleRoundEnd = (again: boolean) => {
    unlockAudio()
    const unlocked = lockedWardrobeItems.length > 0
      ? lockedWardrobeItems[Math.floor(Math.random() * lockedWardrobeItems.length)]
      : null
    onRoundComplete(unlocked)
    if (unlocked) speak('Új ruha vár rád a szekrényben!')
    if (again) {
      startRound(gameType)
    } else {
      onBack()
    }
  }

  const handleBack = () => { unlockAudio(); speak('Visszamegyünk a kertbe!'); setTimeout(onBack, 600) }

  // ── Progress dots ───────────────────────────────────────────────────────────

  const ProgressDots = (): JSX.Element => (
    <div className="flex gap-2 flex-1 justify-center">
      {Array.from({ length: TASKS_PER_ROUND }, (_, i) => (
        <div key={i} className={[
          'w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-300',
          i < taskIndex   ? 'bg-yellow-400 border-yellow-300 scale-110' :
          i === taskIndex ? 'bg-white scale-110' : 'bg-white/30',
        ].join(' ')} />
      ))}
    </div>
  )

  // ── SELECT ──────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-rose-400 via-pink-400 to-fuchsia-400 flex flex-col">
        <div className="flex items-center px-4 pt-4 gap-3">
          <button onClick={handleBack}
            className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-rose-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform">
            ← Kert
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow flex-1 text-center pr-16">✏️ Írás</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-8 px-8 pb-8">
          <div className="w-36 h-36 drop-shadow-xl"><Illustration /></div>
          <p className="text-white font-bold text-2xl text-center drop-shadow">Melyik játékot választod?</p>
          <div className="flex gap-5 w-full max-w-sm">
            <button onClick={() => startRound('trace')}
              className="flex-1 flex flex-col items-center gap-3 bg-rose-300 active:bg-rose-200 rounded-3xl py-6 shadow-2xl border-4 border-rose-200 active:scale-95 transition-transform">
              <span className="text-5xl leading-none">✏️</span>
              <span className="text-rose-900 font-bold text-xl text-center">Rajzold!</span>
              <span className="text-rose-800 text-sm text-center px-2">Kövesd az ujjaddal!</span>
            </button>
            <button onClick={() => startRound('orient')}
              className="flex-1 flex flex-col items-center gap-3 bg-fuchsia-300 active:bg-fuchsia-200 rounded-3xl py-6 shadow-2xl border-4 border-fuchsia-200 active:scale-95 transition-transform">
              <span className="text-5xl leading-none">🔍</span>
              <span className="text-fuchsia-900 font-bold text-xl text-center">Melyik jó?</span>
              <span className="text-fuchsia-800 text-sm text-center px-2">Mutasd a helyest!</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ROUND-END ───────────────────────────────────────────────────────────────

  if (phase === 'round-end') {
    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-rose-400 to-fuchsia-500 flex flex-col items-center justify-center gap-8 px-8">
        <div className="text-[10rem] leading-none" style={{ animation: 'star-pop 1s ease-out forwards' }}>✏️</div>
        <p className="text-white font-bold text-3xl text-center drop-shadow-lg">
          {mascot.name} szerint<br />szuper voltál!
        </p>
        <div className="w-40 h-40 drop-shadow-2xl" style={{ animation: 'bounce-dance 0.5s ease-in-out infinite' }}>
          <Illustration />
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button onClick={() => handleRoundEnd(true)}
            className="bg-yellow-400 active:bg-yellow-300 active:scale-95 text-yellow-900 font-bold text-2xl rounded-3xl py-5 shadow-2xl border-4 border-yellow-300 transition-transform">
            🔄 Még egy kör!
          </button>
          <button onClick={() => handleRoundEnd(false)}
            className="bg-white/30 active:bg-white/50 active:scale-95 text-white font-bold text-xl rounded-3xl py-4 shadow-xl border-4 border-white/40 transition-transform">
            🌳 Vissza a kertbe
          </button>
        </div>
        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </div>
    )
  }

  const currentLetter = roundLettersRef.current[taskIndex]

  // ── TRACE GAME ──────────────────────────────────────────────────────────────

  if (gameType === 'trace' && currentLetter) {
    const borderClass = traceResult === 'correct' ? 'border-green-400'
      : traceResult === 'wrong' ? 'border-red-400'
      : 'border-white/80'
    const statusText = traceResult === 'correct' ? '✓ Szuper indulás!'
      : traceResult === 'wrong' ? '↻ Próbáld újra!'
      : 'Rajzold!'

    return (
      <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-rose-400 via-pink-300 to-rose-200 flex flex-col">
        <div className="flex items-center px-4 pt-4 gap-3 flex-shrink-0">
          <button onClick={handleBack}
            className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-rose-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform">
            ← Kert
          </button>
          <ProgressDots />
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50 shadow flex-shrink-0">
            <Illustration />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-between py-3 px-4 min-h-0">

          {/* Letter + status */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-white font-black text-5xl drop-shadow-lg">{currentLetter.letter}</span>
            <span className="text-white/90 text-sm font-semibold bg-white/25 rounded-xl px-3 py-1">
              {statusText}
            </span>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className={`w-full max-w-[340px] aspect-square touch-none rounded-3xl shadow-2xl border-4 bg-white flex-shrink-0 ${borderClass}`}
            style={{ transition: 'border-color 0.2s' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Buttons */}
          <div className="flex gap-3 w-full max-w-[340px] flex-shrink-0">
            <button onClick={() => { unlockAudio(); clearCanvas() }}
              className="flex-1 bg-white/40 active:bg-white/60 active:scale-95 text-white font-bold text-lg rounded-2xl py-3 border-2 border-white/50 transition-transform shadow">
              🗑️ Töröld!
            </button>
            <button onClick={() => { unlockAudio(); handleTraceNext() }}
              className="flex-[2] bg-rose-500 active:bg-rose-400 active:scale-95 text-white font-bold text-xl rounded-2xl py-3 border-2 border-rose-300 transition-transform shadow-xl">
              ⏭ Tovább
            </button>
          </div>
        </div>

        <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
      </div>
    )
  }

  // ── ORIENT GAME ─────────────────────────────────────────────────────────────

  if (!currentLetter) return <div className="w-screen h-screen bg-rose-400" />

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-fuchsia-400 via-purple-400 to-violet-400 flex flex-col">
      <div className="flex items-center px-4 pt-4 gap-3 flex-shrink-0">
        <button onClick={handleBack}
          className="bg-white/80 active:bg-white rounded-2xl px-4 py-2.5 text-fuchsia-900 font-bold text-lg shadow border-2 border-white/60 active:scale-95 transition-transform">
          ← Kert
        </button>
        <ProgressDots />
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50 shadow flex-shrink-0">
          <Illustration />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 min-h-0">
        <p className="text-white font-bold text-2xl text-center drop-shadow flex-shrink-0">
          Melyik a jó <span className="text-5xl">{currentLetter.letter}</span> betű?
        </p>

        <div className="flex gap-5 items-center flex-shrink-0">
          {orientOptions.map((opt, i) => {
            const isSel = orientSelected === i
            const isOk  = opt.isCorrect
            let cls = 'border-white/60 bg-white'
            if (isSel && isOk)   cls = 'border-green-400 bg-green-100 scale-110'
            if (isSel && !isOk)  cls = 'border-red-400 bg-red-100'
            if (orientResult !== 'idle' && !isSel) cls += ' opacity-40'
            return (
              <button key={i}
                onClick={() => { unlockAudio(); handleOrientTap(i) }}
                disabled={orientResult !== 'idle'}
                style={{ animation: isSel && !isOk ? 'shake-no 0.5s ease-out' : 'none' }}
                className={`rounded-3xl border-4 shadow-xl transition-all duration-200 p-1 ${cls}`}
              >
                <LetterCanvas def={currentLetter} transform={opt.transform} size={120} />
              </button>
            )
          })}
        </div>

        <div className="h-4 flex-shrink-0" />
      </div>

      <RewardOverlay type={activeReward} rewardKey={rewardKey} mascotId={mascotId} />
    </div>
  )
}
