import { useState } from 'react'
import type { JSX } from 'react'

interface Props {
  onBack: () => void
  onMascotReset: () => void
}

type Color = 'yellow' | 'blue' | 'red'
type ParentTab = 'mascot' | 'praises' | 'progress' | 'difficulty'

const SEQUENCE: Color[] = ['yellow', 'blue', 'red']

const COLOR_CONFIG: Record<Color, { bg: string; label: string }> = {
  yellow: { bg: 'bg-yellow-400', label: 'Sárga' },
  blue:   { bg: 'bg-blue-500',   label: 'Kék'   },
  red:    { bg: 'bg-red-500',    label: 'Piros'  },
}

const TABS: { id: ParentTab; emoji: string; label: string }[] = [
  { id: 'mascot',     emoji: '🐾', label: 'Kabala'     },
  { id: 'praises',    emoji: '💬', label: 'Dicséretek' },
  { id: 'progress',   emoji: '📊', label: 'Haladás'    },
  { id: 'difficulty', emoji: '⚙️', label: 'Nehézség'   },
]

const DEFAULT_PRAISES = [
  'Szuper voltál!', 'Fantasztikus!', 'Menő vagy!', 'Brávó, brávó!',
  'Klassz!', 'Te vagy a legjobb!', 'Mesés!', 'Nagyon ügyes voltál!',
]

const MODULE_PROGRESS = [
  { key: 'mathFlowers',    emoji: '🌷', name: 'Matek'   },
  { key: 'readingFlowers', emoji: '🌻', name: 'Olvasás' },
  { key: 'writingFlowers', emoji: '🌹', name: 'Írás'    },
  { key: 'englishFlowers', emoji: '🌺', name: 'Angol'   },
]

function loadCustomPraises(): string[] {
  try { return JSON.parse(localStorage.getItem('customPraises') ?? '[]') } catch { return [] }
}

export function ParentLock({ onBack, onMascotReset }: Props): JSX.Element {
  const [progress, setProgress]   = useState(0)
  const [unlocked, setUnlocked]   = useState(false)
  const [shakeKey, setShakeKey]   = useState(0)
  const [activeTab, setActiveTab] = useState<ParentTab>('mascot')

  // Kabala tab
  const [confirmed, setConfirmed] = useState(false)

  // Dicséretek tab
  const [customPraises, setCustomPraises] = useState<string[]>(loadCustomPraises)
  const [newPraise, setNewPraise]         = useState('')

  // Nehézség tab
  const [mathMax, setMathMax] = useState<'5' | '10'>(
    () => (localStorage.getItem('mathMaxCount') as '5' | '10') ?? '10'
  )

  const handleColorTap = (color: Color): void => {
    if (unlocked) return
    if (color === SEQUENCE[progress]) {
      const next = progress + 1
      if (next >= SEQUENCE.length) { setProgress(SEQUENCE.length); setUnlocked(true) }
      else setProgress(next)
    } else {
      setShakeKey(k => k + 1)
      setProgress(0)
    }
  }

  const handleMascotReset = (): void => {
    localStorage.removeItem('mascot')
    onMascotReset()
  }

  const handleAddPraise = (): void => {
    const trimmed = newPraise.trim()
    if (!trimmed) return
    const updated = [...customPraises, trimmed]
    setCustomPraises(updated)
    localStorage.setItem('customPraises', JSON.stringify(updated))
    setNewPraise('')
  }

  const handleRemovePraise = (idx: number): void => {
    const updated = customPraises.filter((_, i) => i !== idx)
    setCustomPraises(updated)
    localStorage.setItem('customPraises', JSON.stringify(updated))
  }

  const handleMathMax = (val: '5' | '10'): void => {
    setMathMax(val)
    localStorage.setItem('mathMaxCount', val)
  }

  // ── LOCKED ─────────────────────────────────────────────────────────────────

  if (!unlocked) {
    return (
      <div
        className="w-screen h-screen flex flex-col items-center justify-center gap-8 px-6 select-none"
        style={{ background: '#0f172a' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">🔒</span>
          <h1 className="text-white font-bold text-3xl text-center">Szülői beállítások</h1>
          <p className="text-white/60 text-base text-center">
            Nyomd meg sorban: sárga → kék → piros
          </p>
        </div>

        <div
          key={shakeKey}
          className="flex gap-3"
          style={{ animation: shakeKey > 0 ? 'shake-no 0.4s ease-out' : 'none' }}
        >
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

        <div className="flex gap-6">
          {(['yellow', 'blue', 'red'] as Color[]).map(color => (
            <button
              key={color}
              onClick={() => handleColorTap(color)}
              className={`w-24 h-24 rounded-3xl shadow-2xl transition-transform active:scale-90 duration-100 ${COLOR_CONFIG[color].bg}`}
              aria-label={COLOR_CONFIG[color].label}
            />
          ))}
        </div>

        <button
          onClick={onBack}
          className="text-white/50 text-base py-2 px-4 active:text-white/80 transition-colors"
        >
          ← Vissza
        </button>
      </div>
    )
  }

  // ── UNLOCKED ───────────────────────────────────────────────────────────────

  return (
    <div className="w-screen h-screen flex flex-col select-none" style={{ background: '#0f172a' }}>

      {/* Header */}
      <div className="flex-none flex items-center justify-between px-5 pt-6 pb-3">
        <button
          onClick={onBack}
          className="text-white/50 text-base active:text-white/80 transition-colors"
        >
          ← Vissza
        </button>
        <span className="text-green-400 font-bold text-base">✓ Feloldva</span>
        <div className="w-16" />
      </div>

      {/* Tab strip */}
      <div className="flex-none flex gap-1.5 px-4 pb-3">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ borderRadius: '14px' }}
            className={[
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-white/15 text-white'
                : 'text-white/35 active:text-white/60',
            ].join(' ')}
          >
            <span className="text-xl leading-none">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">

        {/* ── KABALA ─────────────────────────────────────────────────── */}
        {activeTab === 'mascot' && !confirmed && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-white/50 text-sm">
              Töröld a kabala-választást — Panka újra választhat egyet.
            </p>
            <button
              onClick={() => setConfirmed(true)}
              style={{ borderRadius: '22px', boxShadow: 'var(--sh-1)' }}
              className="w-full bg-orange-500 active:bg-orange-400 active:scale-95 text-white font-bold text-xl py-5 transition-transform"
            >
              🔄 Kabala csere
            </button>
          </div>
        )}

        {activeTab === 'mascot' && confirmed && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-white font-bold text-lg text-center leading-snug">
              Biztosan törli a kabalát?<br />
              <span className="text-white/50 text-base font-normal">Panka újra választhat egyet.</span>
            </p>
            <button
              onClick={handleMascotReset}
              style={{ borderRadius: '22px' }}
              className="w-full bg-red-500 active:bg-red-400 active:scale-95 text-white font-bold text-xl py-5 transition-transform"
            >
              Igen, törlöm
            </button>
            <button
              onClick={() => setConfirmed(false)}
              style={{ borderRadius: '22px', border: '1.5px solid rgba(255,255,255,0.18)' }}
              className="w-full bg-white/10 active:bg-white/18 active:scale-95 text-white font-semibold text-lg py-4 transition-transform"
            >
              Mégsem
            </button>
          </div>
        )}

        {/* ── DICSÉRETEK ─────────────────────────────────────────────── */}
        {activeTab === 'praises' && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-white/50 text-sm">Alapkészlet (csak olvasható):</p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_PRAISES.map((p, i) => (
                <span
                  key={i}
                  style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}
                  className="bg-white/8 text-white/65 text-sm font-medium px-3 py-1.5"
                >
                  {p}
                </span>
              ))}
            </div>

            {customPraises.length > 0 && (
              <>
                <p className="text-white/50 text-sm">Egyedi dicséretek:</p>
                <div className="flex flex-col gap-2">
                  {customPraises.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        style={{ borderRadius: '12px' }}
                        className="flex-1 bg-white/12 text-white text-sm font-medium px-3 py-2"
                      >
                        {p}
                      </span>
                      <button
                        onClick={() => handleRemovePraise(i)}
                        className="text-white/35 active:text-red-400 text-base px-2 py-1 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newPraise}
                onChange={e => setNewPraise(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddPraise() }}
                placeholder="Új dicséret..."
                autoComplete="off"
                style={{ borderRadius: '14px', border: '1.5px solid rgba(255,255,255,0.18)' }}
                className="flex-1 bg-white/10 text-white text-sm font-medium px-4 py-3 placeholder:text-white/25 outline-none focus:border-white/35"
              />
              <button
                onClick={handleAddPraise}
                style={{ borderRadius: '14px' }}
                className="bg-violet-600 active:bg-violet-500 text-white font-bold px-4 py-3 text-sm transition-colors"
              >
                + Hozzá
              </button>
            </div>
          </div>
        )}

        {/* ── HALADÁS ────────────────────────────────────────────────── */}
        {activeTab === 'progress' && (
          <div className="flex flex-col gap-5 pt-2">
            <p className="text-white/50 text-sm">Összesített virágok modulonként:</p>
            {MODULE_PROGRESS.map(mod => {
              const count = Math.min(Number(localStorage.getItem(mod.key)) || 0, 8)
              const pct   = Math.round((count / 8) * 100)
              return (
                <div key={mod.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-base">
                      {mod.emoji} {mod.name}
                    </span>
                    <span className="text-white/50 text-sm">{count} / 8</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/55 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── NEHÉZSÉG ───────────────────────────────────────────────── */}
        {activeTab === 'difficulty' && (
          <div className="flex flex-col gap-6 pt-2">

            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold text-base">Matek — Számolj! tartomány</p>
              <p className="text-white/40 text-xs">A Villám! játék mindig 1–5-ig megy.</p>
              <div className="flex gap-2 mt-1">
                {(['5', '10'] as const).map(val => (
                  <button
                    key={val}
                    onClick={() => handleMathMax(val)}
                    style={{ borderRadius: '14px' }}
                    className={[
                      'flex-1 py-3.5 font-bold text-base transition-colors',
                      mathMax === val
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/10 text-white/50 active:bg-white/18',
                    ].join(' ')}
                  >
                    1 – {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold text-base">Olvasás szint</p>
              <p className="text-white/35 text-sm italic">Hamarosan...</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold text-base">Angol szókészlet</p>
              <p className="text-white/35 text-sm italic">Hamarosan...</p>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
