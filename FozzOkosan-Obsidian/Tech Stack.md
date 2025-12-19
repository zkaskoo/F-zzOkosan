# Tech Stack

#tech #architecture

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
| [[Frontend]] | React 18 | UI Framework |
| [[Frontend]] | TypeScript | Type safety |
| [[Frontend]] | TailwindCSS | Styling |
| [[Backend]] | NestJS | API Framework |
| [[Backend]] | Prisma | ORM |
| [[Database]] | PostgreSQL | Relational DB |
| [[NLP & AI]] | Gemini API | Ingredient parsing |

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

- [[Frontend]]
- [[Backend]]
- [[Database]]
- [[NLP & AI]]
- [[00 - Index]]
