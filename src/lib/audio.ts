import { Howler } from 'howler'

// Howler alapból 30 mp tétlenség után felfüggeszti a saját (a
// pre-generált Azure klipeket lejátszó) AudioContext-jét, hogy spóroljon
// az akkuval — mobil böngészőkön viszont nem mindig ébred fel megbízhatóan
// utána, ami az "egy idő után elnémul minden hang, csak újraindítás
// segít" jelenség egyik gyanúsítottja (lásd audioLog.ts). Egy gyerekeknek
// szóló appnál a megbízhatóság többet ér, mint az akku-spórolás.
Howler.autoSuspend = false

let audioCtx: AudioContext | null = null

export function unlockAudio(): void {
  if (Howler.ctx?.state === 'suspended') void Howler.ctx.resume()
  if (audioCtx && audioCtx.state !== 'closed') {
    void audioCtx.resume()
    return
  }
  audioCtx = new AudioContext()
  void audioCtx.resume()
}

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

export function playErrorPitt(): void {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(360, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.12)
    gain.gain.setValueAtTime(0.15, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.18)
  } catch {
    // Audio not available
  }
}

export function playBigMelody(): void {
  try {
    const c = getCtx()
    // C major ascending then back: C5 E5 G5 C6 E6 G5 E5 C5
    const notes = [523, 659, 784, 1047, 1319, 784, 659, 523]
    const times = [0, 0.18, 0.36, 0.54, 0.72, 0.98, 1.14, 1.32]
    const durs =  [0.28, 0.28, 0.28, 0.28, 0.38, 0.28, 0.28, 0.55]

    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.type = 'sine'
      const t = c.currentTime + times[i]
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + durs[i])
      osc.start(t)
      osc.stop(t + durs[i] + 0.05)
    })
  } catch {
    // Audio not available
  }
}
