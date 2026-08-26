/**
 * Azure Neural TTS audio pre-generator
 *
 * Usage:
 *   node scripts/generateAudio.mjs
 *
 * Reads AZURE_SPEECH_KEY and AZURE_SPEECH_REGION from .env
 * Saves MP3 files to public/audio/
 * Bemeneti lista: scripts/audioManifest.mjs (AUDIO_ENTRIES)
 *
 * Entry fields:
 *   text      — a szöveg
 *   lang      — 'hu-HU' | 'en-GB'
 *   type      — 'normal' (alapért.) | 'syllable' (Meixner-módszer, Noémi hang + break elemek)
 *   syllables — string[] (csak syllable type-nál; az egyes szótagok kisbetűsen)
 *
 * Hangstratégia:
 *   type:'syllable'          → hu-HU-NoemiNeural  (lassabb, tisztább szótagoláshoz)
 *   type:'normal', hu-HU     → hu-HU-Lilla:MAI-Voice-2
 *   type:'normal', en-GB     → en-GB-Ada:DragonHDLatestNeural
 *
 * Fájlnév: {prefix}_{slug}.mp3   (syllable → "hu_sy_{slug}.mp3")
 */

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AUDIO_ENTRIES } from './audioManifest.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'audio')

// ── Hang konfiguráció ─────────────────────────────────────────────────────────

const VOICE_NORMAL = {
  'hu-HU': 'hu-HU-Lilla:MAI-Voice-2',
  'en-GB': 'en-GB-Ada:DragonHDLatestNeural',
}
const VOICE_SYLLABLE = 'hu-HU-NoemiNeural'

// ── Slug + fájlnév ────────────────────────────────────────────────────────────

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/·/g, '')           // szótag-elválasztó eltávolítása
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

export function audioFilename(text, lang, type = 'normal') {
  const prefix = type === 'syllable' ? 'hu_sy' : (lang === 'hu-HU' ? 'hu' : 'en')
  return `${prefix}_${toSlug(text)}.mp3`
}

// ── SSML összeállítás ─────────────────────────────────────────────────────────

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildSSML(entry) {
  const { text, lang, type = 'normal', syllables } = entry

  if (type === 'syllable') {
    // syllables mező (string[]) vagy '·' elválasztás fallback
    const parts = syllables
      ? syllables.map(s => s.toLowerCase())
      : text.split('·').map(s => s.trim())
    const fullWord = parts.join('')
    const inner = parts.map(escapeXml).join(" <break time='300ms'/> ")
      + ` <break time='500ms'/> ${escapeXml(fullWord)}`
    return (
      `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='hu-HU'>` +
      `<voice name='${VOICE_SYLLABLE}'>${inner}</voice></speak>`
    )
  }

  const voice = VOICE_NORMAL[lang]
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
    `<voice name='${voice}'>${escapeXml(text)}</voice></speak>`
  )
}

// ── Azure hívások ─────────────────────────────────────────────────────────────

async function fetchToken(key, region) {
  const res = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key } }
  )
  if (!res.ok) throw new Error(`issueToken failed: HTTP ${res.status}`)
  return res.text()
}

async function callAzureTTS(ssml, token, region) {
  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err || '(empty body)'}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

// ── Egy fájl generálása ───────────────────────────────────────────────────────

async function generate(entry, token, region, { overwrite = false } = {}) {
  const { text, lang, type = 'normal' } = entry
  const filename = entry.file ?? audioFilename(text, lang, type)
  const outPath  = path.join(OUT_DIR, filename)

  if (!overwrite && fs.existsSync(outPath)) {
    console.log(`  skip  ${filename}`)
    return { filename, skipped: true }
  }

  const ssml = buildSSML(entry)
  const mp3  = await callAzureTTS(ssml, token, region)
  fs.writeFileSync(outPath, mp3)
  console.log(`  ✓     ${filename}  (${mp3.length} bytes)`)
  return { filename, skipped: false }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const DELAY_MS = 150  // API hívások között (rate limit elkerülése)

async function main() {
  const key    = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION
  if (!key || !region) { console.error('Missing .env'); process.exit(1) }

  // Deduplikálás: azonos text+lang+type kombináció csak egyszer
  const seen = new Set()
  const entries = []
  for (const e of AUDIO_ENTRIES) {
    const key_ = `${e.lang}|${e.type ?? 'normal'}|${e.text}`
    if (!seen.has(key_)) { seen.add(key_); entries.push(e) }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log(`Azure TTS → ${OUT_DIR}`)
  console.log(`Region: ${region}  |  Bejegyzések (dedup után): ${entries.length}\n`)

  let token = await fetchToken(key, region)
  console.log('Auth token OK.\n')
  let tokenFetchedAt = Date.now()

  let generated = 0, skipped = 0, failed = 0
  const failures = []
  const total = entries.length

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]

    if (Date.now() - tokenFetchedAt > 9 * 60 * 1000) {
      process.stdout.write('  [token refresh]\n')
      token = await fetchToken(key, region)
      tokenFetchedAt = Date.now()
    }

    try {
      const result = await generate(entry, token, region)
      if (result.skipped) {
        skipped++
      } else {
        generated++
        // Csak generálásnál várunk — átugrott fájloknál nincs API hívás
        await new Promise(r => setTimeout(r, DELAY_MS))
      }
    } catch (err) {
      failures.push({ text: entry.text, lang: entry.lang, err: err.message })
      console.error(`  ✗  [${entry.lang}] "${entry.text.substring(0, 60)}"\n     ${err.message}`)
      failed++
    }

    // Progress minden 50. elemnél (és az utolsónál)
    if ((i + 1) % 50 === 0 || i + 1 === total) {
      const pct = Math.round((i + 1) / total * 100)
      console.log(`  ── ${i + 1}/${total} (${pct}%)  gen:${generated}  skip:${skipped}  err:${failed}`)
    }
  }

  // Manifest kiírás — public/audio/manifest.json
  const allFiles = fs.readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.mp3'))
    .map(f => f.replace(/\.mp3$/, ''))
    .sort()
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(allFiles))

  console.log('\n══════════════════════════════════════════')
  console.log(`  Kész!  Generált: ${generated}  Átugrott: ${skipped}  Hibás: ${failed}`)
  console.log(`  Manifest: ${allFiles.length} fájl → public/audio/manifest.json`)
  if (failures.length > 0) {
    console.log(`\n  Hibás bejegyzések (max 10):`)
    failures.slice(0, 10).forEach(f =>
      console.log(`    [${f.lang}] "${f.text.substring(0, 70)}"  →  ${f.err}`)
    )
  }
  console.log('══════════════════════════════════════════\n')
}

main()
