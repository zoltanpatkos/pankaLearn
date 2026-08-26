import { useEffect, useRef, useState } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak } from '../lib/tts'

interface Props {
  onSelect: (id: MascotId) => void
  onFirstInteraction: () => Promise<void>
}

const CARD_STYLES: Record<MascotId, { illustBg: string; ring: string; dotColor: string }> = {
  balamber: { illustBg: 'linear-gradient(160deg,#fde68a,#fbbf24)', ring: 'rgba(251,191,36,0.6)',  dotColor: '#f59e0b' },
  kifli:    { illustBg: 'linear-gradient(160deg,#fbcfe8,#f472b6)', ring: 'rgba(244,114,182,0.6)', dotColor: '#f472b6' },
  bolyhos:  { illustBg: 'linear-gradient(160deg,#fef9c3,#facc15)', ring: 'rgba(250,204,21,0.6)',  dotColor: '#facc15' },
}

export function MascotSelect({ onSelect, onFirstInteraction }: Props) {
  const [activeMascot, setActiveMascot] = useState<MascotId | null>(null)
  const selectingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    speak('Válassz egy barátot!')
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const handleSelect = async (id: MascotId) => {
    if (selectingRef.current) return
    selectingRef.current = true
    await onFirstInteraction()
    setActiveMascot(id)
    const mascot = MASCOTS.find(m => m.id === id)!
    speak(mascot.intro)
    timeoutRef.current = setTimeout(() => onSelect(id), 700)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom,#e0f2fe 0%,#f0f9ff 30%,#f0f9ff 100%)' }}
    >
      {/* Sun decoration */}
      <div
        className="absolute top-8 right-8 w-16 h-16 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#fde68a,rgba(253,224,71,0))', opacity: 0.6 }}
      />

      {/* Title */}
      <div className="text-center relative z-10">
        <h1 className="text-[36px] font-bold text-[#0c4a6e] leading-tight tracking-tight">
          Válassz egy barátot
        </h1>
        <p className="text-[16px] font-medium text-sky-700 mt-1" style={{ opacity: 0.7 }}>
          Koppints valamelyikre
        </p>
      </div>

      {/* Mascot cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xl relative z-10">
        {MASCOTS.map(mascot => {
          const Illustration = mascot.Illustration
          const isActive = activeMascot === mascot.id
          const isOther = activeMascot !== null && !isActive
          const cs = CARD_STYLES[mascot.id]
          return (
            <button
              key={mascot.id}
              onClick={() => handleSelect(mascot.id)}
              style={{
                borderRadius: '22px',
                boxShadow: isActive
                  ? `0 14px 28px -16px rgba(15,23,42,.3), 0 0 0 3px ${cs.ring}`
                  : '0 14px 28px -16px rgba(15,23,42,.25)',
                transform: isActive ? 'translateY(-6px)' : 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                opacity: isOther ? 0.6 : 1,
              }}
              className="bg-white flex flex-col items-center gap-2 py-5 px-3"
            >
              {/* Illustration in hue circle */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: cs.illustBg }}
              >
                <div className="w-16 h-16">
                  <Illustration />
                </div>
              </div>

              {/* Name */}
              <p className="text-[18px] font-bold text-[#0c4a6e] leading-tight">{mascot.name}</p>

              {/* Animal */}
              <p className="text-[11px] font-medium text-[#475569]" style={{ opacity: 0.7 }}>
                {mascot.animal}
              </p>

              {/* Hue dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: cs.dotColor }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
