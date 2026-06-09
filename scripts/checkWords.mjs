#!/usr/bin/env node
/**
 * Magyar szótagolás-ellenőrző — readingWords.ts adatbázishoz
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = join(__dirname, '../src/data/readingWords.ts')
const content = readFileSync(filePath, 'utf-8')

// ── Adatok kinyerése ──────────────────────────────────────────────────────────

const entries = []
const entryRegex = /syllables:\s*\[([^\]]+)\].*?word:\s*'([^']+)'.*?level:\s*(\d+)/gs
let match
while ((match = entryRegex.exec(content)) !== null) {
  const syllables = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  const word = match[2]
  const level = parseInt(match[3])
  entries.push({ syllables, word, level })
}

// ── Magyar fonetika ───────────────────────────────────────────────────────────

const VOWELS = new Set('aáeéiíoóöőuúüű')

// Kétjegyű mássalhangzók — hosszútól rövid felé rendezve, hogy a 'dzs' > 'dz' > 'cs' stb.
const DIGRAPHS = ['dzs', 'dz', 'cs', 'sz', 'zs', 'ny', 'ly', 'gy', 'ty']

function isVowel(ch) {
  return VOWELS.has(ch.toLowerCase())
}

/** Szó → fonéma-tömb (kétjegyűek egységként) */
function toPhonemes(word) {
  const lower = word.toLowerCase()
  const result = []
  let i = 0
  while (i < lower.length) {
    let found = false
    for (const dg of DIGRAPHS) {
      if (lower.startsWith(dg, i)) {
        result.push(dg)
        i += dg.length
        found = true
        break
      }
    }
    if (!found) {
      result.push(lower[i])
      i++
    }
  }
  return result
}

function isPhonemeVowel(ph) {
  return ph.length === 1 && VOWELS.has(ph)
}

/** Szabályalapú szótagolás-javaslat */
function suggestSyllabification(word) {
  const phonemes = toPhonemes(word)
  const vowelIdx = phonemes.map((p, i) => isPhonemeVowel(p) ? i : -1).filter(i => i >= 0)

  if (vowelIdx.length === 0) return [word.toUpperCase()]
  if (vowelIdx.length === 1) return [word.toUpperCase()]

  const syllables = []
  let start = 0

  for (let v = 0; v < vowelIdx.length - 1; v++) {
    const vi = vowelIdx[v]
    const nextVi = vowelIdx[v + 1]
    const cons = phonemes.slice(vi + 1, nextVi)  // mássalhangzók a két magánhangzó között

    let splitAfter
    if (cons.length === 0) {
      // Két szomszédos magánhangzó → külön szótagba
      splitAfter = vi + 1
    } else if (cons.length === 1) {
      // Egy mássalhangzó → a következő szótaghoz (V | CV)
      splitAfter = vi + 1
    } else {
      // Két vagy több mássalhangzó → első az előzőhöz, többi a következőhöz (VC | CV+)
      splitAfter = vi + 2
    }

    syllables.push(phonemes.slice(start, splitAfter).join('').toUpperCase())
    start = splitAfter
  }
  syllables.push(phonemes.slice(start).join('').toUpperCase())
  return syllables
}

// ── Ellenőrzés ────────────────────────────────────────────────────────────────

const errors = []
const suspicious = []

for (const entry of entries) {
  const { syllables, word, level } = entry

  // 1. ELLENŐRZÉS: Szótagok összefűzve = szó?
  const joined = syllables.join('').toLowerCase()
  const wordLower = word.toLowerCase()

  if (joined !== wordLower) {
    errors.push({
      word, level,
      stored: syllables,
      issue: `Összefűzve: "${joined}" ≠ szó: "${wordLower}"`,
      suggested: suggestSyllabification(word),
    })
    continue
  }

  // 2. ELLENŐRZÉS: Szabályalapú javaslattal egyezik?
  const suggested = suggestSyllabification(word)
  const storedStr = syllables.join('-')
  const suggestedStr = suggested.join('-')

  if (storedStr !== suggestedStr) {
    // Szótagszám is eltér?
    const countDiff = syllables.length !== suggested.length
    suspicious.push({
      word, level,
      stored: storedStr,
      suggested: suggestedStr,
      countDiff,
    })
  }
}

// ── Kimenet ───────────────────────────────────────────────────────────────────

const hr = '─'.repeat(62)
console.log('\n╔══════════════════════════════════════════════════════════════╗')
console.log('║     Magyar szótagolás-ellenőrző — readingWords.ts           ║')
console.log('╚══════════════════════════════════════════════════════════════╝\n')

if (errors.length > 0) {
  console.log(`❌  HIBÁK (${errors.length} db) — szótagok ≠ szó:`)
  console.log(hr)
  for (const e of errors) {
    console.log(`  Szó:        "${e.word}"  (Level ${e.level})`)
    console.log(`  Tárolt:     [${e.stored.map(s => `'${s}'`).join(', ')}]`)
    console.log(`  Probléma:   ${e.issue}`)
    console.log(`  Javasolt:   [${e.suggested.map(s => `'${s}'`).join(', ')}]  →  ${e.suggested.join('-')}`)
    console.log()
  }
} else {
  console.log(`❌  HIBÁK: nincs\n`)
}

if (suspicious.length > 0) {
  console.log(`⚠️   GYANÚS (${suspicious.length} db) — eltér a szabályalapú javaslattól:`)
  console.log(hr)
  for (const s of suspicious) {
    const flag = s.countDiff ? '  ⚠ SZÓTAGSZÁM ELTÉR!' : ''
    console.log(`  Szó:        "${s.word}"  (Level ${s.level})${flag}`)
    console.log(`  Tárolt:     ${s.stored}`)
    console.log(`  Javasolt:   ${s.suggested}`)
    console.log()
  }
  console.log('  Megjegyzés: A "gyanús" nem feltétlenül hiba — pl. AU-TÓ')
  console.log('  szabályosan A-U-TÓ lenne, de pedagógiailag AU-TÓ is elfogadott.\n')
} else {
  console.log(`⚠️   GYANÚS: nincs\n`)
}

console.log(hr)
console.log(`  Összesen ellenőrzött: ${entries.length} szó`)
console.log(`  Hibák: ${errors.length}  |  Gyanús: ${suspicious.length}`)
console.log(hr + '\n')
