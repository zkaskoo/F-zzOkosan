# February

> Tags: `timeline` `february`

---

## Focus: Foundation & Setup

---

## Tasks

### Literature Research ✅
- [x] Analyze similar apps (Cookpad, Mealime, Tasty, etc.)
- [x] Document features comparison
- [x] Identify gaps/opportunities
- [x] Research NLP approaches for ingredient parsing

📄 **See full document:** [Literature Research](Literature%20Research.md)

### System Design ✅
- [x] Create architecture diagram
- [x] Design [Database](Database.md) schema
- [x] Define API endpoints
- [x] Plan module structure

📄 **See full document:** [System Design](System%20Design.md)

### Dev Environment Setup ✅
- [x] Create GitHub repository
- [x] Set up CI/CD (GitHub Actions)
- [x] Configure Docker for local development
- [x] Set up PostgreSQL database
- [x] Initialize [Frontend](Frontend.md) (React + TypeScript + TailwindCSS v4)
- [x] Initialize [Backend](Backend.md) (NestJS)
- [x] Configure Prisma ORM

### User Authentication ✅
- [x] Implement user registration
- [x] Implement user login
- [x] Set up JWT authentication
- [x] Create protected routes
- [x] Password hashing (bcrypt)

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Literature analysis document | ✅ Done |
| Architecture diagram | ✅ Done |
| Database schema (Prisma) | ✅ Done |
| Dev environment (Docker + Projects) | ✅ Done |
| CI/CD pipeline | ✅ Done |
| Working registration/login | ✅ Done |

---

## Tech Focus

- [Backend](Backend.md) - NestJS setup, auth module
- [Database](Database.md) - Prisma schema design
- [Frontend](Frontend.md) - Basic React setup

---

## Commands to Run

```bash
# Start Docker containers (PostgreSQL, Redis, Adminer)
cd fozzokosan
npm run docker:up

# Install all dependencies
npm run install:all

# Run database migrations
npm run db:migrate

# Start development servers
npm run backend:dev  # Terminal 1
npm run frontend:dev # Terminal 2

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Database Admin: http://localhost:8080
```

---

## Related

- [Timeline](Timeline.md)
- [Literature Research](Literature%20Research.md)
- [March](March.md) - Next month
- [Index](00%20-%20Index.md)
