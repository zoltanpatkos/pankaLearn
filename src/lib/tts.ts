const HUNGARIAN_VOWELS = new Set('aáeéiíoóöőuúüű')

// Ordinal numbers 1–10 első hangja (for article selection)
const ORDINAL_FIRST_SOUND: Record<number, string> = {
  1: 'e',  // első
  2: 'm',  // második
  3: 'h',  // harmadik
  4: 'n',  // negyedik
  5: 'ö',  // ötödik
  6: 'h',  // hatodik
  7: 'h',  // hetedik
  8: 'n',  // nyolcadik
  9: 'k',  // kilencedik
  10: 't', // tizedik
}

export function getArticle(nextWord: string): 'a' | 'az' {
  const trimmed = nextWord.trim()
  const numMatch = trimmed.match(/^(\d+)\.?$/)
  if (numMatch) {
    const first = ORDINAL_FIRST_SOUND[parseInt(numMatch[1], 10)]
    if (first) return HUNGARIAN_VOWELS.has(first) ? 'az' : 'a'
  }
  return HUNGARIAN_VOWELS.has(trimmed.charAt(0).toLowerCase()) ? 'az' : 'a'
}

let _muted = localStorage.getItem('tts-muted') === 'true'

export const isMuted = (): boolean => _muted

export function setMuted(value: boolean): void {
  _muted = value
  localStorage.setItem('tts-muted', String(value))
  if (value) window.speechSynthesis.cancel()
}

function lookupHungarianVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'hu-HU') ??
    voices.find(v => v.lang.startsWith('hu')) ??
    null
  )
}

function lookupEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'en-GB') ??
    voices.find(v => v.lang === 'en-US') ??
    voices.find(v => v.lang.startsWith('en')) ??
    null
  )
}

// Populated once by ensureVoicesLoaded() (kicked off eagerly below, at
// module load — i.e. app startup, while Panka is still on the mascot
// picker). getHungarianVoice()/getEnglishVoice() read these directly so
// no speak* call has to wait on voice loading; only a call landing before
// that initial load finishes falls back to a fresh (possibly still
// incomplete) live lookup, which in practice only happens on the very
// first render.
let cachedHuVoice: SpeechSynthesisVoice | null = null
let cachedEnVoice: SpeechSynthesisVoice | null = null

function getHungarianVoice(): SpeechSynthesisVoice | null {
  return cachedHuVoice ?? lookupHungarianVoice()
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  return cachedEnVoice ?? lookupEnglishVoice()
}

// Android Chrome's speechSynthesis.getVoices() can return a non-empty but
// INCOMPLETE list on first call (e.g. only a generic default voice), with
// the real hu-HU/en-GB voices arriving via a later 'voiceschanged' event —
// unlike desktop Chrome, where the full list is available immediately.
// This waits for BOTH a Hungarian and an English voice to actually be
// present, with polling as a fallback since Android's 'voiceschanged'
// doesn't always fire reliably, then caches them.
let voicesReadyPromise: Promise<void> | null = null
function ensureVoicesLoaded(): Promise<void> {
  if (voicesReadyPromise) return voicesReadyPromise
  voicesReadyPromise = new Promise(resolve => {
    const ready = (): boolean => {
      const voices = window.speechSynthesis.getVoices()
      return voices.some(v => v.lang.startsWith('hu')) && voices.some(v => v.lang.startsWith('en'))
    }
    const finish = (): void => {
      cachedHuVoice = lookupHungarianVoice()
      cachedEnVoice = lookupEnglishVoice()
      resolve()
    }
    if (ready()) { finish(); return }
    const onChange = (): void => {
      if (ready()) { window.speechSynthesis.removeEventListener('voiceschanged', onChange); finish() }
    }
    window.speechSynthesis.addEventListener('voiceschanged', onChange)
    let attempts = 0
    const poll = (): void => {
      attempts++
      if (ready() || (window.speechSynthesis.getVoices().length > 0 && attempts >= 20)) {
        window.speechSynthesis.removeEventListener('voiceschanged', onChange)
        finish()
        return
      }
      if (attempts < 20) setTimeout(poll, 150)
      else { window.speechSynthesis.removeEventListener('voiceschanged', onChange); finish() }
    }
    setTimeout(poll, 150)
  })
  return voicesReadyPromise
}

// Fire immediately on module load (app startup) rather than on the first
// speak call — by the time Panka gets through the mascot picker/confirm
// screens to any TTS-producing screen, voices are already cached.
void ensureVoicesLoaded()

function makeU(text: string, rate: number, voice: SpeechSynthesisVoice | null, lang = 'hu-HU', volume = 1): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  u.pitch = 1.1
  u.volume = volume
  if (voice) u.voice = voice
  return u
}

function silentPad(voice: SpeechSynthesisVoice | null): void {
  const pad = new SpeechSynthesisUtterance(' ')
  pad.volume = 0
  pad.lang = 'hu-HU'
  if (voice) pad.voice = voice
  window.speechSynthesis.speak(pad)
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export function speak(text: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()
  // No voiceschanged wait here — getHungarianVoice() reads the cache
  // populated by the eager ensureVoicesLoaded() call at module load.
  const voice = getHungarianVoice()
  window.speechSynthesis.speak(makeU(text, 0.85, voice))
  silentPad(voice)
}

export function speakChained(parts: string[]): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const voice = getHungarianVoice()
    for (const part of parts) {
      if (_muted) return
      await new Promise<void>(resolve => {
        const u = makeU(part, 0.85, voice)
        u.onend = () => resolve()
        window.speechSynthesis.speak(u)
      })
    }
    if (!_muted) silentPad(voice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

// Web Speech API fallback for the digraph-elongation hint (used only when the
// pre-generated Azure clip — see audioPlayer.ts playDigraphHint — is
// unavailable). Doubling a digraph's last letter ("nyy") reads like English;
// instead this slows the utterance rate directly and speaks a vowel-appended
// syllable ("nye"), since a bare digraph has no standalone Hungarian reading.
export function speakDigraphHint(word: string, syllable: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const voice = getHungarianVoice()
    const speakOne = (text: string, rate: number): Promise<void> =>
      new Promise(resolve => {
        const u = makeU(text, rate, voice)
        u.onend = () => resolve()
        window.speechSynthesis.speak(u)
      })

    await speakOne(word, 0.7)
    if (_muted) return
    await delay(600)
    if (_muted) return
    await speakOne(syllable, 0.5)
    if (_muted) return
    await delay(400)
    if (_muted) return
    await speakOne(`Hallod a ${syllable} hangot?`, 0.85)
    if (!_muted) silentPad(voice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

export function speakSyllabified(syllables: string[], word: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const voice = getHungarianVoice()

    const speakOne = (text: string, rate: number): Promise<void> =>
      new Promise(resolve => {
        const u = makeU(text.toLowerCase(), rate, voice)
        u.onend = () => resolve()
        window.speechSynthesis.speak(u)
      })

    for (const syllable of syllables) {
      if (_muted) return
      await speakOne(syllable, 0.75)
    }

    if (!_muted && syllables.length > 1) await speakOne(word, 0.85)
    if (!_muted) silentPad(voice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

export function speakTPR(verb: string, hungarian: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const huVoice = getHungarianVoice()
    const enVoice = getEnglishVoice()

    const speakEn = (): Promise<void> =>
      new Promise(resolve => {
        const u = makeU(verb, 0.8, enVoice, 'en-GB')
        u.onend = () => resolve()
        window.speechSynthesis.speak(u)
      })

    await speakEn()
    if (_muted) return
    await delay(300)
    if (_muted) return
    await new Promise<void>(resolve => {
      const u = makeU(hungarian, 0.85, huVoice, 'hu-HU', 0.45)
      u.onend = () => resolve()
      window.speechSynthesis.speak(u)
    })
    if (_muted) return
    await delay(300)
    if (_muted) return
    await speakEn()
    if (!_muted) silentPad(enVoice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

export function speakEnglish(text: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()
  const doSpeak = () => {
    const voice = getEnglishVoice()
    window.speechSynthesis.speak(makeU(text, 0.8, voice, 'en-GB'))
    silentPad(voice)
  }
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

const ENGLISH_PRAISES = [
  'Good job!', 'Well done!', 'Excellent!', 'Perfect!', 'Great!',
  'Amazing!', 'Awesome!', 'Fantastic!', 'Brilliant!', 'You did it!', 'Wow!', 'Yes!',
]

export function speakEnglishTwice(text: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const voice = getEnglishVoice()
    const say = (): Promise<void> => new Promise(resolve => {
      const u = makeU(text, 0.8, voice, 'en-GB')
      u.onend = () => resolve()
      window.speechSynthesis.speak(u)
    })
    await say()
    if (_muted) return
    await delay(500)
    if (_muted) return
    await say()
    if (!_muted) silentPad(voice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

export function speakEnglishPraise(): void {
  speakEnglish(ENGLISH_PRAISES[Math.floor(Math.random() * ENGLISH_PRAISES.length)])
}

export function speakEnglishSuccess(word: string): void {
  const praise = ENGLISH_PRAISES[Math.floor(Math.random() * ENGLISH_PRAISES.length)]
  speakEnglish(`Yes! ${word}! ${praise}`)
}

export function speakBilingual(english: string, hungarian: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()

  const doSpeak = async (): Promise<void> => {
    const huVoice = getHungarianVoice()
    const enVoice = getEnglishVoice()

    await new Promise<void>(resolve => {
      const u = makeU(english, 0.75, enVoice, 'en-GB')
      u.onend = () => resolve()
      window.speechSynthesis.speak(u)
    })
    if (_muted) return
    await new Promise<void>(resolve => {
      const u = makeU(hungarian, 0.85, huVoice, 'hu-HU')
      u.onend = () => resolve()
      window.speechSynthesis.speak(u)
    })
    if (!_muted) silentPad(huVoice)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}

export interface SpeechPart {
  text: string
  lang: 'hu-HU' | 'en-GB'
  rate?: number       // default: 0.8 for en-GB, 0.85 for hu-HU
  pauseAfter?: number // ms of silence before the next part, default 0
}

// Speaks one utterance, resolving on 'end' — or on 'error', or after a
// safety timeout, whichever comes first. Some engines (Android Chrome
// especially) never fire 'end' for a lang/voice combination that isn't
// actually installed; without this net, awaiting onend directly would hang
// the whole chain forever on that single utterance. The timeout scales
// with text length so short and long phrases both get a realistic budget.
// A couple of trailing spaces guard against Android's last-word/last-
// utterance truncation bug (the same reason silentPad() exists below).
function speakOnePart(text: string, rate: number, voice: SpeechSynthesisVoice | null, lang: 'hu-HU' | 'en-GB'): Promise<void> {
  return new Promise<void>(resolve => {
    let done = false
    const finish = (): void => { if (!done) { done = true; resolve() } }
    const u = makeU(`${text}  `, rate, voice, lang)
    u.onend = finish
    u.onerror = finish
    window.speechSynthesis.speak(u)
    setTimeout(finish, text.length * 80 + 1000)
  })
}

// Egyetlen mondat kimondása, VALÓDI várakozással a végére (onend/onerror/
// biztonsági időzítés) — a speak()/speakEnglish() ezzel szemben "tüzelj és
// felejtsd el" (nem ad vissza semmit), ami audioPlayer.ts playAudio()
// wsFallback-jában azt okozta, hogy a hívó (pl. playSequence) már a
// KÖVETKEZŐ mondatra lépett, miközben az előző még szólt — a második
// speak() elején lévő cancel() néha levágta, néha (Android-flakiness)
// egyáltalán nem hangzott el a második mondat. Ezt hívja audioPlayer.ts,
// amikor egy szöveghez nincs előre legenerált klip.
export async function speakAwait(text: string, lang: 'hu-HU' | 'en-GB', rate?: number): Promise<void> {
  if (_muted) return
  window.speechSynthesis.cancel()
  const voice = lang === 'en-GB' ? getEnglishVoice() : getHungarianVoice()
  const r = rate ?? (lang === 'en-GB' ? 0.8 : 0.85)
  await speakOnePart(text, r, voice, lang)
  if (!_muted) silentPad(voice)
}

// Speaks a mixed-language sequence, each part in its own voice (unlike
// speakChained, which always uses the Hungarian voice regardless of the
// text's language) — for prompts that switch between English and Hungarian.
// Returns a promise that resolves once the whole sequence has finished
// playing, so callers can advance exactly when the speech actually ends
// instead of guessing a fixed delay (Web Speech durations vary by voice/
// rate and a guessed timeout easily cuts a multi-part sequence short).
export async function speakSequence(parts: SpeechPart[]): Promise<void> {
  if (_muted) return
  window.speechSynthesis.cancel()

  // No voiceschanged wait here — getHungarianVoice()/getEnglishVoice()
  // read the cache populated by the eager ensureVoicesLoaded() call at
  // module load (see above), so this never blocks on a per-call basis.
  const huVoice = getHungarianVoice()
  const enVoice = getEnglishVoice()
  let lastVoice = huVoice
  for (const part of parts) {
    if (_muted) return
    const voice = part.lang === 'en-GB' ? enVoice : huVoice
    lastVoice = voice
    const rate = part.rate ?? (part.lang === 'en-GB' ? 0.8 : 0.85)
    await speakOnePart(part.text, rate, voice, part.lang)
    if (_muted) return
    if (part.pauseAfter) await delay(part.pauseAfter)
  }
  if (!_muted) silentPad(lastVoice)
}
