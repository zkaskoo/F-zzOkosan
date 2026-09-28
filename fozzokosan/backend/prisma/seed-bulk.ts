/**
 * Tömeges recept-seed: sok, valósághű magyar recept feltöltése tesztadatnak.
 * Idempotens: a már létező slug-okat kihagyja.
 *
 * Futtatás:  npx ts-node prisma/seed-bulk.ts
 */
import { PrismaClient, Difficulty, DietaryTag } from '@prisma/client';
import { slugify } from '../src/common/slugify';

const prisma = new PrismaClient();

interface Ing {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

interface GenRecipe {
  title: string;
  category: string; // kategória slug
  difficulty: Difficulty;
  cookingTime: number;
  servings: number;
  dietaryTags: DietaryTag[];
  description: string;
  ingredients: Ing[];
  steps: string[];
}

const recipes: GenRecipe[] = [];

// ============================================================
// 1) KRÉMLEVESEK — zöldség-variánsok
// ============================================================
const kremlevesVeggies: { name: string; adj: string; qty: number }[] = [
  { name: 'brokkoli', adj: 'brokkoli', qty: 50 },
  { name: 'karfiol', adj: 'karfiol', qty: 50 },
  { name: 'sárgarépa', adj: 'sárgarépa', qty: 50 },
  { name: 'sütőtök', adj: 'sütőtök', qty: 60 },
  { name: 'cukkini', adj: 'cukkini', qty: 50 },
  { name: 'gomba', adj: 'gomba', qty: 50 },
  { name: 'zöldborsó', adj: 'zöldborsó', qty: 50 },
  { name: 'paradicsom', adj: 'paradicsom', qty: 60 },
  { name: 'csicseriborsó', adj: 'csicseriborsó', qty: 40 },
  { name: 'zeller', adj: 'zeller', qty: 50 },
  { name: 'spenót', adj: 'spenót', qty: 40 },
  { name: 'padlizsán', adj: 'padlizsán', qty: 50 },
];
for (const v of kremlevesVeggies) {
  const title = `${v.adj.charAt(0).toUpperCase() + v.adj.slice(1)}krémleves`;
  recipes.push({
    title,
    category: 'leves',
    difficulty: 'EASY',
    cookingTime: 30,
    servings: 4,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: `Selymes, krémes ${v.name}leves friss zöldségekből, egy kevés tejszínnel gazdagítva.`,
    ingredients: [
      { name: v.name, quantity: v.qty, unit: 'dkg' },
      { name: 'vöröshagyma', quantity: 1, unit: 'fej', notes: 'apróra vágva' },
      { name: 'fokhagyma', quantity: 2, unit: 'gerezd' },
      { name: 'vaj', quantity: 3, unit: 'dkg' },
      { name: 'zöldségalaplé', quantity: 8, unit: 'dl' },
      { name: 'főzőtejszín', quantity: 1, unit: 'dl' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
      { name: 'bors', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      'A vajon üvegesre pároljuk az apróra vágott hagymát és a fokhagymát.',
      `Hozzáadjuk a felkockázott ${v.name}t, és pár percig együtt pároljuk.`,
      'Felöntjük az alaplével, és puhára főzzük (kb. 15-20 perc).',
      'Botmixerrel simára turmixoljuk, majd hozzáöntjük a tejszínt.',
      'Sóval, borssal ízesítjük, és forrón tálaljuk.',
    ],
  });
}

// ============================================================
// 2) PÖRKÖLTEK — hús- és gombavariánsok
// ============================================================
const porkoltProteins: {
  name: string;
  title: string;
  vegan: boolean;
  time: number;
}[] = [
  { name: 'marhalábszár', title: 'Marhapörkölt', vegan: false, time: 120 },
  { name: 'sertéslapocka', title: 'Sertéspörkölt', vegan: false, time: 90 },
  { name: 'csirkecomb', title: 'Csirkepörkölt', vegan: false, time: 60 },
  { name: 'pulykacomb', title: 'Pulykapörkölt', vegan: false, time: 60 },
  { name: 'gomba', title: 'Gombapörkölt', vegan: true, time: 40 },
  { name: 'borjúlábszár', title: 'Borjúpörkölt', vegan: false, time: 100 },
];
for (const p of porkoltProteins) {
  recipes.push({
    title: p.title,
    category: 'foetel',
    difficulty: 'MEDIUM',
    cookingTime: p.time,
    servings: 4,
    dietaryTags: p.vegan ? ['VEGAN', 'GLUTEN_FREE'] : ['GLUTEN_FREE'],
    description: `Hagyományos magyar ${p.title.toLowerCase()} bő hagymával és pirospaprikával, lassan összefőzve.`,
    ingredients: [
      { name: p.name, quantity: 80, unit: 'dkg', notes: 'kockázva' },
      { name: 'vöröshagyma', quantity: 2, unit: 'fej', notes: 'apróra vágva' },
      { name: 'fokhagyma', quantity: 2, unit: 'gerezd' },
      { name: 'pirospaprika', quantity: 2, unit: 'ek' },
      { name: 'paradicsom', quantity: 1, unit: 'db' },
      { name: 'zöldpaprika', quantity: 1, unit: 'db' },
      { name: p.vegan ? 'napraforgóolaj' : 'sertészsír', quantity: 3, unit: 'ek' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      'A zsiradékon üvegesre pároljuk a hagymát.',
      'Lehúzzuk a tűzről, megszórjuk a pirospaprikával és gyorsan elkeverjük.',
      `Hozzáadjuk a kockázott ${p.name}t, és fehéredésig pirítjuk.`,
      'Sózzuk, felöntjük kevés vízzel, és lassú tűzön puhára pároljuk.',
      'A vége felé hozzáadjuk a paradicsomot és a paprikát, és összeforraljuk.',
    ],
  });
}

// ============================================================
// 3) RAKOTT ÉTELEK
// ============================================================
const rakottDishes: { title: string; base: string; qty: number }[] = [
  { title: 'Rakott krumpli', base: 'burgonya', qty: 80 },
  { title: 'Rakott karfiol', base: 'karfiol', qty: 70 },
  { title: 'Rakott cukkini', base: 'cukkini', qty: 70 },
  { title: 'Rakott kelkáposzta', base: 'kelkáposzta', qty: 70 },
  { title: 'Rakott brokkoli', base: 'brokkoli', qty: 70 },
];
for (const d of rakottDishes) {
  recipes.push({
    title: d.title,
    category: 'foetel',
    difficulty: 'EASY',
    cookingTime: 60,
    servings: 4,
    dietaryTags: ['VEGETARIAN'],
    description: `Klasszikus ${d.title.toLowerCase()} tejfölös-tojásos rétegekkel, sajttal a tetején.`,
    ingredients: [
      { name: d.base, quantity: d.qty, unit: 'dkg' },
      { name: 'tojás', quantity: 4, unit: 'db', notes: 'keményre főzve' },
      { name: 'tejföl', quantity: 3, unit: 'dl' },
      { name: 'füstölt kolbász', quantity: 20, unit: 'dkg', notes: 'karikázva' },
      { name: 'reszelt sajt', quantity: 10, unit: 'dkg' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      `A ${d.base}t megfőzzük, és felkarikázzuk.`,
      'Egy tűzálló tálat kizsírozunk, és rétegezzük a zöldséget, tojást, kolbászt.',
      'Minden réteget megkenünk tejföllel és sózzuk.',
      'A tetejére reszelt sajtot szórunk.',
      '180 fokos sütőben aranybarnára sütjük, kb. 30 perc alatt.',
    ],
  });
}

// ============================================================
// 4) SALÁTÁK
// ============================================================
const salads: GenRecipe[] = [
  {
    title: 'Görög saláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 15,
    servings: 2,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: 'Friss görög saláta feta sajttal, olívabogyóval és olívaolajos öntettel.',
    ingredients: [
      { name: 'paradicsom', quantity: 3, unit: 'db' },
      { name: 'uborka', quantity: 1, unit: 'db' },
      { name: 'lilahagyma', quantity: 1, unit: 'db' },
      { name: 'feta sajt', quantity: 15, unit: 'dkg' },
      { name: 'olívabogyó', quantity: 10, unit: 'dkg' },
      { name: 'olívaolaj', quantity: 3, unit: 'ek' },
    ],
    steps: [
      'A paradicsomot és az uborkát felkockázzuk.',
      'A lilahagymát vékony karikákra vágjuk.',
      'Egy tálban összekeverjük a zöldségeket az olívabogyóval.',
      'A tetejére morzsolt feta sajtot teszünk, és meglocsoljuk olívaolajjal.',
    ],
  },
  {
    title: 'Cézár saláta',
    category: 'salata',
    difficulty: 'MEDIUM',
    cookingTime: 25,
    servings: 2,
    dietaryTags: [],
    description: 'Ropogós cézár saláta grillezett csirkemellel és krutonnal.',
    ingredients: [
      { name: 'jégsaláta', quantity: 1, unit: 'fej' },
      { name: 'csirkemell', quantity: 30, unit: 'dkg' },
      { name: 'parmezán', quantity: 5, unit: 'dkg' },
      { name: 'kenyér', quantity: 3, unit: 'szelet', notes: 'krutonnak' },
      { name: 'cézár öntet', quantity: 1, unit: 'dl' },
    ],
    steps: [
      'A csirkemellet megsütjük és felcsíkozzuk.',
      'A kenyeret kockákra vágjuk, és ropogósra pirítjuk.',
      'A salátát összetépkedjük, és tálba tesszük.',
      'Rátesszük a csirkét, a krutont, meglocsoljuk az öntettel, és parmezánnal megszórjuk.',
    ],
  },
  {
    title: 'Tonhalsaláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 15,
    servings: 2,
    dietaryTags: ['GLUTEN_FREE'],
    description: 'Laktató tonhalsaláta kukoricával és friss zöldségekkel.',
    ingredients: [
      { name: 'tonhalkonzerv', quantity: 2, unit: 'db' },
      { name: 'kukorica', quantity: 1, unit: 'db' },
      { name: 'paradicsom', quantity: 2, unit: 'db' },
      { name: 'jégsaláta', quantity: 1, unit: 'fej' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
    ],
    steps: [
      'A salátát összetépkedjük, a paradicsomot felkockázzuk.',
      'Hozzáadjuk a lecsepegtetett tonhalat és kukoricát.',
      'Meglocsoljuk olívaolajjal, és óvatosan összeforgatjuk.',
    ],
  },
  {
    title: 'Cékla-feta saláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 20,
    servings: 2,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: 'Édeskés cékla feta sajttal és dióval.',
    ingredients: [
      { name: 'főtt cékla', quantity: 30, unit: 'dkg' },
      { name: 'feta sajt', quantity: 10, unit: 'dkg' },
      { name: 'dió', quantity: 5, unit: 'dkg' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
      { name: 'balzsamecet', quantity: 1, unit: 'ek' },
    ],
    steps: [
      'A céklát felkockázzuk.',
      'Tálba tesszük, rámorzsoljuk a fetát és rászórjuk a diót.',
      'Olívaolaj és balzsamecet keverékével meglocsoljuk.',
    ],
  },
  {
    title: 'Quinoa saláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 25,
    servings: 2,
    dietaryTags: ['VEGAN', 'GLUTEN_FREE'],
    description: 'Tápláló quinoa saláta friss zöldségekkel és citromos öntettel.',
    ingredients: [
      { name: 'quinoa', quantity: 15, unit: 'dkg' },
      { name: 'uborka', quantity: 1, unit: 'db' },
      { name: 'paradicsom', quantity: 2, unit: 'db' },
      { name: 'lilahagyma', quantity: 1, unit: 'db' },
      { name: 'citrom', quantity: 1, unit: 'db' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
    ],
    steps: [
      'A quinoát csomagolás szerint megfőzzük, és hagyjuk kihűlni.',
      'A zöldségeket apróra kockázzuk.',
      'Összekeverjük a quinoával, citromlével és olívaolajjal ízesítjük.',
    ],
  },
  {
    title: 'Kukoricás csirkesaláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 20,
    servings: 2,
    dietaryTags: ['GLUTEN_FREE'],
    description: 'Könnyű csirkesaláta kukoricával és joghurtos öntettel.',
    ingredients: [
      { name: 'csirkemell', quantity: 25, unit: 'dkg' },
      { name: 'kukorica', quantity: 1, unit: 'db' },
      { name: 'jégsaláta', quantity: 1, unit: 'fej' },
      { name: 'görög joghurt', quantity: 1, unit: 'dl' },
    ],
    steps: [
      'A csirkemellet megsütjük és felcsíkozzuk.',
      'A salátát összetépkedjük, hozzáadjuk a kukoricát.',
      'Rátesszük a csirkét, és a joghurtos öntettel meglocsoljuk.',
    ],
  },
  {
    title: 'Paradicsom-mozzarella saláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 10,
    servings: 2,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: 'Olasz klasszikus friss bazsalikommal.',
    ingredients: [
      { name: 'paradicsom', quantity: 3, unit: 'db' },
      { name: 'mozzarella', quantity: 20, unit: 'dkg' },
      { name: 'bazsalikom', quantity: 1, unit: 'csokor' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
    ],
    steps: [
      'A paradicsomot és a mozzarellát karikákra vágjuk.',
      'Felváltva tányérra rendezzük.',
      'Friss bazsalikommal megszórjuk és olívaolajjal meglocsoljuk.',
    ],
  },
  {
    title: 'Burgonyasaláta',
    category: 'salata',
    difficulty: 'EASY',
    cookingTime: 30,
    servings: 4,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: 'Hagyományos ecetes-hagymás burgonyasaláta.',
    ingredients: [
      { name: 'burgonya', quantity: 70, unit: 'dkg' },
      { name: 'lilahagyma', quantity: 1, unit: 'db' },
      { name: 'ecet', quantity: 2, unit: 'ek' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
    ],
    steps: [
      'A burgonyát héjában megfőzzük, majd megpucoljuk és felkarikázzuk.',
      'A hagymát vékonyra szeleteljük.',
      'Ecettel, olajjal, sóval összeforgatjuk, és állni hagyjuk fél órát.',
    ],
  },
];
recipes.push(...salads);

// ============================================================
// 5) TURMIXOK / SMOOTHIE-K
// ============================================================
const smoothies: { fruit: string; extra?: string }[] = [
  { fruit: 'eper', extra: 'banán' },
  { fruit: 'áfonya' },
  { fruit: 'mangó' },
  { fruit: 'málna' },
  { fruit: 'őszibarack' },
  { fruit: 'ananász' },
  { fruit: 'meggy' },
  { fruit: 'körte', extra: 'spenót' },
  { fruit: 'banán', extra: 'kakaó' },
  { fruit: 'sárgabarack' },
];
for (const s of smoothies) {
  const title = s.extra
    ? `${cap(s.fruit)}-${s.extra} turmix`
    : `${cap(s.fruit)} turmix`;
  const ings: Ing[] = [
    { name: s.fruit, quantity: 15, unit: 'dkg' },
    { name: 'banán', quantity: 1, unit: 'db' },
    { name: 'növényi tej', quantity: 2, unit: 'dl' },
    { name: 'méz', quantity: 1, unit: 'ek' },
  ];
  if (s.extra && s.extra !== 'banán') {
    ings.splice(1, 0, { name: s.extra, quantity: 5, unit: 'dkg' });
  }
  recipes.push({
    title,
    category: 'ital',
    difficulty: 'EASY',
    cookingTime: 5,
    servings: 1,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: `Frissítő ${s.fruit} turmix, tökéletes reggelire vagy uzsonnára.`,
    ingredients: ings,
    steps: [
      'Az összes hozzávalót turmixgépbe tesszük.',
      'Simára turmixoljuk.',
      'Pohárba töltjük, és azonnal fogyasztjuk.',
    ],
  });
}

// ============================================================
// 6) RÁNTOTT / SÜLT HÚSOK
// ============================================================
const friedDishes: {
  title: string;
  main: string;
  qty: number;
  veg: boolean;
  time: number;
}[] = [
  { title: 'Rántott csirkemell', main: 'csirkemell', qty: 60, veg: false, time: 30 },
  { title: 'Rántott sertésszelet', main: 'sertéskaraj', qty: 60, veg: false, time: 35 },
  { title: 'Rántott sajt', main: 'trappista sajt', qty: 40, veg: true, time: 20 },
  { title: 'Rántott gomba', main: 'csiperkegomba', qty: 40, veg: true, time: 25 },
  { title: 'Rántott karfiol', main: 'karfiol', qty: 50, veg: true, time: 30 },
];
for (const f of friedDishes) {
  recipes.push({
    title: f.title,
    category: 'foetel',
    difficulty: 'MEDIUM',
    cookingTime: f.time,
    servings: 4,
    dietaryTags: f.veg ? ['VEGETARIAN'] : [],
    description: `Ropogós bundában sült ${f.main}, klasszikus magyar módra.`,
    ingredients: [
      { name: f.main, quantity: f.qty, unit: 'dkg' },
      { name: 'liszt', quantity: 15, unit: 'dkg' },
      { name: 'tojás', quantity: 2, unit: 'db' },
      { name: 'zsemlemorzsa', quantity: 15, unit: 'dkg' },
      { name: 'napraforgóolaj', quantity: 3, unit: 'dl', notes: 'sütéshez' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      `A ${f.main}t előkészítjük, és megsózzuk.`,
      'Lisztbe, felvert tojásba, majd zsemlemorzsába forgatjuk.',
      'Bő forró olajban mindkét oldalát aranybarnára sütjük.',
      'Papírtörlőn lecsepegtetjük, és azonnal tálaljuk.',
    ],
  });
}

// ============================================================
// 7) DESSZERTEK
// ============================================================
const desserts: { title: string; fruit?: string }[] = [
  { title: 'Palacsinta', fruit: 'baracklekvár' },
  { title: 'Almás pite' },
  { title: 'Meggyes piskóta', fruit: 'meggy' },
  { title: 'Csokis muffin' },
  { title: 'Áfonyás muffin', fruit: 'áfonya' },
  { title: 'Túrós palacsinta' },
  { title: 'Mákos guba' },
  { title: 'Gesztenyepüré' },
  { title: 'Citromos sajttorta' },
  { title: 'Kakaós csiga' },
];
for (const d of desserts) {
  recipes.push({
    title: d.title,
    category: 'desszert',
    difficulty: 'MEDIUM',
    cookingTime: 45,
    servings: 6,
    dietaryTags: ['VEGETARIAN'],
    description: `Házi ${d.title.toLowerCase()}, ahogy a nagymama készítette.`,
    ingredients: [
      { name: 'liszt', quantity: 25, unit: 'dkg' },
      { name: 'cukor', quantity: 15, unit: 'dkg' },
      { name: 'tojás', quantity: 3, unit: 'db' },
      { name: 'tej', quantity: 3, unit: 'dl' },
      { name: 'vaj', quantity: 10, unit: 'dkg' },
      ...(d.fruit ? [{ name: d.fruit, quantity: 15, unit: 'dkg' } as Ing] : []),
    ],
    steps: [
      'A száraz hozzávalókat összekeverjük.',
      'Hozzáadjuk a tojást, a tejet és az olvasztott vajat.',
      'Sima tésztát keverünk, és pihentetjük.',
      'A sütő/serpenyő előmelegítése után aranybarnára sütjük.',
      'Tálalás előtt hagyjuk kissé hűlni.',
    ],
  });
}

// ============================================================
// 8) REGGELIK
// ============================================================
const breakfasts: { title: string; main: string }[] = [
  { title: 'Zabkása almával', main: 'alma' },
  { title: 'Zabkása banánnal', main: 'banán' },
  { title: 'Overnight oats áfonyával', main: 'áfonya' },
  { title: 'Sonkás-sajtos rántotta', main: 'sonka' },
  { title: 'Gombás rántotta', main: 'gomba' },
  { title: 'Bundáskenyér', main: 'kenyér' },
  { title: 'Túrós bundáskenyér', main: 'túró' },
  { title: 'Avokádós pirítós', main: 'avokádó' },
];
for (const b of breakfasts) {
  recipes.push({
    title: b.title,
    category: 'reggeli',
    difficulty: 'EASY',
    cookingTime: 15,
    servings: 1,
    dietaryTags: ['VEGETARIAN'],
    description: `Gyors és laktató reggeli: ${b.title.toLowerCase()}.`,
    ingredients: [
      { name: b.main, quantity: 1, unit: 'db' },
      { name: 'tojás', quantity: 2, unit: 'db' },
      { name: 'tej', quantity: 1, unit: 'dl' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      'Az alapanyagokat előkészítjük.',
      `A ${b.main}t hozzáadjuk, és a szokásos módon elkészítjük.`,
      'Melegen tálaljuk.',
    ],
  });
}

// ============================================================
// 9) TÉSZTAÉTELEK
// ============================================================
const pastas: { title: string; sauce: string; veg: boolean }[] = [
  { title: 'Spagetti bolognai', sauce: 'darált marhahús', veg: false },
  { title: 'Carbonara', sauce: 'baconkocka', veg: false },
  { title: 'Sajtos tészta', sauce: 'reszelt sajt', veg: true },
  { title: 'Spenótos tészta', sauce: 'spenót', veg: true },
  { title: 'Gombás tészta', sauce: 'gomba', veg: true },
  { title: 'Paradicsomos tészta', sauce: 'paradicsomszósz', veg: true },
];
for (const p of pastas) {
  recipes.push({
    title: p.title,
    category: 'teszta',
    difficulty: 'EASY',
    cookingTime: 25,
    servings: 4,
    dietaryTags: p.veg ? ['VEGETARIAN'] : [],
    description: `Olasz stílusú ${p.title.toLowerCase()} házi szósszal.`,
    ingredients: [
      { name: 'száraztészta', quantity: 40, unit: 'dkg' },
      { name: p.sauce, quantity: 30, unit: 'dkg' },
      { name: 'fokhagyma', quantity: 2, unit: 'gerezd' },
      { name: 'olívaolaj', quantity: 2, unit: 'ek' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      'A tésztát sós vízben, csomagolás szerint kifőzzük.',
      'Közben az olajon megfuttatjuk a fokhagymát.',
      `Hozzáadjuk a ${p.sauce}t, és összeforraljuk.`,
      'A leszűrt tésztát a szószhoz forgatjuk, és tálaljuk.',
    ],
  });
}

// ============================================================
// 10) KÖRETEK
// ============================================================
const sides: { title: string; main: string }[] = [
  { title: 'Petrezselymes burgonya', main: 'burgonya' },
  { title: 'Burgonyapüré', main: 'burgonya' },
  { title: 'Hasábburgonya', main: 'burgonya' },
  { title: 'Párolt rizs', main: 'rizs' },
  { title: 'Vajas zöldbab', main: 'zöldbab' },
  { title: 'Grillezett zöldségek', main: 'cukkini' },
];
for (const s of sides) {
  recipes.push({
    title: s.title,
    category: 'koret',
    difficulty: 'EASY',
    cookingTime: 25,
    servings: 4,
    dietaryTags: ['VEGETARIAN', 'GLUTEN_FREE'],
    description: `Egyszerű köret bármilyen főételhez: ${s.title.toLowerCase()}.`,
    ingredients: [
      { name: s.main, quantity: 60, unit: 'dkg' },
      { name: 'vaj', quantity: 3, unit: 'dkg' },
      { name: 'só', quantity: null as unknown as number, unit: '', notes: 'ízlés szerint' },
    ],
    steps: [
      `A ${s.main}t megtisztítjuk és előkészítjük.`,
      'Puhára főzzük vagy sütjük.',
      'Vajjal, sóval ízesítjük, és melegen tálaljuk.',
    ],
  });
}

// ============================================================
// 11) HAGYOMÁNYOS LEVESEK
// ============================================================
const soups: GenRecipe[] = [
  {
    title: 'Jókai bableves',
    category: 'leves',
    difficulty: 'MEDIUM',
    cookingTime: 90,
    servings: 6,
    dietaryTags: [],
    description: 'Füstölt csülkös, gazdag Jókai bableves csipetkével.',
    ingredients: [
      { name: 'tarkabab', quantity: 30, unit: 'dkg' },
      { name: 'füstölt csülök', quantity: 40, unit: 'dkg' },
      { name: 'sárgarépa', quantity: 2, unit: 'db' },
      { name: 'füstölt kolbász', quantity: 15, unit: 'dkg' },
      { name: 'tejföl', quantity: 2, unit: 'dl' },
    ],
    steps: [
      'A babot előző este beáztatjuk.',
      'A csülköt feltesszük főni, majd hozzáadjuk a babot és a zöldségeket.',
      'Puhára főzzük, a végén beletesszük a karikázott kolbászt.',
      'Tejföllel behabarjuk, és csipetkével tálaljuk.',
    ],
  },
  {
    title: 'Gombaleves',
    category: 'leves',
    difficulty: 'EASY',
    cookingTime: 35,
    servings: 4,
    dietaryTags: ['VEGETARIAN'],
    description: 'Tejfölös, tárkonyos gombaleves.',
    ingredients: [
      { name: 'csiperkegomba', quantity: 50, unit: 'dkg' },
      { name: 'vöröshagyma', quantity: 1, unit: 'fej' },
      { name: 'tejföl', quantity: 2, unit: 'dl' },
      { name: 'tárkony', quantity: 1, unit: 'tk' },
    ],
    steps: [
      'A hagymát megdinszteljük, hozzáadjuk a szeletelt gombát.',
      'Felöntjük vízzel, fűszerezzük tárkonnyal.',
      'Puhára főzzük, majd tejföllel behabarjuk.',
    ],
  },
  {
    title: 'Zöldségleves',
    category: 'leves',
    difficulty: 'EASY',
    cookingTime: 40,
    servings: 4,
    dietaryTags: ['VEGAN', 'GLUTEN_FREE'],
    description: 'Könnyű, vitamindús vegyes zöldségleves.',
    ingredients: [
      { name: 'sárgarépa', quantity: 2, unit: 'db' },
      { name: 'petrezselyemgyökér', quantity: 1, unit: 'db' },
      { name: 'karfiol', quantity: 20, unit: 'dkg' },
      { name: 'zöldborsó', quantity: 15, unit: 'dkg' },
      { name: 'burgonya', quantity: 2, unit: 'db' },
    ],
    steps: [
      'A zöldségeket felkockázzuk.',
      'Enyhén sós vízben feltesszük főni.',
      'Puhára főzzük, és friss petrezselyemmel megszórva tálaljuk.',
    ],
  },
  {
    title: 'Tojásleves',
    category: 'leves',
    difficulty: 'EASY',
    cookingTime: 20,
    servings: 4,
    dietaryTags: ['VEGETARIAN'],
    description: 'Egyszerű, gyors tojásleves.',
    ingredients: [
      { name: 'tojás', quantity: 4, unit: 'db' },
      { name: 'vöröshagyma', quantity: 1, unit: 'fej' },
      { name: 'pirospaprika', quantity: 1, unit: 'tk' },
      { name: 'burgonya', quantity: 2, unit: 'db' },
    ],
    steps: [
      'A hagymát megpirítjuk, megszórjuk paprikával.',
      'Felöntjük vízzel, hozzáadjuk a kockázott burgonyát.',
      'Amikor a burgonya megpuhult, beleütjük a tojásokat.',
      'Pár perc alatt készre főzzük.',
    ],
  },
  {
    title: 'Húsleves',
    category: 'leves',
    difficulty: 'MEDIUM',
    cookingTime: 120,
    servings: 6,
    dietaryTags: [],
    description: 'Aranyló, gazdag vasárnapi tyúkhúsleves.',
    ingredients: [
      { name: 'tyúkhús', quantity: 80, unit: 'dkg' },
      { name: 'sárgarépa', quantity: 3, unit: 'db' },
      { name: 'petrezselyemgyökér', quantity: 2, unit: 'db' },
      { name: 'zeller', quantity: 1, unit: 'db' },
      { name: 'vöröshagyma', quantity: 1, unit: 'fej' },
    ],
    steps: [
      'A húst hideg vízzel feltesszük főni, lehabozzuk.',
      'Hozzáadjuk a megtisztított zöldségeket és fűszereket.',
      'Lassú tűzön 2 órán át főzzük.',
      'Leszűrjük, és cérnametélttel tálaljuk.',
    ],
  },
];
recipes.push(...soups);

// ============================================================
// Segédfüggvények
// ============================================================
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || 'recept';
  let slug = root;
  let i = 2;
  while (await prisma.recipe.findFirst({ where: { slug } })) {
    slug = `${root}-${i}`;
    i++;
  }
  return slug;
}

// ============================================================
// Beszúrás
// ============================================================
async function main() {
  console.log(`Generált receptek száma: ${recipes.length}`);

  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    throw new Error('Nincs felhasználó az adatbázisban. Előbb futtasd: npm run db:seed');
  }

  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  let created = 0;
  let skipped = 0;

  for (let idx = 0; idx < recipes.length; idx++) {
    const r = recipes[idx];
    const user = users[idx % users.length];

    // Idempotencia: azonos című recept ugyanattól a felhasználótól kimarad
    const existing = await prisma.recipe.findFirst({
      where: { userId: user.id, title: r.title },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const slug = await uniqueSlug(r.title);
    const categoryId = catBySlug.get(r.category);

    await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          userId: user.id,
          title: r.title,
          slug,
          description: r.description,
          cookingTime: r.cookingTime,
          servings: r.servings,
          difficulty: r.difficulty,
          dietaryTags: r.dietaryTags,
        },
      });

      await tx.recipeStep.createMany({
        data: r.steps.map((instruction, i) => ({
          recipeId: recipe.id,
          stepNumber: i + 1,
          instruction,
        })),
      });

      for (const ing of r.ingredients) {
        const normalizedName = ing.name.toLowerCase().trim();
        const ingredient = await tx.ingredient.upsert({
          where: { normalizedName },
          update: {},
          create: { name: ing.name, normalizedName },
        });
        await tx.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            quantity: ing.quantity ?? 0,
            unit: ing.unit,
            notes: ing.notes,
          },
        });
      }

      if (categoryId) {
        await tx.recipeCategory.create({
          data: { recipeId: recipe.id, categoryId },
        });
      }
    });
    created++;
  }

  const total = await prisma.recipe.count();
  console.log(`Létrehozva: ${created}, kihagyva (már létezett): ${skipped}`);
  console.log(`Receptek összesen az adatbázisban: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
