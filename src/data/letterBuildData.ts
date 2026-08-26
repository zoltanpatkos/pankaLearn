export interface LetterBuildWord {
  word: string        // lowercase: 'fa'
  letters: string[]   // uppercase: ['F', 'A']
  emoji: string | null
  letterSounds: string[] // TTS sounds: ['Fff', 'Aaa']
  distractors: string[]  // visually similar: ['E', 'O']
}

const S: Record<string, string> = {
  F: 'Fff', S: 'Sss', M: 'Mmm', N: 'Nnn', L: 'Lll', V: 'Vvv', R: 'Rrr',
  T: 'T', P: 'P', K: 'K', H: 'H', B: 'B',
  A: 'Aaa', E: 'Eee', O: 'Ooo',
}
const s = (...ls: string[]): string[] => ls.map(l => S[l] ?? l)

export const LETTER_BUILD_WORDS: LetterBuildWord[] = [
  { word: 'fa', letters: ['F', 'A'], emoji: '🌳', letterSounds: s('F', 'A'), distractors: ['E', 'O'] },
  { word: 'ma', letters: ['M', 'A'], emoji: null,  letterSounds: s('M', 'A'), distractors: ['N', 'O'] },
  { word: 'pa', letters: ['P', 'A'], emoji: null,  letterSounds: s('P', 'A'), distractors: ['B', 'O'] },
  { word: 'te', letters: ['T', 'E'], emoji: null,  letterSounds: s('T', 'E'), distractors: ['L', 'F'] },
  { word: 'se', letters: ['S', 'E'], emoji: null,  letterSounds: s('S', 'E'), distractors: ['Z', 'F'] },
  { word: 'ha', letters: ['H', 'A'], emoji: null,  letterSounds: s('H', 'A'), distractors: ['N', 'O'] },
  { word: 'ne', letters: ['N', 'E'], emoji: null,  letterSounds: s('N', 'E'), distractors: ['M', 'F'] },
  { word: 'va', letters: ['V', 'A'], emoji: null,  letterSounds: s('V', 'A'), distractors: ['U', 'O'] },
  { word: 'le', letters: ['L', 'E'], emoji: null,  letterSounds: s('L', 'E'), distractors: ['I', 'F'] },
  { word: 'me', letters: ['M', 'E'], emoji: null,  letterSounds: s('M', 'E'), distractors: ['N', 'F'] },
  { word: 'ko', letters: ['K', 'O'], emoji: null,  letterSounds: s('K', 'O'), distractors: ['R', 'U'] },
  { word: 'na', letters: ['N', 'A'], emoji: null,  letterSounds: s('N', 'A'), distractors: ['M', 'O'] },
  { word: 'ra', letters: ['R', 'A'], emoji: null,  letterSounds: s('R', 'A'), distractors: ['P', 'O'] },
  { word: 'be', letters: ['B', 'E'], emoji: null,  letterSounds: s('B', 'E'), distractors: ['P', 'F'] },
]
