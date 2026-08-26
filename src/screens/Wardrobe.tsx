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

const TABS: { id: TabId; label: string }[] = [
  { id: 'outfit',    label: '👗 Ruha' },
  { id: 'hair',      label: '💇 Haj' },
  { id: 'accessory', label: '✨ Extra' },
  { id: 'footwear',  label: '👠 Cipő' },
]

export function Wardrobe({ wardrobeState, onBack, onEquip }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>('outfit')

  useEffect(() => {
    speak('Ez a te szekrényed! Öltöztesd fel magad!')
  }, [])

  const { equipped, unlockedItems } = wardrobeState

  const EQUIP_PRAISES = [
    'De szép vagy!',
    'Ezért megdolgoztál!',
    'Igazán ügyes voltál!',
    'Megérte tanulni!',
  ]

  const handleEquip = (itemId: string, category: WardrobeCategory, isLocked: boolean): void => {
    if (isLocked) return
    onEquip(itemId, category)
    speak(EQUIP_PRAISES[Math.floor(Math.random() * EQUIP_PRAISES.length)])
  }

  const visibleItems = WARDROBE_ITEMS.filter(i => i.category === activeTab)

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-gradient-to-b from-[#f5f3ff] to-[#fce7f3]">

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 gap-3 z-10">
        <button
          onClick={onBack}
          style={{ boxShadow: 'var(--sh-1)' }}
          className="w-14 h-14 rounded-full bg-white/85 flex items-center justify-center text-2xl flex-shrink-0 active:scale-90 transition-transform"
          aria-label="Vissza a kertbe"
        >
          🌳
        </button>
        <h1 className="flex-1 text-center text-[20px] font-bold text-violet-800">
          👗 Panka szekrénye
        </h1>
        <div className="w-14 h-14 flex-shrink-0" />
      </div>

      {/* Body below header */}
      <div className="absolute top-16 left-0 right-0 bottom-0 flex flex-col">

        {/* Avatar zone — upper 38% */}
        <div className="relative flex-none h-[38%] flex items-end justify-center pb-3">
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-6 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.4), transparent 70%)' }}
          />
          <div className="w-[130px] h-[250px] drop-shadow-lg">
            <PankaAvatarDressable equipped={equipped} />
          </div>
        </div>

        {/* Tabs + grid */}
        <div className="flex-1 flex flex-col px-4 pb-4 gap-2 min-h-0">

          {/* Category tabs */}
          <div className="flex-none grid grid-cols-4 gap-1.5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'py-[9px] rounded-[14px] text-[12px] font-semibold text-center transition-colors active:scale-95',
                  activeTab === tab.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/80 text-violet-800',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-6 gap-2">
              {visibleItems.map(item => {
                const isLocked   = !unlockedItems.includes(item.id)
                const isEquipped = equipped[item.category] === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(item.id, item.category, isLocked)}
                    disabled={isLocked}
                    style={{
                      borderRadius: '12px',
                      boxShadow: isEquipped
                        ? '0 8px 18px -10px rgba(139,92,246,.6)'
                        : isLocked ? 'none' : 'var(--sh-1)',
                    }}
                    className={[
                      'relative aspect-square flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-90',
                      isEquipped
                        ? 'bg-violet-500'
                        : isLocked
                          ? 'bg-[#f5f3ff] opacity-70'
                          : 'bg-white',
                    ].join(' ')}
                  >
                    {isLocked ? (
                      <>
                        <span className="text-[26px] leading-none opacity-20 grayscale">{item.emoji}</span>
                        <span className="absolute top-0.5 right-1 text-[11px]">🔒</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[26px] leading-none">{item.emoji}</span>
                        <span className={[
                          'text-[9px] font-bold leading-tight text-center px-0.5 uppercase tracking-wide',
                          isEquipped ? 'text-white' : 'text-violet-800',
                        ].join(' ')}>
                          {item.name}
                        </span>
                        {isEquipped && (
                          <span className="absolute top-[3px] left-[5px] text-[10px] font-bold text-white">✓</span>
                        )}
                      </>
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
