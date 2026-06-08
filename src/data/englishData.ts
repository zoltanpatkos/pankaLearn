export interface VerbEntry {
  verb: string       // lowercase: "jump" — displayed as JUMP, spoken as "Jump!"
  emoji: string
  hungarian: string  // imperative: "Ugorj!"
}

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

export interface PointerTask {
  englishQuestion: string
  hungarianQuestion: string
  correctEmoji: string
  distractors: [string, string]
  englishAnswer: string
  hungarianAnswer: string
}

export const POINTER_TASKS: PointerTask[] = [
  // Állatok
  { englishQuestion: 'Where is the cat?',    hungarianQuestion: 'Hol van a cica?',   correctEmoji: '🐱', distractors: ['🐶', '🐰'], englishAnswer: 'Yes, the cat!',    hungarianAnswer: 'Igen, a cica!' },
  { englishQuestion: 'Where is the dog?',    hungarianQuestion: 'Hol van a kutya?',  correctEmoji: '🐶', distractors: ['🐱', '🐦'], englishAnswer: 'Yes, the dog!',    hungarianAnswer: 'Igen, a kutya!' },
  { englishQuestion: 'Where is the fish?',   hungarianQuestion: 'Hol van a hal?',    correctEmoji: '🐟', distractors: ['🦋', '🐝'], englishAnswer: 'Yes, the fish!',   hungarianAnswer: 'Igen, a hal!' },
  { englishQuestion: 'Where is the bird?',   hungarianQuestion: 'Hol van a madár?',  correctEmoji: '🐦', distractors: ['🐶', '🐱'], englishAnswer: 'Yes, the bird!',   hungarianAnswer: 'Igen, a madár!' },
  { englishQuestion: 'Where is the rabbit?', hungarianQuestion: 'Hol van a nyuszi?', correctEmoji: '🐰', distractors: ['🐱', '🐸'], englishAnswer: 'Yes, the rabbit!', hungarianAnswer: 'Igen, a nyuszi!' },
  // Színek
  { englishQuestion: 'Where is the red?',    hungarianQuestion: 'Hol van a piros?',  correctEmoji: '🔴', distractors: ['🔵', '🟢'], englishAnswer: 'Yes, red!',        hungarianAnswer: 'Igen, piros!' },
  { englishQuestion: 'Where is the blue?',   hungarianQuestion: 'Hol van a kék?',    correctEmoji: '🔵', distractors: ['🔴', '🟡'], englishAnswer: 'Yes, blue!',       hungarianAnswer: 'Igen, kék!' },
  { englishQuestion: 'Where is the yellow?', hungarianQuestion: 'Hol van a sárga?',  correctEmoji: '🟡', distractors: ['🟢', '🔵'], englishAnswer: 'Yes, yellow!',     hungarianAnswer: 'Igen, sárga!' },
  { englishQuestion: 'Where is the green?',  hungarianQuestion: 'Hol van a zöld?',   correctEmoji: '🟢', distractors: ['🔴', '🟡'], englishAnswer: 'Yes, green!',      hungarianAnswer: 'Igen, zöld!' },
  // Ételek
  { englishQuestion: 'Where is the apple?',  hungarianQuestion: 'Hol van az alma?',  correctEmoji: '🍎', distractors: ['🍌', '🍓'], englishAnswer: 'Yes, the apple!',  hungarianAnswer: 'Igen, az alma!' },
  { englishQuestion: 'Where is the banana?', hungarianQuestion: 'Hol van a banán?',  correctEmoji: '🍌', distractors: ['🍎', '🍇'], englishAnswer: 'Yes, the banana!', hungarianAnswer: 'Igen, a banán!' },
  { englishQuestion: 'Where is the milk?',   hungarianQuestion: 'Hol van a tej?',    correctEmoji: '🥛', distractors: ['🍎', '🍪'], englishAnswer: 'Yes, the milk!',   hungarianAnswer: 'Igen, a tej!' },
  // Család
  { englishQuestion: 'Where is the mother?', hungarianQuestion: 'Hol van a mama?',   correctEmoji: '👩', distractors: ['👨', '👶'], englishAnswer: 'Yes, the mother!', hungarianAnswer: 'Igen, a mama!' },
  { englishQuestion: 'Where is the father?', hungarianQuestion: 'Hol van a papa?',   correctEmoji: '👨', distractors: ['👩', '👶'], englishAnswer: 'Yes, the father!', hungarianAnswer: 'Igen, a papa!' },
  { englishQuestion: 'Where is the baby?',   hungarianQuestion: 'Hol van a baba?',   correctEmoji: '👶', distractors: ['👨', '👩'], englishAnswer: 'Yes, the baby!',   hungarianAnswer: 'Igen, a baba!' },
]

// TODO — további angol feladattípusok (későbbi fázis):
// B: Történet-sorrend — képkártyák sorba rakása sztori alapján
// C: Echo játék — angol szó ismétlése mikrofonba (Web Speech API recognition)
// D: Kategorizáló — szó besorolása csoportokba (állat / étel / szín)
