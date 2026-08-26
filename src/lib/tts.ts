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

function getHungarianVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'hu-HU') ??
    voices.find(v => v.lang.startsWith('hu')) ??
    null
  )
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'en-GB') ??
    voices.find(v => v.lang === 'en-US') ??
    voices.find(v => v.lang.startsWith('en')) ??
    null
  )
}

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
  const doSpeak = () => {
    const voice = getHungarianVoice()
    window.speechSynthesis.speak(makeU(text, 0.85, voice))
    silentPad(voice)
  }
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
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
