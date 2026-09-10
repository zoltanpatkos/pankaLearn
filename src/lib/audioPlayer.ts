import { Howl } from 'howler'
import { isMuted, speakAwait, speakSyllabified, speakDigraphHint } from './tts'
import { logAudioEvent } from './audioLog'

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
  const prefix = type === 'syllable' ? 'hu_sy' : (lang === 'hu-HU' ? 'hu' : 'en')
  return `${prefix}_${toSlug(text)}`
}

// ── Manifest — egyszer töltjük be induláskor ──────────────────────────────────
// A generateAudio.mjs végén írja ki: public/audio/manifest.json
// String array az elérhető fájlnevekről kiterjesztés nélkül.

const _available = new Set<string>()
const _ready: Promise<void> = fetch(`${import.meta.env.BASE_URL}audio/manifest.json`)
  .then(r => r.json() as Promise<string[]>)
  .then(files => files.forEach(f => _available.add(f)))
  .catch(() => {}) // ha nincs manifest → minden Web Speech API fallback

// ── Howler cache ──────────────────────────────────────────────────────────────
//
// LRU-korlátos: a betöltött (dekódolt) klipek a memóriában maradnak, amíg a
// Howl-példány létezik. Egy hosszabb angol-modul munkamenet közben könnyen
// 100+ különböző szót/mondatot lejátszik a gyerek — korlát nélkül ez a
// dekódolt hangpufferek korlátlan felhalmozódásához vezetne, ami a
// gyanú szerint az "egy idő után elnémul minden hang" jelenség oka
// (lásd MAX_HOWLS lent + a play() biztonsági időzítése).
const MAX_HOWLS = 60
const _howls = new Map<string, Howl>()

function getHowl(slug: string): Howl {
  const existing = _howls.get(slug)
  if (existing) {
    // Frissen használt — kerüljön a Map végére (LRU: a legrégebben
    // használt van elöl, azt dobjuk el elsőként).
    _howls.delete(slug)
    _howls.set(slug, existing)
    return existing
  }
  if (_howls.size >= MAX_HOWLS) {
    const oldest = _howls.keys().next().value
    if (oldest) {
      _howls.get(oldest)?.unload()
      _howls.delete(oldest)
      logAudioEvent(`evict ${oldest} (cache full at ${MAX_HOWLS})`)
    }
  }
  const howl = new Howl({ src: [`${import.meta.env.BASE_URL}audio/${slug}.mp3`] })
  _howls.set(slug, howl)
  return howl
}

// ── Web Speech API fallback ───────────────────────────────────────────────────
// Awaitable — a syllabizált ág kivételével (speakSyllabified nem ad vissza
// promise-t, ritkán használt hint-eset), hogy a hívó (playSequence stb.)
// tényleg megvárja, míg a mondat elhangzik, mielőtt a következőre lépne.

async function wsFallback(
  text: string,
  lang: 'hu-HU' | 'en-GB',
  options?: { syllables?: string[] }
): Promise<void> {
  if (options?.syllables) {
    speakSyllabified(options.syllables, text)
    return
  }
  await speakAwait(text, lang)
}

// Lejátssza a howl-t, és 'end'-en, hibán, VAGY egy biztonsági időzítésen
// (amelyik előbb bekövetkezik) felold — enélkül egy csendben elakadt
// .play() (pl. a fenti cache-korlát nélkül felhalmozódott memórianyomás
// miatt) örökre függve hagyná az őt váró playAudio()/playDigraphHint()
// hívást, és minden utána jövő hang leállna vele (lásd MAX_HOWLS fent).
const HOWL_TIMEOUT_MS = 8000

function playHowlSafely(slug: string, howl: Howl, onFail: () => void): Promise<void> {
  return new Promise(resolve => {
    let done = false
    const finish = (): void => { if (!done) { done = true; resolve() } }
    howl.once('end', finish)
    howl.once('loaderror', () => { logAudioEvent(`loaderror ${slug}`); onFail(); finish() })
    howl.once('playerror', () => { logAudioEvent(`playerror ${slug}`); onFail(); finish() })
    howl.play()
    setTimeout(() => {
      if (!done) {
        logAudioEvent(`timeout ${slug} (cache size ${_howls.size})`)
        onFail()
        finish()
      }
    }, HOWL_TIMEOUT_MS)
  })
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

  // Kill any Web Speech utterance a reward hook (triggerMicro/Small/Error)
  // may have just queued — it runs on a separate audio pipeline from Howler,
  // so without this it would play on top of the clip below.
  window.speechSynthesis.cancel()

  await _ready

  const type = options?.syllables ? 'syllable' : 'normal'
  const slug = slugFor(text, lang, type)

  if (_available.has(slug)) {
    return playHowlSafely(slug, getHowl(slug), () => wsFallback(text, lang, options))
  }

  await wsFallback(text, lang, options)
}

/**
 * Kétjegyű mássalhangzó elnyújtás-klip lejátszása (előre generált Azure MP3,
 * "hu_dg_{szó}"), Web Speech fallback-kel ha a fájl nincs meg.
 */
export async function playDigraphHint(word: string, syllable: string): Promise<void> {
  if (isMuted()) return
  window.speechSynthesis.cancel()
  await _ready
  const slug = `hu_dg_${toSlug(word)}`
  if (_available.has(slug)) {
    return playHowlSafely(slug, getHowl(slug), () => speakDigraphHint(word, syllable))
  }
  speakDigraphHint(word, syllable)
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
