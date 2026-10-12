import { Allergen } from '@prisma/client';

/**
 * Kulcsszó alapú allergén-felismerés az összetevő neve alapján.
 *
 * Az összetevők (pl. „trapista sajt", „reszelt sajt") szabad szövegként
 * kerülnek be a receptekbe, ezért nem lehet pontos névegyezésre hagyatkozni.
 * Itt a normalizált (kisbetűs) névben keresünk jellemző szórészleteket, és
 * ez alapján rendeljük hozzá az allergéneket. Ez heurisztika: a gyakori
 * eseteket lefedi, de nem helyettesíti a kézzel karbantartott adatokat.
 */
const ALLERGEN_KEYWORDS: Record<Allergen, string[]> = {
  DAIRY: [
    'sajt',
    'tej',
    'tejföl',
    'tejfol',
    'tejszín',
    'tejszin',
    'tejpor',
    'vaj',
    'túró',
    'turo',
    'joghurt',
    'mascarpone',
    'mozzarella',
    'parmez',
    'gomolya',
    'trappista',
    'trapista',
    'cheddar',
    'feta',
    'ricotta',
    'krémsajt',
    'kremsajt',
    'kefir',
    'tejföl',
  ],
  GLUTEN: [
    'liszt',
    'tészta',
    'teszta',
    'kenyér',
    'kenyer',
    'zsemle',
    'morzsa',
    'bulgur',
    'búza',
    'buza',
    'árpa',
    'arpa',
    'rozs',
    'spagetti',
    'spaghetti',
    'penne',
    'makaróni',
    'makaroni',
    'tortilla',
    'keksz',
    'piskóta',
    'piskota',
    'palacsinta',
    'grízes',
    'gríz',
    'griz',
  ],
  EGG: ['tojás', 'tojas', 'majonéz', 'majonez'],
  NUT: ['dió', 'dio', 'mandula', 'mogyoró', 'mogyoro', 'kesu', 'pisztácia', 'pisztacia', 'pekándió', 'pekandio'],
  PEANUT: ['földimogyoró', 'foldimogyoro', 'amerikai mogyoró', 'mogyoróvaj', 'mogyorovaj'],
  SOY: ['szója', 'szoja', 'tofu', 'edamame'],
  FISH: ['hal', 'lazac', 'tonhal', 'pisztráng', 'pisztrang', 'tőkehal', 'tokehal', 'szardínia', 'szardinia', 'hekk'],
  SHELLFISH: ['rák', 'garnéla', 'garnela', 'kagyló', 'kagylo', 'polip', 'tintahal', 'languszta'],
  SESAME: ['szezám', 'szezam', 'tahini'],
  CELERY: ['zeller'],
  MUSTARD: ['mustár', 'mustar'],
  SULPHITE: ['szulfit'],
};

/**
 * Visszaadja az összetevő nevéből kikövetkeztetett allergéneket.
 * A „hal" kulcsszónál vigyázunk: önálló szóként, vagy összetétel végén/elején
 * szerepeljen, hogy a „halszálka" jó, de pl. „halom" ne adjon fals találatot.
 */
export function detectAllergens(name: string): Allergen[] {
  const normalized = name.toLowerCase().trim();
  const found = new Set<Allergen>();

  for (const [allergen, keywords] of Object.entries(ALLERGEN_KEYWORDS) as [
    Allergen,
    string[],
  ][]) {
    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        found.add(allergen);
        break;
      }
    }
  }

  return Array.from(found);
}
