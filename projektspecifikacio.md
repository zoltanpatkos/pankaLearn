# Panka tanulóapp — projektspecifikáció

> Panka (5 éves) személyes tanulóappja. Otthoni használat, Samsung Galaxy Tab S6 Lite, wifi-s környezet. Nem üzleti termék.
>
> **Projekt mappa:** `C:\Users\Csucsi\source\repos\PankiLearning\pankaLearn`
> **Munkagép:** Windows, Node.js telepítve
> **Cél eszköz:** Galaxy Tab S6 Lite, Chrome böngészőben PWA-ként

---

## 1. Cél és kontextus

Egy személyre szabott, kényelmes, hatékony tanulóeszköz építése egy 5 éves kislány számára, négy területre:
**matematika, olvasás, írás, angol**.

A fejlesztés Claude Code-dal történik, a szülő irányításával. A cél nem profit, hanem **kifejezetten ennek a gyereknek a fejlődése**. Ezért a tervezésnél a pedagógiai hatékonyság és az életkori illeszkedés mindenek felett áll.

## 2. A felhasználó profilja

- **Név:** Panka
- **Életkor:** 5 év
- **Nyelv:** magyar anyanyelvű, angolt mint idegen nyelvet tanul
- **Eszköz:** Samsung Galaxy Tab S6 Lite (Android, ~10.4")
- **Kontextus:** Panka **egyedül használja**, szülő a háttérben (= az app teljesen autonóm kell legyen)
- **Olvasás:** még nem folyékony → minden ikon mellett kép, minden szöveg felolvasásra kerül
- **Beírás:** lehetőleg semmilyen billentyűzet (sem fizikai, sem virtuális)

### Tudásszint induláskor

| Terület | Mit tud | Mit nem tud még |
|---------|---------|-----------------|
| Matek | Számokat felismer, ujjon számol | Subitizing, mennyiség-bontás, automatikus összeadás |
| Olvasás | Betűket nagyjából ismer | Folyékony összeolvasás, szótagolás-tudat |
| Írás | Betűket leír | Konzisztens írásirány, néha tükrözi a betűket |
| Angol | Passzív szókincs van | Aktív szóhasználat, mondatba foglalás, igék előhívása |

## 3. Technológiai stack

**Progressive Web App (PWA), React + TypeScript alapon.**

| Réteg | Eszköz | Miért |
|-------|--------|-------|
| Build | Vite | Gyors, modern, Claude Code jól bánik vele |
| UI | React + TypeScript | Iparági standard, sok példa |
| Styling | Tailwind CSS | Gyors prototípus, Claude Code optimalizált |
| Animáció | Framer Motion | Gyerekbarát mozgás, deklaratív |
| Konfetti/tűzijáték | canvas-confetti | Out-of-the-box jutalom-effekt |
| Hang | Howler.js | Megbízható audio kezelés |
| TTS | Web Speech API (natív) | Magyar női hang elérhető Chrome-on |
| Adattárolás | Dexie.js (IndexedDB wrapper) | Lokális haladás-mentés |
| Rajz | Canvas + Pointer Events | Nyomásérzékenység támogatása (S Pen) |
| Hosting fejlesztés alatt | Vite dev server `--host` flaggal, wifin | A tablet eléri a dev gépet |
| Hosting kész | Vercel / Netlify ingyenes | Stabil végleges link |

### Miért NEM más:
- **Nem natív Android (Kotlin):** Claude Code natív Android projekteken jelentősen gyengébb, és a fejlesztési overhead nem éri meg egy személyes appnál.
- **Nem React Native / Flutter:** felesleges komplexitás, build pipeline, app store. PWA wifin tökéletesen elég.

## 4. UX alapelvek (minden modulra érvényes)

1. **Érintési zónák min. 80×80 px.** Egy 5 éves nem precíz.
2. **Maximum 2-3 perces figyelmi blokkok.** 4-6 feladat után automata jutalom + lehetőség kilépésre.
3. **Hiba nem büntet.** Halk pittyenés, „próbáljuk újra együtt", soha nem „rossz!" hangzású visszajelzés.
4. **TTS lassú beszéddel** (rate 0.85-0.9), barátságos női hang, gyerekbarát hangmagasság.
5. **Minden szöveghez kép.** Ő még nem tud olvasni — vizuális navigáció.
6. **Hangerő gomb a sarokban**, mindig elérhető. „Mondd újra" gomb minden TTS-hez.
7. **Szülői zár csak a beállításokra.** Hármas színes-szekvencia (sárga → kék → piros 2 mp), amit ő még nem tud.
8. **Nincs gamifikációs csapda:** nincs streak, nincs „elveszett életek", nincs ranglista. Csak haladás és pozitív megerősítés.
9. **Egyetlen profil**, kezdéskor ráböki a saját arcára/avatárjára. Nincs jelszó.
10. **Automata felolvasás** minden képernyő megnyíláskor.

### Témakeret

**Panka világa: egy kert.** A kert három fő összetevője:

1. **Egy nagy fa középen**, ami szintenként nő (kis hajtás → bokor → fa → virágzó fa → gyümölcsfa). Napi cél elérve = egy szint.
2. **Virágágyások modulonként** — minden modulnak saját ágyása van, ahol az ott szerzett mikrojutalmak növényekké változnak (matek = tulipánok, olvasás = napraforgók, írás = rózsák, angol = pipacsok). Így rögtön látja, melyik modulból szerzett mennyit.
3. **„Vendégek"** a kertben (pillangók, méhecskék, katicák) — minden mikrosiker hív egyet. Ők repkednek, mozognak, a kert él, miközben Panka csak nézi.

**Évszakváltás** hosszú távon (hetente lép tovább): tavasz → nyár → ősz → tél. Ez extra rejtett jutalom és változatosság.

### Panka avatárja (öltöztethető női alak)

A kertben mindig ott áll **Panka avatárja**, akit Panka **öltöztethet**. Ez egy második motivációs réteg a fa/kert mellett.

**Alap kinézet:**
- Barna hajú kislány
- Egy kis **lila masni** (cof) a hajban
- Vidám arckifejezés
- Egyszerű alap ruha (pl. színes póló + szoknya)

**Öltöztethető elemek:**
- **Ruha:** felső, alsó, vagy egész ruha
- **Haj:** különböző frizurák (de a barna szín a default)
- **Kiegészítők:** masnik, hajpántok, szemüveg, korona, ékszer
- **Smink/arckifejezés:** vidám, szerelmes (szív szemek), büszke stb.

**Hogyan szerez új darabokat:** feladat-csomag teljesítése (közepes jutalom) = egy új ruhatár-elem kerül a tárolóba.

**„Ruhatár" képernyő** a kertből elérhető (egy szekrény ikon mellette): itt rendezheti az avatárt.

**Hangos visszajelzés öltöztetés után:** „De szép vagy ma!", „Nagyon jól öltöztetted fel magad!"

**Nincs vásárlás, nincs valuta** — a megoldott feladatok közvetlenül adnak ruhadarabokat, ez egyszerűbb az ő korában.

A négy modul mint épület / állomás a kertben:
- **Matek** → bolt (vásárolunk, számolunk)
- **Olvasás** → kis könyvtár / olvasópad
- **Írás** → műhely (íróasztal)
- **Angol** → reptér / léggömb (utazás)

### Vizuális stílus

**Élénk, telített színek** (gyerekkönyv-szerű, vidám). Magas kontraszt, határozott körvonalak. Telt zöldek, sárgák, rózsaszínek, kékek. Nem pasztell, nem mértékletes — Pankát erősen vonzza majd.

### Hang és zene

- **Nincs háttérzene** (sem a kertben, sem a feladatokban). Panka kapcsolata az apphoz a kabala beszéde köré épül, ne legyen háttérzaj.
- **Hangeffektek mindenhol:** koppintásra puha „pop", helyes válaszra csilingelés, jutalomra konfetti-hang, tűzijáték-hang.
- **Beszéd (TTS) folyamatosan**, ez a fő hangréteg.
- Egy kivétel: nagy jutalomnál (napi cél) rövid dallam-jelzés (5-10 másodperc).

### Kabalafigura

**Panka 3 opció közül választhat indításkor:**

| Név | Állat | Személyiség |
|-----|-------|-------------|
| **Balambér** | kutya | hűséges, lelkes, sokat ugrál; „Vau-vau, megcsináljuk!" |
| **Kifli** | cica | kedves, dorombolós, halk; „Nyau, együtt menni fog" |
| **Bolyhos** | méhecske | szorgalmas, energikus, vidám zümmögős; „Bzzz, dolgozzunk!" |

Mindegyik bemutatkozik hangban a választó képernyőn („Szia, én Balambér vagyok, és imádok tanulni!"), Panka rákoppint. Megerősítő képernyő ezután, hogy ne véletlenül cserélje.

A kabala végigkíséri az appot: ő ad instrukciót, dicsér, tapsol, vele együtt mutatja a mozdulatokat. **Fontos:** a kabala NEM azonos Panka avatárjával — a kabala az állat-segítő (tanár/barát), az avatár az ő reprezentációja a kertben.

## 5. Jutalmazási rendszer (rétegezve)

| Szint | Mikor | Mi történik |
|-------|-------|-------------|
| Mikro | Egy feladat sikere | Csillag pukkanása + rövid dicsérő mondat („Szuper!", „Ügyes vagy!") |
| Kicsi | 3 feladat sorozat sikere | Tapsoló kabala animáció + dicséret + új vendég (pillangó, méhecske) érkezik a kertbe |
| Közepes | Egy gyakorlat-egység (~5-6 feladat) | Konfetti + új virág a modul saját ágyásában + **új ruhatár-elem** (ruha/haj/kiegészítő) az avatárhoz |
| Nagy | Napi cél elérve | **Tűzijáték** + rövid dallam + kabala táncol + a fa nő egy szintet |

A jutalmak némileg **kiszámíthatatlanok** legyenek (változó megerősítés) — ez tartja fent leginkább a motivációt. Például: nem mindig ugyanaz a virág nyílik, nem mindig ugyanaz a kabala-animáció, a ruhatár-elem véletlenszerű egy adott készletből.

### Dicséret-bank (kezdeti alapkészlet)

A kabala változatos dicséretet ad — sosem ugyanazt egymás után. Véletlenszerűen választunk a megfelelő szint kosarából, és kerüljük azt, ami az előző 3-4 alkalom között már elhangzott.

**Mikro szint (egy feladat sikere) — rövid, energikus:**
- „Szuper!"
- „Ügyes vagy!"
- „Bravó!"
- „Klassz!"
- „Király!"
- „Ez az!"
- „Sikerült!"
- „Hűha!"
- „Tökéletes!"
- „Hopp, megvan!"
- „Pompás!"
- „Csodás!"
- „Aha, ez az!"
- „Igen, így van!"
- „Remek!"

**Kicsi szint (3 jó válasz egymás után) — biztatóbb:**
- „De ügyes vagy, Panka!"
- „Hűha, ez nagyon jól ment!"
- „Csak így tovább!"
- „Látszik, hogy figyeltél!"
- „Olyan büszke vagyok rád!"
- „Wow, milyen okos vagy!"
- „Ezt megcsináltad!"
- „Nagyon jól csinálod!"

**Közepes szint (egy gyakorlat-egység vége) — ünneplő, többmondatos:**
- „Panka, ez fantasztikus volt! Nézd, új ruhát kaptál!"
- „Olyan ügyesen dolgoztál! A kerted is örül neked!"
- „Megint tanultál valamit! Imádlak, mert nem adod fel!"
- „Hűha, ez nagyon szépen ment! Egy új virág is nyílt!"
- „Panki, te kis tündibündi! Folytatjuk?"
- „Ezt nézd! Egy új pillangó jött a kertedbe, mert olyan ügyes vagy!"

**Nagy szint (napi cél elérve) — ünnepi, lelkes:**
- „PANKA! Megcsináltad a mai célt! Nézd a tűzijátékot, neked szól!"
- „Ó, Panka, olyan büszke vagyok rád! Egész nap olyan szorgalmas voltál!"
- „Hurrá! A fád is nőtt egyet! Olyan szép a kerted!"
- „Te vagy a legszorgalmasabb kislány! Tüzijátékot érdemelsz!"

**Hibára (sosem büntet, mindig biztat) — kedvesen:**
- „Semmi baj, próbáljuk meg újra!"
- „Hopp, ez most nem jött össze. Még egyszer?"
- „Gyakorlással megy! Próbáld újra!"
- „Mindenki gyakorol! Én is segítek, ha kell."
- „Lehet, hogy a másik a jó! Próbáld meg azt!"
- „Semmi gond! Együtt rájövünk."

> **A szülő bővítheti ezt később:** a beállítások képernyőn (szülői zár mögött) lesz lehetőség saját családi kifejezéseket hozzáadni a kosarakhoz.

### Ruhatár-elem készletek (öltöztetéshez)

Kezdéskor van egy alapkészlet (alap ruha + lila masni). A többi unlock-olható közepes jutalmakból:
- **Ruhák** (~10-15 db idővel): nyári ruha, hercegnő-ruha, balerina-tüll, sportos szett, esőkabát, télikabát, jelmez (katicabogár, tündér), stb.
- **Hajak** (~6-8 db): hosszú barna (alap), copfok, lófarok, varkocs, hullámos. *A szín mindig barna, mert ez Panka.*
- **Kiegészítők** (~10 db): szemüveg, hajpánt, sapka, korona, fülbevaló, nyaklánc, hátizsák, masnik különböző színekben
- **Szezonális** (rejtett): pl. nyári korall (csak nyár évszakban), karácsonyi sapka (csak télen)


## 6. A négy modul specifikációja

### 🔢 Matek

**Pedagógiai irány:** subitizing → number bonds (mennyiség-bontás) → összeadás 10-ig.

**Első körben elkészülő feladattípusok:**

1. **Subitizing villantások 1-5**
   - Mintázat (dobókocka, ujjak, gyümölcsök) 1-2 másodpercig villan
   - Eltűnik
   - Ő rákoppint a számra (3-4 választható közül)
   - Fokozatosság: először 1-3, aztán 1-5

2. **Számolós játék képekkel**
   - „Hány pillangó van a réten?"
   - Tap-pal megszámolható (megszínesednek, kabala mondja a számokat)
   - Válasz a számra koppintással
   - Számtartomány: induláskor 1-5, később 1-10

**Későbbi feladattípusok (későbbi fázisokban):**
- Bontás-játék (drag and drop, „a 6 alma fele a kosárba, fele a tálba")
- Több vagy kevesebb (két csoport összehasonlítása)
- Számszomszédok

**Amit *nem* csinálunk most:** absztrakt szimbólumokkal írott összeadás, szöveges feladatok.

### 📖 Olvasás

**Pedagógiai alap:** Meixner-módszer (magyar standard, kutatás támogatja).

**Kulcselv:** szótagolás központtal, NEM betűnként összeolvasás.
- A „macska" az „MAC-SKA", nem „M-A-C-S-K-A".
- Zárt szótagok először (MA, PI, KU), majd nyitott, majd kombinációk.
- A magyar nyelv fonetikus → óriási előny.

**Feladattípusok:**
1. Szótag-tapsoló (kép + kimondott szó, ő kopog szótagonként)
2. Szótag-összerakó (drag and drop szótagokból szavak)
3. Szó-kép párosító (kép + 3 szó szótagolva, melyik?)
4. Rímkereső (szótagtudat fejlesztés)
5. Folyékony olvasás-modell (szótagolva → folyékonyan)

**Fontos:** a TTS a betűket **hangzóként** mondja („mmm", nem „em"). Ez segíti az összeolvasást.

### ✍️ Írás

**Tudni kell:** **a betű/szám megfordítása 5 évesen teljesen normális**, 7 éves korra magától megszűnik. Nem aggódunk — konzisztens irányt tanítunk.

**Pedagógiai kulcsok:**
- Indítópont és vonalrend tanítása betűnként
- Verbális kísérés: TTS mondja a lépéseket írás közben („indulj fent, lefelé, körbe...")
- Hasonló alakú betűk csoportban tanítva
- Multiszenzoros: tableten + levegőbe is

**Feladattípusok:**
1. **Útkövető betűírás:** halvány szürke betű + zöld indítópont + piros érkezési pont + nyilak. Ujjal/S Pennel követni.
2. **Betűszobor-építő:** vonáselemekből drag and drop, betű összerakása.
3. **„Melyik a jó betű?":** több variáció (jó, fordított, fejjel lefelé), válasszon.
4. **Saját betűgyűjtemény:** amit megírt, eltárolódik, megnézhető fejlődés.

**Technikai kihívás:** vonal-felismerés iránytévesztésre (ha rossz irányba indul, kedvesen szól). Ezt a Pointer Events idősorából kell elemezni.

### 🌍 Angol

**Pedagógiai alap:** Total Physical Response (TPR), James Asher módszere. Kutatás támogatja young learner-eknél, kifejezetten igékre hatékony.

**Kulcselv:** ige = mozdulat. Először érti és cselekszi, csak utána mondja.

**Feladattípusok:**
1. **TPR cselekedj-és-tanulj:** kép + angol parancs („Jump!"). Kabala mutatja, ő utánozza fizikailag. Aztán hangosan ismételheti (opcionális).
2. **Mondatépítő képkártyákkal:** drag and drop szavak helyes sorrendbe.
3. **Színes szókincsfa:** kategóriánként képek (állatok, étel, mozdulatok, érzések, színek).
4. **Kérdés-válasz párbeszéd:** kabala kérdez, választható válaszok közül választ.
5. **Dalok mozdulatokkal:** klasszikus angol gyerekdalok mozdulatokkal.

**Kísérleti komponens (későbbi fázis):** Web Speech API STT-vel hangos ismétlés *jutalomként*. Soha nem büntet, soha nem buktat. Ha felismeri → extra csillag. Ha nem → semmi nem történik.

## 7. Implementációs roadmap

### 1. fázis — Váz + kert + avatár (kritikus alapok)
- [ ] Projekt felállítása (Vite + React + TS + Tailwind) a `C:\Users\Csucsi\source\repos\PankiLearning\pankaLearn` mappában
- [ ] PWA konfiguráció (manifest, service worker)
- [ ] Kabalaválasztó képernyő (Balambér / Kifli / Bolyhos), bemutatkozó hangokkal
- [ ] Kert főképernyő: fa középen + 4 modul-épület + avatár álló alakja
- [ ] Avatár alap (barna haj + lila masni + alap ruha) — még nem öltöztethető
- [ ] TTS-keretrendszer és magyar hang tesztelése
- [ ] Dicséret-bank rendszer (random választás, nem-ismétlés logika)
- [ ] Egy demó feladat (1-2 subitizing kártya) ami megmutatja a teljes jutalmazási kört: mikro → közepes → új ruhatár-elem
- [ ] IndexedDB profil alapok (Panka, választott kabala, haladás)
- [ ] Dev szerver Windows-ról a tabletre — működő pipeline
- [ ] **Kipróbálás a tableten — fő ellenőrző pont!**

### 1.5. fázis — Ruhatár rendszer
- [ ] Szekrény ikon a kertben, megnyithatóság
- [ ] Ruhatár képernyő: avatár előnézet + kategória-tabok (ruha, haj, kiegészítő)
- [ ] 3-3 alap elem mindegyik kategóriából (mire kibővítjük, már működik a rendszer)
- [ ] Új unlock animáció (csillogó doboz, kabala bemutatja)
- [ ] Kiválasztott elemek mentése profilba

### 2. fázis — Matek modul
- [ ] Subitizing villantások 1-5 (5-10 mintázat-variáció)
- [ ] Számolós játék képekkel (témakörönként: állatok, gyümölcsök, virágok)
- [ ] Kert-integráció: matek-siker tulipánt nyit a matek-ágyásban
- [ ] Új ruhatár-elemek hozzákapcsolása a közepes jutalmakhoz

### 3. fázis — Olvasás modul
- [ ] Szótag-adatbázis felépítése (zárt szótagok először)
- [ ] Szótag-tapsoló feladat
- [ ] Szótag-összerakó feladat (drag and drop)
- [ ] Olvasás-ágyás napraforgóval

### 4. fázis — Angol modul (TPR)
- [ ] TPR cselekedj-és-tanulj (alap ige-szókincs: jump, run, sleep, eat, drink, etc.)
- [ ] Mondatépítő képkártyákkal
- [ ] Szókincsfa (kategóriák szerint)
- [ ] Angol-ágyás pipaccsal

### 5. fázis — Írás modul
- [ ] Útkövető betűírás (Canvas + Pointer Events)
- [ ] Vonal-irány elemzés iránytévesztésre
- [ ] Betűszobor-építő
- [ ] Írás-ágyás rózsával

### 6. fázis — Kísérleti hangfelismerés (angol)
- [ ] Web Speech API STT integráció
- [ ] Jutalom-csak logika (nem büntet)
- [ ] Tesztelés Panka hangján — működik-e egyáltalán?

### 7. fázis — Szülői panel
- [ ] Szülői zár (sárga → kék → piros szekvencia)
- [ ] Haladási statisztikák szülőnek
- [ ] Dicséret-bank bővítése családi kifejezésekkel
- [ ] Nehézségi szint hangolása

## 8. Fontos technikai elvek

- **Mobile-first.** A tablet a célplatform, ne kelljen reszponzív akrobatikát csinálni asztali nézethez.
- **Offline-first ha lehet.** PWA service worker, hogy ne legyen kínos, ha pillanatra megszakad a wifi.
- **Adatkonzisztencia.** IndexedDB-be írunk minden haladást, hogy újratöltés után is folytathassa.
- **Hang-betöltés előre.** A jutalom-hangok preload-olva legyenek, ne legyen késleltetés.
- **Animációk teljesítménye.** Galaxy Tab S6 Lite középkategóriás eszköz — kerüljük a pazarló rerenderelést, használjunk `will-change`-et és `transform`-ot pozícióállításra.

## 9. Glossary

- **PWA:** Progressive Web App — böngészőből telepíthető „app".
- **TTS:** Text-to-Speech, szöveg felolvasása géppel.
- **STT:** Speech-to-Text, beszéd felismerése géppel.
- **Subitizing:** kis mennyiség azonnali felismerése számolás nélkül.
- **Number bonds:** mennyiség-bontás (pl. a 6 az 5+1, 4+2, 3+3).
- **Meixner-módszer:** magyar olvasástanítási standard, szótag-alapú.
- **TPR:** Total Physical Response, mozgással kísért nyelvtanulás.
