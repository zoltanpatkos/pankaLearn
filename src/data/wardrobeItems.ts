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
  { id: 'outfit-default',    name: 'Lila ruha',       category: 'outfit', emoji: '👗',  defaultUnlocked: true  },
  { id: 'outfit-princess',   name: 'Hercegnő',         category: 'outfit', emoji: '👸',  defaultUnlocked: false },
  { id: 'outfit-ballerina',  name: 'Balerina',          category: 'outfit', emoji: '🩰',  defaultUnlocked: false },
  { id: 'outfit-sporty',     name: 'Sportos szett',     category: 'outfit', emoji: '⚡',  defaultUnlocked: false },
  { id: 'outfit-ladybug',    name: 'Katicabogár',       category: 'outfit', emoji: '🐞',  defaultUnlocked: false },
  { id: 'outfit-fairy',      name: 'Tündér',            category: 'outfit', emoji: '🧚',  defaultUnlocked: false },
  { id: 'outfit-bee',        name: 'Méhecske',          category: 'outfit', emoji: '🐝',  defaultUnlocked: false },
  { id: 'outfit-dino',       name: 'Teknős jelmez',     category: 'outfit', emoji: '🐢',  defaultUnlocked: false },
  { id: 'outfit-swimsuit',   name: 'Fürdőruha',         category: 'outfit', emoji: '🩱',  defaultUnlocked: false },
  { id: 'outfit-dolphin',    name: 'Delfinjelmez',      category: 'outfit', emoji: '🐬',  defaultUnlocked: false },
  { id: 'outfit-pajama',        name: 'Pizsama',        category: 'outfit', emoji: '🌙',  defaultUnlocked: false },
  { id: 'outfit-raincoat',      name: 'Esőkabát',       category: 'outfit', emoji: '🌦️', defaultUnlocked: false },
  { id: 'outfit-snowsuit',      name: 'Hóruha',         category: 'outfit', emoji: '❄️',  defaultUnlocked: false },
  { id: 'outfit-ballet-blue',   name: 'Kék balerina',   category: 'outfit', emoji: '💙',  defaultUnlocked: false },
  { id: 'outfit-soccer',        name: 'Focimez',        category: 'outfit', emoji: '⚽',  defaultUnlocked: false },
  { id: 'outfit-doctor',        name: 'Orvosi köpeny',  category: 'outfit', emoji: '🩺',  defaultUnlocked: false },
  { id: 'outfit-chef',          name: 'Szakácskötény',  category: 'outfit', emoji: '👨‍🍳', defaultUnlocked: false },
  { id: 'outfit-astronaut',     name: 'Asztronauta',    category: 'outfit', emoji: '🚀',  defaultUnlocked: false },
  { id: 'outfit-mermaid',       name: 'Hableány',       category: 'outfit', emoji: '🧜',  defaultUnlocked: false },
  // ── Hair ─────────────────────────────────────────────────────────────────────
  { id: 'hair-default',        name: 'Hosszú barna',      category: 'hair', emoji: '🟫',  defaultUnlocked: true  },
  { id: 'hair-pigtails',       name: 'Copfok',            category: 'hair', emoji: '🎀',  defaultUnlocked: false },
  { id: 'hair-ponytail',       name: 'Lófarok',           category: 'hair', emoji: '🐴',  defaultUnlocked: false },
  { id: 'hair-braid',          name: 'Varkocs',           category: 'hair', emoji: '🌾',  defaultUnlocked: false },
  { id: 'hair-wavy',           name: 'Hullámos',          category: 'hair', emoji: '〰️',   defaultUnlocked: false },
  { id: 'hair-bun',            name: 'Konty',             category: 'hair', emoji: '🎱',  defaultUnlocked: false },
  { id: 'hair-bun-flowers',    name: 'Konty virágokkal',  category: 'hair', emoji: '🌸',  defaultUnlocked: false },
  { id: 'hair-pigtails-colored', name: 'Fonott copfok',  category: 'hair', emoji: '🌈',  defaultUnlocked: false },
  { id: 'hair-braid-bow',      name: 'Copf masnival',     category: 'hair', emoji: '🎀',  defaultUnlocked: false },
  { id: 'hair-messy',          name: 'Kócos frizura',     category: 'hair', emoji: '😴',  defaultUnlocked: false },
  // ── Accessories ───────────────────────────────────────────────────────────────
  { id: 'accessory-none',           name: 'Semmi',             category: 'accessory', emoji: '✨',  defaultUnlocked: true  },
  { id: 'accessory-crown',          name: 'Korona',            category: 'accessory', emoji: '👑',  defaultUnlocked: false },
  { id: 'accessory-glasses',        name: 'Szemüveg',          category: 'accessory', emoji: '👓',  defaultUnlocked: false },
  { id: 'accessory-headband',       name: 'Hajpánt',           category: 'accessory', emoji: '🎗️', defaultUnlocked: false },
  { id: 'accessory-bow-red',        name: 'Piros masni',       category: 'accessory', emoji: '🔴',  defaultUnlocked: false },
  { id: 'accessory-bow-blue',       name: 'Kék masni',         category: 'accessory', emoji: '🔵',  defaultUnlocked: false },
  { id: 'accessory-cat-ears',       name: 'Cicafül',           category: 'accessory', emoji: '🐱',  defaultUnlocked: false },
  { id: 'accessory-baseball-cap',   name: 'Baseball sapka',    category: 'accessory', emoji: '🧢',  defaultUnlocked: false },
  { id: 'accessory-necklace',       name: 'Nyaklánc',          category: 'accessory', emoji: '📿',  defaultUnlocked: false },
  { id: 'accessory-umbrella',       name: 'Esernyő',           category: 'accessory', emoji: '☂️',  defaultUnlocked: false },
  { id: 'accessory-bag',            name: 'Táska',             category: 'accessory', emoji: '👜',  defaultUnlocked: false },
  { id: 'accessory-sunglasses',     name: 'Napszemüveg',       category: 'accessory', emoji: '🕶️', defaultUnlocked: false },
  { id: 'accessory-ring',           name: 'Gyűrű',             category: 'accessory', emoji: '💍',  defaultUnlocked: false },
  { id: 'accessory-winter-hat',     name: 'Téli sapka',        category: 'accessory', emoji: '🧣',  defaultUnlocked: false },
  { id: 'accessory-swim-ring',      name: 'Úszógumi',          category: 'accessory', emoji: '🩲',  defaultUnlocked: false },
  { id: 'accessory-bracelet',       name: 'Karkötő',           category: 'accessory', emoji: '📿',  defaultUnlocked: false },
  { id: 'accessory-watch',          name: 'Karóra',            category: 'accessory', emoji: '⌚',  defaultUnlocked: false },
  { id: 'accessory-scarf',          name: 'Sál',               category: 'accessory', emoji: '🧣',  defaultUnlocked: false },
  { id: 'accessory-gloves',         name: 'Kesztyű',           category: 'accessory', emoji: '🧤',  defaultUnlocked: false },
  { id: 'accessory-tiara',          name: 'Tiara',             category: 'accessory', emoji: '💎',  defaultUnlocked: false },
  { id: 'accessory-butterfly-wings', name: 'Pillangó-szárnyak', category: 'accessory', emoji: '🦋', defaultUnlocked: false },
  { id: 'accessory-flower-garland', name: 'Virágfüzér',        category: 'accessory', emoji: '💐',  defaultUnlocked: false },
  { id: 'accessory-santa-hat',      name: 'Mikulás-sapka',     category: 'accessory', emoji: '🎅',  defaultUnlocked: false },
  { id: 'accessory-bunny-ears',     name: 'Nyuszi-fülek',      category: 'accessory', emoji: '🐰',  defaultUnlocked: false },
  { id: 'accessory-party-hat',      name: 'Parti-kalap',       category: 'accessory', emoji: '🎉',  defaultUnlocked: false },
  // ── Footwear ──────────────────────────────────────────────────────────────────
  { id: 'footwear-sneakers',     name: 'Sportcipő',     category: 'footwear', emoji: '👟', defaultUnlocked: true  },
  { id: 'footwear-heels',        name: 'Magassarkú',    category: 'footwear', emoji: '👠', defaultUnlocked: false },
  { id: 'footwear-boots',        name: 'Csizma',        category: 'footwear', emoji: '👢', defaultUnlocked: false },
  { id: 'footwear-slippers',     name: 'Papucs',        category: 'footwear', emoji: '🥿', defaultUnlocked: true  },
  { id: 'footwear-barefoot',     name: 'Mezítláb',      category: 'footwear', emoji: '🦶', defaultUnlocked: false },
  { id: 'footwear-socks',        name: 'Pöttyös zokni', category: 'footwear', emoji: '🧦', defaultUnlocked: false },
  { id: 'footwear-ballet-shoes', name: 'Balerina cipő', category: 'footwear', emoji: '🩰', defaultUnlocked: false },
  { id: 'footwear-rain-boots',   name: 'Gumicsizma',    category: 'footwear', emoji: '🥾', defaultUnlocked: false },
]

export const DEFAULT_UNLOCKED_IDS = WARDROBE_ITEMS
  .filter(i => i.defaultUnlocked)
  .map(i => i.id)
