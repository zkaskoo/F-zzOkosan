# NLP & AI

#nlp #ai #gemini

---

## Overview

The NLP component uses **Google Gemini API** to parse free-text Hungarian recipe ingredients into structured data.

---

## Why Gemini?

| Feature | Gemini | OpenAI | Claude |
|---------|--------|--------|--------|
| Free Tier | **Yes** | No | Limited |
| Hungarian | Good | Good | Excellent |
| Cost | Free / Cheap | $$ | $$ |
| Integration | Easy | Easy | Easy |

---

## Flow Diagram

```
User Input (Free Text)
         │
         │  "2 evőkanál olívaolaj, fél kiló csirkemell,
         │   3 gerezd fokhagyma, só, bors ízlés szerint"
         ▼
┌─────────────────────────────────────┐
│         GEMINI API                   │
│   Prompt: Parse ingredients to JSON  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│       UNIT CONVERTER                 │
│   Normalize: ek → ml, kg → g         │
└─────────────────────────────────────┘
         │
         ▼
Structured JSON Output
[
  { name: "olívaolaj", qty: 30, unit: "ml" },
  { name: "csirkemell", qty: 500, unit: "g" },
  { name: "fokhagyma", qty: 3, unit: "gerezd" },
  { name: "só", qty: null, unit: "ízlés szerint" },
  { name: "bors", qty: null, unit: "ízlés szerint" }
]
```

---

## Implementation

### NLP Service (NestJS)

```typescript
// src/modules/nlp/nlp.service.ts

import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UnitConverterService } from './unit-converter.service';

interface ParsedIngredient {
  name: string;
  originalText: string;
  quantity: number | null;
  unit: string;
  originalUnit?: string;
  category?: string;
}

@Injectable()
export class NlpService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private unitConverter: UnitConverterService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });
  }

  async parseIngredients(text: string): Promise<ParsedIngredient[]> {
    const prompt = `
Parse these Hungarian recipe ingredients into a JSON array.

Input: "${text}"

For each ingredient extract:
- name: ingredient name in Hungarian
- originalText: the original text for this ingredient
- quantity: numeric value (use decimals, e.g., 0.5 for "fél")
- unit: the unit (ek, tk, dkg, kg, g, ml, l, db, gerezd, csipet, csésze, etc.)

Special cases:
- "fél" = 0.5
- "negyed" = 0.25
- "ízlés szerint" = quantity: null, unit: "ízlés szerint"
- No unit specified = unit: "db"

Return ONLY valid JSON array, no markdown, no explanation:
[{ "name": "", "originalText": "", "quantity": 0, "unit": "" }]
`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON from response
    const parsed = JSON.parse(response);

    // Normalize units
    return parsed.map(ingredient =>
      this.unitConverter.normalize(ingredient)
    );
  }
}
```

### Unit Converter

```typescript
// src/modules/nlp/unit-converter.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitConverterService {
  private conversions = {
    // Weight
    'dkg': { to: 'g', multiply: 10 },
    'kg': { to: 'g', multiply: 1000 },

    // Volume
    'ek': { to: 'ml', multiply: 15 },      // evőkanál
    'tk': { to: 'ml', multiply: 5 },       // teáskanál
    'dl': { to: 'ml', multiply: 100 },
    'l': { to: 'ml', multiply: 1000 },
    'csésze': { to: 'ml', multiply: 250 },

    // Small amounts
    'csipet': { to: 'g', multiply: 0.5 },
  };

  normalize(ingredient: any) {
    const conversion = this.conversions[ingredient.unit];

    if (conversion && ingredient.quantity !== null) {
      return {
        ...ingredient,
        originalUnit: ingredient.unit,
        unit: conversion.to,
        quantity: ingredient.quantity * conversion.multiply,
      };
    }

    return ingredient;
  }
}
```

---

## Prompt Engineering Tips

### Good Prompt Practices
1. Be specific about output format
2. Give examples for edge cases ("fél", "ízlés szerint")
3. Request ONLY JSON, no markdown
4. Specify Hungarian language context

### Example Prompts Tested

```
Input: "2 ek olaj, 30 dkg liszt, 3 tojás, fél kg cukor"
Output: ✅ Correctly parsed

Input: "só, bors ízlés szerint"
Output: ✅ Correctly handled as null quantity

Input: "1-2 gerezd fokhagyma"
Output: ✅ Returns quantity: 1.5 (average)
```

---

## Error Handling

```typescript
async parseIngredients(text: string) {
  try {
    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    // Fallback: return unparsed
    return [{
      name: text,
      originalText: text,
      quantity: null,
      unit: 'unparsed',
      parseError: true
    }];
  }
}
```

---

## API Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Tokens per minute | 1,000,000 |

For thesis project: **More than enough!**

---

## Related

- [[Tech Stack]]
- [[Backend]]
- [[May]] - Shopping list implementation
- [[June]] - NLP implementation month
- [[00 - Index]]
