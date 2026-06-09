export interface WordEntry {
  syllables: string[]
  word: string
  emoji: string
  level: 1 | 2 | 3
}

export const READING_WORDS: WordEntry[] = [
  // Level 1 — 2 szótagos, egyszerű (+ KÉP: 1 szótag)
  { syllables: ['MA', 'MA'],  word: 'mama',  emoji: '👩',  level: 1 },
  { syllables: ['PA', 'PA'],  word: 'papa',  emoji: '👨',  level: 1 },
  { syllables: ['BA', 'BA'],  word: 'baba',  emoji: '👶',  level: 1 },
  { syllables: ['NÉ', 'NI'],  word: 'néni',  emoji: '👩‍🦳', level: 1 },
  { syllables: ['MA', 'CI'],  word: 'maci',  emoji: '🧸',  level: 1 },
  { syllables: ['ÁL', 'LAT'], word: 'állat', emoji: '🦁',  level: 1 },
  { syllables: ['AL', 'MA'],  word: 'alma',  emoji: '🍎',  level: 1 },
  { syllables: ['AU', 'TÓ'],  word: 'autó',  emoji: '🚗',  level: 1 },
  { syllables: ['Ó', 'RA'],   word: 'óra',   emoji: '⏰',  level: 1 },
  { syllables: ['KÉP'],       word: 'kép',   emoji: '🖼️',  level: 1 },

  // Level 2 — 2 szótagos, összetettebb
  { syllables: ['CI', 'CA'],   word: 'cica',   emoji: '🐱', level: 2 },
  { syllables: ['KU', 'TYA'],  word: 'kutya',  emoji: '🐶', level: 2 },
  { syllables: ['HA', 'LAK'],  word: 'halak',  emoji: '🐟', level: 2 },
  { syllables: ['MA', 'DÁR'],  word: 'madár',  emoji: '🐦', level: 2 },
  { syllables: ['BO', 'GÁR'],  word: 'bogár',  emoji: '🐛', level: 2 },
  { syllables: ['KÉ', 'PES'],  word: 'képes',  emoji: '📖', level: 2 },
  { syllables: ['SZE', 'KÉR'], word: 'szekér', emoji: '🛒', level: 2 },

  // Level 3 — 3 szótagos
  { syllables: ['MACS', 'KA'],       word: 'macska',   emoji: '🐱', level: 2 },
  { syllables: ['PI', 'ROS', 'KA'],  word: 'Piroska',  emoji: '🧺', level: 3 },
  { syllables: ['CU', 'KOR', 'KA'],  word: 'cukorka',  emoji: '🍬', level: 3 },
  { syllables: ['NYU', 'SZI', 'KA'], word: 'nyuszika', emoji: '🐰', level: 3 },
  { syllables: ['BA', 'RÁ', 'TOM'],  word: 'barátom',  emoji: '👫', level: 3 },
  { syllables: ['PIL', 'LAN', 'GÓ'], word: 'pillangó', emoji: '🦋', level: 3 },
]
