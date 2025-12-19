# Features

#features #requirements

---

## Feature Overview

```mermaid
mindmap
  root((FőzzOkosan))
    Auth
      Registration
      Login
      JWT
    Social
      Posts
      Likes
      Comments
      Follows
    Recipes
      CRUD
      Images
      Search
      Categories
    Smart
      NLP Parsing
      Shopping List
      Unit Conversion
      Menu Planner
```

---

## Authentication & Users

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Registration | Email + password signup | High | 🔲 |
| Login | JWT-based auth | High | 🔲 |
| Profile | View/edit user info | Medium | 🔲 |
| Avatar | Profile picture upload | Low | 🔲 |
| Password reset | Email-based reset | Low | 🔲 |

---

## Recipe Management

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Create recipe | Title, ingredients, instructions | High | 🔲 |
| Edit recipe | Update own recipes | High | 🔲 |
| Delete recipe | Remove own recipes | High | 🔲 |
| View recipe | Recipe detail page | High | 🔲 |
| Recipe images | Photo upload | High | 🔲 |
| Categories | Organize by type | Medium | 🔲 |
| Cooking time | Duration field | Low | 🔲 |
| Servings | Portion count | Low | 🔲 |

---

## Social Features

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Recipe feed | Home page with recipes | High | 🔲 |
| Like recipe | Heart button | High | 🔲 |
| Unlike recipe | Remove like | High | 🔲 |
| Comment | Add comments | Medium | 🔲 |
| Delete comment | Remove own comments | Medium | 🔲 |
| Follow user | Follow other users | Medium | 🔲 |
| Unfollow user | Remove follow | Medium | 🔲 |
| User discovery | Find users | Low | 🔲 |

---

## Search & Discovery

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Search by title | Text search | High | 🔲 |
| Search by ingredient | Find by ingredient | Medium | 🔲 |
| Filter by category | Category filter | Medium | 🔲 |
| Filter by diet | Vegetarian, vegan, etc. | Medium | 🔲 |
| Filter by allergen | Exclude allergens | Medium | 🔲 |

---

## Smart Features (Core Innovation)

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| [[NLP & AI\|NLP parsing]] | Parse free-text ingredients | **Critical** | 🔲 |
| Unit conversion | dkg→g, ek→ml, etc. | **Critical** | 🔲 |
| Shopping list | Generate from recipe | **Critical** | 🔲 |
| Multi-recipe merge | Combine ingredients | **Critical** | 🔲 |
| Menu planner | Weekly meal planning | High | 🔲 |
| Week shopping list | List for whole week | High | 🔲 |

---

## User Interface

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Responsive design | Mobile-friendly | High | 🔲 |
| Dark mode | Theme toggle | Low | 🔲 |
| Loading states | Skeleton loaders | Medium | 🔲 |
| Error handling | User-friendly errors | Medium | 🔲 |
| Toast notifications | Action feedback | Low | 🔲 |

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **Critical** | Must have for thesis |
| High | Important feature |
| Medium | Nice to have |
| Low | If time permits |

---

## MVP Features (Minimum Viable Product)

Must be complete for thesis:

1. ✅ User registration & login
2. ✅ Recipe CRUD with images
3. ✅ Like & comment
4. ✅ NLP ingredient parsing
5. ✅ Unit conversion
6. ✅ Shopping list generation
7. ✅ Multi-recipe merge
8. ✅ Weekly menu planner

---

## Related

- [[Project Overview]]
- [[Timeline]]
- [[00 - Index]]
