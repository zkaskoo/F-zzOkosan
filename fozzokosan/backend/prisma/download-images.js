/**
 * Letölti a recepteknél tárolt (Pollinations) képeket a backend/uploads mappába,
 * és a recept image_url mezőjét a helyi, relatív /uploads/... útvonalra állítja.
 * Így a képek a saját szerverről töltődnek (nem külső szolgáltatásról), megbízhatóan.
 *
 * Futtatás:
 *   DATABASE_URL="postgresql://fozzokosan:fozzokosan123@localhost:5433/fozzokosan?schema=public" node prisma/download-images.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UPLOADS = path.join(__dirname, '..', 'uploads');
const CONCURRENCY = 6;

async function downloadOne(recipe) {
  const res = await fetch(recipe.imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const filename = `recipe-${recipe.id}.jpg`;
  fs.writeFileSync(path.join(UPLOADS, filename), buf);
  await prisma.recipe.update({
    where: { id: recipe.id },
    data: { imageUrl: `/uploads/${filename}` },
  });
  return buf.length;
}

async function main() {
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

  const recipes = await prisma.recipe.findMany({
    where: { imageUrl: { contains: 'pollinations' } },
    select: { id: true, title: true, imageUrl: true },
  });
  console.log(`Letöltendő képek: ${recipes.length}`);

  let ok = 0;
  let failed = 0;
  for (let i = 0; i < recipes.length; i += CONCURRENCY) {
    const batch = recipes.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(downloadOne));
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === 'fulfilled') {
        ok++;
      } else {
        failed++;
        console.log(`  HIBA: ${batch[j].title} -> ${results[j].reason}`);
      }
    }
    console.log(`  ${Math.min(i + CONCURRENCY, recipes.length)}/${recipes.length} kész`);
  }
  console.log(`Letöltve: ${ok}, hiba: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
