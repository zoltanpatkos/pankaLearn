export type PraiseLevel = 'micro' | 'small' | 'medium' | 'big' | 'error'

const BANKS: Record<PraiseLevel, readonly string[]> = {
  micro: [
    'Szuper!', 'Ügyes vagy!', 'Bravó!', 'Klassz!', 'Király!',
    'Ez az!', 'Sikerült!', 'Hűha!', 'Tökéletes!', 'Hopp, megvan!',
    'Pompás!', 'Csodás!', 'Aha, ez az!', 'Igen, így van!', 'Remek!',
  ],
  small: [
    'De ügyes vagy, Panka!', 'Hűha, ez nagyon jól ment!',
    'Csak így tovább!', 'Látszik, hogy figyeltél!',
    'Olyan büszke vagyok rád!', 'Wow, milyen okos vagy!',
    'Ezt megcsináltad!', 'Nagyon jól csinálod!',
  ],
  medium: [
    'Panka, ez fantasztikus volt! Nézd, új ruhát kaptál!',
    'Olyan ügyesen dolgoztál! A kerted is örül neked!',
    'Megint tanultál valamit! Imádlak, mert nem adod fel!',
    'Hűha, ez nagyon szépen ment! Egy új virág is nyílt!',
    'Panki, te kis tündibündi! Folytatjuk?',
    'Ezt nézd! Egy új pillangó jött a kertedbe, mert olyan ügyes vagy!',
  ],
  big: [
    'PANKA! Megcsináltad a mai célt! Nézd a tűzijátékot, neked szól!',
    'Ó, Panka, olyan büszke vagyok rád! Egész nap olyan szorgalmas voltál!',
    'Hurrá! A fád is nőtt egyet! Olyan szép a kerted!',
    'Te vagy a legszorgalmasabb kislány! Tüzijátékot érdemelsz!',
  ],
  error: [
    'Semmi baj, próbáljuk meg újra!',
    'Hopp, ez most nem jött össze. Még egyszer?',
    'Gyakorlással megy! Próbáld újra!',
    'Mindenki gyakorol! Én is segítek, ha kell.',
    'Lehet, hogy a másik a jó! Próbáld meg azt!',
    'Semmi gond! Együtt rájövünk.',
  ],
}

const lastUsed: Partial<Record<PraiseLevel, number>> = {}

export function getRandomPraise(level: PraiseLevel): string {
  const bank = BANKS[level]
  const last = lastUsed[level] ?? -1
  let idx: number
  do {
    idx = Math.floor(Math.random() * bank.length)
  } while (idx === last && bank.length > 1)
  lastUsed[level] = idx
  return bank[idx]
}
