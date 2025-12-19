# Frontend

> Tags: `frontend #react #typescript

---

## Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Styling |
| React Query | 5.x | Data fetching & caching |
| React Router | 6.x | Navigation |
| Zustand | 4.x | State management |
| Axios | 1.x | HTTP client |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Basic UI (Button, Input, Card)
│   │   ├── recipe/          # Recipe components
│   │   ├── user/            # User components
│   │   └── layout/          # Layout components
│   │
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── CreateRecipe.tsx
│   │   ├── Profile.tsx
│   │   ├── ShoppingList.tsx
│   │   └── MenuPlanner.tsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useRecipes.ts
│   │   └── useShoppingList.ts
│   │
│   ├── services/            # API calls
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.service.ts
│   │   ├── recipe.service.ts
│   │   └── shopping.service.ts
│   │
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── user.types.ts
│   │   ├── recipe.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/               # Utility functions
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Key Pages

### Home (Feed)
- Recipe feed
- Search bar
- Filter options
- Infinite scroll

### Recipe Detail
- Recipe image
- Ingredients list
- Instructions
- Like/comment buttons
- "Add to shopping list" button

### Create Recipe
- Title input
- Image upload
- Ingredients textarea (free text)
- Instructions editor
- Category selection

### Shopping List
- Select multiple recipes
- View merged ingredients
- Check off items
- Export/share list

### Menu Planner
- Weekly calendar view
- Drag & drop recipes
- Generate shopping list for week

---

## Setup Commands

```bash
# Create React app with TypeScript
npx create-react-app frontend --template typescript

# Install dependencies
cd frontend
npm install tailwindcss postcss autoprefixer
npm install @tanstack/react-query react-router-dom zustand axios
npm install lucide-react  # Icons

# Initialize Tailwind
npx tailwindcss init -p
```

---

## Related

- [Tech Stack](Tech%20Stack.md)
- [Backend](Backend.md)
- [Index](00%20-%20Index.md)
