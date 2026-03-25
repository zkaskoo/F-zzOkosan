import { PrismaClient, IngredientCategory } from '@prisma/client';

const prisma = new PrismaClient();

const INGREDIENTS: { name: string; category: IngredientCategory; defaultUnit?: string }[] = [
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
  { name: 'tej', category: 'DAIRY', defaultUnit: 'ml' },
  { name: 'tejföl', category: 'DAIRY', defaultUnit: 'ml' },
  { name: 'vaj', category: 'DAIRY', defaultUnit: 'g' },
  { name: 'sajt', category: 'DAIRY', defaultUnit: 'g' },
  { name: 'tojás', category: 'DAIRY', defaultUnit: 'db' },
  { name: 'túró', category: 'DAIRY', defaultUnit: 'g' },
  { name: 'mascarpone', category: 'DAIRY', defaultUnit: 'g' },
  { name: 'tejszín', category: 'DAIRY', defaultUnit: 'ml' },
  { name: 'joghurt', category: 'DAIRY', defaultUnit: 'ml' },
  { name: 'mozzarella', category: 'DAIRY', defaultUnit: 'g' },
  { name: 'parmezán', category: 'DAIRY', defaultUnit: 'g' },

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
  { name: 'liszt', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'rizs', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'tészta', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'zsemlemorzsa', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'kenyér', category: 'GRAIN', defaultUnit: 'szelet' },
  { name: 'zabpehely', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'spagetti', category: 'GRAIN', defaultUnit: 'g' },
  { name: 'penne', category: 'GRAIN', defaultUnit: 'g' },

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
  { name: 'szójaszósz', category: 'CONDIMENT', defaultUnit: 'ek' },
  { name: 'mustár', category: 'CONDIMENT', defaultUnit: 'tk' },
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
      update: { category: ing.category, defaultUnit: ing.defaultUnit },
      create: {
        name: ing.name,
        normalizedName,
        category: ing.category,
        defaultUnit: ing.defaultUnit,
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
