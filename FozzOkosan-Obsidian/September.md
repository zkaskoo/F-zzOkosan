# September

#timeline #september

---

## Focus: Menu Planner & User Testing

---

## Tasks

### Weekly Menu Planner
- [ ] Create menu plan data model
- [ ] Build calendar UI component
- [ ] Implement drag & drop for recipes
- [ ] Generate shopping list for whole week
- [ ] Save/load menu plans

### User Testing
- [ ] Recruit 5-10 test users
- [ ] Create test scenarios
- [ ] Conduct testing sessions
- [ ] Collect SUS questionnaire responses
- [ ] Calculate SUS score

### Bug Fixes & Polish
- [ ] Fix issues from testing
- [ ] Improve UI/UX based on feedback
- [ ] Performance optimization
- [ ] Mobile responsiveness

---

## Menu Planner UI

```
┌────────────────────────────────────────────────────────────┐
│                    Heti Menütervező                         │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│  Hétfő  │  Kedd   │ Szerda  │ Csütörtök│ Péntek │ Szombat │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Ebéd:   │ Ebéd:   │ Ebéd:   │ Ebéd:   │ Ebéd:   │ Ebéd:   │
│ ┌─────┐ │ ┌─────┐ │         │ ┌─────┐ │         │ ┌─────┐ │
│ │Guly.│ │ │Pörk.│ │ [+Add]  │ │Rán. │ │ [+Add]  │ │Pizz.│ │
│ └─────┘ │ └─────┘ │         │ └─────┘ │         │ └─────┘ │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Vacsora:│ Vacsora:│ Vacsora:│ Vacsora:│ Vacsora:│ Vacsora:│
│         │ ┌─────┐ │ ┌─────┐ │         │ ┌─────┐ │         │
│ [+Add]  │ │Sala.│ │ │Leves│ │ [+Add]  │ │Tész.│ │ [+Add]  │
│         │ └─────┘ │ └─────┘ │         │ └─────┘ │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
│                                                            │
│  [Bevásárlólista generálása a heti menühöz]               │
└────────────────────────────────────────────────────────────┘
```

---

## Data Model

```typescript
interface MenuPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  meals: {
    monday: { lunch?: string; dinner?: string };
    tuesday: { lunch?: string; dinner?: string };
    wednesday: { lunch?: string; dinner?: string };
    thursday: { lunch?: string; dinner?: string };
    friday: { lunch?: string; dinner?: string };
    saturday: { lunch?: string; dinner?: string };
    sunday: { lunch?: string; dinner?: string };
  };
}
```

---

## SUS Questionnaire

System Usability Scale - 10 questions, 1-5 scale

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person.
5. I found the various functions were well integrated.
6. I thought there was too much inconsistency.
7. I imagine most people would learn to use this quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot before I could use this.

### Scoring
- Odd questions: score - 1
- Even questions: 5 - score
- Sum × 2.5 = SUS score (0-100)
- **Target: > 68** (above average)

---

## Test Scenarios

| # | Scenario | Success Criteria |
|---|----------|-----------------|
| 1 | Register new account | Account created, logged in |
| 2 | Create a recipe with image | Recipe visible in feed |
| 3 | Search for a recipe | Relevant results shown |
| 4 | Generate shopping list from 2 recipes | Merged list displayed |
| 5 | Create weekly menu plan | Plan saved, can generate list |
| 6 | Filter recipes by diet | Only matching recipes shown |

---

## Testing Schedule

| Day | Activity |
|-----|----------|
| Week 1 | Recruit testers, prepare scenarios |
| Week 2 | Conduct testing sessions (2-3 per day) |
| Week 3 | Analyze results, calculate SUS |
| Week 4 | Fix bugs, implement feedback |

---

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Menu planner feature | 🔲 |
| User testing completed | 🔲 |
| SUS score calculated | 🔲 |
| Bug fixes implemented | 🔲 |

---

## Dependencies

- [[June]] must be complete (NLP working)

---

## Related

- [[Timeline]]
- [[June]] - Previous month
- [[October]] - Next month
- [[Features]]
- [[00 - Index]]
