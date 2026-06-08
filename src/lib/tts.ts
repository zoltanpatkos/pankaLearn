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

function makeU(text: string, rate: number, voice: SpeechSynthesisVoice | null): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hu-HU'
  u.rate = rate
  u.pitch = 1.1
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
