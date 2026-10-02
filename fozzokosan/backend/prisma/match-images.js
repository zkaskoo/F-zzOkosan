/**
 * Receptenként a KONKRÉT fogáshoz keres képet a TheMealDB / TheCocktailDB-ből
 * (a cím kulcsszavai alapján), letölti a backend/uploads mappába, és az
 * image_url-t /uploads/recipe-<id>.jpg?v=3-ra állítja (cache-törés).
 *
 * Sorrend: konkrét név-keresés -> fő hozzávaló szerinti szűrés -> kategória-pool.
 * Csak a bulk recepteket érinti (image_url LIKE '/uploads/recipe-%').
 *
 * Futtatás:
 *   DATABASE_URL="postgresql://.../fozzokosan?schema=public" node prisma/match-images.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UPLOADS = path.join(__dirname, '..', 'uploads');
const VERSION = 'v3';

async function fetchJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
  return r.json();
}
const mealSearch = (s) =>
  fetchJson(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(s)}`).then(
    (d) => (d.meals || []).map((m) => m.strMealThumb),
  );
const mealByIng = (i) =>
  fetchJson(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(i)}`).then(
    (d) => (d.meals || []).map((m) => m.strMealThumb),
  );
const mealByCat = (c) =>
  fetchJson(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(c)}`).then(
    (d) => (d.meals || []).map((m) => m.strMealThumb),
  );
const drinkSearch = (s) =>
  fetchJson(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(s)}`).then(
    (d) => (d.drinks || []).map((m) => m.strDrinkThumb),
  );

// cache
const cache = new Map();
async function cached(key, fn) {
  if (cache.has(key)) return cache.get(key);
  let v = [];
  try { v = await fn(); } catch { v = []; }
  cache.set(key, v);
  return v;
}

// Kulcsszó-szabályok: SORREND SZÁMÍT (specifikus előbb).
// q: név-keresési kifejezések, ing: fő hozzávaló (szűréshez).
const RULES = [
  // rántott / sült panírozott
  { m: 'rántott', q: ['schnitzel', 'fried chicken'], ing: [] },
  // rakott
  { m: 'rakott', q: ['casserole', 'gratin'], ing: [] },
  // tészták
  { m: 'bolognai', q: ['spaghetti bolognese', 'spaghetti'], ing: ['beef'] },
  { m: 'carbonara', q: ['carbonara'], ing: ['bacon'] },
  { m: 'sajtos tészta', q: ['macaroni cheese', 'cheese pasta'], ing: ['pasta'] },
  { m: 'spenótos tészta', q: ['spinach pasta', 'spaghetti'], ing: ['spinach'] },
  { m: 'gombás tészta', q: ['mushroom pasta', 'pasta'], ing: ['mushrooms'] },
  { m: 'paradicsomos tészta', q: ['tomato pasta', 'pasta'], ing: ['pasta'] },
  { m: 'tészta', q: ['pasta', 'spaghetti'], ing: ['pasta'] },
  { m: 'spagetti', q: ['spaghetti', 'spaghetti bolognese'], ing: ['pasta'] },
  // pörköltek / ragu
  { m: 'pörkölt', q: ['goulash', 'stew'], ing: ['beef'] },
  // krémlevesek és levesek (zöldség szerint)
  { m: 'brokkoli', q: ['broccoli soup'], ing: ['broccoli'] },
  { m: 'karfiol', q: ['cauliflower soup', 'cauliflower'], ing: [] },
  { m: 'sárgarépa', q: ['carrot soup'], ing: ['carrots'] },
  { m: 'sütőtök', q: ['pumpkin soup', 'squash soup'], ing: [] },
  { m: 'cukkini', q: ['zucchini soup', 'courgette'], ing: [] },
  { m: 'zöldborsó', q: ['pea soup'], ing: ['peas'] },
  { m: 'csicseriborsó', q: ['chickpea soup', 'chickpea'], ing: ['chickpeas'] },
  { m: 'zeller', q: ['celery soup', 'celeriac soup'], ing: [] },
  { m: 'padlizsán', q: ['aubergine', 'eggplant'], ing: [] },
  { m: 'gombaleves', q: ['mushroom soup'], ing: ['mushrooms'] },
  { m: 'gombakrémleves', q: ['mushroom soup'], ing: ['mushrooms'] },
  { m: 'paradicsomkrémleves', q: ['tomato soup'], ing: [] },
  { m: 'spenótkrémleves', q: ['spinach soup'], ing: ['spinach'] },
  { m: 'bableves', q: ['bean soup'], ing: [] },
  { m: 'húsleves', q: ['chicken soup', 'broth'], ing: [] },
  { m: 'tojásleves', q: ['egg soup', 'soup'], ing: [] },
  { m: 'zöldségleves', q: ['vegetable soup'], ing: [] },
  { m: 'krémleves', q: ['soup'], ing: [] },
  { m: 'leves', q: ['soup'], ing: [] },
  // saláták
  { m: 'görög', q: ['greek salad'], ing: [] },
  { m: 'cézár', q: ['caesar salad'], ing: [] },
  { m: 'tonhal', q: ['tuna salad', 'tuna'], ing: ['tuna'] },
  { m: 'cékla', q: ['beetroot salad', 'beetroot'], ing: [] },
  { m: 'quinoa', q: ['quinoa salad', 'quinoa'], ing: [] },
  { m: 'kukoricás csirke', q: ['chicken salad'], ing: ['chicken'] },
  { m: 'mozzarella', q: ['caprese salad', 'salad'], ing: [] },
  { m: 'burgonyasaláta', q: ['potato salad'], ing: [] },
  { m: 'saláta', q: ['salad'], ing: [] },
  // reggelik
  { m: 'zabkása', q: ['porridge', 'oatmeal'], ing: ['oats'] },
  { m: 'overnight oats', q: ['overnight oats', 'porridge'], ing: ['oats'] },
  { m: 'rántotta', q: ['omelette', 'scrambled eggs'], ing: ['eggs'] },
  { m: 'bundáskenyér', q: ['french toast', 'toast'], ing: [] },
  { m: 'avokádós pirítós', q: ['avocado toast', 'avocado'], ing: [] },
  // desszertek
  { m: 'palacsinta', q: ['pancakes', 'crepes'], ing: [] },
  { m: 'almás pite', q: ['apple pie', 'apple'], ing: [] },
  { m: 'sajttorta', q: ['cheesecake'], ing: [] },
  { m: 'muffin', q: ['muffin', 'cupcake'], ing: [] },
  { m: 'piskóta', q: ['sponge cake', 'cake'], ing: [] },
  { m: 'csiga', q: ['cinnamon roll', 'cake'], ing: [] },
  { m: 'guba', q: ['bread pudding', 'dessert'], ing: [] },
  { m: 'gesztenye', q: ['chestnut', 'dessert'], ing: [] },
  // köretek
  { m: 'burgonyapüré', q: ['mashed potato'], ing: [] },
  { m: 'hasábburgonya', q: ['fries', 'chips'], ing: [] },
  { m: 'petrezselymes burgonya', q: ['potatoes', 'potato'], ing: ['potatoes'] },
  { m: 'párolt rizs', q: ['rice', 'steamed rice'], ing: ['rice'] },
  { m: 'zöldbab', q: ['green beans'], ing: [] },
  { m: 'grillezett zöldség', q: ['grilled vegetables', 'vegetables'], ing: [] },
];

// kategória-pool fallback
let POOLS = {};
async function buildPools() {
  const [beef, chicken, soups, dessert, breakfast, salad, side, pasta, sm, ms, juice] =
    await Promise.all([
      mealByCat('Beef'), mealByCat('Chicken'), mealSearch('soup'), mealByCat('Dessert'),
      mealByCat('Breakfast'), mealSearch('salad'), mealByCat('Side'), mealByCat('Pasta'),
      drinkSearch('smoothie'), drinkSearch('milkshake'), drinkSearch('juice'),
    ]);
  POOLS = {
    leves: soups, foetel: [...beef, ...chicken], desszert: dessert, ital: [...sm, ...ms, ...juice],
    reggeli: breakfast, salata: salad, koret: side, teszta: pasta,
  };
}

const counters = {};
function pick(arr, key) {
  counters[key] = (counters[key] || 0);
  const v = arr[counters[key] % arr.length];
  counters[key]++;
  return v;
}

async function resolveThumb(title, slug) {
  const t = title.toLowerCase();

  // italok: TheCocktailDB pool
  if (slug === 'ital' || t.includes('turmix')) {
    const pool = POOLS.ital && POOLS.ital.length ? POOLS.ital : POOLS.desszert;
    return pick(pool, 'ital');
  }

  const rule = RULES.find((r) => t.includes(r.m));
  if (rule) {
    for (const q of rule.q) {
      const thumbs = await cached('s:' + q, () => mealSearch(q));
      if (thumbs.length) return pick(thumbs, 's:' + q);
    }
    for (const ing of rule.ing) {
      const thumbs = await cached('i:' + ing, () => mealByIng(ing));
      if (thumbs.length) return pick(thumbs, 'i:' + ing);
    }
  }

  // kategória fallback
  const pool = (POOLS[slug] && POOLS[slug].length) ? POOLS[slug] : POOLS.foetel;
  return pick(pool, 'cat:' + slug);
}

async function main() {
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
  await buildPools();

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: '' },
        { imageUrl: { startsWith: '/uploads/' } },
        { imageUrl: { contains: 'pollinations' } },
      ],
    },
    select: { id: true, title: true, categories: { include: { category: true } } },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`Feldolgozandó receptek: ${recipes.length}`);

  let ok = 0, failed = 0;
  for (const r of recipes) {
    const slug = r.categories[0]?.category.slug || 'foetel';
    try {
      const thumb = await resolveThumb(r.title, slug);
      if (!thumb) throw new Error('nincs kép');
      const res = await fetch(thumb, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const filename = `recipe-${r.id}.jpg`;
      fs.writeFileSync(path.join(UPLOADS, filename), buf);
      await prisma.recipe.update({ where: { id: r.id }, data: { imageUrl: `/uploads/${filename}?${VERSION}` } });
      ok++;
      console.log(`  ✓ ${r.title}`);
    } catch (e) {
      failed++;
      console.log(`  ✗ ${r.title} -> ${e}`);
    }
  }
  console.log(`Kész. OK: ${ok}, hiba: ${failed}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
