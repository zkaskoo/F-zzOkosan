# February

> Tags: `timeline #february

---

## Focus: Foundation & Setup

---

## Tasks

### Literature Research
- [ ] Analyze similar apps (Cookpad, Mealime, Tasty, etc.)
- [ ] Document features comparison
- [ ] Identify gaps/opportunities
- [ ] Research NLP approaches for ingredient parsing

### System Design
- [ ] Create architecture diagram
- [ ] Design [Database](Database.md) schema
- [ ] Define API endpoints
- [ ] Plan module structure

### Dev Environment Setup
- [ ] Create GitHub repository
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Configure Docker for local development
- [ ] Set up PostgreSQL database
- [ ] Initialize [Frontend](Frontend.md) (React + TypeScript)
- [ ] Initialize [Backend](Backend.md) (NestJS)
- [ ] Configure Prisma ORM

### User Authentication
- [ ] Implement user registration
- [ ] Implement user login
- [ ] Set up JWT authentication
- [ ] Create protected routes
- [ ] Password hashing (bcrypt)

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Literature analysis document | ⬜ |
| Architecture diagram | ⬜ |
| Database schema (Prisma) | ⬜ |
| Working registration/login | ⬜ |
| CI/CD pipeline | ⬜ |

---

## Tech Focus

- [Backend](Backend.md) - NestJS setup, auth module
- [Database](Database.md) - Prisma schema design
- [Frontend](Frontend.md) - Basic React setup

---

## Commands to Run

```bash
# Create GitHub repo (already done)
# git@github.com:zkaskoo/F-zzOkosan.git

# Initialize projects
npx create-react-app frontend --template typescript
npx @nestjs/cli new backend

# Backend auth dependencies
cd backend
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install bcrypt class-validator class-transformer
npm install @prisma/client
npm install -D prisma

# Initialize database
npx prisma init
npx prisma migrate dev --name init
```

---

## Related

- [Timeline](Timeline.md)
- [March](March.md) - Next month
- [Index](00%20-%20Index.md)
