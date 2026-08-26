import { VOCABULARY, getMemoryCategories, type VocabWord } from './englishVocabulary'

export { getMemoryCategories }

export interface SayItWord {
  word: string
  emoji: string
  accepted: string[]  // phonetic variants — any match = correct
}

export interface VerbEntry {
  verb: string       // lowercase: "jump" — displayed as JUMP, spoken as "Jump!"
  emoji: string
  hungarian: string  // imperative: "Ugorj!"
}

export interface PointerTask {
  id: string            // adaptive itemId (e.g. "cat", "head", "strawberry")
  englishQuestion: string
  hungarianQuestion: string
  correctEmoji: string
  distractors: [string, string]
  englishAnswer: string
  hungarianAnswer: string
}

// ── Derived from central vocabulary ──────────────────────────────────────────

export const SAY_IT_WORDS: SayItWord[] = VOCABULARY
  .filter(w => w.accepted !== undefined)
  .map(w => ({ word: w.word, emoji: w.emoji, accepted: w.accepted! }))

export const POINTER_TASKS: PointerTask[] = (() => {
  const filtered = VOCABULARY.filter(w => !w.skipPointer)
  const byCategory = new Map<string, VocabWord[]>()
  filtered.forEach(w => {
    if (!byCategory.has(w.category)) byCategory.set(w.category, [])
    byCategory.get(w.category)!.push(w)
  })

  return filtered.flatMap(w => {
    const categoryWords = byCategory.get(w.category)!
    const others = categoryWords.filter(v => v.word !== w.word)
    if (others.length < 2) return []

    const idx = categoryWords.indexOf(w)
    const d1 = others[idx % others.length]
    const d2 = others[(idx + 1) % others.length]

    const qp = w.questionPrefix ?? 'where'
    const plural = w.plural ?? false

    let enQ: string, huQ: string, enA: string, huA: string

    if (qp === 'who') {
      enQ = `Who is ${w.word}?`
      huQ = `Ki ${w.hu}?`
      enA = `Yes, ${w.word}!`
      huA = `Igen, ${w.hu}!`
    } else if (qp === 'which') {
      enQ = `Which one is ${w.word}?`
      huQ = `Melyik ${w.huArticle} ${w.hu}?`
      enA = `Yes, ${w.word}!`
      huA = `Igen, ${w.huArticle} ${w.hu}!`
    } else if (plural) {
      enQ = `Where are the ${w.word}?`
      huQ = `Hol van ${w.huArticle} ${w.hu}?`
      enA = `Yes, the ${w.word}!`
      huA = `Igen, ${w.huArticle} ${w.hu}!`
    } else {
      enQ = `Where is the ${w.word}?`
      huQ = `Hol van ${w.huArticle} ${w.hu}?`
      enA = `Yes, the ${w.word}!`
      huA = `Igen, ${w.huArticle} ${w.hu}!`
    }

    return [{
      id: w.word,
      englishQuestion: enQ,
      hungarianQuestion: huQ,
      correctEmoji: w.emoji,
      distractors: [d1.emoji, d2.emoji] as [string, string],
      englishAnswer: enA,
      hungarianAnswer: huA,
    }]
  })
})()

// ── TPR verbs (unchanged — actions, not nouns) ────────────────────────────────

export const TPR_VERBS: VerbEntry[] = [
  { verb: 'jump',  emoji: '🦘', hungarian: 'Ugorj!' },
  { verb: 'run',   emoji: '🏃', hungarian: 'Fuss!' },
  { verb: 'sleep', emoji: '😴', hungarian: 'Aludj!' },
  { verb: 'eat',   emoji: '🍎', hungarian: 'Egyél!' },
  { verb: 'drink', emoji: '💧', hungarian: 'Igyál!' },
  { verb: 'dance', emoji: '💃', hungarian: 'Táncolj!' },
  { verb: 'clap',  emoji: '👏', hungarian: 'Tapsolj!' },
  { verb: 'wave',  emoji: '👋', hungarian: 'Integess!' },
  { verb: 'sit',   emoji: '🪑', hungarian: 'Ülj le!' },
  { verb: 'stand', emoji: '🧍', hungarian: 'Állj fel!' },
  { verb: 'fly',   emoji: '🦋', hungarian: 'Repülj!' },
  { verb: 'swim',  emoji: '🏊', hungarian: 'Ússz!' },
]
