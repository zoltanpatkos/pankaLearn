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
