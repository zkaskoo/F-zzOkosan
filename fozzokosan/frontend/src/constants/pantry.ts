// A bevásárlólista „okos" csoportosításához használt alapanyag-halmazok.
// A kulcsszavakat a hozzávaló nevének kisbetűs alakjában keressük.
//
// - seasoning (fűszer): „ízlés szerint" kezeljük – mennyiség nélkül, külön csoportban.
// - pantry (kamra-alap): nem töröljük, csak jelöljük, hogy valószínűleg otthon van.
// - normal: sima, megveendő tétel.

export type ItemCategory = 'seasoning' | 'pantry' | 'normal';

// Egyértelmű, hosszú fűszernevek – részszó-egyezéssel is biztonságosak.
const SEASONING_SUBSTRINGS = [
  'pirospaprika',
  'fűszerpaprika',
  'majoránna',
  'kömény',
  'oregánó',
  'babérlevél',
  'szerecsendió',
  'kakukkfű',
  'rozmaring',
  'bazsalikom',
  'chili',
  'fahéj',
  'kurkuma',
  'curry',
  'fűszer',
];

// Rövid/kétértelmű fűszerek szóhatárral: a „bors" igen, de a „borsó" (zöldség) ne.
const SEASONING_WORDS = [/(^|[\s,])bors([\s,]|$)/];

// Kamra-alapok (otthon szokott lenni). Az „olaj" lefedi az olívaolaj/étolaj stb. alakokat.
const PANTRY_SUBSTRINGS = ['cukor', 'olaj'];

// A „só" rövid szó, ezért szóhatárral keressük (hogy a „borsó", „sóska", „sós" ne essen ide).
const PANTRY_WORDS = [/(^|[\s,])só([\s,]|$)/];

export function classifyShoppingItem(name: string): ItemCategory {
  const n = name.toLowerCase();

  if (
    SEASONING_SUBSTRINGS.some((k) => n.includes(k)) ||
    SEASONING_WORDS.some((re) => re.test(n))
  ) {
    return 'seasoning';
  }

  if (
    PANTRY_WORDS.some((re) => re.test(n)) ||
    PANTRY_SUBSTRINGS.some((k) => n.includes(k))
  ) {
    return 'pantry';
  }

  return 'normal';
}
