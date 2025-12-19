# May

#timeline #may

---

## Focus: Shopping List Generator

---

## Tasks

### Single Recipe Shopping List
- [ ] Create shopping list from one recipe
- [ ] Display ingredients with quantities
- [ ] Allow checking off items

### Multi-Recipe Merge
- [ ] Select multiple recipes
- [ ] Combine same ingredients
- [ ] Sum quantities correctly
- [ ] Handle different units (convert first)

### Filtering
- [ ] Filter by allergens (gluten, lactose, nuts, etc.)
- [ ] Filter by diet (vegetarian, vegan, keto)
- [ ] Exclude specific ingredients

---

## Merge Algorithm

```typescript
// shopping.service.ts

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  fromRecipes: string[];
}

function mergeIngredients(recipes: Recipe[]): ShoppingItem[] {
  const merged = new Map<string, ShoppingItem>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.parsedIngredients) {
      const key = `${ingredient.name}-${ingredient.unit}`;

      if (merged.has(key)) {
        const existing = merged.get(key)!;
        existing.quantity += ingredient.quantity;
        existing.fromRecipes.push(recipe.id);
      } else {
        merged.set(key, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          fromRecipes: [recipe.id],
        });
      }
    }
  }

  return Array.from(merged.values());
}
```

---

## Example

### Input: 2 Recipes

**Recipe 1: Palacsinta**
- 30 dkg liszt (300g)
- 2 tojás
- 5 dl tej (500ml)

**Recipe 2: Bundáskenyér**
- 20 dkg liszt (200g)
- 3 tojás
- 2 dl tej (200ml)

### Output: Merged Shopping List

| Ingredient | Quantity | From |
|------------|----------|------|
| liszt | 500g | Both |
| tojás | 5 db | Both |
| tej | 700ml | Both |

---

## Allergen Tags

| Tag | Hungarian | Includes |
|-----|-----------|----------|
| gluten | glutén | wheat, barley, rye |
| lactose | laktóz | milk, cheese, cream |
| nuts | diófélék | peanuts, almonds, etc. |
| eggs | tojás | eggs |
| soy | szója | soy products |

---

## Diet Tags

| Tag | Hungarian | Excludes |
|-----|-----------|----------|
| vegetarian | vegetáriánus | meat, fish |
| vegan | vegán | all animal products |
| keto | keto | high-carb foods |
| lactose-free | laktózmentes | dairy |
| gluten-free | gluténmentes | gluten |

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Shopping list from 1 recipe | 🔲 |
| Multi-recipe merge | 🔲 |
| Allergen filtering | 🔲 |
| Diet filtering | 🔲 |
| Shopping list UI | 🔲 |

---

## UI Mockup

```
┌────────────────────────────────────┐
│  🛒 Shopping List                  │
├────────────────────────────────────┤
│  Selected Recipes: 3               │
│  • Palacsinta                      │
│  • Bundáskenyér                    │
│  • Rántotta                        │
├────────────────────────────────────┤
│  Filters: [Vegetarian ▼]           │
├────────────────────────────────────┤
│  ☐ 500g liszt                      │
│  ☑ 700ml tej                       │
│  ☐ 8 db tojás                      │
│  ☐ 100g vaj                        │
│  ☐ csipet só                       │
├────────────────────────────────────┤
│  [Export] [Share] [Clear Checked]  │
└────────────────────────────────────┘
```

---

## Dependencies

- [[April]] must be complete (unit conversion)

---

## Related

- [[Timeline]]
- [[April]] - Previous month
- [[June]] - Next month
- [[NLP & AI]]
- [[00 - Index]]
