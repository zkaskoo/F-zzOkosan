/**
 * Valódi ételfotókat tölt le a TheMealDB / TheCocktailDB ingyenes API-kból,
 * kategória szerint hozzárendelve a receptekhez, a backend/uploads mappába,
 * és a recept image_url mezőjét a helyi /uploads/... útvonalra állítja.
 *
 * Csak a korábban generált (pollinations) / letöltött bulk recepteket érinti;
 * az eredeti, Unsplash-képes recepteket békén hagyja.
 *
 * Futtatás:
 *   DATABASE_URL="postgresql://.../fozzokosan?schema=public" node prisma/images-from-mealdb.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UPLOADS = path.join(__dirname, '..', 'uploads');

async function fetchJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
  return r.json();
}
const meal = (q) =>
  fetchJson(`https://www.themealdb.com/api/json/v1/1/${q}`).then((d) =>
    (d.meals || []).map((m) => m.strMealThumb),
  );
const drink = (q) =>
  fetchJson(`https://www.thecocktaildb.com/api/json/v1/1/${q}`).then((d) =>
    (d.drinks || []).map((m) => m.strDrinkThumb),
  );

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function buildPools() {
  const [beef, chicken, pork, soups, desserts, breakfast, saladS, veg, sides, pasta, sm, ms, juice] =
    await Promise.all([
      meal('filter.php?c=Beef'),
      meal('filter.php?c=Chicken'),
      meal('filter.php?c=Pork'),
      meal('search.php?s=soup'),
      meal('filter.php?c=Dessert'),
      meal('filter.php?c=Breakfast'),
      meal('search.php?s=salad'),
      meal('filter.php?c=Vegetarian'),
      meal('filter.php?c=Side'),
      meal('filter.php?c=Pasta'),
      drink('search.php?s=smoothie'),
      drink('search.php?s=milkshake'),
      drink('search.php?s=juice'),
    ]);

  return {
    leves: shuffle(soups),
    foetel: shuffle([...beef, ...chicken, ...pork]),
    desszert: shuffle(desserts),
    ital: shuffle([...sm, ...ms, ...juice]),
    reggeli: shuffle(breakfast),
    salata: shuffle([...saladS, ...veg]),
    koret: shuffle(sides),
    teszta: shuffle(pasta),
  };
}

async function main() {
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

  const pools = await buildPools();
  for (const [k, v] of Object.entries(pools)) {
    console.log(`  pool ${k}: ${v.length} kép`);
  }
  const fallback = pools.foetel;

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        { imageUrl: { contains: 'pollinations' } },
        { imageUrl: { startsWith: '/uploads/recipe-' } },
      ],
    },
    select: { id: true, title: true, categories: { include: { category: true } } },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`Feldolgozandó receptek: ${recipes.length}`);

  const counters = {};
  let ok = 0;
  let failed = 0;

  for (const r of recipes) {
    const slug = r.categories[0]?.category.slug || 'foetel';
    const pool = (pools[slug] && pools[slug].length ? pools[slug] : fallback);
    counters[slug] = (counters[slug] || 0);
    const thumb = pool[counters[slug] % pool.length];
    counters[slug]++;

    try {
      const res = await fetch(thumb, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const filename = `recipe-${r.id}.jpg`;
      fs.writeFileSync(path.join(UPLOADS, filename), buf);
      await prisma.recipe.update({
        where: { id: r.id },
        data: { imageUrl: `/uploads/${filename}` },
      });
      ok++;
    } catch (e) {
      failed++;
      console.log(`  HIBA: ${r.title} -> ${e}`);
    }
  }

  console.log(`Kész. Letöltve: ${ok}, hiba: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
