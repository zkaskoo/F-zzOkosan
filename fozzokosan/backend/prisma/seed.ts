import { PrismaClient, IngredientCategory, Difficulty, Allergen } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const INGREDIENTS: { name: string; category: IngredientCategory; defaultUnit?: string; allergens?: Allergen[] }[] = [
  // MEAT
  { name: 'csirkemell', category: 'MEAT', defaultUnit: 'g' },
  { name: 'csirkecomb', category: 'MEAT', defaultUnit: 'g' },
  { name: 'darált hús', category: 'MEAT', defaultUnit: 'g' },
  { name: 'sertéskaraj', category: 'MEAT', defaultUnit: 'g' },
  { name: 'szalonna', category: 'MEAT', defaultUnit: 'g' },
  { name: 'kolbász', category: 'MEAT', defaultUnit: 'g' },
  { name: 'sonka', category: 'MEAT', defaultUnit: 'g' },
  { name: 'marha hús', category: 'MEAT', defaultUnit: 'g' },
  { name: 'pulyka', category: 'MEAT', defaultUnit: 'g' },
  { name: 'bacon', category: 'MEAT', defaultUnit: 'g' },

  // DAIRY
  { name: 'tej', category: 'DAIRY', defaultUnit: 'ml', allergens: ['DAIRY'] },
  { name: 'tejföl', category: 'DAIRY', defaultUnit: 'ml', allergens: ['DAIRY'] },
  { name: 'vaj', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },
  { name: 'sajt', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },
  { name: 'tojás', category: 'DAIRY', defaultUnit: 'db', allergens: ['EGG'] },
  { name: 'túró', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },
  { name: 'mascarpone', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },
  { name: 'tejszín', category: 'DAIRY', defaultUnit: 'ml', allergens: ['DAIRY'] },
  { name: 'joghurt', category: 'DAIRY', defaultUnit: 'ml', allergens: ['DAIRY'] },
  { name: 'mozzarella', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },
  { name: 'parmezán', category: 'DAIRY', defaultUnit: 'g', allergens: ['DAIRY'] },

  // VEGETABLE
  { name: 'hagyma', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'fokhagyma', category: 'VEGETABLE', defaultUnit: 'gerezd' },
  { name: 'paradicsom', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'paprika', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'burgonya', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'sárgarépa', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'zeller', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'cukkini', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'padlizsán', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'brokkoli', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'karfiol', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'gomba', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'kukorica', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'borsó', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'zöldbab', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'káposzta', category: 'VEGETABLE', defaultUnit: 'g' },
  { name: 'saláta', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'uborka', category: 'VEGETABLE', defaultUnit: 'db' },
  { name: 'spenót', category: 'VEGETABLE', defaultUnit: 'g' },

  // FRUIT
  { name: 'alma', category: 'FRUIT', defaultUnit: 'db' },
  { name: 'citrom', category: 'FRUIT', defaultUnit: 'db' },
  { name: 'narancs', category: 'FRUIT', defaultUnit: 'db' },
  { name: 'banán', category: 'FRUIT', defaultUnit: 'db' },
  { name: 'eper', category: 'FRUIT', defaultUnit: 'g' },
  { name: 'meggy', category: 'FRUIT', defaultUnit: 'g' },

  // GRAIN
  { name: 'liszt', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN'] },
  { name: 'rizs', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'tészta', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN', 'EGG'] },
  { name: 'zsemlemorzsa', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN'] },
  { name: 'kenyér', category: 'GRAIN', defaultUnit: 'szelet', allergens: ['GLUTEN'] },
  { name: 'zabpehely', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN'] },
  { name: 'spagetti', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN'] },
  { name: 'penne', category: 'GRAIN', defaultUnit: 'g', allergens: ['GLUTEN'] },

  // SPICE
  { name: 'só', category: 'SPICE', defaultUnit: 'csipet' },
  { name: 'bors', category: 'SPICE', defaultUnit: 'csipet' },
  { name: 'pirospaprika', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'oregánó', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'bazsalikom', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'rozmaring', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'kakukkfű', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'fahéj', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'szerecsendió', category: 'SPICE', defaultUnit: 'csipet' },
  { name: 'gyömbér', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'curry', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'köménymag', category: 'SPICE', defaultUnit: 'tk' },
  { name: 'babérlevél', category: 'SPICE', defaultUnit: 'db' },
  { name: 'petrezselyem', category: 'SPICE', defaultUnit: 'csokor' },
  { name: 'kapor', category: 'SPICE', defaultUnit: 'csokor' },
  { name: 'tárkony', category: 'SPICE', defaultUnit: 'tk' },

  // CONDIMENT
  { name: 'olívaolaj', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'étolaj', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'napraforgó olaj', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'ecet', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'szójaszósz', category: 'CONDIMENT', defaultUnit: 'ek', allergens: ['SOY'] },
  { name: 'mustár', category: 'CONDIMENT', defaultUnit: 'tk', allergens: ['MUSTARD'] },
  { name: 'ketchup', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'majonéz', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'méz', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'cukor', category: 'CONDIMENT', defaultUnit: 'g' },
  { name: 'porcukor', category: 'CONDIMENT', defaultUnit: 'g' },
  { name: 'vaníliás cukor', category: 'CONDIMENT', defaultUnit: 'csomag' },
  { name: 'sütőpor', category: 'CONDIMENT', defaultUnit: 'tk' },
  { name: 'élesztő', category: 'CONDIMENT', defaultUnit: 'g' },
  { name: 'paradicsomszósz', category: 'CONDIMENT', defaultUnit: 'ml' },
  { name: 'paradicsompüré', category: 'CONDIMENT', defaultUnit: 'ek' },

  // BEVERAGE
  { name: 'víz', category: 'BEVERAGE', defaultUnit: 'ml' },
  { name: 'fehérbor', category: 'BEVERAGE', defaultUnit: 'dl' },
  { name: 'vörösbor', category: 'BEVERAGE', defaultUnit: 'dl' },
  { name: 'sör', category: 'BEVERAGE', defaultUnit: 'dl' },
];

const UNIT_CONVERSIONS = [
  { fromUnit: 'dkg', toUnit: 'g', multiplier: 10 },
  { fromUnit: 'kg', toUnit: 'g', multiplier: 1000 },
  { fromUnit: 'ek', toUnit: 'ml', multiplier: 15 },
  { fromUnit: 'tk', toUnit: 'ml', multiplier: 5 },
  { fromUnit: 'dl', toUnit: 'ml', multiplier: 100 },
  { fromUnit: 'l', toUnit: 'ml', multiplier: 1000 },
  { fromUnit: 'csésze', toUnit: 'ml', multiplier: 250 },
  { fromUnit: 'csipet', toUnit: 'g', multiplier: 0.5 },
];

async function main() {
  console.log('Seeding ingredients...');

  for (const ing of INGREDIENTS) {
    const normalizedName = ing.name.toLowerCase().trim();
    await prisma.ingredient.upsert({
      where: { normalizedName },
      update: { category: ing.category, defaultUnit: ing.defaultUnit, allergens: ing.allergens ?? [] },
      create: {
        name: ing.name,
        normalizedName,
        category: ing.category,
        defaultUnit: ing.defaultUnit,
        allergens: ing.allergens ?? [],
      },
    });
  }

  console.log(`Seeded ${INGREDIENTS.length} ingredients.`);

  console.log('Seeding unit conversions...');

  for (const conv of UNIT_CONVERSIONS) {
    await prisma.unitConversion.upsert({
      where: {
        fromUnit_toUnit: { fromUnit: conv.fromUnit, toUnit: conv.toUnit },
      },
      update: { multiplier: conv.multiplier },
      create: conv,
    });
  }

  console.log(`Seeded ${UNIT_CONVERSIONS.length} unit conversions.`);

  // ============================================
  // DEMO USERS
  // ============================================
  console.log('Seeding demo users...');
  const passwordHash = await bcrypt.hash('jelszo123', 10);

  const users = [
    {
      email: 'anna@demo.hu',
      name: 'Kiss Anna',
      bio: 'Háziasszony, 3 gyerek anyukája. Imádok sütni-főzni!',
      passwordHash,
    },
    {
      email: 'peter@demo.hu',
      name: 'Nagy Péter',
      bio: 'Séfként dolgozom egy budapesti étteremben. A magyar konyha a szenvedélyem.',
      passwordHash,
    },
    {
      email: 'eszter@demo.hu',
      name: 'Szabó Eszter',
      bio: 'Fitness rajongó, egészséges recepteket keresek és osztok meg.',
      passwordHash,
    },
    {
      email: 'gabor@demo.hu',
      name: 'Tóth Gábor',
      bio: 'Hétvégi hobbiszakács, grillmester és a jó borok kedvelője.',
      passwordHash,
    },
  ];

  const createdUsers: { id: string; email: string; name: string }[] = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    createdUsers.push(user);
  }
  console.log(`Seeded ${createdUsers.length} demo users.`);

  // ============================================
  // DEMO RECIPES
  // ============================================
  console.log('Seeding demo recipes...');

  const recipes = [
    // --- Kiss Anna receptjei ---
    {
      userIndex: 0,
      title: 'Klasszikus gulyásleves',
      description: 'Az igazi magyar gulyásleves, ahogy a nagyitól tanultam. Sűrű, fűszeres, és csípős a paprikától.',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
      cookingTime: 120,
      servings: 6,
      difficulty: 'MEDIUM' as Difficulty,
      ingredients: [
        { name: 'marha hús', quantity: 500, unit: 'g' },
        { name: 'burgonya', quantity: 400, unit: 'g' },
        { name: 'sárgarépa', quantity: 2, unit: 'db' },
        { name: 'hagyma', quantity: 2, unit: 'db' },
        { name: 'fokhagyma', quantity: 3, unit: 'gerezd' },
        { name: 'paprika', quantity: 2, unit: 'db' },
        { name: 'paradicsom', quantity: 2, unit: 'db' },
        { name: 'pirospaprika', quantity: 2, unit: 'ek' },
        { name: 'köménymag', quantity: 1, unit: 'tk' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'bors', quantity: 1, unit: 'csipet' },
        { name: 'étolaj', quantity: 2, unit: 'ek' },
      ],
      steps: [
        'A hagymát apróra vágjuk és a forró olajban megpároljuk.',
        'Hozzáadjuk a kockára vágott húst és megdinszteljük.',
        'Beleszórjuk a pirospaprikát, köménymagot, és azonnal felöntjük egy kevés vízzel.',
        'Hozzáadjuk a kockára vágott zöldségeket: burgonyát, sárgarépát, paprikát, paradicsomot.',
        'Felöntjük vízzel, sózzuk, borsozzuk, és lassú tűzön főzzük 1.5-2 óráig.',
        'A fokhagymát az utolsó 10 percben adjuk hozzá átnyomva.',
        'Tálalás előtt megkóstoljuk és szükség szerint ízesítjük.',
      ],
    },
    {
      userIndex: 0,
      title: 'Túrós csusza',
      description: 'Egyszerű, gyors és finom hétvégi ebéd. A szalonna az ropogósra sütve teszi tökéletessé.',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
      cookingTime: 30,
      servings: 4,
      difficulty: 'EASY' as Difficulty,
      ingredients: [
        { name: 'tészta', quantity: 500, unit: 'g', notes: 'szélesmetélt' },
        { name: 'túró', quantity: 250, unit: 'g' },
        { name: 'tejföl', quantity: 2, unit: 'dl' },
        { name: 'szalonna', quantity: 200, unit: 'g' },
        { name: 'só', quantity: 1, unit: 'csipet' },
      ],
      steps: [
        'A tésztát lobogó, sós vízben megfőzzük al dente-re.',
        'A szalonnát apró kockákra vágjuk és ropogósra sütjük.',
        'A leszűrt tésztát a túróval és tejföllel összekeverjük.',
        'Tetejére szórjuk a ropogós szalonnát és a kisütött zsírt.',
        'Melegen tálaljuk.',
      ],
    },
    {
      userIndex: 0,
      title: 'Almás pite',
      description: 'Nagymama almás pitéje, omlós tésztával és fahéjas almatöltelékkel. A család kedvence!',
      imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&h=600&fit=crop',
      cookingTime: 75,
      servings: 8,
      difficulty: 'MEDIUM' as Difficulty,
      ingredients: [
        { name: 'liszt', quantity: 400, unit: 'g' },
        { name: 'vaj', quantity: 200, unit: 'g' },
        { name: 'cukor', quantity: 150, unit: 'g' },
        { name: 'tojás', quantity: 2, unit: 'db' },
        { name: 'alma', quantity: 6, unit: 'db', notes: 'savanyú fajta' },
        { name: 'fahéj', quantity: 2, unit: 'tk' },
        { name: 'vaníliás cukor', quantity: 1, unit: 'csomag' },
        { name: 'sütőpor', quantity: 1, unit: 'tk' },
        { name: 'citrom', quantity: 1, unit: 'db', notes: 'a leve' },
        { name: 'porcukor', quantity: 2, unit: 'ek', notes: 'a tetejére' },
      ],
      steps: [
        'A lisztet a sütőporral összeszitáljuk, hozzáadjuk a cukrot és a vaníliás cukrot.',
        'A hideg vajat belekockázzuk és morzsás tésztát gyúrunk belőle a tojásokkal.',
        'A tészta 2/3-át egy kibélelt tepsibe nyomkodjuk.',
        'Az almákat meghámozzuk, kimagozzuk és lereszelj. Fahéjjal és citromlével ízesítjük.',
        'Az almatölteléket a tésztára kenjük.',
        'A maradék tésztát ráreszeljük a tetejére.',
        '180°C-ra előmelegített sütőben 40-45 percig sütjük.',
        'Kihűlés után porcukorral megszórjuk.',
      ],
    },

    // --- Nagy Péter receptjei ---
    {
      userIndex: 1,
      title: 'Marhapörkölt nokedlivel',
      description: 'Éttermi minőségű pörkölt házilag. A titok: lassú főzés és rengeteg hagyma.',
      imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=600&fit=crop',
      cookingTime: 150,
      servings: 4,
      difficulty: 'MEDIUM' as Difficulty,
      ingredients: [
        { name: 'marha hús', quantity: 800, unit: 'g', notes: 'lapocka' },
        { name: 'hagyma', quantity: 4, unit: 'db', notes: 'nagy' },
        { name: 'pirospaprika', quantity: 2, unit: 'ek' },
        { name: 'fokhagyma', quantity: 4, unit: 'gerezd' },
        { name: 'paradicsom', quantity: 2, unit: 'db' },
        { name: 'paprika', quantity: 2, unit: 'db', notes: 'zöld' },
        { name: 'étolaj', quantity: 3, unit: 'ek' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'bors', quantity: 1, unit: 'csipet' },
        { name: 'liszt', quantity: 300, unit: 'g', notes: 'a nokedlihez' },
        { name: 'tojás', quantity: 2, unit: 'db', notes: 'a nokedlihez' },
        { name: 'víz', quantity: 1, unit: 'dl', notes: 'a nokedlihez' },
      ],
      steps: [
        'A hagymát apró kockákra vágjuk és olajon üvegesre pároljuk.',
        'Levesszük a tűzről, beleszórjuk a pirospaprikát és gyorsan megkeverjük.',
        'A kockára vágott húst hozzáadjuk és visszateszük a tűzre.',
        'Fedő alatt, saját levében pároljuk 30 percig, nem öntünk hozzá vizet!',
        'Hozzáadjuk a kockázott paradicsomot és paprikát, sózzuk, borsozzuk.',
        'Lassú tűzön főzzük fedő alatt 1.5-2 óráig, amíg a hús puha lesz.',
        'A nokedlihez a lisztet, tojásokat és vizet sima tésztává keverjük.',
        'Forrásban lévő sós vízbe szaggatjuk a nokedlit, amíg feljön a felszínre.',
        'A pörköltet nokedlivel tálaljuk.',
      ],
    },
    {
      userIndex: 1,
      title: 'Rántott csirkemell',
      description: 'Ropogós, aranybarna bundában sült csirkemell. A magyar vasárnapi ebéd klasszikusa.',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop',
      cookingTime: 30,
      servings: 4,
      difficulty: 'EASY' as Difficulty,
      ingredients: [
        { name: 'csirkemell', quantity: 600, unit: 'g' },
        { name: 'tojás', quantity: 3, unit: 'db' },
        { name: 'liszt', quantity: 100, unit: 'g' },
        { name: 'zsemlemorzsa', quantity: 150, unit: 'g' },
        { name: 'étolaj', quantity: 3, unit: 'dl', notes: 'bő olaj a sütéshez' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'bors', quantity: 1, unit: 'csipet' },
        { name: 'citrom', quantity: 1, unit: 'db', notes: 'tálaláshoz' },
      ],
      steps: [
        'A csirkemellet félbevágjuk és húsklopfolóval egyenletes vastagságúra verjük.',
        'Sózzuk, borsozzuk mindkét oldalát.',
        'Három tányérra kirakjuk a lisztet, a felvert tojást és a zsemlemorzsát.',
        'A húst először lisztbe, majd tojásba, végül zsemlemorzsába forgatjuk.',
        'Bő, forró olajban mindkét oldalát aranybarnára sütjük.',
        'Papírtörlőn lecsöpögtetjük és citromszelettel tálaljuk.',
      ],
    },
    {
      userIndex: 1,
      title: 'Halászlé',
      description: 'Bajai halászlé, ahogy a Duna-parton készítik. Tüzes, pirospaprikás, igazi hungarikum.',
      imageUrl: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&h=600&fit=crop',
      cookingTime: 90,
      servings: 6,
      difficulty: 'HARD' as Difficulty,
      ingredients: [
        { name: 'ponty', quantity: 1500, unit: 'g', notes: 'szeletelve' },
        { name: 'hagyma', quantity: 3, unit: 'db', notes: 'nagy' },
        { name: 'pirospaprika', quantity: 3, unit: 'ek' },
        { name: 'paradicsom', quantity: 2, unit: 'db' },
        { name: 'paprika', quantity: 2, unit: 'db', notes: 'zöld, erős' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'víz', quantity: 2, unit: 'l' },
      ],
      steps: [
        'A hal fejéből, farkából és csontos részeiből alaplévet főzünk 30 percig a karikázott hagymával.',
        'Az alaplevet leszűrjük és visszaöntjük a fazékba.',
        'Beleszórjuk a pirospaprikát és 10 percig főzzük.',
        'Hozzáadjuk a szeletelt paradicsomot és paprikát.',
        'A halszeleteket óvatosan belehelyezzük a lébe.',
        'Lassú tűzön, fedő nélkül főzzük 20-25 percig. Nem kavarjuk, csak rázzuk a fazekat!',
        'Sóval ízesítjük és forróan, friss kenyérrel tálaljuk.',
      ],
    },

    // --- Szabó Eszter receptjei ---
    {
      userIndex: 2,
      title: 'Csirkés Caesar saláta',
      description: 'Könnyű, fehérjedús ebéd friss zöldségekkel és házi öntettel.',
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
      cookingTime: 25,
      servings: 2,
      difficulty: 'EASY' as Difficulty,
      ingredients: [
        { name: 'csirkemell', quantity: 300, unit: 'g' },
        { name: 'saláta', quantity: 1, unit: 'db', notes: 'római saláta' },
        { name: 'parmezán', quantity: 50, unit: 'g' },
        { name: 'kenyér', quantity: 2, unit: 'szelet', notes: 'krutonnak' },
        { name: 'olívaolaj', quantity: 3, unit: 'ek' },
        { name: 'citrom', quantity: 1, unit: 'db', notes: 'a leve' },
        { name: 'fokhagyma', quantity: 1, unit: 'gerezd' },
        { name: 'joghurt', quantity: 3, unit: 'ek', notes: 'natúr' },
        { name: 'mustár', quantity: 1, unit: 'tk' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'bors', quantity: 1, unit: 'csipet' },
      ],
      steps: [
        'A csirkemellet sózzuk, borsozzuk és serpenyőben kisütjük. Szeleteljük.',
        'A kenyeret kockázzuk és olívaolajjal krutonná pirítjuk.',
        'Az öntethez összekeverjük a joghurtot, citromlevet, reszelt fokhagymát, mustárt és 1 ek olívaolajat.',
        'A salátát feltépkedjük, rátesszük a csirkét és krutont.',
        'Meglocsoljuk az öntettel és reszelt parmezánnal szórjuk meg.',
      ],
    },
    {
      userIndex: 2,
      title: 'Zabpelyhes banános pancake',
      description: 'Egészséges reggeli cukor nélkül. Tökéletes edzés utáni feltöltődéshez!',
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      cookingTime: 15,
      servings: 2,
      difficulty: 'EASY' as Difficulty,
      ingredients: [
        { name: 'zabpehely', quantity: 100, unit: 'g' },
        { name: 'banán', quantity: 2, unit: 'db', notes: 'érett' },
        { name: 'tojás', quantity: 2, unit: 'db' },
        { name: 'tej', quantity: 1, unit: 'dl' },
        { name: 'fahéj', quantity: 1, unit: 'tk' },
        { name: 'méz', quantity: 1, unit: 'ek', notes: 'tálaláshoz' },
        { name: 'eper', quantity: 100, unit: 'g', notes: 'tálaláshoz' },
      ],
      steps: [
        'A zabpelyhet botmixerrel lisztté őröljük.',
        'A banánt villával összetörjük és a tojásokkal, tejjel, fahéjjal simára keverjük.',
        'Hozzáadjuk a darált zabpelyhet és hagyjuk 5 percig állni.',
        'Serpenyőben kevés olajon kis adag pancake-eket sütünk mindkét oldalán.',
        'Friss eperrel és mézzel tálaljuk.',
      ],
    },

    // --- Tóth Gábor receptjei ---
    {
      userIndex: 3,
      title: 'BBQ oldalas',
      description: 'Lassú tűzön sült, ragacsos, füstös ízű oldalas. A grillezés királya!',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      cookingTime: 180,
      servings: 4,
      difficulty: 'HARD' as Difficulty,
      ingredients: [
        { name: 'sertés oldalas', quantity: 1500, unit: 'g' },
        { name: 'méz', quantity: 3, unit: 'ek' },
        { name: 'szójaszósz', quantity: 3, unit: 'ek' },
        { name: 'ketchup', quantity: 4, unit: 'ek' },
        { name: 'fokhagyma', quantity: 4, unit: 'gerezd' },
        { name: 'gyömbér', quantity: 1, unit: 'tk' },
        { name: 'pirospaprika', quantity: 1, unit: 'ek', notes: 'füstölt' },
        { name: 'bors', quantity: 1, unit: 'tk' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'étolaj', quantity: 2, unit: 'ek' },
      ],
      steps: [
        'A szósz hozzávalóit (méz, szójaszósz, ketchup, préselt fokhagyma, gyömbér, paprika) összekeverjük.',
        'Az oldalasat sózzuk, borsozzuk és a szósz felével beborítjuk.',
        'Legalább 2 órát, de lehetőleg egy éjszakát pihentetjük hűtőben.',
        'Alufóliával letakarva 150°C-on sütjük 2.5 óráig.',
        'Levesszük a fóliát, megkenjük a maradék szósszal.',
        'Fólia nélkül még 30 percig sütjük, amíg ragacsos lesz a felszíne.',
        'Felszeletelés előtt 10 percig pihentetjük.',
      ],
    },
    {
      userIndex: 3,
      title: 'Házi hamburger',
      description: 'Szaftos házi burger friss zsemlével, karamellizált hagymával és cheddar sajttal.',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      cookingTime: 40,
      servings: 4,
      difficulty: 'MEDIUM' as Difficulty,
      ingredients: [
        { name: 'darált hús', quantity: 600, unit: 'g', notes: 'marha' },
        { name: 'hagyma', quantity: 2, unit: 'db' },
        { name: 'sajt', quantity: 4, unit: 'szelet', notes: 'cheddar' },
        { name: 'saláta', quantity: 4, unit: 'db', notes: 'levél' },
        { name: 'paradicsom', quantity: 2, unit: 'db' },
        { name: 'kenyér', quantity: 4, unit: 'db', notes: 'hamburger zsemle' },
        { name: 'ketchup', quantity: 2, unit: 'ek' },
        { name: 'mustár', quantity: 1, unit: 'ek' },
        { name: 'só', quantity: 1, unit: 'csipet' },
        { name: 'bors', quantity: 1, unit: 'csipet' },
        { name: 'vaj', quantity: 30, unit: 'g' },
      ],
      steps: [
        'A darált húst sóval és borssal ízesítjük, 4 pogácsát formázunk belőle.',
        'Az egyik hagymát karikákra vágjuk és vajon lassú tűzön karamellizáljuk 15 percig.',
        'A húspogácsákat forró serpenyőben vagy grillen mindkét oldalán 3-4 percig sütjük.',
        'Az utolsó percben rátesszük a sajtszeletet, hogy elolvadjon.',
        'A zsemléket félbevágjuk és enyhén megpirítjuk.',
        'Összeállítjuk: zsemle alja, ketchup, saláta, paradicsom, hús sajttal, karamellizált hagyma, mustár, zsemle teteje.',
      ],
    },
  ];

  for (const r of recipes) {
    const user = createdUsers[r.userIndex];

    // Check if recipe already exists for this user with this title
    const existing = await prisma.recipe.findFirst({
      where: { userId: user.id, title: r.title },
    });
    if (existing) continue;

    await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          userId: user.id,
          title: r.title,
          description: r.description,
          imageUrl: r.imageUrl,
          cookingTime: r.cookingTime,
          servings: r.servings,
          difficulty: r.difficulty,
        },
      });

      // Create steps
      await tx.recipeStep.createMany({
        data: r.steps.map((instruction, i) => ({
          recipeId: recipe.id,
          stepNumber: i + 1,
          instruction,
        })),
      });

      // Create ingredients
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
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
          },
        });
      }
    });
  }

  console.log(`Seeded ${recipes.length} demo recipes.`);

  // ============================================
  // DEMO LIKES & COMMENTS
  // ============================================
  console.log('Seeding demo interactions...');

  const allRecipes = await prisma.recipe.findMany({ select: { id: true, userId: true } });

  // Each user likes random recipes (not their own)
  let likeCount = 0;
  for (const user of createdUsers) {
    const othersRecipes = allRecipes.filter((r) => r.userId !== user.id);
    for (const recipe of othersRecipes) {
      // ~70% chance of liking
      if (Math.random() < 0.7) {
        await prisma.like.upsert({
          where: { userId_recipeId: { userId: user.id, recipeId: recipe.id } },
          update: {},
          create: { userId: user.id, recipeId: recipe.id },
        });
        likeCount++;
      }
    }
  }
  console.log(`Seeded ${likeCount} demo likes.`);

  const demoComments = [
    'Nagyon finom lett, köszönöm a receptet!',
    'Kipróbáltam, a család imádta!',
    'Ez az egyik kedvencem, rendszeresen elkészítem.',
    'Szuper recept! Én egy kis tejföllel is kiegészítettem.',
    'Gyerekek is szerették, ez ritkaság!',
    'Tökéletes vasárnapi ebéd volt belőle.',
    'Kicsit több fűszert tettem bele, úgy még jobb!',
    'Első próbálkozásra sikerült, nagyon egyszerű!',
    'A párom is elkérte a receptet, annyira ízlett neki.',
    'Vendégeknek is be merem vállalni, mindig bejön!',
  ];

  let commentCount = 0;
  for (const recipe of allRecipes) {
    const otherUsers = createdUsers.filter((u) => u.id !== recipe.userId);
    // 1-3 comments per recipe
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments && i < otherUsers.length; i++) {
      const commentText = demoComments[Math.floor(Math.random() * demoComments.length)];
      const existing = await prisma.comment.findFirst({
        where: { userId: otherUsers[i].id, recipeId: recipe.id },
      });
      if (!existing) {
        await prisma.comment.create({
          data: {
            userId: otherUsers[i].id,
            recipeId: recipe.id,
            content: commentText,
          },
        });
        commentCount++;
      }
    }
  }
  console.log(`Seeded ${commentCount} demo comments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
