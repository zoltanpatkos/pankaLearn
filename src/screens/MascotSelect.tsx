import { useEffect, useRef, useState } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak } from '../lib/tts'

interface Props {
  onSelect: (id: MascotId) => void
  onFirstInteraction: () => Promise<void>
}

export function MascotSelect({ onSelect, onFirstInteraction }: Props) {
  const [activeMascot, setActiveMascot] = useState<MascotId | null>(null)
  const selectingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    speak('Válassz egy barátot!')
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-teal-300 flex flex-col items-center justify-center p-5 gap-6">
      <h1 className="text-5xl lg:text-6xl font-black text-white drop-shadow-lg text-center leading-tight tracking-tight">
        Válassz egy barátot! 🌟
      </h1>
      <p className="text-white font-bold text-2xl text-center drop-shadow">
        👆 Koppints valamelyikre!
      </p>

      <div className="grid grid-cols-3 gap-5 w-full max-w-5xl">
        {MASCOTS.map((mascot) => {
          const Illustration = mascot.Illustration
          const isActive = activeMascot === mascot.id
          return (
            <button
              key={mascot.id}
              onClick={() => handleSelect(mascot.id)}
              style={isActive ? { animation: 'card-pulse 0.7s ease-in-out infinite' } : undefined}
              className={[
                'bg-gradient-to-b', mascot.cardBg,
                'rounded-[2rem] shadow-2xl p-5 flex flex-col items-center gap-3',
                'border-4',
                isActive ? 'border-white shadow-white/40' : 'border-white/40 active:scale-95 transition-transform duration-150',
              ].join(' ')}
            >
              <div className="w-full aspect-square drop-shadow-xl">
                <Illustration />
              </div>
              <p className="text-white font-black text-3xl drop-shadow-lg">{mascot.name}</p>
              <div className="bg-white/40 rounded-2xl px-4 py-2 w-full text-center border border-white/50">
                <p className="text-white font-bold text-base leading-snug drop-shadow">{mascot.catchphrase}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
