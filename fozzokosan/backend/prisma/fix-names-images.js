/**
 * Egyszeri javító script:
 *  1) a teszt-felhasználóknak valós magyar nevet ad (email alapján),
 *  2) minden kép nélküli recepthez a címéből generált képet állít be (Pollinations).
 *
 * Futtatás:
 *   DATABASE_URL="postgresql://fozzokosan:fozzokosan123@localhost:5433/fozzokosan?schema=public" node prisma/fix-names-images.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// email -> valós név (csak a teszt-fiókokat írjuk át; a demo-userek maradnak)
const NAME_BY_EMAIL = {
  'test@example.com': 'Horváth Katalin',
  'test2@gmail.com': 'Varga Dániel',
  'tothzoltan1998@gmail.com': 'Tóth Zoltán',
  'nlptest@test.hu': 'Kovács Júlia',
  'teszt1789548444@example.com': 'Molnár Bence',
  'imp1789553713@example.com': 'Németh Réka',
};

function imageUrlFor(title, seed) {
  const prompt = `${title}, hungarian cuisine, professional food photography, appetizing, on a plate, natural light`;
  return (
    'https://image.pollinations.ai/prompt/' +
    encodeURIComponent(prompt) +
    `?width=800&height=600&nologo=true&seed=${seed}`
  );
}

async function main() {
  // 1) Nevek
  let renamed = 0;
  for (const [email, name] of Object.entries(NAME_BY_EMAIL)) {
    const res = await prisma.user.updateMany({ where: { email }, data: { name } });
    if (res.count > 0) {
      renamed += res.count;
      console.log(`  név: ${email} -> ${name}`);
    }
  }
  console.log(`Átnevezett felhasználók: ${renamed}`);

  // 2) Kép nélküli receptek
  const recipes = await prisma.recipe.findMany({
    where: { OR: [{ imageUrl: null }, { imageUrl: '' }] },
    select: { id: true, title: true },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`Kép nélküli receptek: ${recipes.length}`);

  let i = 0;
  for (const r of recipes) {
    i++;
    const url = imageUrlFor(r.title, i);
    await prisma.recipe.update({ where: { id: r.id }, data: { imageUrl: url } });
  }
  console.log(`Beállított képek: ${i}`);

  const remaining = await prisma.recipe.count({
    where: { OR: [{ imageUrl: null }, { imageUrl: '' }] },
  });
  console.log(`Kép nélkül maradt: ${remaining}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
