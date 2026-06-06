import { useEffect, useState } from 'react'
import { MascotSelect } from './screens/MascotSelect'
import { MascotConfirm } from './screens/MascotConfirm'
import { Garden } from './screens/Garden'
import type { MascotId } from './mascots'

type Screen = 'mascot-select' | 'mascot-confirm' | 'garden'

async function enterFullscreen(): Promise<void> {
  if (document.fullscreenElement) return
  try {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    localStorage.setItem('fullscreenEnabled', 'true')
  } catch { /* Silently ignore if fullscreen is unavailable */ }
}

export default function App() {
  const [currentMascot, setCurrentMascot] = useState<MascotId | null>(
    () => localStorage.getItem('mascot') as MascotId | null
  )
  const [pendingMascot, setPendingMascot] = useState<MascotId | null>(null)
  const [screen, setScreen] = useState<Screen>(
    () => (localStorage.getItem('mascot') ? 'garden' : 'mascot-select')
  )
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const handleMascotSelect = (id: MascotId) => {
    setPendingMascot(id)
    setScreen('mascot-confirm')
  }

  const handleMascotConfirm = () => {
    if (!pendingMascot) return
    localStorage.setItem('mascot', pendingMascot)
    setCurrentMascot(pendingMascot)
    setScreen('garden')
  }

  const activeMascot = currentMascot ?? pendingMascot

  return (
    <>
      {screen === 'mascot-select' && (
        <MascotSelect onSelect={handleMascotSelect} onFirstInteraction={enterFullscreen} />
      )}
      {screen === 'mascot-confirm' && pendingMascot && (
        <MascotConfirm
          mascotId={pendingMascot}
          onConfirm={handleMascotConfirm}
          onBack={() => setScreen('mascot-select')}
        />
      )}
      {screen === 'garden' && activeMascot && (
        <Garden mascotId={activeMascot} />
      )}

      {/* Restore fullscreen button — shown when accidentally exited (Android back button) */}
      {!isFullscreen && (
        <button
          onClick={enterFullscreen}
          className="fixed bottom-4 right-4 bg-black/40 active:bg-black/60 text-white text-2xl w-14 h-14 rounded-xl flex items-center justify-center shadow-lg z-50"
          aria-label="Teljes képernyő"
        >
          ⛶
        </button>
      )}
    </>
  )
}
