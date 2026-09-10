// Könnyű, localStorage-be író körkörös napló a hanglejátszás hibáinak
// utólagos vizsgálatához (pl. "egy idő után elnémul a hang, csak
// újraindítás után jó megint" jelenség — lásd audioPlayer.ts). Nem
// hívja fel magára a figyelmet, nincs UI hozzá; ha a jelenség
// visszatér, a naplót távoli hibakereséssel (chrome://inspect,
// Application → Local Storage → "pankaAudioLog") lehet megnézni.

const KEY = 'pankaAudioLog'
const MAX_ENTRIES = 200

interface LogEntry {
  t: number // Date.now()
  msg: string
}

export function logAudioEvent(msg: string): void {
  try {
    const raw = localStorage.getItem(KEY)
    const entries: LogEntry[] = raw ? JSON.parse(raw) : []
    entries.push({ t: Date.now(), msg })
    while (entries.length > MAX_ENTRIES) entries.shift()
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    // localStorage megtelt/nem elérhető — a napló nem kritikus, elnyeljük
  }
}

export function readAudioLog(): string {
  try {
    const raw = localStorage.getItem(KEY)
    const entries: LogEntry[] = raw ? JSON.parse(raw) : []
    return entries
      .map(e => `${new Date(e.t).toLocaleTimeString('hu-HU')}  ${e.msg}`)
      .join('\n')
  } catch {
    return ''
  }
}
