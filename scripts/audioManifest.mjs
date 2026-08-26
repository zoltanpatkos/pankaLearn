/**
 * audioManifest.mjs — PankaLearn TTS audio manifest
 *
 * Kategóriánkénti összesítés (dedup előtt):
 *   Magyar dicséretek            39  hu-HU, normal
 *   Angol dicséretek             12  en-GB, normal
 *   Kabala                        9  hu-HU, normal
 *   Navigáció / közös             6  hu-HU, normal
 *   Ruhatár                       5  hu-HU, normal
 *   Írás modul                   59  hu-HU, normal
 *   Olvasás — fix szövegek        9  hu-HU, normal
 *   Olvasás — szótagolt szavak   23  hu-HU, syllable  (READING_WORDS)
 *   Olvasás — rímpár szavak      20  hu-HU, syllable  (RHYME_PAIRS)
 *   Olvasás — betűhangok         15  hu-HU, normal
 *   Olvasás — betűépítő szavak   14  hu-HU, normal
 *   Matematika                   25  hu-HU, normal
 *   Angol — TPR EN               12  en-GB, normal
 *   Angol — TPR HU               12  hu-HU, normal
 *   Angol — Pointer (87×4)      348  en-GB + hu-HU, normal
 *   Angol — Feed EN              10  en-GB, normal
 *   Angol — Feed HU              10  hu-HU, normal
 *   Angol — Memory hangkártyák   90  en-GB, normal   pl. "Cat!"
 *   Angol — Memory pártalálás    90  en-GB, normal   pl. "Great! Cat!"
 *   Angol — SAY-IT szavak        43  en-GB, normal
 *   Angol — Feed visszajelzés    18  en-GB, normal   Hmmm×9 + Yes!×9
 *   Angol — Feed yuck            12  en-GB, normal   3 yuck × 4 disztráktor
 *   Angol — HU instrukció         2  hu-HU, normal
 *   ────────────────────────────────────────────────
 *   ÖSSZESEN (dedup előtt)      883
 *
 * Megjegyzések:
 *   - Néhány szöveg több kategóriában is szerepel (pl. "Visszamegyünk a kertbe!",
 *     "Szuper!", "Próbáld újra!") — generateAudio.mjs overwrite:false miatt
 *     csak egyszer generálódik fájl belőlük.
 *   - Írás/Math dinamikus szövegek emojival (pl. "négy 🍎 van a bal oldalon")
 *     egyelőre nem szerepelnek — az emoji elhagyja a TTS-t, külön döntés szükséges.
 *   - speakEnglishSuccess() kombinált szövegei (Yes! cat! Great!) nincsenek benne;
 *     a szó és a dicséret külön fájlként szerepel.
 */

// ── Segédfüggvény ─────────────────────────────────────────────────────────────

const hu = (text, type = 'normal', syllables) =>
  syllables ? { text, lang: 'hu-HU', type: 'syllable', syllables }
             : { text, lang: 'hu-HU', type }

const en = (text) => ({ text, lang: 'en-GB', type: 'normal' })

// ── 1. Magyar dicséretek (39) ─────────────────────────────────────────────────

const HU_PRAISES_ENTRIES = [
  // micro (15)
  hu('Szuper!'), hu('Ügyes vagy!'), hu('Bravó!'), hu('Klassz!'), hu('Király!'),
  hu('Ez az!'), hu('Sikerült!'), hu('Hűha!'), hu('Tökéletes!'), hu('Hopp, megvan!'),
  hu('Pompás!'), hu('Csodás!'), hu('Aha, ez az!'), hu('Igen, így van!'), hu('Remek!'),
  // small (8)
  hu('De ügyes vagy, Panka!'), hu('Hűha, ez nagyon jól ment!'),
  hu('Csak így tovább!'), hu('Látszik, hogy figyeltél!'),
  hu('Olyan büszke vagyok rád!'), hu('Wow, milyen okos vagy!'),
  hu('Ezt megcsináltad!'), hu('Nagyon jól csinálod!'),
  // medium (6)
  hu('Panka, ez fantasztikus volt! Nézd, új ruhát kaptál!'),
  hu('Olyan ügyesen dolgoztál! A kerted is örül neked!'),
  hu('Megint tanultál valamit! Imádlak, mert nem adod fel!'),
  hu('Hűha, ez nagyon szépen ment! Egy új virág is nyílt!'),
  hu('Panki, te kis tündibündi! Folytatjuk?'),
  hu('Ezt nézd! Egy új pillangó jött a kertedbe, mert olyan ügyes vagy!'),
  // big (4)
  hu('PANKA! Megcsináltad a mai célt! Nézd a tűzijátékot, neked szól!'),
  hu('Ó, Panka, olyan büszke vagyok rád! Egész nap olyan szorgalmas voltál!'),
  hu('Hurrá! A fád is nőtt egyet! Olyan szép a kerted!'),
  hu('Te vagy a legszorgalmasabb kislány! Tüzijátékot érdemelsz!'),
  // hiba (6)
  hu('Semmi baj, próbáljuk meg újra!'),
  hu('Hopp, ez most nem jött össze. Még egyszer?'),
  hu('Gyakorlással megy! Próbáld újra!'),
  hu('Mindenki gyakorol! Én is segítek, ha kell.'),
  hu('Lehet, hogy a másik a jó! Próbáld meg azt!'),
  hu('Semmi gond! Együtt rájövünk.'),
]

// ── 2. Angol dicséretek (12) ─────────────────────────────────────────────────

const EN_PRAISES_ENTRIES = [
  en('Good job!'), en('Well done!'), en('Excellent!'), en('Perfect!'), en('Great!'),
  en('Amazing!'), en('Awesome!'), en('Fantastic!'), en('Brilliant!'),
  en('You did it!'), en('Wow!'), en('Yes!'),
]

// ── 3. Kabala (9) ─────────────────────────────────────────────────────────────

const KABALA_ENTRIES = [
  // intro
  hu('Szia, én Balambér vagyok, és imádok tanulni veled! Vau-vau, megcsináljuk!'),
  hu('Szia, én Kifli vagyok! Nyau, együtt menni fog, meglátod!'),
  hu('Szia, én Bolyhos vagyok! Bzzz, és együtt mindent megcsinálunk!'),
  // megerősítés
  hu('Biztos ezt választod? Balambér lesz a barátod!'),
  hu('Biztos ezt választod? Kifli lesz a barátod!'),
  hu('Biztos ezt választod? Bolyhos lesz a barátod!'),
  // kert
  hu('Szia Panka! Balambér vagyok, és együtt tanulunk! Vau-vau!'),
  hu('Szia Panka! Kifli vagyok, és itt vagyok veled! Nyau!'),
  // "...Bzzz!" → Azure terminated (3×) → Web Speech API fallback
]

// ── 4. Navigáció / közös szövegek (6) ────────────────────────────────────────

const NAV_ENTRIES = [
  hu('Válassz egy barátot!'),
  hu('Új barátot választasz?'),
  hu('Visszamegyünk a kertbe!'),
  hu('Visszamegyünk a kertbe?'),
  hu('Melyik játékot választod?'),
  hu('Új ruha vár rád a szekrényben!'),
]

// ── 5. Ruhatár (5) ────────────────────────────────────────────────────────────

const WARDROBE_ENTRIES = [
  hu('Ez a te szekrényed! Öltöztesd fel magad!'),
  hu('De szép vagy!'),
  hu('Ezért megdolgoztál!'),
  hu('Igazán ügyes voltál!'),
  hu('Megérte tanulni!'),
]

// ── 6. Írás modul (59) ───────────────────────────────────────────────────────

const WRITING_PRAISE_ENTRIES = [
  // HU_PRAISES a WritingModule-ban (néhány átfed a praise bankkal)
  hu('Szuper!'), hu('Brávó!'), hu('Remek!'),
  hu('Zseniális!'), hu('Nagyon jó!'), hu('Fantasztikus!'),
]

const WRITING_TTS_INSTRUCTION_ENTRIES = [
  // ttsInstruction minden betűhöz (19)
  hu('Rajzold az I betűt! Indulj felülről, húzz egyenesen le!'),
  hu('Rajzold az L betűt! Le, majd jobbra!'),
  hu('Rajzold a T betűt! Először húzz jobbra, majd le a közepéből!'),
  hu('Rajzold a H betűt! Bal le, jobb le, középen kereszt!'),
  hu('Rajzold az F betűt! Le, majd jobbra fent, jobbra közép!'),
  hu('Rajzold az E betűt! Le, fent jobbra, közép jobbra, lent jobbra!'),
  hu('Rajzold a V betűt! Le jobbra, majd fel jobbra!'),
  hu('Rajzold az O betűt! Kerek kör, nem szabad a lyuk!'),
  hu('Rajzold a C betűt! Körbe, de hagyj rést jobbra!'),
  hu('Rajzold a D betűt! Le, majd körívvel vissza!'),
  hu('Rajzold a P betűt! Le, majd körívvel vissza a közepéig!'),
  hu('Rajzold a B betűt! Le, majd két kis körív jobbra!'),
  hu('Rajzold az R betűt! Le, körív fent, majd átlósan le!'),
  hu('Rajzold az A betűt! Fel jobbra, le jobbra, kereszt a közepén!'),
  hu('Rajzold az M betűt! Fel, csúcsra le, megint fel, le!'),
  hu('Rajzold az N betűt! Fel, átlósan le, megint fel!'),
  hu('Rajzold a K betűt! Le, fel jobbra, le jobbra!'),
  hu('Rajzold az S betűt! Körbe balra fent, körbe jobbra lent!'),
  hu('Rajzold a Z betűt! Jobbra, átlósan le, jobbra!'),
]

// "Igen, így néz ki a X betű!" — trace game helyes irány (19)
const WRITING_IGEN_ENTRIES = [
  'I','L','T','H','F','E','V','O','C','D','P','B','R','A','M','N','K','S','Z',
].map(l => hu(`Igen, így néz ki a ${l} betű!`))

// "Melyik a helyes X betű?" — orient game (12; I,T,H,O,A,V,M kizárva)
const WRITING_MELYIK_ENTRIES = [
  'L','F','E','C','D','P','B','R','N','K','S','Z',
].map(l => hu(`Melyik a helyes ${l} betű?`))

const WRITING_FIX_ENTRIES = [
  hu('Szuper indulás!'),
  hu('Próbáld újra!'),
  hu('Ez tükörkép! Próbáld a másikat!'),
]

// ── 7. Olvasás modul ─────────────────────────────────────────────────────────

const READING_FIX_ENTRIES = [
  hu('Mi rímel erre?'),
  hu('Melyik szó illik a képhez?'),
  // tördelt instrukció részei (speakChained hívásokhoz)
  hu('1.'), hu('2.'), hu('3.'), hu('4.'), hu('5.'),
  hu('szó! Hány részből áll?'),
  hu('szó! Rakd össze!'),
]

// READING_WORDS — szótagolt (23, hu-HU syllable, Noémi hang)
const READING_WORD_ENTRIES = [
  hu('mama',     'syllable', ['ma','ma']),
  hu('papa',     'syllable', ['pa','pa']),
  hu('baba',     'syllable', ['ba','ba']),
  hu('néni',     'syllable', ['né','ni']),
  hu('maci',     'syllable', ['ma','ci']),
  hu('állat',    'syllable', ['ál','lat']),
  hu('alma',     'syllable', ['al','ma']),
  hu('autó',     'syllable', ['au','tó']),
  hu('óra',      'syllable', ['ó','ra']),
  hu('kép',      'syllable', ['kép']),
  hu('cica',     'syllable', ['ci','ca']),
  hu('kutya',    'syllable', ['ku','tya']),
  hu('halak',    'syllable', ['ha','lak']),
  hu('madár',    'syllable', ['ma','dár']),
  hu('bogár',    'syllable', ['bo','gár']),
  hu('képes',    'syllable', ['ké','pes']),
  hu('szekér',   'syllable', ['sze','kér']),
  hu('macska',   'syllable', ['macs','ka']),
  hu('Piroska',  'syllable', ['pi','ros','ka']),
  hu('cukorka',  'syllable', ['cu','kor','ka']),
  hu('nyuszika', 'syllable', ['nyu','szi','ka']),
  hu('barátom',  'syllable', ['ba','rá','tom']),
  hu('pillangó', 'syllable', ['pil','lan','gó']),
]

// RHYME_PAIRS — minden egyedi szó szótagolva (20, hu-HU syllable)
const RHYME_WORD_ENTRIES = [
  hu('bál',   'syllable', ['bál']),
  hu('tál',   'syllable', ['tál']),
  hu('hal',   'syllable', ['hal']),
  hu('kéz',   'syllable', ['kéz']),
  hu('méz',   'syllable', ['méz']),
  hu('vár',   'syllable', ['vár']),
  hu('fal',   'syllable', ['fal']),
  hu('mák',   'syllable', ['mák']),
  hu('rák',   'syllable', ['rák']),
  hu('ház',   'syllable', ['ház']),
  hu('nyár',  'syllable', ['nyár']),
  hu('ég',    'syllable', ['ég']),
  hu('jég',   'syllable', ['jég']),
  hu('kút',   'syllable', ['kút']),
  hu('út',    'syllable', ['út']),
  hu('váz',   'syllable', ['váz']),
  // alma átfed a READING_WORDS-szel, de azonos fájl lesz (dedup)
  hu('alma',  'syllable', ['al','ma']),
  hu('palma', 'syllable', ['pal','ma']),
  hu('tél',   'syllable', ['tél']),
  hu('cél',   'syllable', ['cél']),
]

// Betűhangok (15) — speakChained-ben egyenként, Lilla (normal)
// Mássalhangzósorozatok és rövid szövegek: file override-dal tartjuk az eredeti
// fájlnevet, de az Azure-nak hosszabb/kiejthető szöveget küldünk.
const LETTER_SOUND_ENTRIES = [
  { text: 'Effff', lang: 'hu-HU', type: 'normal', file: 'hu_fff.mp3' },
  { text: 'Esss',  lang: 'hu-HU', type: 'normal', file: 'hu_sss.mp3' },
  { text: 'Emmm',  lang: 'hu-HU', type: 'normal', file: 'hu_mmm.mp3' },
  // Nnn, Rrr, Ooo → Azure HTTP 400 minden közelítéssel → Web Speech API fallback
  { text: 'Elll',  lang: 'hu-HU', type: 'normal', file: 'hu_lll.mp3' },
  { text: 'Evvv',  lang: 'hu-HU', type: 'normal', file: 'hu_vvv.mp3' },
  hu('T'), hu('P'),
  { text: 'Ká',    lang: 'hu-HU', type: 'normal', file: 'hu_k.mp3'   },
  hu('H'), hu('B'),
  hu('Aaa'), hu('Eee'),
]

// Betűépítő szavak (12) — speakChained végén Lilla mondja a szót
// pa, na → Azure minden közelítéssel HTTP 400 → Web Speech API fallback
const LETTER_BUILD_WORD_ENTRIES = [
  hu('fa'), hu('ma'), hu('te'), hu('se'),
  hu('há'), hu('ne'), hu('va'), hu('le'), hu('me'),
  hu('ko'), hu('ra'), hu('be'),
]

// ── 8. Matematika modul (25) ──────────────────────────────────────────────────

const MATH_ENTRIES = [
  // Statikus (5)
  hu('Hány pötty villan fel?'),
  hu('Melyik két rúd ér ki ennyire?'),
  hu('Egyensúlyban vagy! Szuper!'),
  hu('Még nem ér ki! Próbáld mással!'),
  hu('Túl hosszú lett! Próbáld mással!'),
  // Számlálós "Hány X van itt?" (10 EMOJI_SET.plural-nál)
  hu('Hány macska van itt?'),
  hu('Hány kutya van itt?'),
  hu('Hány béka van itt?'),
  hu('Hány pillangó van itt?'),
  hu('Hány méh van itt?'),
  hu('Hány alma van itt?'),
  hu('Hány banán van itt?'),
  hu('Hány szamóca van itt?'),
  hu('Hány narancs van itt?'),
  hu('Hány virág van itt?'),
  // Dienes "Melyik két rúd ér ki ennyire? X" (10, HU_NUMS[1..10])
  hu('Melyik két rúd ér ki ennyire? egy'),
  hu('Melyik két rúd ér ki ennyire? kettő'),
  hu('Melyik két rúd ér ki ennyire? három'),
  hu('Melyik két rúd ér ki ennyire? négy'),
  hu('Melyik két rúd ér ki ennyire? öt'),
  hu('Melyik két rúd ér ki ennyire? hat'),
  hu('Melyik két rúd ér ki ennyire? hét'),
  hu('Melyik két rúd ér ki ennyire? nyolc'),
  hu('Melyik két rúd ér ki ennyire? kilenc'),
  hu('Melyik két rúd ér ki ennyire? tíz'),
]

// ── 9. Angol modul ───────────────────────────────────────────────────────────

// TPR verbs
const TPR_EN_ENTRIES = [
  en('Jump!'), en('Run!'), en('Sleep!'), en('Eat!'), en('Drink!'), en('Dance!'),
  en('Clap!'), en('Wave!'), en('Sit!'), en('Stand!'), en('Fly!'), en('Swim!'),
]
const TPR_HU_ENTRIES = [
  hu('Ugorj!'), hu('Fuss!'), hu('Aludj!'), hu('Egyél!'), hu('Igyál!'), hu('Táncolj!'),
  hu('Tapsolj!'), hu('Integess!'), hu('Ülj le!'), hu('Állj fel!'), hu('Repülj!'),
  { text: 'Ússzál!', lang: 'hu-HU', type: 'normal', file: 'hu_ussz.mp3' },
]

// Feed Monster
const FEED_EN_ENTRIES = [
  en("I'm hungry! I want an apple."),
  en("I'm hungry! I want a banana."),
  en("I'm thirsty! I want milk."),
  en("I'm hungry! I want a cookie."),
  en("I'm hungry! I want a carrot."),
  en("I'm hungry! I want an apple and a banana."),
  en("I'm hungry! I want milk and a cookie."),
  en("I'm hungry! I want a carrot and a tomato."),
  en("I'm hungry! I want an orange and some grapes."),
  en("I'm hungry! I want a strawberry and a banana."),
]
const FEED_HU_ENTRIES = [
  hu('Éhes vagyok! Almát szeretnék.'),
  hu('Éhes vagyok! Banánt szeretnék.'),
  hu('Szomjas vagyok! Tejet szeretnék.'),
  hu('Éhes vagyok! Sütit szeretnék.'),
  hu('Éhes vagyok! Sárgarépát szeretnék.'),
  hu('Éhes vagyok! Almát és banánt szeretnék.'),
  hu('Éhes vagyok! Tejet és sütit szeretnék.'),
  hu('Éhes vagyok! Sárgarépát és paradicsomot szeretnék.'),
  hu('Éhes vagyok! Narancsot és szőlőt szeretnék.'),
  hu('Éhes vagyok! Epret és banánt szeretnék.'),
]

// Feed visszajelzés (18 = 9 Hmmm + 9 Yes!)
const FEED_TARGET_NAMES = ['apple','banana','milk','a cookie','a carrot','a tomato','an orange','grapes','a strawberry']
const FEED_FEEDBACK_ENTRIES = [
  ...FEED_TARGET_NAMES.map(n => en(`Hmmm... ${n}!`)),
  ...FEED_TARGET_NAMES.map(n => en(`Yes! ${n}!`)),
]

// Feed yuck (12 = 3 yuck × 4 disztráktor)
const YUCKS = ['Eww!', 'Blah!', 'No no no!']
const DISTRACTOR_NAMES = ['cheese', 'broccoli', 'a pear', 'a cucumber']
const FEED_YUCK_ENTRIES = YUCKS.flatMap(y =>
  DISTRACTOR_NAMES.map(d => en(`${y} I don't want ${d}!`))
)

// HU instrukció (2)
const ENGLISH_HU_INSTR_ENTRIES = [
  hu('Keress párokat! Fordíts fel egy képkártyát és egy hangkártyát!'),
  hu('Mondd hangosan!'),
]

// ── Szókincs-alapú generálás ─────────────────────────────────────────────────
// Forrás: src/data/englishVocabulary.ts — 90 szó, 13 kategória

const VOCAB = [
  // animals
  { word:'cat',         hu:'macska',    category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'dog',         hu:'kutya',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'fish',        hu:'hal',       category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'bird',        hu:'madár',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'rabbit',      hu:'nyuszi',    category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'horse',       hu:'ló',        category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'cow',         hu:'tehén',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'pig',         hu:'disznó',    category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'sheep',       hu:'bárány',    category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'duck',        hu:'kacsa',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'frog',        hu:'béka',      category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'elephant',    hu:'elefánt',   category:'animals',    huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'lion',        hu:'oroszlán',  category:'animals',    huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'monkey',      hu:'majom',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'bear',        hu:'medve',     category:'animals',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  // fruits
  { word:'apple',       hu:'alma',      category:'fruits',     huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'banana',      hu:'banán',     category:'fruits',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'strawberry',  hu:'eper',      category:'fruits',     huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'orange',      hu:'narancs',   category:'fruits',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'grape',       hu:'szőlő',     category:'fruits',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'watermelon',  hu:'görögdinnye',category:'fruits',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'pear',        hu:'körte',     category:'fruits',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  // vegetables
  { word:'carrot',      hu:'sárgarépa', category:'vegetables', huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'tomato',      hu:'paradicsom',category:'vegetables', huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'cucumber',    hu:'uborka',    category:'vegetables', huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'potato',      hu:'burgonya',  category:'vegetables', huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'broccoli',    hu:'brokkoli',  category:'vegetables', huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  // colours
  { word:'red',         hu:'piros',     category:'colours',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'where' },
  { word:'blue',        hu:'kék',       category:'colours',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'where' },
  { word:'yellow',      hu:'sárga',     category:'colours',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'where' },
  { word:'green',       hu:'zöld',      category:'colours',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'where' },
  // family
  { word:'mother',      hu:'mama',      category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'father',      hu:'papa',      category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'baby',        hu:'baba',      category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'grandmother', hu:'nagymama',  category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'grandfather', hu:'nagypapa',  category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'sister',      hu:'húg',       category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'brother',     hu:'fivér',     category:'family',     huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  // body
  { word:'head',        hu:'fej',       category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'nose',        hu:'orr',       category:'body',       huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'mouth',       hu:'száj',      category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'ear',         hu:'fül',       category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'eye',         hu:'szem',      category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'hand',        hu:'kéz',       category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'foot',        hu:'láb',       category:'body',       huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  // emotions — questionPrefix:'who'
  { word:'happy',       hu:'boldog',    category:'emotions',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'who'   },
  { word:'sad',         hu:'szomorú',   category:'emotions',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'who'   },
  { word:'tired',       hu:'álmos',     category:'emotions',   huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'who'   },
  { word:'angry',       hu:'mérges',    category:'emotions',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'who'   },
  { word:'surprised',   hu:'meglepett', category:'emotions',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, questionPrefix:'who'   },
  // clothes
  { word:'shirt',       hu:'póló',      category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'trousers',    hu:'nadrág',    category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, plural:true            },
  { word:'shoes',       hu:'cipő',      category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, plural:true            },
  { word:'hat',         hu:'sapka',     category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'dress',       hu:'ruha',      category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'socks',       hu:'zokni',     category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false, plural:true            },
  { word:'jacket',      hu:'kabát',     category:'clothes',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  // vehicles
  { word:'car',         hu:'autó',      category:'vehicles',   huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'bus',         hu:'busz',      category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'train',       hu:'vonat',     category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'bicycle',     hu:'bicikli',   category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'airplane',    hu:'repülő',    category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'boat',        hu:'csónak',    category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'helicopter',  hu:'helikopter',category:'vehicles',   huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  // weather
  { word:'sun',         hu:'nap',       category:'weather',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'rain',        hu:'eső',       category:'weather',    huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'snow',        hu:'hó',        category:'weather',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'wind',        hu:'szél',      category:'weather',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'cloud',       hu:'felhő',     category:'weather',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true  },
  { word:'rainbow',     hu:'szivárvány',category:'weather',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  // numbers — questionPrefix:'which'
  { word:'one',         hu:'egy',       category:'numbers',    huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'two',         hu:'kettő',     category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'three',       hu:'három',     category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'four',        hu:'négy',      category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'five',        hu:'öt',        category:'numbers',    huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'six',         hu:'hat',       category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'seven',       hu:'hét',       category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'eight',       hu:'nyolc',     category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'nine',        hu:'kilenc',    category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  { word:'ten',         hu:'tíz',       category:'numbers',    huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:true,  questionPrefix:'which' },
  // daily routine
  { word:'morning',     hu:'reggel',    category:'daily',      huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'night',       hu:'éjszaka',   category:'daily',      huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'breakfast',   hu:'reggeli',   category:'daily',      huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'lunch',       hu:'ebéd',      category:'daily',      huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'dinner',      hu:'vacsora',   category:'daily',      huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'bath',        hu:'fürdő',     category:'daily',      huArticle:'a',  skipPointer:false, skipMemory:false, hasSayIt:false },
  { word:'bed',         hu:'ágy',       category:'daily',      huArticle:'az', skipPointer:false, skipMemory:false, hasSayIt:false },
  // misc
  { word:'ball',        hu:'labda',     category:'misc',       huArticle:'a',  skipPointer:true,  skipMemory:true,  hasSayIt:true  },
  { word:'milk',        hu:'tej',       category:'misc',       huArticle:'a',  skipPointer:false, skipMemory:true,  hasSayIt:true  },
  { word:'big',         hu:'nagy',      category:'misc',       huArticle:'a',  skipPointer:true,  skipMemory:true,  hasSayIt:true  },
]

// Pointer tasks (87 × 4 szöveg = 348)
const POINTER_ENTRIES = (() => {
  const filtered = VOCAB.filter(w => !w.skipPointer)
  const byCategory = new Map()
  filtered.forEach(w => {
    if (!byCategory.has(w.category)) byCategory.set(w.category, [])
    byCategory.get(w.category).push(w)
  })
  const entries = []
  for (const w of filtered) {
    const others = byCategory.get(w.category).filter(v => v.word !== w.word)
    if (others.length < 2) continue
    const qp = w.questionPrefix ?? 'where'
    const plural = w.plural ?? false
    let enQ, huQ, enA, huA
    if (qp === 'who') {
      enQ = `Who is ${w.word}?`;  huQ = `Ki ${w.hu}?`
      enA = `Yes, ${w.word}!`;   huA = `Igen, ${w.hu}!`
    } else if (qp === 'which') {
      enQ = `Which one is ${w.word}?`;  huQ = `Melyik ${w.huArticle} ${w.hu}?`
      enA = `Yes, ${w.word}!`;          huA = `Igen, ${w.huArticle} ${w.hu}!`
    } else if (plural) {
      enQ = `Where are the ${w.word}?`; huQ = `Hol van ${w.huArticle} ${w.hu}?`
      enA = `Yes, the ${w.word}!`;      huA = `Igen, ${w.huArticle} ${w.hu}!`
    } else {
      enQ = `Where is the ${w.word}?`;  huQ = `Hol van ${w.huArticle} ${w.hu}?`
      enA = `Yes, the ${w.word}!`;      huA = `Igen, ${w.huArticle} ${w.hu}!`
    }
    entries.push(en(enQ), hu(huQ), en(enA), hu(huA))
  }
  return entries
})()

// Memory hangkártyák — minden szó mint "Cat!" (90)
const MEMORY_SOUND_ENTRIES = VOCAB.map(w =>
  en(w.word.charAt(0).toUpperCase() + w.word.slice(1) + '!')
)

// Memory pártalálás — "Great! Cat!" (90)
const MEMORY_PAIR_ENTRIES = VOCAB.map(w =>
  en(`Great! ${w.word.charAt(0).toUpperCase() + w.word.slice(1)}!`)
)

// SAY-IT szavak (43, speakEnglishTwice hívás)
const SAY_IT_ENTRIES = VOCAB
  .filter(w => w.hasSayIt)
  .map(w => en(w.word))

// ── Összesítés ────────────────────────────────────────────────────────────────

export const AUDIO_ENTRIES = [
  ...HU_PRAISES_ENTRIES,          // 39
  ...EN_PRAISES_ENTRIES,          // 12
  ...KABALA_ENTRIES,              //  9
  ...NAV_ENTRIES,                 //  6
  ...WARDROBE_ENTRIES,            //  5
  ...WRITING_PRAISE_ENTRIES,      //  6
  ...WRITING_TTS_INSTRUCTION_ENTRIES, // 19
  ...WRITING_IGEN_ENTRIES,        // 19
  ...WRITING_MELYIK_ENTRIES,      // 12
  ...WRITING_FIX_ENTRIES,         //  3
  ...READING_FIX_ENTRIES,         //  9
  ...READING_WORD_ENTRIES,        // 23
  ...RHYME_WORD_ENTRIES,          // 20
  ...LETTER_SOUND_ENTRIES,        // 15
  ...LETTER_BUILD_WORD_ENTRIES,   // 14
  ...MATH_ENTRIES,                // 25
  ...TPR_EN_ENTRIES,              // 12
  ...TPR_HU_ENTRIES,              // 12
  ...POINTER_ENTRIES,             // 348 (számított)
  ...FEED_EN_ENTRIES,             // 10
  ...FEED_HU_ENTRIES,             // 10
  ...MEMORY_SOUND_ENTRIES,        // 90
  ...MEMORY_PAIR_ENTRIES,         // 90
  ...SAY_IT_ENTRIES,              // 43
  ...FEED_FEEDBACK_ENTRIES,       // 18
  ...FEED_YUCK_ENTRIES,           // 12
  ...ENGLISH_HU_INSTR_ENTRIES,    //  2
]

// Kategóriánkénti összesítő — node-ban futtatható ellenőrzéshez
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  console.log(`\nÖsszes bejegyzés (dedup előtt): ${AUDIO_ENTRIES.length}`)
  console.log(`  Ebből hu-HU normal:   ${AUDIO_ENTRIES.filter(e => e.lang === 'hu-HU' && e.type === 'normal').length}`)
  console.log(`  Ebből hu-HU syllable: ${AUDIO_ENTRIES.filter(e => e.lang === 'hu-HU' && e.type === 'syllable').length}`)
  console.log(`  Ebből en-GB:          ${AUDIO_ENTRIES.filter(e => e.lang === 'en-GB').length}`)

  const seen = new Set()
  let dups = 0
  for (const e of AUDIO_ENTRIES) {
    const key = `${e.lang}|${e.type}|${e.text}`
    if (seen.has(key)) dups++
    else seen.add(key)
  }
  console.log(`  Duplikátum (azonos text+lang+type): ${dups}`)
  console.log(`  Egyedi bejegyzés:     ${seen.size}\n`)
}
