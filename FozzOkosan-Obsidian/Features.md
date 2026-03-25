# Features

> Tags: `features` `requirements`

---

## Feature Overview

```mermaid
flowchart TD
    A[🍳 FőzzOkosan] --> B[🔐 Auth]
    A --> C[👥 Social]
    A --> D[📖 Recipes]
    A --> E[🧠 Smart]

    B --> B1[Registration]
    B --> B2[Login]
    B --> B3[JWT]

    C --> C1[Posts]
    C --> C2[Likes]
    C --> C3[Comments]
    C --> C4[Follows]

    D --> D1[CRUD]
    D --> D2[Images]
    D --> D3[Search]
    D --> D4[Categories]

    E --> E1[NLP Parsing]
    E --> E2[Shopping List]
    E --> E3[Unit Conversion]
    E --> E4[Menu Planner]
```

---

## Authentication & Users

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Registration** | Email + password signup | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Login** | JWT-based auth | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Profile** | View/edit user info | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Avatar** | Profile picture upload | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Password reset** | Email-based reset | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## Recipe Management

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Create recipe** | Title, ingredients, instructions | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Edit recipe** | Update own recipes | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Delete recipe** | Remove own recipes | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **View recipe** | Recipe detail page | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Recipe images** | Photo upload | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Categories** | Organize by type | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Cooking time** | Duration field | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Servings** | Portion count | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## Social Features

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Recipe feed** | Home page with recipes | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Like recipe** | Heart button | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Unlike recipe** | Remove like | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Comment** | Add comments | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Delete comment** | Remove own comments | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Follow user** | Follow other users | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Unfollow user** | Remove follow | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **User discovery** | Find users | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## Search & Discovery

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Search by title** | Text search | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Search by ingredient** | Find by ingredient | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Filter by category** | Category filter | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Filter by diet** | Vegetarian, vegan, etc. | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Filter by allergen** | Exclude allergens | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## Smart Features (Core Innovation)

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **NLP parsing** | Parse free-text ingredients | ![Critical](https://img.shields.io/badge/Critical-red) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Unit conversion** | dkg→g, ek→ml, etc. | ![Critical](https://img.shields.io/badge/Critical-red) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Shopping list** | Generate from recipe | ![Critical](https://img.shields.io/badge/Critical-red) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Multi-recipe merge** | Combine ingredients | ![Critical](https://img.shields.io/badge/Critical-red) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Menu planner** | Weekly meal planning | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Week shopping list** | List for whole week | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## User Interface

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Responsive design** | Mobile-friendly | ![High](https://img.shields.io/badge/High-orange) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Dark mode** | Theme toggle | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Loading states** | Skeleton loaders | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Error handling** | User-friendly errors | ![Medium](https://img.shields.io/badge/Medium-yellow) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |
| **Toast notifications** | Action feedback | ![Low](https://img.shields.io/badge/Low-blue) | ![Todo](https://img.shields.io/badge/Todo-lightgrey) |

---

## Priority Legend

| Badge | Meaning |
|-------|---------|
| ![Critical](https://img.shields.io/badge/Critical-red) | Must have for thesis |
| ![High](https://img.shields.io/badge/High-orange) | Important feature |
| ![Medium](https://img.shields.io/badge/Medium-yellow) | Nice to have |
| ![Low](https://img.shields.io/badge/Low-blue) | If time permits |

## Status Legend

| Badge | Meaning |
|-------|---------|
| ![Todo](https://img.shields.io/badge/Todo-lightgrey) | Not started |
| ![In Progress](https://img.shields.io/badge/In_Progress-yellow) | Currently working |
| ![Done](https://img.shields.io/badge/Done-brightgreen) | Completed |

---

## MVP Features (Minimum Viable Product)

Must be complete for thesis:

- [x] User registration & login
- [x] Recipe CRUD with images
- [x] Like & comment
- [ ] NLP ingredient parsing
- [ ] Unit conversion
- [ ] Shopping list generation
- [ ] Multi-recipe merge
- [ ] Weekly menu planner

---

## Related

- [Project Overview](Project%20Overview.md)
- [Timeline](Timeline.md)
- [Index](00%20-%20Index.md)
