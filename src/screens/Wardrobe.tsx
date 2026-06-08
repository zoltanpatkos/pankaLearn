import { useState, useEffect } from 'react'
import type { JSX } from 'react'
import { WARDROBE_ITEMS, type WardrobeCategory } from '../data/wardrobeItems'
import { type WardrobeState } from '../lib/wardrobe'
import { PankaAvatarDressable } from '../components/PankaAvatarDressable'
import { speak } from '../lib/tts'

interface Props {
  wardrobeState: WardrobeState
  onBack: () => void
  onEquip: (itemId: string, category: WardrobeCategory) => void
}

type TabId = WardrobeCategory

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'outfit',    label: 'Ruha',       emoji: '👗' },
  { id: 'hair',      label: 'Haj',        emoji: '💇' },
  { id: 'accessory', label: 'Kiegészítő', emoji: '✨' },
  { id: 'footwear',  label: 'Lábbeli',    emoji: '👠' },
]

export function Wardrobe({ wardrobeState, onBack, onEquip }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>('outfit')

  useEffect(() => {
    speak('Ez a te szekrényed! Öltöztesd fel magad!')
  }, [])

  const { equipped, unlockedItems } = wardrobeState

  const handleEquip = (itemId: string, category: WardrobeCategory, isLocked: boolean): void => {
    if (isLocked) return
    onEquip(itemId, category)
    speak('De szép vagy!')
  }

  const visibleItems = WARDROBE_ITEMS.filter(i => i.category === activeTab)

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100">

      {/* ── Decorative background circles ── */}
      <div className="absolute top-[-60px] right-[-60px] w-56 h-56 rounded-full bg-purple-200 opacity-40" />
      <div className="absolute bottom-[-40px] left-[-40px] w-44 h-44 rounded-full bg-pink-200 opacity-40" />

      {/* ── Header ── */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 gap-3 bg-white/50 backdrop-blur-sm border-b border-white/60 z-10">
        <button
          onClick={onBack}
          className="bg-white/80 active:bg-white rounded-2xl px-4 py-2 text-purple-900 font-bold text-lg shadow border-2 border-white/60 transition-transform active:scale-95"
        >
          ← Kert
        </button>
        <h1 className="text-2xl font-bold text-purple-900 flex-1 text-center pr-16">
          👗 Ruhatár
        </h1>
      </div>

      {/* ── Main area (below header) ── */}
      <div className="absolute top-16 left-0 right-0 bottom-0 flex">

        {/* ── Left: Avatar preview ── */}
        <div className="w-[38%] flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-48 h-[340px] drop-shadow-2xl">
            <PankaAvatarDressable equipped={equipped} />
          </div>
          <p className="text-purple-700 font-semibold text-base text-center">Panka</p>
        </div>

        {/* ── Right: Tabs + Grid ── */}
        <div className="flex-1 flex flex-col pt-3 pb-4 pr-4 gap-3">

          {/* Category tabs */}
          <div className="flex gap-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-2.5 font-bold text-sm transition-transform active:scale-95 shadow border-2',
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white border-purple-400 shadow-purple-200'
                    : 'bg-white/70 text-purple-800 border-white/60',
                ].join(' ')}
              >
                <span className="text-lg">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3 pb-2">
              {visibleItems.map(item => {
                const isLocked   = !unlockedItems.includes(item.id)
                const isEquipped = equipped[item.category] === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(item.id, item.category, isLocked)}
                    className={[
                      'relative flex flex-col items-center justify-center gap-1.5 rounded-3xl py-3 px-2',
                      'border-4 shadow-lg transition-transform active:scale-95',
                      isEquipped
                        ? 'bg-purple-400 border-purple-300 shadow-purple-300'
                        : 'bg-white/80 border-white/60',
                      isLocked ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    <span className="text-4xl leading-none">{item.emoji}</span>
                    <span className={[
                      'text-xs font-semibold leading-tight text-center',
                      isEquipped ? 'text-white' : 'text-purple-900',
                    ].join(' ')}>
                      {item.name}
                    </span>
                    {isLocked && (
                      <span className="absolute top-1.5 right-2 text-base">🔒</span>
                    )}
                    {isEquipped && (
                      <span className="absolute top-1.5 left-2 text-sm">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
