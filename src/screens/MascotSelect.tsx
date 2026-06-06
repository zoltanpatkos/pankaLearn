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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-teal-300 to-emerald-400 flex flex-col items-center justify-center p-5 gap-5">
      <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg text-center leading-tight">
        Válassz egy barátot! 🌟
      </h1>
      <p className="text-white/90 text-xl text-center drop-shadow">
        Koppints az egyik barátomra! 👆
      </p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
        {MASCOTS.map((mascot) => {
          const Illustration = mascot.Illustration
          const isActive = activeMascot === mascot.id
          return (
            <button
              key={mascot.id}
              onClick={() => handleSelect(mascot.id)}
              className={[
                'bg-gradient-to-b', mascot.cardBg,
                'rounded-3xl shadow-2xl p-4 flex flex-col items-center gap-3',
                'transition-transform duration-150 active:scale-95',
                isActive ? 'ring-4 ring-white ring-offset-2 scale-105' : 'hover:scale-102',
              ].join(' ')}
            >
              <div className="w-full aspect-square">
                <Illustration />
              </div>
              <p className="text-white font-bold text-2xl drop-shadow">{mascot.name}</p>
              <div className="bg-white/35 rounded-2xl px-4 py-2 w-full text-center">
                <p className="text-white font-semibold text-sm leading-snug">{mascot.catchphrase}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
