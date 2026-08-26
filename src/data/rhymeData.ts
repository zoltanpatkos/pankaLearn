export interface RhymeDistractor { word: string; emoji: string; syllables: string[] }

export interface RhymePair {
  prompt: string           // lowercase, for TTS: 'bál'
  promptEmoji: string
  promptSyllables: string[] // uppercase display: ['BÁL']
  correct: string
  correctEmoji: string
  correctSyllables: string[]
  distractors: [RhymeDistractor, RhymeDistractor]
}

export const RHYME_PAIRS: RhymePair[] = [
  {
    prompt: 'bál', promptEmoji: '🎉', promptSyllables: ['BÁL'],
    correct: 'tál', correctEmoji: '🥣', correctSyllables: ['TÁL'],
    distractors: [
      { word: 'hal', emoji: '🐟', syllables: ['HAL'] },
      { word: 'kéz', emoji: '✋', syllables: ['KÉZ'] },
    ],
  },
  {
    prompt: 'kéz', promptEmoji: '✋', promptSyllables: ['KÉZ'],
    correct: 'méz', correctEmoji: '🍯', correctSyllables: ['MÉZ'],
    distractors: [
      { word: 'tál', emoji: '🥣', syllables: ['TÁL'] },
      { word: 'vár', emoji: '🏰', syllables: ['VÁR'] },
    ],
  },
  {
    prompt: 'hal', promptEmoji: '🐟', promptSyllables: ['HAL'],
    correct: 'fal', correctEmoji: '🧱', correctSyllables: ['FAL'],
    distractors: [
      { word: 'kéz', emoji: '✋', syllables: ['KÉZ'] },
      { word: 'bál', emoji: '🎉', syllables: ['BÁL'] },
    ],
  },
  {
    prompt: 'mák', promptEmoji: '🌺', promptSyllables: ['MÁK'],
    correct: 'rák', correctEmoji: '🦞', correctSyllables: ['RÁK'],
    distractors: [
      { word: 'ház', emoji: '🏠', syllables: ['HÁZ'] },
      { word: 'méz', emoji: '🍯', syllables: ['MÉZ'] },
    ],
  },
  {
    prompt: 'vár', promptEmoji: '🏰', promptSyllables: ['VÁR'],
    correct: 'nyár', correctEmoji: '☀️', correctSyllables: ['NYÁR'],
    distractors: [
      { word: 'tál', emoji: '🥣', syllables: ['TÁL'] },
      { word: 'fal', emoji: '🧱', syllables: ['FAL'] },
    ],
  },
  {
    prompt: 'ég', promptEmoji: '🌤️', promptSyllables: ['ÉG'],
    correct: 'jég', correctEmoji: '🧊', correctSyllables: ['JÉG'],
    distractors: [
      { word: 'kút', emoji: '🪣', syllables: ['KÚT'] },
      { word: 'mák', emoji: '🌺', syllables: ['MÁK'] },
    ],
  },
  {
    prompt: 'út', promptEmoji: '🛣️', promptSyllables: ['ÚT'],
    correct: 'kút', correctEmoji: '🪣', correctSyllables: ['KÚT'],
    distractors: [
      { word: 'jég', emoji: '🧊', syllables: ['JÉG'] },
      { word: 'rák', emoji: '🦞', syllables: ['RÁK'] },
    ],
  },
  {
    prompt: 'ház', promptEmoji: '🏠', promptSyllables: ['HÁZ'],
    correct: 'váz', correctEmoji: '🏺', correctSyllables: ['VÁZ'],
    distractors: [
      { word: 'út', emoji: '🛣️', syllables: ['ÚT'] },
      { word: 'kéz', emoji: '✋', syllables: ['KÉZ'] },
    ],
  },
  {
    prompt: 'alma', promptEmoji: '🍎', promptSyllables: ['AL', 'MA'],
    correct: 'palma', correctEmoji: '🌴', correctSyllables: ['PAL', 'MA'],
    distractors: [
      { word: 'ház', emoji: '🏠', syllables: ['HÁZ'] },
      { word: 'méz', emoji: '🍯', syllables: ['MÉZ'] },
    ],
  },
  {
    prompt: 'tél', promptEmoji: '❄️', promptSyllables: ['TÉL'],
    correct: 'cél', correctEmoji: '🎯', correctSyllables: ['CÉL'],
    distractors: [
      { word: 'fal', emoji: '🧱', syllables: ['FAL'] },
      { word: 'rák', emoji: '🦞', syllables: ['RÁK'] },
    ],
  },
]
