import { useState } from 'react'
import type { JSX } from 'react'

interface Props {
  onBack: () => void
  onMascotReset: () => void
}

type Color = 'yellow' | 'blue' | 'red'
const SEQUENCE: Color[] = ['yellow', 'blue', 'red']

const COLOR_CONFIG: Record<Color, { bg: string; activeBg: string; label: string; emoji: string }> = {
  yellow: { bg: 'bg-yellow-400 border-yellow-300', activeBg: 'bg-yellow-300', label: 'Sárga',  emoji: '🟡' },
  blue:   { bg: 'bg-blue-500 border-blue-400',     activeBg: 'bg-blue-400',   label: 'Kék',    emoji: '🔵' },
  red:    { bg: 'bg-red-500 border-red-400',        activeBg: 'bg-red-400',    label: 'Piros',  emoji: '🔴' },
}

export function ParentLock({ onBack, onMascotReset }: Props): JSX.Element {
  const [progress, setProgress] = useState(0)   // 0–3 helyes taps
  const [unlocked, setUnlocked] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  const handleColorTap = (color: Color): void => {
    if (unlocked) return
    if (color === SEQUENCE[progress]) {
      const next = progress + 1
      if (next >= SEQUENCE.length) {
        setProgress(SEQUENCE.length)
        setUnlocked(true)
      } else {
        setProgress(next)
      }
    } else {
      // Hibás — reset + shake
      setShakeKey(k => k + 1)
      setProgress(0)
    }
  }

  const handleMascotReset = (): void => {
    localStorage.removeItem('mascot')
    onMascotReset()
  }

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 px-6 select-none">

      {/* Fejléc */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl">🔒</span>
        <h1 className="text-white font-black text-3xl text-center">Szülői beállítások</h1>
        {!unlocked && (
          <p className="text-white/60 text-base text-center">
            Nyomd meg sorban: sárga → kék → piros
          </p>
        )}
      </div>

      {/* Haladásjelző */}
      {!unlocked && (
        <div key={shakeKey} className="flex gap-3" style={{ animation: shakeKey > 0 ? 'shake-no 0.4s ease-out' : 'none' }}>
          {SEQUENCE.map((_, i) => (
            <div
              key={i}
              className={[
                'w-5 h-5 rounded-full border-2 transition-all duration-200',
                i < progress ? 'bg-green-400 border-green-300 scale-125' : 'bg-white/20 border-white/30',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {/* Szín gombok */}
      {!unlocked && (
        <div className="flex gap-6">
          {(['yellow', 'blue', 'red'] as Color[]).map(color => {
            const cfg = COLOR_CONFIG[color]
            return (
              <button
                key={color}
                onClick={() => handleColorTap(color)}
                className={[
                  'w-24 h-24 rounded-3xl border-4 shadow-2xl',
                  'transition-transform active:scale-90 duration-100',
                  cfg.bg,
                ].join(' ')}
                aria-label={cfg.label}
              />
            )
          })}
        </div>
      )}

      {/* Feloldva — akciók */}
      {unlocked && !confirmed && (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
            <span>✓</span><span>Feloldva</span>
          </div>

          <button
            onClick={() => setConfirmed(true)}
            className="w-full bg-orange-500 active:bg-orange-400 active:scale-95 text-white font-black text-xl rounded-3xl py-5 shadow-2xl border-4 border-orange-400 transition-transform"
          >
            🔄 Kabala csere
          </button>
        </div>
      )}

      {/* Megerősítés */}
      {confirmed && (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <p className="text-white font-bold text-lg text-center leading-snug">
            Biztosan törli a kabalát?<br/>
            <span className="text-white/60 text-base font-normal">Panka újra választhat egyet.</span>
          </p>
          <button
            onClick={handleMascotReset}
            className="w-full bg-red-500 active:bg-red-400 active:scale-95 text-white font-black text-xl rounded-3xl py-5 shadow-2xl border-4 border-red-400 transition-transform"
          >
            Igen, törlöm
          </button>
          <button
            onClick={() => setConfirmed(false)}
            className="w-full bg-white/15 active:bg-white/25 active:scale-95 text-white font-bold text-lg rounded-3xl py-4 border-2 border-white/20 transition-transform"
          >
            Mégsem
          </button>
        </div>
      )}

      {/* Vissza gomb */}
      <button
        onClick={onBack}
        className="bg-white/15 active:bg-white/25 active:scale-95 text-white font-bold text-lg rounded-2xl px-8 py-3 border-2 border-white/20 transition-transform"
      >
        ← Vissza
      </button>

    </div>
  )
}
