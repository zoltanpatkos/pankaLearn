/**
 * Noémi hang teszt — 8 MathModule mondat generálása
 * Fájlnév: hu_noemi_{slug}.mp3 (Lilla verziók érintetlenek maradnak)
 *
 * Futtatás: node scripts/testNoemi.mjs
 */

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'audio')

const VOICE = 'hu-HU-NoemiNeural'

const TEST_SENTENCES = [
  'Hány pötty villan fel?',
  'Melyik két rúd ér ki ennyire?',
  'Melyik játékot választod?',
  'Visszamegyünk a kertbe?',
  'Egyensúlyban vagy! Szuper!',
  'Még nem ér ki! Próbáld mással!',
  'Túl hosszú lett! Próbáld mással!',
  'Új ruha vár rád a szekrényben!',
]

function toSlug(text) {
  return text
    .toLowerCase()
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

function buildSSML(text) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='hu-HU'>` +
    `<voice name='${VOICE}'>${escaped}</voice></speak>`
  )
}

async function fetchToken(key, region) {
  const res = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key } }
  )
  if (!res.ok) throw new Error(`issueToken failed: HTTP ${res.status}`)
  return res.text()
}

async function callTTS(ssml, token, region) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const key    = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION
  if (!key || !region) { console.error('Hiányzik a .env (AZURE_SPEECH_KEY, AZURE_SPEECH_REGION)'); process.exit(1) }

  const token = await fetchToken(key, region)
  console.log(`Noémi hang teszt — ${TEST_SENTENCES.length} mondat\n`)

  for (const text of TEST_SENTENCES) {
    const filename = `hu_noemi_${toSlug(text)}.mp3`
    const outPath  = path.join(OUT_DIR, filename)
    if (fs.existsSync(outPath)) {
      console.log(`  skip  ${filename}`)
      continue
    }
    try {
      const mp3 = await callTTS(buildSSML(text), token, region)
      fs.writeFileSync(outPath, mp3)
      console.log(`  ✓     ${filename}  (${mp3.length} bytes)`)
      await new Promise(r => setTimeout(r, 150))
    } catch (err) {
      console.error(`  ✗     "${text}"  →  ${err.message}`)
    }
  }

  // Manifest frissítés
  const allFiles = fs.readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.mp3'))
    .map(f => f.replace(/\.mp3$/, ''))
    .sort()
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(allFiles))
  console.log(`\nManifest frissítve: ${allFiles.length} fájl`)
}

main()
