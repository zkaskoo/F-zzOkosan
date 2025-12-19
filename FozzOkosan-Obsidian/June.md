# June

#timeline #june

---

## Focus: NLP Implementation & Documentation

---

## Tasks

### NLP Implementation
- [ ] Set up Google Gemini API
- [ ] Create NLP service in [[Backend]]
- [ ] Design prompt for ingredient parsing
- [ ] Handle edge cases (fractions, "ízlés szerint")
- [ ] Integrate with recipe creation flow
- [ ] Add fallback for parsing errors

### NLP Testing
- [ ] Create test cases for common inputs
- [ ] Test Hungarian-specific patterns
- [ ] Measure accuracy
- [ ] Document failure cases

### Documentation - Thesis Chapters
- [ ] Chapter 1: Introduction
  - [ ] Problem statement
  - [ ] Goals and objectives
  - [ ] Thesis structure overview
- [ ] Chapter 2: Literature Review
  - [ ] Similar systems analysis
  - [ ] NLP technologies overview
  - [ ] Web development frameworks

---

## NLP Service Implementation

See [[NLP & AI]] for full implementation details.

### Key Files

```
backend/src/modules/nlp/
├── nlp.module.ts
├── nlp.service.ts          # Gemini API calls
├── nlp.controller.ts       # POST /nlp/parse
├── unit-converter.service.ts
└── dto/
    └── parse-ingredients.dto.ts
```

### Prompt Design

```
Parse these Hungarian recipe ingredients into JSON.

Input: "{user_input}"

For each ingredient extract:
- name: ingredient name in Hungarian
- originalText: original text
- quantity: numeric value (0.5 for "fél")
- unit: unit (ek, tk, dkg, kg, g, ml, l, db, etc.)

Handle:
- "fél" = 0.5
- "ízlés szerint" = quantity: null

Return ONLY valid JSON array.
```

---

## Test Cases

| Input | Expected Output | Status |
|-------|-----------------|--------|
| "2 ek olaj" | qty: 2, unit: ek | 🔲 |
| "fél kg liszt" | qty: 0.5, unit: kg | 🔲 |
| "3 tojás" | qty: 3, unit: db | 🔲 |
| "só ízlés szerint" | qty: null | 🔲 |
| "1-2 gerezd fokhagyma" | qty: 1.5 | 🔲 |

---

## Thesis Structure

```
1. Bevezetés (Introduction)
   1.1 Problémafelvetés
   1.2 Célkitűzések
   1.3 Dolgozat felépítése

2. Irodalmi áttekintés (Literature Review)
   2.1 Hasonló rendszerek elemzése
       - Cookpad
       - Mealime
       - Tasty
   2.2 Webes technológiák
       - React
       - NestJS
       - PostgreSQL
   2.3 Természetes nyelvfeldolgozás
       - NLP alapok
       - LLM-ek (GPT, Gemini)
       - Magyar nyelv kihívásai
```

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Gemini API integration | 🔲 |
| NLP service complete | 🔲 |
| Unit tests for NLP | 🔲 |
| Chapter 1 draft | 🔲 |
| Chapter 2 draft | 🔲 |

---

## Dependencies

- [[May]] must be complete (shopping list)

---

## Related

- [[Timeline]]
- [[May]] - Previous month
- [[September]] - Next month
- [[NLP & AI]]
- [[00 - Index]]
