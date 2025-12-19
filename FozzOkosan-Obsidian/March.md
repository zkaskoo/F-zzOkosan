# March

> Tags: `timeline #march

---

## Focus: Core Recipe Features

---

## Tasks

### Recipe CRUD
- [ ] Create recipe endpoint (POST /recipes)
- [ ] Read recipe endpoint (GET /recipes/:id)
- [ ] Update recipe endpoint (PATCH /recipes/:id)
- [ ] Delete recipe endpoint (DELETE /recipes/:id)
- [ ] List recipes endpoint (GET /recipes)
- [ ] Search recipes by title/ingredients

### Image Upload
- [ ] Set up Multer for file uploads
- [ ] Configure Cloudinary/S3 for image storage
- [ ] Add image field to recipe model
- [ ] Create image upload endpoint

### Frontend UI Components
- [ ] Layout components (Header, Footer, Sidebar)
- [ ] Recipe card component
- [ ] Recipe detail page
- [ ] Create recipe form
- [ ] Recipe feed (home page)
- [ ] User profile page
- [ ] Login/Register forms

### Basic Interactions
- [ ] Like recipe functionality
- [ ] Comment on recipe
- [ ] View recipe details

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Recipe CRUD API | ⬜ |
| Image upload working | ⬜ |
| Home feed UI | ⬜ |
| Recipe detail page | ⬜ |
| Create recipe form | ⬜ |

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
