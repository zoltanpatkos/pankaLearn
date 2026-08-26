import { Howl } from 'howler'
import { isMuted, speak, speakEnglish, speakSyllabified } from './tts'

// ── Slug (megegyezik a generateAudio.mjs toSlug logikájával) ─────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/·/g, '')
    .replace(/[áàâ]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòôő]/g, 'o')
    .replace(/[öő]/g, 'o')
    .replace(/[úùûű]/g, 'u')
    .replace(/[üű]/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 60)
}

function slugFor(
  text: string,
  lang: 'hu-HU' | 'en-GB',
  type: 'normal' | 'syllable'
): string {
  // TESZT: hu_noemi_ prefix → visszaállításhoz: 'hu' : 'en'
  const prefix = type === 'syllable' ? 'hu_sy' : (lang === 'hu-HU' ? 'hu_noemi' : 'en')
  return `${prefix}_${toSlug(text)}`
}

// ── Manifest — egyszer töltjük be induláskor ──────────────────────────────────
// A generateAudio.mjs végén írja ki: public/audio/manifest.json
// String array az elérhető fájlnevekről kiterjesztés nélkül.

const _available = new Set<string>()
const _ready: Promise<void> = fetch('/audio/manifest.json')
  .then(r => r.json() as Promise<string[]>)
  .then(files => files.forEach(f => _available.add(f)))
  .catch(() => {}) // ha nincs manifest → minden Web Speech API fallback

// ── Howler cache ──────────────────────────────────────────────────────────────

const _howls = new Map<string, Howl>()

function getHowl(slug: string): Howl {
  if (!_howls.has(slug)) {
    _howls.set(slug, new Howl({ src: [`/audio/${slug}.mp3`] }))
  }
  return _howls.get(slug)!
}

// ── Web Speech API fallback ───────────────────────────────────────────────────

function wsFallback(
  text: string,
  lang: 'hu-HU' | 'en-GB',
  options?: { syllables?: string[] }
): void {
  if (options?.syllables) {
    speakSyllabified(options.syllables, text)
  } else if (lang === 'en-GB') {
    speakEnglish(text)
  } else {
    speak(text)
  }
}

// ── Fő API ───────────────────────────────────────────────────────────────────

/**
 * Szöveg lejátszása: előre generált MP3 (Howler.js) ha létezik,
 * különben Web Speech API fallback. Muted állapotban azonnal resolve.
 *
 * Syllabizált szavakhoz: playAudio(szó, 'hu-HU', { syllables: ['ma','cska'] })
 * → hu_sy_macska.mp3 keresése, fallback: speakSyllabified()
 */
export async function playAudio(
  text: string,
  lang: 'hu-HU' | 'en-GB',
  options?: { syllables?: string[] }
): Promise<void> {
  if (isMuted()) return

  await _ready

  const type = options?.syllables ? 'syllable' : 'normal'
  const slug = slugFor(text, lang, type)

  if (_available.has(slug)) {
    return new Promise(resolve => {
      const howl = getHowl(slug)
      howl.once('end', () => resolve())
      howl.once('loaderror', () => { wsFallback(text, lang, options); resolve() })
      howl.once('playerror', () => { wsFallback(text, lang, options); resolve() })
      howl.play()
    })
  }

  wsFallback(text, lang, options)
}

/**
 * Induláskor hívható: betölti a memóriába a leggyakrabban használt hangokat,
 * hogy az első lejátszásnál ne legyen késleltetés.
 */
export function preloadAudio(
  entries: Array<{ text: string; lang: 'hu-HU' | 'en-GB'; syllables?: string[] }>
): void {
  void _ready.then(() => {
    for (const { text, lang, syllables } of entries) {
      const slug = slugFor(text, lang, syllables ? 'syllable' : 'normal')
      if (_available.has(slug)) getHowl(slug)
    }
  })
}
