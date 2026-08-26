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
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: '#f0f9ff' }}
    >
      {/* Large illustration */}
      <div className="w-[180px] h-[180px]">
        <Illustration />
      </div>

      {/* Text */}
      <div className="text-center">
        <h1 className="text-[28px] font-bold text-[#0c4a6e]">
          Ő legyen a barátod?
        </h1>
        <p className="text-[20px] font-bold text-[#0c4a6e] mt-1">{mascot.name}</p>
        <p className="text-[14px] font-medium text-[#475569] mt-0.5" style={{ opacity: 0.7 }}>
          {mascot.animal}
        </p>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onConfirm}
        style={{ borderRadius: '22px', boxShadow: 'var(--sh-1)' }}
        className="w-full max-w-xs bg-violet-600 active:bg-violet-500 active:scale-95 text-white font-bold text-[22px] py-6 transition-transform"
      >
        Igen, ő! ✅
      </button>

      {/* Back link */}
      <button
        onClick={onBack}
        className="text-sky-700 text-[16px] font-medium py-2 px-4 active:opacity-60 transition-opacity"
        style={{ opacity: 0.65 }}
      >
        ← Másik barátot választok
      </button>
    </div>
  )
}
