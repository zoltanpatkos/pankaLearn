let _muted = localStorage.getItem('tts-muted') === 'true'

export const isMuted = (): boolean => _muted

export function setMuted(value: boolean): void {
  _muted = value
  localStorage.setItem('tts-muted', String(value))
  if (value) window.speechSynthesis.cancel()
}

export function speak(text: string): void {
  if (_muted) return
  window.speechSynthesis.cancel()
  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hu-HU'
    utterance.rate = 0.85
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
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

  const doSpeak = (): void => {
    let i = 0
    const speakNext = (): void => {
      if (i < syllables.length) {
        const u = new SpeechSynthesisUtterance(syllables[i])
        u.lang = 'hu-HU'
        u.rate = 0.75
        u.pitch = 1.1
        i++
        u.onend = () => setTimeout(speakNext, 300)
        window.speechSynthesis.speak(u)
      } else {
        setTimeout(() => {
          if (_muted) return
          const u = new SpeechSynthesisUtterance(word)
          u.lang = 'hu-HU'
          u.rate = 0.85
          u.pitch = 1.1
          window.speechSynthesis.speak(u)
        }, 200)
      }
    }
    speakNext()
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
  }
}
