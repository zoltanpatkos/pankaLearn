/**
 * Voice comparison generator — one-off script
 * Usage: node scripts/compareVoices.mjs
 */

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'audio')

async function fetchToken(key, region) {
  const res = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key } }
  )
  if (!res.ok) throw new Error(`issueToken failed: HTTP ${res.status}`)
  return res.text()
}

function buildSSML(text, lang, voice) {
  const escaped = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
    `<voice name='${voice}'>${escaped}</voice></speak>`
  )
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
    throw new Error(`HTTP ${res.status}: ${err || '(empty)'}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

const COMPARISONS = [
  // Magyar összehasonlítás
  { text: 'Helyes! Szuper vagy!',                lang: 'hu-HU', voice: 'hu-HU-NoemiNeural',      file: 'hu_noemi_helyes_szuper.mp3' },
  { text: 'Helyes! Szuper vagy!',                lang: 'hu-HU', voice: 'hu-HU-Lilla:MAI-Voice-2', file: 'hu_lilla_helyes_szuper.mp3' },

  { text: 'Hol van a kutya?',                    lang: 'hu-HU', voice: 'hu-HU-NoemiNeural',      file: 'hu_noemi_hol_van_a_kutya.mp3' },
  { text: 'Hol van a kutya?',                    lang: 'hu-HU', voice: 'hu-HU-Lilla:MAI-Voice-2', file: 'hu_lilla_hol_van_a_kutya.mp3' },

  { text: 'Próbáld újra, együtt megoldjuk!',     lang: 'hu-HU', voice: 'hu-HU-NoemiNeural',      file: 'hu_noemi_probald_ujra_egyutt.mp3' },
  { text: 'Próbáld újra, együtt megoldjuk!',     lang: 'hu-HU', voice: 'hu-HU-Lilla:MAI-Voice-2', file: 'hu_lilla_probald_ujra_egyutt.mp3' },

  // Angol összehasonlítás
  { text: 'Well done! Amazing!',                 lang: 'en-GB', voice: 'en-GB-SoniaNeural',                 file: 'en_sonia_well_done_amazing.mp3' },
  { text: 'Well done! Amazing!',                 lang: 'en-GB', voice: 'en-GB-Ada:DragonHDLatestNeural',    file: 'en_ada_well_done_amazing.mp3' },
]

async function main() {
  const key    = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION
  if (!key || !region) { console.error('Missing .env'); process.exit(1) }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const token = await fetchToken(key, region)
  console.log(`Auth token OK  |  Region: ${region}  |  Files: ${COMPARISONS.length}\n`)

  for (const { text, lang, voice, file } of COMPARISONS) {
    const outPath = path.join(OUT_DIR, file)
    try {
      const ssml = buildSSML(text, lang, voice)
      const mp3  = await callAzureTTS(ssml, token, region)
      fs.writeFileSync(outPath, mp3)
      console.log(`  ✓  ${file}  (${mp3.length} bytes)`)
    } catch (err) {
      console.error(`  ✗  ${file}  →  ${err.message}`)
    }
  }

  console.log('\nDone. Fájlok: public/audio/')
}

main()
