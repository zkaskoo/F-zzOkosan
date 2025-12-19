# Backend

#backend #nestjs #api

---

## Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| NestJS | 10.x | Framework |
| TypeScript | 5.x | Language |
| Prisma | 5.x | ORM |
| Passport | 0.7.x | Authentication |
| JWT | - | Token auth |
| Multer | 1.x | File uploads |
| class-validator | - | DTO validation |
| @google/generative-ai | - | Gemini integration |

---

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── dto/
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── recipes/
│   │   │   ├── recipes.module.ts
│   │   │   ├── recipes.controller.ts
│   │   │   ├── recipes.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── comments/
│   │   │   └── ...
│   │   │
│   │   ├── likes/
│   │   │   └── ...
│   │   │
│   │   ├── shopping/
│   │   │   ├── shopping.module.ts
│   │   │   ├── shopping.controller.ts
│   │   │   ├── shopping.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── menu/
│   │   │   └── ...
│   │   │
│   │   └── nlp/
│   │       ├── nlp.module.ts
│   │       ├── nlp.service.ts        # Gemini integration
│   │       └── unit-converter.ts
│   │
│   ├── prisma/
│   │   └── prisma.service.ts
│   │
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── filters/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   └── schema.prisma
│
├── test/
├── .env
└── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get JWT |
| GET | `/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PATCH | `/users/:id` | Update profile |
| POST | `/users/:id/follow` | Follow user |
| DELETE | `/users/:id/follow` | Unfollow user |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes` | Get feed |
| GET | `/recipes/:id` | Get single recipe |
| POST | `/recipes` | Create recipe |
| PATCH | `/recipes/:id` | Update recipe |
| DELETE | `/recipes/:id` | Delete recipe |
| POST | `/recipes/:id/like` | Like recipe |
| DELETE | `/recipes/:id/like` | Unlike recipe |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes/:id/comments` | Get comments |
| POST | `/recipes/:id/comments` | Add comment |
| DELETE | `/comments/:id` | Delete comment |

### Shopping Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shopping-lists` | Get user's lists |
| POST | `/shopping-lists` | Create list |
| POST | `/shopping-lists/generate` | Generate from recipes |
| DELETE | `/shopping-lists/:id` | Delete list |

### NLP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/nlp/parse` | Parse ingredients text |

---

## Setup Commands

```bash
# Create NestJS app
npx @nestjs/cli new backend

# Install dependencies
cd backend
npm install @prisma/client
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
npm install @nestjs/config
npm install class-validator class-transformer
npm install bcrypt
npm install @google/generative-ai
npm install multer @nestjs/platform-express

# Dev dependencies
npm install -D prisma @types/passport-jwt @types/multer

# Initialize Prisma
npx prisma init
```

---

## Related

- [[Tech Stack]]
- [[Frontend]]
- [[Database]]
- [[NLP & AI]]
- [[00 - Index]]
