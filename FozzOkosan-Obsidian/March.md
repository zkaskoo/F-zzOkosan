# March

> Tags: `timeline #march

---

## Focus: Core Recipe Features

---

## Tasks

### Recipe CRUD
- [x] Create recipe endpoint (POST /recipes)
- [x] Read recipe endpoint (GET /recipes/:id)
- [x] Update recipe endpoint (PATCH /recipes/:id)
- [x] Delete recipe endpoint (DELETE /recipes/:id)
- [x] List recipes endpoint (GET /recipes)
- [x] Search recipes by title/ingredients

### Image Upload
- [x] Set up Multer for file uploads
- [x] Configure Cloudinary/S3 for image storage
- [x] Add image field to recipe model
- [x] Create image upload endpoint

### Frontend UI Components
- [x] Layout components (Header, Footer, Sidebar)
- [x] Recipe card component
- [x] Recipe detail page
- [x] Create recipe form
- [x] Recipe feed (home page)
- [x] User profile page
- [x] Login/Register forms

### Basic Interactions
- [x] Like recipe functionality
- [x] Comment on recipe
- [x] View recipe details

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Recipe CRUD API | ✅ |
| Image upload working | ✅ |
| Home feed UI | ✅ |
| Recipe detail page | ✅ |
| Create recipe form | ✅ |

---

## UI Mockups

### Home Feed
```
┌────────────────────────────────────┐
│  🍳 FőzzOkosan          [Search]   │
├────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐       │
│  │  Recipe  │  │  Recipe  │       │
│  │  Image   │  │  Image   │       │
│  │  ------  │  │  ------  │       │
│  │  Title   │  │  Title   │       │
│  │  ♥ 42    │  │  ♥ 28    │       │
│  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐       │
│  │  Recipe  │  │  Recipe  │       │
│  │  ...     │  │  ...     │       │
└────────────────────────────────────┘
```

### Recipe Detail
```
┌────────────────────────────────────┐
│  ← Back                            │
├────────────────────────────────────┤
│  ┌────────────────────────────┐   │
│  │      Recipe Image          │   │
│  └────────────────────────────┘   │
│                                    │
│  Recipe Title             ♥ Like  │
│  by @username                      │
│  ─────────────────────────────    │
│  Ingredients:                      │
│  • 2 ek olaj                       │
│  • 500g csirkemell                 │
│  • 3 gerezd fokhagyma              │
│  ─────────────────────────────    │
│  Instructions:                     │
│  1. First step...                  │
│  2. Second step...                 │
│  ─────────────────────────────    │
│  [Add to Shopping List]            │
│  ─────────────────────────────    │
│  Comments (5)                      │
│  ...                               │
└────────────────────────────────────┘
```

---

## Dependencies

- [February](February.md) must be complete (auth working)

---

## Related

- [Timeline](Timeline.md)
- [February](February.md) - Previous month
- [April](April.md) - Next month
- [Frontend](Frontend.md)
- [Backend](Backend.md)
- [Index](00%20-%20Index.md)
