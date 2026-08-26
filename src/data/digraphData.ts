export type Digraph = 'ny' | 'ty' | 'gy' | 'sz' | 'cs' | 'zs'

export interface DigraphWord {
  word: string    // lowercase, always starts with the digraph
  emoji: string
  digraph: Digraph
}

export const DIGRAPHS: Digraph[] = ['ny', 'ty', 'gy', 'sz', 'cs', 'zs']

// A bare digraph (e.g. "ny") isn't a pronounceable Hungarian syllable on its
// own — TTS engines either spell out the letter names or guess an English
// reading. Appending a neutral vowel makes it a real, sayable syllable while
// still isolating the digraph sound. Used for the spoken "hear the NY sound"
// prompts (see src/lib/audioPlayer.ts / scripts/audioManifest.mjs) — the
// on-screen card text still shows the plain uppercase digraph.
export const DIGRAPH_SYLLABLE: Record<Digraph, string> = {
  ny: 'nyö', ty: 'työ', gy: 'gyö', sz: 'szö', cs: 'csö', zs: 'zsö',
}

// Every word starts with its digraph so the highlighted prefix is always
// word.slice(0, digraph.length). "atya" was dropped per spec (too abstract
// for this age); "nyelv" was added in its place so NY has a full 3-word set.
export const DIGRAPH_WORDS: DigraphWord[] = [
  { word: 'nyúl',      emoji: '🐰', digraph: 'ny' },
  { word: 'nyár',      emoji: '☀️', digraph: 'ny' },
  { word: 'nyelv',     emoji: '👅', digraph: 'ny' },

  { word: 'tyúk',      emoji: '🐔', digraph: 'ty' },

  { word: 'gyerek',    emoji: '👧', digraph: 'gy' },
  { word: 'gyűrű',     emoji: '💍', digraph: 'gy' },
  { word: 'gyümölcs',  emoji: '🍎', digraph: 'gy' },

  { word: 'szív',      emoji: '❤️', digraph: 'sz' },
  { word: 'szőlő',     emoji: '🍇', digraph: 'sz' },
  { word: 'szél',      emoji: '💨', digraph: 'sz' },
  { word: 'szék',      emoji: '🪑', digraph: 'sz' },

  { word: 'csillag',   emoji: '⭐', digraph: 'cs' },
  { word: 'csirke',    emoji: '🐣', digraph: 'cs' },
  { word: 'csiga',     emoji: '🐌', digraph: 'cs' },

  { word: 'zsák',      emoji: '🎒', digraph: 'zs' },
  { word: 'zsemle',    emoji: '🥐', digraph: 'zs' },
]
