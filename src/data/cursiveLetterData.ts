import type { LetterDef } from './writingData'

// Magyar iskolai kötött (dőlt, összekötött) írás — a teljes ábécé (kis- és
// nagybetűk külön gyakorlatban), a "Magyar Script Basic" betűtípussal
// rajzolva (lásd src/index.css) — Zsoltai Kálmán, Free for Personal Use,
// https://betutipusok.hu/fonts/13128/magyar_script_basic.html — nem kézzel
// megrajzolt vonalakkal, mint a nyomtatott nagybetűknél (writingData.ts), a
// betűforma így pontosan a hivatalos tantervi alakot követi.
//
// Nincs irány-nyíl/kezdőpont-jelzés: a font maga nem árulja el, milyen
// sorrendben és merről indulva rajzolta a valódi tollvezetés, és a
// munkafüzet-képek alapján rekonstruált irányok pontatlannak bizonyultak —
// félrevezető nyíl/pötty helyett inkább nincs semmi, csak a betű alakja
// segít a követésben. A füzetvonalakhoz (cursiveRuledLines) való illesztés
// magától a fonttól jön (minden betű a saját, valódi x-magasságáig/
// szármagasságáig rajzolódik) — nincs hozzá betűnkénti adat.

interface CursiveEntry {
  letter: string
  level: 1 | 2 | 3
  name: string // kimondott betűnév (magyar ábécé betűnevek)
}

// Sorrend: a hivatalos "magyar ábécé írott kisbetűi" tábla sorrendje.
const ENTRIES: CursiveEntry[] = [
  // Level 1 — egyszerű, gyakori, ékezet és kettőzött betű nélküli alapbetűk
  { letter: 'a', level: 1, name: 'a' },
  { letter: 'e', level: 1, name: 'e' },
  { letter: 'i', level: 1, name: 'i' },
  { letter: 'o', level: 1, name: 'o' },
  { letter: 'u', level: 1, name: 'u' },
  { letter: 'c', level: 1, name: 'cé' },
  { letter: 'l', level: 1, name: 'el' },
  { letter: 'm', level: 1, name: 'em' },
  { letter: 'n', level: 1, name: 'en' },

  // Level 2 — ékezetes magánhangzók + további mássalhangzók
  { letter: 'á', level: 2, name: 'á' },
  { letter: 'é', level: 2, name: 'é' },
  { letter: 'í', level: 2, name: 'í' },
  { letter: 'ó', level: 2, name: 'ó' },
  { letter: 'ö', level: 2, name: 'ö' },
  { letter: 'ő', level: 2, name: 'ő' },
  { letter: 'ú', level: 2, name: 'ú' },
  { letter: 'ü', level: 2, name: 'ü' },
  { letter: 'ű', level: 2, name: 'ű' },
  { letter: 'b', level: 2, name: 'bé' },
  { letter: 'd', level: 2, name: 'dé' },
  { letter: 'f', level: 2, name: 'ef' },
  { letter: 'g', level: 2, name: 'gé' },
  { letter: 'h', level: 2, name: 'há' },
  { letter: 'j', level: 2, name: 'jé' },
  { letter: 'k', level: 2, name: 'ká' },
  { letter: 'p', level: 2, name: 'pé' },
  { letter: 'q', level: 2, name: 'kú' },
  { letter: 'r', level: 2, name: 'er' },
  { letter: 's', level: 2, name: 'es' },
  { letter: 't', level: 2, name: 'té' },
  { letter: 'v', level: 2, name: 'vé' },
  { letter: 'w', level: 2, name: 'dupla vé' },
  { letter: 'x', level: 2, name: 'iksz' },
  { letter: 'y', level: 2, name: 'ipszilon' },
  { letter: 'z', level: 2, name: 'zé' },

  // Level 3 — kettőshangzók / összetett betűk (legnehezebb, két hangot jelölnek)
  { letter: 'cs', level: 3, name: 'csé' },
  { letter: 'dz', level: 3, name: 'dzé' },
  { letter: 'dzs', level: 3, name: 'dzsé' },
  { letter: 'gy', level: 3, name: 'gyé' },
  { letter: 'ly', level: 3, name: 'ely' },
  { letter: 'ny', level: 3, name: 'eny' },
  { letter: 'sz', level: 3, name: 'esz' },
  { letter: 'ty', level: 3, name: 'tyé' },
  { letter: 'zs', level: 3, name: 'zsé' },
]

// Nagybetűk — mindegyik a szármagasság-vonalig ér (nincs külön x-magasságuk).
const UPPER_ENTRIES: CursiveEntry[] = [
  { letter: 'A', level: 1, name: 'a' },
  { letter: 'E', level: 1, name: 'e' },
  { letter: 'I', level: 1, name: 'i' },
  { letter: 'O', level: 1, name: 'o' },
  { letter: 'U', level: 1, name: 'u' },
  { letter: 'C', level: 1, name: 'cé' },
  { letter: 'L', level: 1, name: 'el' },
  { letter: 'M', level: 1, name: 'em' },
  { letter: 'N', level: 1, name: 'en' },

  { letter: 'Á', level: 2, name: 'á' },
  { letter: 'É', level: 2, name: 'é' },
  { letter: 'Í', level: 2, name: 'í' },
  { letter: 'Ó', level: 2, name: 'ó' },
  { letter: 'Ö', level: 2, name: 'ö' },
  { letter: 'Ő', level: 2, name: 'ő' },
  { letter: 'Ú', level: 2, name: 'ú' },
  { letter: 'Ü', level: 2, name: 'ü' },
  { letter: 'Ű', level: 2, name: 'ű' },
  { letter: 'B', level: 2, name: 'bé' },
  { letter: 'D', level: 2, name: 'dé' },
  { letter: 'F', level: 2, name: 'ef' },
  { letter: 'G', level: 2, name: 'gé' },
  { letter: 'H', level: 2, name: 'há' },
  { letter: 'J', level: 2, name: 'jé' },
  { letter: 'K', level: 2, name: 'ká' },
  { letter: 'P', level: 2, name: 'pé' },
  { letter: 'Q', level: 2, name: 'kú' },
  { letter: 'R', level: 2, name: 'er' },
  { letter: 'S', level: 2, name: 'es' },
  { letter: 'T', level: 2, name: 'té' },
  { letter: 'V', level: 2, name: 'vé' },
  { letter: 'W', level: 2, name: 'dupla vé' },
  { letter: 'X', level: 2, name: 'iksz' },
  { letter: 'Y', level: 2, name: 'ipszilon' },
  { letter: 'Z', level: 2, name: 'zé' },

  { letter: 'Cs', level: 3, name: 'csé' },
  { letter: 'Dz', level: 3, name: 'dzé' },
  { letter: 'Dzs', level: 3, name: 'dzsé' },
  { letter: 'Gy', level: 3, name: 'gyé' },
  { letter: 'Ly', level: 3, name: 'ely' },
  { letter: 'Ny', level: 3, name: 'eny' },
  { letter: 'Sz', level: 3, name: 'esz' },
  { letter: 'Ty', level: 3, name: 'tyé' },
  { letter: 'Zs', level: 3, name: 'zsé' },
]

// A "Magyar Script Basic" betűtípus x-magassága a betűméretéhez képest
// jóval kisebb, mint egy tipikus fonté, ezért a fontScale itt jelentősen
// nagyobb (>1), mint amit egy "normál" fontnál várnánk. Egyetlen, kényelmes
// méret van (nem kell "nagy/kis" választás — a vászon szélessége adja a
// tényleges méretet a képernyőn).
const FONT_SCALE = 1

// Az alapvonal pozíciója (a sor magasságának %-ában), és a betűtípus
// tényleges arányai (ctx.measureText().actualBoundingBoxAscent/Descent
// alapján, 300px-es mérésből a "Magyar Script Basic" fontra: x-magasság ≈
// 0.297×, szármagasság ≈ 0.578×, szárnyúlvány (pl. "gy", "j", "q") ≈
// 0.281× a betűméreten belül) — ez adja a füzetvonalak helyes illesztését
// a betű alakjához.
export const CURSIVE_BASELINE_Y = 66
export const CURSIVE_X_HEIGHT_RATIO = 0.297
export const CURSIVE_ASCENDER_RATIO = 0.578

export function cursiveRuledLines(): number[] {
  const fontScalePct = FONT_SCALE * 100
  return [
    CURSIVE_BASELINE_Y,
    CURSIVE_BASELINE_Y - CURSIVE_X_HEIGHT_RATIO * fontScalePct,
    CURSIVE_BASELINE_Y - CURSIVE_ASCENDER_RATIO * fontScalePct,
  ]
}

function cursiveDraw(letter: string): LetterDef['draw'] {
  return (ctx, w, h = w) => {
    ctx.save()
    ctx.fillStyle = '#9ca8b8'
    ctx.font = `${h * FONT_SCALE}px "Magyar Script Basic"`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(letter, w * 0.5, h * (CURSIVE_BASELINE_Y / 100))
    ctx.restore()
  }
}

export type CursiveCase = 'lower' | 'upper'

export function buildCursiveLetterDefs(letterCase: CursiveCase = 'lower'): LetterDef[] {
  const entries = letterCase === 'upper' ? UPPER_ENTRIES : ENTRIES
  return entries.map(({ letter, level, name }) => ({
    letter,
    level,
    ttsInstruction: letterCase === 'upper' ? `Nagy ${name}` : name,
    // Nincs irány/kezdőpont-jelzés (lásd fenti megjegyzés) — ezek a mezők
    // csak a közös LetterDef interfészhez kellenek, a WritingModule kötött
    // írásnál nem rajzolja ki és nem is értékeli őket.
    startX: 50, startY: CURSIVE_BASELINE_Y, endX: 50, endY: CURSIVE_BASELINE_Y,
    expectedAngle: 0,
    arrows: [],
    draw: cursiveDraw(letter),
  }))
}
