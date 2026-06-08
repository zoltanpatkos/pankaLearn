export type WardrobeCategory = 'outfit' | 'hair' | 'accessory' | 'footwear'

export interface WardrobeItem {
  id: string
  name: string
  category: WardrobeCategory
  emoji: string
  defaultUnlocked: boolean
}

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ── Outfits ──────────────────────────────────────────────────────────────────
  { id: 'outfit-default',   name: 'Lila ruha',       category: 'outfit', emoji: '👗', defaultUnlocked: true  },
  { id: 'outfit-princess',  name: 'Hercegnő',         category: 'outfit', emoji: '👸', defaultUnlocked: false },
  { id: 'outfit-ballerina', name: 'Balerina',          category: 'outfit', emoji: '🩰', defaultUnlocked: false },
  { id: 'outfit-sporty',    name: 'Sportos szett',     category: 'outfit', emoji: '⚡', defaultUnlocked: false },
  { id: 'outfit-ladybug',   name: 'Katicabogár',       category: 'outfit', emoji: '🐞', defaultUnlocked: false },
  { id: 'outfit-fairy',     name: 'Tündér',            category: 'outfit', emoji: '🧚', defaultUnlocked: false },
  { id: 'outfit-bee',       name: 'Méhecske',          category: 'outfit', emoji: '🐝', defaultUnlocked: false },
  // ── Hair ─────────────────────────────────────────────────────────────────────
  { id: 'hair-default',   name: 'Hosszú barna',   category: 'hair', emoji: '🟫', defaultUnlocked: true  },
  { id: 'hair-pigtails',  name: 'Copfok',         category: 'hair', emoji: '🎀', defaultUnlocked: false },
  { id: 'hair-ponytail',  name: 'Lófarok',        category: 'hair', emoji: '🐴', defaultUnlocked: false },
  { id: 'hair-braid',     name: 'Varkocs',        category: 'hair', emoji: '🌾', defaultUnlocked: false },
  { id: 'hair-wavy',      name: 'Hullámos',       category: 'hair', emoji: '〰️',  defaultUnlocked: false },
  // ── Accessories ───────────────────────────────────────────────────────────────
  { id: 'accessory-none',         name: 'Semmi',          category: 'accessory', emoji: '✨', defaultUnlocked: true  },
  { id: 'accessory-crown',        name: 'Korona',         category: 'accessory', emoji: '👑', defaultUnlocked: false },
  { id: 'accessory-glasses',      name: 'Szemüveg',       category: 'accessory', emoji: '👓', defaultUnlocked: false },
  { id: 'accessory-headband',     name: 'Hajpánt',        category: 'accessory', emoji: '🎗️', defaultUnlocked: false },
  { id: 'accessory-bow-red',      name: 'Piros masni',    category: 'accessory', emoji: '🔴', defaultUnlocked: false },
  { id: 'accessory-bow-blue',     name: 'Kék masni',      category: 'accessory', emoji: '🔵', defaultUnlocked: false },
  { id: 'accessory-cat-ears',     name: 'Cicafül',        category: 'accessory', emoji: '🐱', defaultUnlocked: false },
  { id: 'accessory-baseball-cap', name: 'Baseball sapka', category: 'accessory', emoji: '🧢', defaultUnlocked: false },
  { id: 'accessory-necklace',     name: 'Nyaklánc',       category: 'accessory', emoji: '📿', defaultUnlocked: false },
  { id: 'accessory-umbrella',     name: 'Esernyő',        category: 'accessory', emoji: '☂️', defaultUnlocked: false },
  { id: 'accessory-bag',          name: 'Táska',          category: 'accessory', emoji: '👜', defaultUnlocked: false },
  // ── Footwear ──────────────────────────────────────────────────────────────────
  { id: 'footwear-sneakers', name: 'Sportcipő',   category: 'footwear', emoji: '👟', defaultUnlocked: true  },
  { id: 'footwear-heels',    name: 'Magassarkú',  category: 'footwear', emoji: '👠', defaultUnlocked: false },
  { id: 'footwear-boots',    name: 'Csizma',      category: 'footwear', emoji: '👢', defaultUnlocked: false },
]

export const DEFAULT_UNLOCKED_IDS = WARDROBE_ITEMS
  .filter(i => i.defaultUnlocked)
  .map(i => i.id)
