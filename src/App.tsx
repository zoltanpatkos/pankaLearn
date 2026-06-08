import { useEffect, useState } from 'react'
import { MascotSelect } from './screens/MascotSelect'
import { MascotConfirm } from './screens/MascotConfirm'
import { Garden } from './screens/Garden'
import { Wardrobe } from './screens/Wardrobe'
import { MathModule } from './screens/MathModule'
import { ReadingModule } from './screens/ReadingModule'
import { EnglishModule } from './screens/EnglishModule'
import type { MascotId } from './mascots'
import {
  loadWardrobeState,
  saveWardrobeState,
  equipItem,
  unlockItem,
  type WardrobeState,
} from './lib/wardrobe'
import { WARDROBE_ITEMS, type WardrobeCategory } from './data/wardrobeItems'

type Screen = 'mascot-select' | 'mascot-confirm' | 'garden' | 'wardrobe' | 'math' | 'reading' | 'english'

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
  const [wardrobeState, setWardrobeState] = useState<WardrobeState>(loadWardrobeState)
  const [mathFlowers, setMathFlowers] = useState(
    () => Number(localStorage.getItem('mathFlowers')) || 0
  )
  const [readingFlowers, setReadingFlowers] = useState(
    () => Number(localStorage.getItem('readingFlowers')) || 0
  )
  const [englishFlowers, setEnglishFlowers] = useState(
    () => Number(localStorage.getItem('englishFlowers')) || 0
  )

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

  const handleEquip = (itemId: string, category: WardrobeCategory): void => {
    const next = equipItem(itemId, category, wardrobeState)
    setWardrobeState(next)
    saveWardrobeState(next)
  }

  const handleRoundComplete = (unlockedItemId: string | null): void => {
    if (unlockedItemId) {
      const next = unlockItem(unlockedItemId, wardrobeState)
      setWardrobeState(next)
      saveWardrobeState(next)
    }
    const next = Math.min(mathFlowers + 1, 8)
    localStorage.setItem('mathFlowers', String(next))
    setMathFlowers(next)
  }

  const handleReadingRoundComplete = (unlockedItemId: string | null): void => {
    if (unlockedItemId) {
      const next = unlockItem(unlockedItemId, wardrobeState)
      setWardrobeState(next)
      saveWardrobeState(next)
    }
    const next = Math.min(readingFlowers + 1, 8)
    localStorage.setItem('readingFlowers', String(next))
    setReadingFlowers(next)
  }

  const handleEnglishRoundComplete = (unlockedItemId: string | null): void => {
    if (unlockedItemId) {
      const next = unlockItem(unlockedItemId, wardrobeState)
      setWardrobeState(next)
      saveWardrobeState(next)
    }
    const next = Math.min(englishFlowers + 1, 8)
    localStorage.setItem('englishFlowers', String(next))
    setEnglishFlowers(next)
  }

  const lockedWardrobeItems = WARDROBE_ITEMS
    .filter(item => !wardrobeState.unlockedItems.includes(item.id))
    .map(item => item.id)

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
        <Garden
          mascotId={activeMascot}
          equippedItems={wardrobeState.equipped}
          mathFlowers={mathFlowers}
          readingFlowers={readingFlowers}
          englishFlowers={englishFlowers}
          onOpenWardrobe={() => setScreen('wardrobe')}
          onOpenMath={() => setScreen('math')}
          onOpenReading={() => setScreen('reading')}
          onOpenEnglish={() => setScreen('english')}
        />
      )}
      {screen === 'wardrobe' && activeMascot && (
        <Wardrobe
          wardrobeState={wardrobeState}
          onBack={() => setScreen('garden')}
          onEquip={handleEquip}
        />
      )}
      {screen === 'math' && activeMascot && (
        <MathModule
          mascotId={activeMascot}
          lockedWardrobeItems={lockedWardrobeItems}
          onBack={() => setScreen('garden')}
          onRoundComplete={handleRoundComplete}
        />
      )}
      {screen === 'reading' && activeMascot && (
        <ReadingModule
          mascotId={activeMascot}
          lockedWardrobeItems={lockedWardrobeItems}
          onBack={() => setScreen('garden')}
          onRoundComplete={handleReadingRoundComplete}
        />
      )}
      {screen === 'english' && activeMascot && (
        <EnglishModule
          mascotId={activeMascot}
          lockedWardrobeItems={lockedWardrobeItems}
          onBack={() => setScreen('garden')}
          onRoundComplete={handleEnglishRoundComplete}
        />
      )}

      {/* Restore fullscreen button */}
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
