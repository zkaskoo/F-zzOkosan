# FőzzOkosan - Complete Project Roadmap

## Project Overview

| Aspect | Description |
|--------|-------------|
| **Name** | FőzzOkosan (Smart Cooking) |
| **Type** | Social media recipe sharing + smart shopping list |
| **Core Feature** | NLP-powered ingredient parsing & list optimization |

---

## Technology Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type safety |
| **TailwindCSS** | Styling |
| **React Query** | Data fetching & caching |
| **React Router** | Navigation |
| **Zustand** | State management |

### Backend
| Tech | Purpose |
|------|---------|
| **NestJS** | Backend framework (TypeScript) |
| **Prisma** | Database ORM |
| **PostgreSQL** | Database |
| **JWT + Passport** | Authentication |
| **Multer** | Image uploads |

### NLP / AI
| Tech | Purpose |
|------|---------|
| **Google Gemini API** | Ingredient parsing (FREE tier) |

### DevOps / Hosting
| Tech | Purpose |
|------|---------|
| **Docker** | Local development |
| **Vercel** | Frontend hosting (free) |
| **Railway / Render** | Backend hosting (free tier) |
| **Supabase / Neon** | PostgreSQL hosting (free tier) |

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│            React + TypeScript + TailwindCSS                │
│                    (Vercel - Free)                          │
└────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│                 NestJS + TypeScript                         │
│               (Railway/Render - Free)                       │
├─────────────────────┬──────────────────────────────────────┤
│      Modules:       │           Services:                   │
│  • Auth             │  • JWT Authentication                 │
│  • Users            │  • File Upload (Images)               │
│  • Recipes          │  • Gemini AI Integration              │
│  • Comments         │                                       │
│  • Likes            │                                       │
│  • Shopping Lists   │                                       │
└─────────────────────┴──────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│      DATABASE        │    │         AI SERVICE           │
│     PostgreSQL       │    │    Google Gemini API         │
│  (Supabase - Free)   │    │         (Free)               │
└──────────────────────┘    └──────────────────────────────┘
```

---

## Database Schema

```
Users
├── id
├── email
├── password (hashed)
├── username
├── avatar
├── bio
└── createdAt

Recipes
├── id
├── userId (FK)
├── title
├── description
├── ingredients (text)
├── parsedIngredients (JSON)
├── instructions
├── image
├── cookingTime
└── createdAt

Comments
├── id
├── userId (FK)
├── recipeId (FK)
├── content
└── createdAt

Likes
├── id
├── userId (FK)
├── recipeId (FK)
└── createdAt

Follows
├── id
├── followerId (FK)
├── followingId (FK)
└── createdAt

ShoppingLists
├── id
├── userId (FK)
├── name
├── items (JSON)
└── createdAt

MenuPlans
├── id
├── userId (FK)
├── weekStartDate
├── meals (JSON)
└── createdAt
```

---

## Timeline Overview

```
Feb ──── Mar ──── Apr ──── May ──── Jun ──── Sep ──── Oct
 │        │        │        │        │        │        │
 │        │        │        │        │        │        │
Setup   CRUD    Units    Shopping   NLP    Testing   Docs
& Auth  & UI    & DB     List      & Docs  & Menu    Final
```

---

## Detailed Monthly Breakdown

### February - Foundation

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Literature research | - | Analysis document of similar apps (Cookpad, Mealime, etc.) |
| System design | Draw.io / Excalidraw | Architecture diagram, DB schema |
| Dev environment setup | Git, Docker, GitHub Actions | Repository, CI/CD pipeline |
| User auth implementation | NestJS, JWT, Prisma | Register/Login/Logout working |

**Key Milestones:**
- [ ] GitHub repo created with CI/CD
- [ ] Database schema designed
- [ ] User registration & login functional

---

### March - Core Recipe Features

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Recipe CRUD | NestJS, Prisma | Create, Read, Update, Delete recipes |
| Image upload | Multer, Cloudinary/S3 | Recipe photo uploads |
| Frontend UI | React, TailwindCSS | Home, Recipe detail, Create recipe pages |
| Search | Prisma full-text search | Search recipes by title/ingredients |

**Key Milestones:**
- [ ] Users can post recipes with images
- [ ] Recipe feed displaying all recipes
- [ ] Basic search functionality

---

### April - Data Normalization

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Unit conversion system | TypeScript | dkg→g, ek→ml, etc. |
| Ingredient database | PostgreSQL | Standardized ingredient list |
| Structured storage | Prisma JSON | Parsed ingredients in DB |

**Unit Conversion Examples:**
```typescript
const conversions = {
  'dkg': { to: 'g', multiply: 10 },
  'kg': { to: 'g', multiply: 1000 },
  'ek': { to: 'ml', multiply: 15 },      // evőkanál
  'tk': { to: 'ml', multiply: 5 },       // teáskanál
  'csipet': { to: 'g', multiply: 0.5 },
  'csésze': { to: 'ml', multiply: 250 },
};
```

**Key Milestones:**
- [ ] All units converted to base units (g, ml)
- [ ] Ingredients stored in structured JSON format

---

### May - Shopping List Generator

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Shopping list from recipe | NestJS | Generate list from single recipe |
| Multi-recipe merge | Algorithm | Combine ingredients from multiple recipes |
| Allergen filtering | Database flags | Filter by allergies (gluten, lactose, etc.) |
| Diet filtering | Database flags | Vegetarian, vegan, keto filters |

**Merge Algorithm Example:**
```typescript
// Input: 2 recipes
// Recipe 1: 200g liszt, 2 tojás
// Recipe 2: 300g liszt, 100g cukor

// Output: Merged shopping list
// - 500g liszt (combined)
// - 2 tojás
// - 100g cukor
```

**Key Milestones:**
- [ ] Generate shopping list from 1+ recipes
- [ ] Ingredients properly merged
- [ ] Allergen/diet filters working

---

### June - Documentation & NLP

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Thesis intro & literature | Word/LaTeX | Chapters 1-2 of thesis |
| NLP implementation | Gemini API | Free-text ingredient parsing |
| NLP testing | Jest | Unit tests for parser |

**NLP Flow:**
```
User Input: "2 evőkanál olívaolaj, fél kiló csirkemell, 3 gerezd fokhagyma"
                              │
                              ▼
                      ┌───────────────┐
                      │  Gemini API   │
                      └───────────────┘
                              │
                              ▼
Structured Output:
[
  { "name": "olívaolaj", "quantity": 2, "unit": "ek", "normalized": { "ml": 30 }},
  { "name": "csirkemell", "quantity": 0.5, "unit": "kg", "normalized": { "g": 500 }},
  { "name": "fokhagyma", "quantity": 3, "unit": "gerezd", "normalized": { "pieces": 3 }}
]
```

**Key Milestones:**
- [ ] NLP parses Hungarian ingredients correctly
- [ ] Thesis introduction & literature review written

---

### September - Menu Planner & Testing

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| Weekly menu planner | React, NestJS | Plan meals for 7 days |
| Auto shopping list | Algorithm | Generate list for entire week |
| User testing | SUS questionnaire | 5-10 testers, feedback collected |
| Bug fixes | - | Issues resolved based on feedback |

**Menu Planner UI Concept:**
```
┌─────────────────────────────────────────────────────────┐
│                    Weekly Menu Planner                   │
├─────────┬─────────┬─────────┬─────────┬─────────┬───────┤
│   Mon   │   Tue   │   Wed   │   Thu   │   Fri   │  ...  │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ Lunch:  │ Lunch:  │ Lunch:  │ Lunch:  │ Lunch:  │       │
│ [+add]  │ Gulyás  │ [+add]  │ Rántott │ [+add]  │       │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ Dinner: │ Dinner: │ Dinner: │ Dinner: │ Dinner: │       │
│ Pörkölt │ [+add]  │ Halászlé│ [+add]  │ Pizza   │       │
└─────────┴─────────┴─────────┴─────────┴─────────┴───────┘
            [ Generate Shopping List for Week ]
```

**SUS (System Usability Scale):**
- 10 standard questions
- Score 0-100
- Goal: Score > 68 (above average)

**Key Milestones:**
- [ ] Weekly menu planner functional
- [ ] User testing completed
- [ ] SUS score calculated

---

### October - Final Documentation

| Task | Tech/Tools | Deliverable |
|------|------------|-------------|
| System design chapter | Word/LaTeX | Architecture, tech stack docs |
| Implementation chapter | Word/LaTeX | Code explanations, screenshots |
| Results chapter | Word/LaTeX | Testing results, SUS analysis |
| Final review | Consultation | Supervisor approval |

**Documentation Structure:**
```
1. Introduction
   - Problem statement
   - Goals

2. Literature Review
   - Similar systems analysis
   - Technologies overview

3. System Design
   - Architecture
   - Database schema
   - API design

4. Implementation
   - Frontend
   - Backend
   - NLP integration

5. Testing & Results
   - User testing methodology
   - SUS results
   - Performance metrics

6. Conclusion
   - Summary
   - Future improvements
```

---

## Complete Feature Checklist

### Auth & Users
- [ ] User registration
- [ ] User login (JWT)
- [ ] User profile
- [ ] Profile editing
- [ ] Avatar upload

### Recipes
- [ ] Create recipe
- [ ] Edit recipe
- [ ] Delete recipe
- [ ] View recipe
- [ ] Recipe images
- [ ] Search recipes
- [ ] Filter by category

### Social Features
- [ ] Like recipes
- [ ] Comment on recipes
- [ ] Follow users
- [ ] Recipe feed
- [ ] User discovery

### Smart Features
- [ ] NLP ingredient parsing
- [ ] Unit conversion
- [ ] Shopping list generation
- [ ] Multi-recipe merge
- [ ] Allergen filtering
- [ ] Diet filtering
- [ ] Weekly menu planner

---

## Cost Summary

| Service | Cost |
|---------|------|
| Vercel (Frontend) | **Free** |
| Railway/Render (Backend) | **Free tier** |
| Supabase/Neon (Database) | **Free tier** |
| Google Gemini API | **Free tier** |
| **Total** | **$0/month** |

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| NLP accuracy issues | Medium | High | Fallback to manual input |
| Gemini API limits | Low | Medium | Caching, rate limiting |
| Time constraints | Medium | High | Prioritize core features |
| Complex merge logic | Medium | Medium | Start simple, iterate |

---

## Development Commands

```bash
# Create frontend
npx create-react-app frontend --template typescript

# Create backend
npx @nestjs/cli new backend

# Install frontend dependencies
cd frontend
npm install tailwindcss postcss autoprefixer
npm install @tanstack/react-query react-router-dom zustand axios

# Install backend dependencies
cd backend
npm install @prisma/client @nestjs/passport passport passport-jwt
npm install @nestjs/config class-validator class-transformer
npm install @google/generative-ai
npx prisma init
```

---

## Repository Structure

```
fozzokosan/
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API calls
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   └── package.json
│
├── backend/                  # NestJS app
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication
│   │   │   ├── users/        # User management
│   │   │   ├── recipes/      # Recipe CRUD
│   │   │   ├── comments/     # Comments
│   │   │   ├── likes/        # Likes
│   │   │   ├── shopping/     # Shopping lists
│   │   │   ├── menu/         # Menu planner
│   │   │   └── nlp/          # NLP service (Gemini)
│   │   ├── prisma/           # Database schema
│   │   └── common/           # Shared utilities
│   └── package.json
│
├── docker-compose.yml        # PostgreSQL + services
├── PROJECT_ROADMAP.md        # This file
└── README.md                 # Project overview
```

---

## Contact & Resources

- **GitHub Repository**: https://github.com/zkaskoo/F-zzOkosan
- **Gemini API**: https://ai.google.dev/
- **NestJS Docs**: https://docs.nestjs.com/
- **Prisma Docs**: https://www.prisma.io/docs
- **React Docs**: https://react.dev/
