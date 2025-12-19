# Tech Stack

> Tags: `tech #architecture

---

## Overview

```
┌─────────────────────────────────────────┐
│              FRONTEND                    │
│    React + TypeScript + TailwindCSS     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              BACKEND                     │
│         NestJS + TypeScript             │
└─────────────────────────────────────────┘
                    │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐  ┌─────────────────┐
│    DATABASE     │  │    AI SERVICE   │
│   PostgreSQL    │  │  Gemini API     │
└─────────────────┘  └─────────────────┘
```

---

## Stack Breakdown

| Layer | Technology | Details |
|-------|------------|---------|
| [Frontend](Frontend.md) | React 18 | UI Framework |
| [Frontend](Frontend.md) | TypeScript | Type safety |
| [Frontend](Frontend.md) | TailwindCSS | Styling |
| [Backend](Backend.md) | NestJS | API Framework |
| [Backend](Backend.md) | Prisma | ORM |
| [Database](Database.md) | PostgreSQL | Relational DB |
| [NLP & AI](NLP%20%26%20AI.md) | Gemini API | Ingredient parsing |

---

## Hosting (Free Tier)

| Service | Provider | Cost |
|---------|----------|------|
| Frontend | Vercel | Free |
| Backend | Railway / Render | Free |
| Database | Supabase / Neon | Free |
| AI | Google Gemini | Free |
| **Total** | | **$0/month** |

---

## Why This Stack?

### React + TypeScript
- Industry standard
- Large ecosystem
- Type safety reduces bugs
- Great developer experience

### NestJS
- TypeScript native
- Structured architecture
- Same language as frontend
- Great for large applications

### PostgreSQL
- Reliable and mature
- Complex queries support
- JSON column support
- Free hosting available

### Gemini API
- Free tier available
- Good Hungarian language support
- Easy to integrate
- Fast response times

---

## Related

- [Frontend](Frontend.md)
- [Backend](Backend.md)
- [Database](Database.md)
- [NLP & AI](NLP%20%26%20AI.md)
- [Index](00%20-%20Index.md)
