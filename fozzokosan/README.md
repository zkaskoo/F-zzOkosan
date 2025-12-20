# FőzzOkosan

Hungarian recipe sharing social network with NLP-powered automatic shopping list generation.

## Features

- User-generated recipe sharing (Instagram-like UI)
- NLP-powered ingredient parsing using Google Gemini API
- Automatic shopping list generation with ingredient merging
- Hungarian language support with local units (dkg, ek, tk)
- Meal planning calendar
- Social features (like, comment, follow)

## Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS v4 + Vite
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16
- **NLP**: Google Gemini API
- **Cache**: Redis (optional)

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

## Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:zkaskoo/F-zzOkosan.git
   cd fozzokosan
   ```

2. **Start the database**
   ```bash
   npm run docker:up
   ```

3. **Install dependencies**
   ```bash
   npm run install:all
   ```

4. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run backend:dev

   # Terminal 2 - Frontend
   npm run frontend:dev
   ```

7. **Open the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database Admin: http://localhost:8080

## Project Structure

```
fozzokosan/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── users/    # User management
│   │   ├── recipes/  # Recipe CRUD
│   │   ├── shopping/ # Shopping list generation
│   │   └── nlp/      # Gemini API integration
│   └── prisma/       # Database schema
├── frontend/         # React application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── services/
└── docker-compose.yml
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run docker:up` | Start PostgreSQL, Redis, Adminer |
| `npm run docker:down` | Stop all containers |
| `npm run backend:dev` | Start backend in development mode |
| `npm run frontend:dev` | Start frontend in development mode |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## License

MIT
