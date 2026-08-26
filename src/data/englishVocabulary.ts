export interface VocabWord {
  word: string
  hu: string
  emoji: string
  category: string
  enArticle: '' | 'a' | 'an'
  huArticle: 'a' | 'az'
  accepted?: string[]         // defined → included in SAY-IT game
  plural?: boolean            // "Where are the X?" instead of "Where is the X?"
  questionPrefix?: 'where' | 'who' | 'which'  // default 'where'
  skipPointer?: boolean       // exclude from pointer task generation
  skipMemory?: boolean        // exclude from memory game
}

export const VOCABULARY: VocabWord[] = [
  // ── Animals ──────────────────────────────────────────────────────────────────
  { word: 'cat',      hu: 'macska',   emoji: '🐱', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['cat', 'ket', 'kett'] },
  { word: 'dog',      hu: 'kutya',    emoji: '🐶', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['dog', 'dok', 'dóg'] },
  { word: 'fish',     hu: 'hal',      emoji: '🐟', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['fish', 'fis', 'fissch'] },
  { word: 'bird',     hu: 'madár',    emoji: '🐦', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['bird', 'berd', 'bürd'] },
  { word: 'rabbit',   hu: 'nyuszi',   emoji: '🐰', category: 'animals', enArticle: 'a',  huArticle: 'a' },
  { word: 'horse',    hu: 'ló',       emoji: '🐴', category: 'animals', enArticle: 'a',  huArticle: 'a' },
  { word: 'cow',      hu: 'tehén',    emoji: '🐮', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['cow', 'kau', 'kou'] },
  { word: 'pig',      hu: 'disznó',   emoji: '🐷', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['pig', 'pik'] },
  { word: 'sheep',    hu: 'bárány',   emoji: '🐑', category: 'animals', enArticle: 'a',  huArticle: 'a' },
  { word: 'duck',     hu: 'kacsa',    emoji: '🦆', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['duck', 'dak', 'dák'] },
  { word: 'frog',     hu: 'béka',     emoji: '🐸', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['frog', 'frok', 'frog'] },
  { word: 'elephant', hu: 'elefánt',  emoji: '🐘', category: 'animals', enArticle: 'an', huArticle: 'az' },
  { word: 'lion',     hu: 'oroszlán', emoji: '🦁', category: 'animals', enArticle: 'a',  huArticle: 'az' },
  { word: 'monkey',   hu: 'majom',    emoji: '🐵', category: 'animals', enArticle: 'a',  huArticle: 'a' },
  { word: 'bear',     hu: 'medve',    emoji: '🐻', category: 'animals', enArticle: 'a',  huArticle: 'a',  accepted: ['bear', 'bér', 'beer'] },

  // ── Fruits ────────────────────────────────────────────────────────────────────
  { word: 'apple',      hu: 'alma',          emoji: '🍎', category: 'fruits', enArticle: 'an', huArticle: 'az', accepted: ['apple', 'apel', 'epol', 'epl'] },
  { word: 'banana',     hu: 'banán',         emoji: '🍌', category: 'fruits', enArticle: 'a',  huArticle: 'a' },
  { word: 'strawberry', hu: 'eper',          emoji: '🍓', category: 'fruits', enArticle: 'a',  huArticle: 'az' },
  { word: 'orange',     hu: 'narancs',       emoji: '🍊', category: 'fruits', enArticle: 'an', huArticle: 'a' },
  { word: 'grape',      hu: 'szőlő',         emoji: '🍇', category: 'fruits', enArticle: 'a',  huArticle: 'a' },
  { word: 'watermelon', hu: 'görögdinnye',   emoji: '🍉', category: 'fruits', enArticle: 'a',  huArticle: 'a' },
  { word: 'pear',       hu: 'körte',         emoji: '🍐', category: 'fruits', enArticle: 'a',  huArticle: 'a',  accepted: ['pear', 'pér', 'per'] },

  // ── Vegetables ────────────────────────────────────────────────────────────────
  { word: 'carrot',   hu: 'sárgarépa',   emoji: '🥕', category: 'vegetables', enArticle: 'a',  huArticle: 'a' },
  { word: 'tomato',   hu: 'paradicsom',  emoji: '🍅', category: 'vegetables', enArticle: 'a',  huArticle: 'a' },
  { word: 'cucumber', hu: 'uborka',      emoji: '🥒', category: 'vegetables', enArticle: 'a',  huArticle: 'az' },
  { word: 'potato',   hu: 'burgonya',    emoji: '🥔', category: 'vegetables', enArticle: 'a',  huArticle: 'a' },
  { word: 'broccoli', hu: 'brokkoli',    emoji: '🥦', category: 'vegetables', enArticle: 'a',  huArticle: 'a' },

  // ── Colours ───────────────────────────────────────────────────────────────────
  { word: 'red',    hu: 'piros',  emoji: '🔴', category: 'colours', enArticle: '', huArticle: 'a',  accepted: ['red', 'rad', 'réd'] },
  { word: 'blue',   hu: 'kék',   emoji: '🔵', category: 'colours', enArticle: '', huArticle: 'a',  accepted: ['blue', 'blú', 'bló'] },
  { word: 'yellow', hu: 'sárga', emoji: '🟡', category: 'colours', enArticle: '', huArticle: 'a' },
  { word: 'green',  hu: 'zöld',  emoji: '🟢', category: 'colours', enArticle: '', huArticle: 'a',  accepted: ['green', 'grin', 'grín'] },

  // ── Family ────────────────────────────────────────────────────────────────────
  { word: 'mother',      hu: 'mama',      emoji: '👩', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'father',      hu: 'papa',      emoji: '👨', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'baby',        hu: 'baba',      emoji: '👶', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'grandmother', hu: 'nagymama',  emoji: '👵', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'grandfather', hu: 'nagypapa',  emoji: '👴', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'sister',      hu: 'húg',       emoji: '👧', category: 'family', enArticle: 'a',  huArticle: 'a' },
  { word: 'brother',     hu: 'fivér',     emoji: '👦', category: 'family', enArticle: 'a',  huArticle: 'a' },

  // ── Body ──────────────────────────────────────────────────────────────────────
  { word: 'head',  hu: 'fej',  emoji: '👤', category: 'body', enArticle: 'a',  huArticle: 'a' },
  { word: 'nose',  hu: 'orr',  emoji: '👃', category: 'body', enArticle: 'a',  huArticle: 'az', accepted: ['nose', 'nóz', 'nóusz'] },
  { word: 'mouth', hu: 'száj', emoji: '👄', category: 'body', enArticle: 'a',  huArticle: 'a' },
  { word: 'ear',   hu: 'fül',  emoji: '👂', category: 'body', enArticle: 'an', huArticle: 'a',  accepted: ['ear', 'ir', 'ír'] },
  { word: 'eye',   hu: 'szem', emoji: '👁️', category: 'body', enArticle: 'an', huArticle: 'a' },
  { word: 'hand',  hu: 'kéz',  emoji: '🖐️', category: 'body', enArticle: 'a',  huArticle: 'a',  accepted: ['hand', 'hend'] },
  { word: 'foot',  hu: 'láb',  emoji: '🦶', category: 'body', enArticle: 'a',  huArticle: 'a',  accepted: ['foot', 'fut', 'fút'] },

  // ── Emotions ──────────────────────────────────────────────────────────────────
  { word: 'happy',     hu: 'boldog',    emoji: '😊', category: 'emotions', enArticle: '', huArticle: 'a',  questionPrefix: 'who' },
  { word: 'sad',       hu: 'szomorú',   emoji: '😢', category: 'emotions', enArticle: '', huArticle: 'a',  questionPrefix: 'who' },
  { word: 'tired',     hu: 'álmos',     emoji: '😴', category: 'emotions', enArticle: '', huArticle: 'az', questionPrefix: 'who' },
  { word: 'angry',     hu: 'mérges',    emoji: '😡', category: 'emotions', enArticle: '', huArticle: 'a',  questionPrefix: 'who' },
  { word: 'surprised', hu: 'meglepett', emoji: '😲', category: 'emotions', enArticle: '', huArticle: 'a',  questionPrefix: 'who' },

  // ── Clothes (NEW) ─────────────────────────────────────────────────────────────
  { word: 'shirt',    hu: 'póló',   emoji: '👕', category: 'clothes', enArticle: 'a',  huArticle: 'a',  accepted: ['shirt', 'söt', 'sert'] },
  { word: 'trousers', hu: 'nadrág', emoji: '👖', category: 'clothes', enArticle: '',   huArticle: 'a',  plural: true },
  { word: 'shoes',    hu: 'cipő',   emoji: '👟', category: 'clothes', enArticle: '',   huArticle: 'a',  plural: true },
  { word: 'hat',      hu: 'sapka',  emoji: '🧢', category: 'clothes', enArticle: 'a',  huArticle: 'a',  accepted: ['hat', 'hát', 'het'] },
  { word: 'dress',    hu: 'ruha',   emoji: '👗', category: 'clothes', enArticle: 'a',  huArticle: 'a',  accepted: ['dress', 'dressz', 'dres'] },
  { word: 'socks',    hu: 'zokni',  emoji: '🧦', category: 'clothes', enArticle: '',   huArticle: 'a',  plural: true },
  { word: 'jacket',   hu: 'kabát',  emoji: '🧥', category: 'clothes', enArticle: 'a',  huArticle: 'a' },

  // ── Vehicles (NEW) ────────────────────────────────────────────────────────────
  { word: 'car',        hu: 'autó',      emoji: '🚗', category: 'vehicles', enArticle: 'a',  huArticle: 'az', accepted: ['car', 'kar', 'kár'] },
  { word: 'bus',        hu: 'busz',      emoji: '🚌', category: 'vehicles', enArticle: 'a',  huArticle: 'a',  accepted: ['bus', 'bász', 'basz'] },
  { word: 'train',      hu: 'vonat',     emoji: '🚂', category: 'vehicles', enArticle: 'a',  huArticle: 'a',  accepted: ['train', 'trein', 'trén'] },
  { word: 'bicycle',    hu: 'bicikli',   emoji: '🚲', category: 'vehicles', enArticle: 'a',  huArticle: 'a' },
  { word: 'airplane',   hu: 'repülő',    emoji: '✈️', category: 'vehicles', enArticle: 'an', huArticle: 'a' },
  { word: 'boat',       hu: 'csónak',    emoji: '⛵', category: 'vehicles', enArticle: 'a',  huArticle: 'a',  accepted: ['boat', 'bot', 'bót'] },
  { word: 'helicopter', hu: 'helikopter',emoji: '🚁', category: 'vehicles', enArticle: 'a',  huArticle: 'a' },

  // ── Weather (NEW) ─────────────────────────────────────────────────────────────
  { word: 'sun',     hu: 'nap',       emoji: '☀️', category: 'weather', enArticle: 'a',  huArticle: 'a',  accepted: ['sun', 'szan', 'szun'] },
  { word: 'rain',    hu: 'eső',       emoji: '🌧️', category: 'weather', enArticle: '',   huArticle: 'az', accepted: ['rain', 'rein', 'rén'] },
  { word: 'snow',    hu: 'hó',        emoji: '❄️', category: 'weather', enArticle: '',   huArticle: 'a',  accepted: ['snow', 'snó', 'szno'] },
  { word: 'wind',    hu: 'szél',      emoji: '💨', category: 'weather', enArticle: '',   huArticle: 'a',  accepted: ['wind', 'vind', 'vint'] },
  { word: 'cloud',   hu: 'felhő',     emoji: '☁️', category: 'weather', enArticle: 'a',  huArticle: 'a',  accepted: ['cloud', 'klaud', 'klaut'] },
  { word: 'rainbow', hu: 'szivárvány',emoji: '🌈', category: 'weather', enArticle: 'a',  huArticle: 'a' },

  // ── Numbers (NEW) ─────────────────────────────────────────────────────────────
  { word: 'one',   hu: 'egy',   emoji: '1️⃣', category: 'numbers', enArticle: '',  huArticle: 'az', accepted: ['one', 'vun', 'uan', 'wan'],      questionPrefix: 'which' },
  { word: 'two',   hu: 'kettő', emoji: '2️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['two', 'tú', 'tuu'],               questionPrefix: 'which' },
  { word: 'three', hu: 'három', emoji: '3️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['three', 'szri', 'tri', 'thri'],   questionPrefix: 'which' },
  { word: 'four',  hu: 'négy',  emoji: '4️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['four', 'fór', 'for'],             questionPrefix: 'which' },
  { word: 'five',  hu: 'öt',    emoji: '5️⃣', category: 'numbers', enArticle: '',  huArticle: 'az', accepted: ['five', 'fájv', 'fáif'],           questionPrefix: 'which' },
  { word: 'six',   hu: 'hat',   emoji: '6️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['six', 'szikszz', 'sziksz'],       questionPrefix: 'which' },
  { word: 'seven', hu: 'hét',   emoji: '7️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['seven', 'szeven', 'szevn'],        questionPrefix: 'which' },
  { word: 'eight', hu: 'nyolc', emoji: '8️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['eight', 'éjt', 'eit'],             questionPrefix: 'which' },
  { word: 'nine',  hu: 'kilenc',emoji: '9️⃣', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['nine', 'nájn', 'najn'],            questionPrefix: 'which' },
  { word: 'ten',   hu: 'tíz',   emoji: '🔟', category: 'numbers', enArticle: '',  huArticle: 'a',  accepted: ['ten', 'ten'],                      questionPrefix: 'which' },

  // ── Daily routine (NEW) ───────────────────────────────────────────────────────
  { word: 'morning',   hu: 'reggel',   emoji: '🌅', category: 'daily', enArticle: '',  huArticle: 'a' },
  { word: 'night',     hu: 'éjszaka',  emoji: '🌙', category: 'daily', enArticle: '',  huArticle: 'az' },
  { word: 'breakfast', hu: 'reggeli',  emoji: '🍳', category: 'daily', enArticle: '',  huArticle: 'a' },
  { word: 'lunch',     hu: 'ebéd',     emoji: '🍽️', category: 'daily', enArticle: '',  huArticle: 'az' },
  { word: 'dinner',    hu: 'vacsora',  emoji: '🍲', category: 'daily', enArticle: '',  huArticle: 'a' },
  { word: 'bath',      hu: 'fürdő',    emoji: '🛁', category: 'daily', enArticle: 'a', huArticle: 'a' },
  { word: 'bed',       hu: 'ágy',      emoji: '🛏️', category: 'daily', enArticle: 'a', huArticle: 'az' },

  // ── Misc (existing SAY-IT words not in other categories) ─────────────────────
  { word: 'ball', hu: 'labda', emoji: '⚽', category: 'misc', enArticle: 'a', huArticle: 'a', accepted: ['ball', 'bal', 'bol'], skipPointer: true, skipMemory: true },
  { word: 'milk', hu: 'tej',   emoji: '🥛', category: 'misc', enArticle: '',  huArticle: 'a', accepted: ['milk', 'milkk', 'mil'], skipMemory: true },
  { word: 'big',  hu: 'nagy',  emoji: '📏', category: 'misc', enArticle: '',  huArticle: 'a', accepted: ['big', 'bik'], skipPointer: true, skipMemory: true },
]

// ── Derived data helpers ──────────────────────────────────────────────────────

export function getMemoryCategories(): Array<{ items: Array<{ word: string; emoji: string }> }> {
  const map = new Map<string, Array<{ word: string; emoji: string }>>()
  VOCABULARY
    .filter(w => !w.skipMemory)
    .forEach(w => {
      if (!map.has(w.category)) map.set(w.category, [])
      map.get(w.category)!.push({ word: w.word, emoji: w.emoji })
    })
  return Array.from(map.values())
    .filter(items => items.length >= 4)
    .map(items => ({ items }))
}
