export interface LowercaseLetterEntry {
  upper: string
  lower: string
  level: 1 | 2 | 3
  distractors: string[] // visually similar lowercase letters
}

// Levels progress from visually distinct upper/lowercase pairs (1) to the
// most similar-looking pairs (3). Distractors are drawn from the same
// visual-shape family as the correct letter (bowl+stem, round, vertical
// stroke, diagonal, hump) so wrong answers are genuinely confusable.
export const LOWERCASE_LETTERS: LowercaseLetterEntry[] = [
  // Level 1 — easily distinguishable
  { upper: 'C', lower: 'c', level: 1, distractors: ['o', 'e', 's'] },
  { upper: 'K', lower: 'k', level: 1, distractors: ['x', 'y', 'v'] },
  { upper: 'O', lower: 'o', level: 1, distractors: ['c', 'e', 'a'] },
  { upper: 'P', lower: 'p', level: 1, distractors: ['b', 'd', 'q'] },
  { upper: 'S', lower: 's', level: 1, distractors: ['c', 'z', 'e'] },
  { upper: 'U', lower: 'u', level: 1, distractors: ['n', 'v', 'w'] },
  { upper: 'V', lower: 'v', level: 1, distractors: ['w', 'y', 'x'] },
  { upper: 'W', lower: 'w', level: 1, distractors: ['v', 'u', 'm'] },
  { upper: 'X', lower: 'x', level: 1, distractors: ['k', 'y', 'v'] },
  { upper: 'Z', lower: 'z', level: 1, distractors: ['s', 'x', 'v'] },

  // Level 2 — medium difficulty
  { upper: 'A', lower: 'a', level: 2, distractors: ['d', 'g', 'q'] },
  { upper: 'B', lower: 'b', level: 2, distractors: ['d', 'p', 'q'] },
  { upper: 'D', lower: 'd', level: 2, distractors: ['b', 'g', 'q'] },
  { upper: 'E', lower: 'e', level: 2, distractors: ['c', 'o', 's'] },
  { upper: 'F', lower: 'f', level: 2, distractors: ['t', 'l', 'i'] },
  { upper: 'G', lower: 'g', level: 2, distractors: ['q', 'a', 'd'] },
  { upper: 'H', lower: 'h', level: 2, distractors: ['n', 'b', 'k'] },
  { upper: 'I', lower: 'i', level: 2, distractors: ['j', 'l', 't'] },
  { upper: 'J', lower: 'j', level: 2, distractors: ['i', 'l', 'f'] },
  { upper: 'L', lower: 'l', level: 2, distractors: ['i', 't', 'f'] },

  // Level 3 — hardest, most similar shapes
  { upper: 'M', lower: 'm', level: 3, distractors: ['n', 'w', 'u'] },
  { upper: 'N', lower: 'n', level: 3, distractors: ['m', 'h', 'u'] },
  { upper: 'Q', lower: 'q', level: 3, distractors: ['g', 'p', 'd'] },
  { upper: 'R', lower: 'r', level: 3, distractors: ['n', 'h', 'v'] },
  { upper: 'T', lower: 't', level: 3, distractors: ['l', 'f', 'i'] },
  { upper: 'Y', lower: 'y', level: 3, distractors: ['v', 'x', 'g'] },
]
