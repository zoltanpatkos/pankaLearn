import { useEffect } from 'react'
import { MASCOTS, type MascotId } from '../mascots'
import { speak } from '../lib/tts'

interface Props {
  mascotId: MascotId
  onConfirm: () => void
  onBack: () => void
}

export function MascotConfirm({ mascotId, onConfirm, onBack }: Props) {
  const mascot = MASCOTS.find(m => m.id === mascotId)!
  const Illustration = mascot.Illustration

  useEffect(() => {
    speak(mascot.confirmSpeech)
  }, [mascotId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`min-h-screen bg-gradient-to-b ${mascot.cardBg} flex flex-col items-center justify-center p-8 gap-6`}>
      <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg text-center">
        Biztos ezt választod? 🤔
      </h1>

      <div className="w-44 h-44 lg:w-56 lg:h-56">
        <Illustration />
      </div>

      <div className="text-center">
        <p className="text-white font-bold text-3xl drop-shadow">{mascot.name}</p>
        <p className="text-white/80 text-xl mt-1">{mascot.animal}</p>
        <p className="text-white font-semibold text-xl mt-3">„{mascot.catchphrase}"</p>
      </div>

      <button
        onClick={onConfirm}
        className="bg-white text-purple-700 font-bold text-3xl py-6 px-16 rounded-3xl shadow-2xl active:scale-95 transition-transform min-h-[80px]"
      >
        Igen! ✅
      </button>

      {/* Subtle back option — not prominent, to discourage accidental changes */}
      <button
        onClick={onBack}
        className="text-white/65 text-lg py-3 px-6 rounded-xl active:text-white transition-colors"
      >
        ← Másik barátot választok
      </button>
    </div>
  )
}
