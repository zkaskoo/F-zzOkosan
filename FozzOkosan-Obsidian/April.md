# April

> Tags: `timeline #april

---

## Focus: Data Normalization & Unit Conversion

---

## Tasks

### Unit Conversion System
- [ ] Create unit conversion service
- [ ] Handle Hungarian units (ek, tk, dkg, csésze, etc.)
- [ ] Convert to base units (g, ml, db)
- [ ] Handle fractions ("fél", "negyed")

### Ingredient Database
- [ ] Create standardized ingredient list
- [ ] Add ingredient categories
- [ ] Map common variations (paradicsom → paradicsom)

### Structured Storage
- [ ] Update recipe model for parsed ingredients
- [ ] Store both raw and parsed ingredients
- [ ] Create JSON structure for ingredients

---

## Unit Conversion Table

| Hungarian | English | Base Unit | Multiplier |
|-----------|---------|-----------|------------|
| dkg | decagram | g | ×10 |
| kg | kilogram | g | ×1000 |
| ek | tablespoon | ml | ×15 |
| tk | teaspoon | ml | ×5 |
| dl | deciliter | ml | ×100 |
| l | liter | ml | ×1000 |
| csésze | cup | ml | ×250 |
| csipet | pinch | g | ×0.5 |

---

## Fraction Handling

| Hungarian | Value |
|-----------|-------|
| fél | 0.5 |
| negyed | 0.25 |
| háromnegyed | 0.75 |
| harmad | 0.33 |
| másfél | 1.5 |

---

## Implementation

```typescript
// unit-converter.service.ts

const CONVERSIONS = {
  // Weight → grams
  'dkg': { to: 'g', multiply: 10 },
  'kg': { to: 'g', multiply: 1000 },

  // Volume → milliliters
  'ek': { to: 'ml', multiply: 15 },
  'tk': { to: 'ml', multiply: 5 },
  'dl': { to: 'ml', multiply: 100 },
  'l': { to: 'ml', multiply: 1000 },
  'csésze': { to: 'ml', multiply: 250 },

  // Small
  'csipet': { to: 'g', multiply: 0.5 },
};

const FRACTIONS = {
  'fél': 0.5,
  'negyed': 0.25,
  'háromnegyed': 0.75,
  'harmad': 0.33,
  'másfél': 1.5,
};
```

---

## Parsed Ingredient Structure

```json
{
  "name": "liszt",
  "originalText": "50 dkg liszt",
  "quantity": 500,
  "unit": "g",
  "originalUnit": "dkg",
  "category": "dry-goods"
}
```

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Unit conversion service | ⬜ |
| Fraction parsing | ⬜ |
| Structured ingredient storage | ⬜ |
| Ingredient categories | ⬜ |

---

## Dependencies

- [March](March.md) must be complete (recipes working)

---

## Related

- [Timeline](Timeline.md)
- [March](March.md) - Previous month
- [May](May.md) - Next month
- [NLP & AI](NLP%20%26%20AI.md)
- [Database](Database.md)
- [Index](00%20-%20Index.md)
