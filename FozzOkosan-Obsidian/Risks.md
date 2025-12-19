# Risks

> Tags: `risks #planning

---

## Risk Matrix

```
Impact
  High │  ┌─────────────┐
       │  │ NLP Accuracy│
       │  │             │
       │  └─────────────┘
       │         ┌─────────────┐
       │         │Time Pressure│
       │         └─────────────┘
Medium │  ┌─────────────┐
       │  │ API Limits  │
       │  └─────────────┘
       │                   ┌─────────────┐
       │                   │Merge Logic  │
       │                   └─────────────┘
  Low  │
       └────────────────────────────────────
            Low        Medium        High
                    Probability
```

---

## Detailed Risk Analysis

### 1. NLP Accuracy Issues

| Aspect | Details |
|--------|---------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | Gemini API may not correctly parse all Hungarian ingredient formats |

**Mitigation Strategies:**
- Implement fallback to manual input
- Allow users to correct parsed ingredients
- Build comprehensive test suite
- Fine-tune prompts for edge cases

**Contingency:**
- If AI fails, allow structured input form as alternative

---

### 2. Time Constraints

| Aspect | Details |
|--------|---------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | May not complete all features before deadline |

**Mitigation Strategies:**
- Prioritize MVP features
- Use [Features](Features.md) priority list
- Weekly progress reviews
- Cut low-priority features if needed

**Contingency:**
- Focus on core features (NLP + shopping list)
- Document planned vs. implemented features in thesis

---

### 3. Gemini API Limits

| Aspect | Details |
|--------|---------|
| **Probability** | Low |
| **Impact** | Medium |
| **Description** | Free tier limits may be reached during testing |

**Mitigation Strategies:**
- Cache parsed results
- Rate limit API calls
- Monitor usage
- Have backup API key ready

**Free Tier Limits:**
- 15 requests/minute
- 1,500 requests/day
- More than enough for thesis

**Contingency:**
- Switch to OpenAI/Claude if needed
- Implement client-side caching

---

### 4. Complex Merge Logic

| Aspect | Details |
|--------|---------|
| **Probability** | Medium |
| **Impact** | Medium |
| **Description** | Ingredient merging may have edge cases |

**Edge Cases:**
- Same ingredient, different units (500g + 2 dkg)
- Similar names (paradicsom vs. paradicsompüré)
- Quantity ranges (1-2 gerezd)

**Mitigation Strategies:**
- Convert all to base units first
- Build ingredient synonym database
- Start with simple merge, iterate
- Extensive unit testing

**Contingency:**
- Show duplicates to user for manual merge
- Log edge cases for future improvement

---

### 5. Database Performance

| Aspect | Details |
|--------|---------|
| **Probability** | Low |
| **Impact** | Low |
| **Description** | Slow queries with growing data |

**Mitigation Strategies:**
- Add proper indexes
- Use pagination
- Optimize Prisma queries
- Free tier has limited data anyway

---

### 6. User Testing Recruitment

| Aspect | Details |
|--------|---------|
| **Probability** | Low |
| **Impact** | Medium |
| **Description** | Difficulty finding 5-10 testers |

**Mitigation Strategies:**
- Ask friends and family
- University classmates
- Online communities
- Start recruiting early ([September](September.md))

---

## Risk Response Summary

| Risk | Response |
|------|----------|
| NLP Accuracy | Fallback + user correction |
| Time Pressure | Prioritize MVP |
| API Limits | Caching + monitoring |
| Merge Logic | Start simple + iterate |
| DB Performance | Indexes + pagination |
| User Testing | Early recruitment |

---

## Monitoring

Weekly check:
- [ ] API usage within limits?
- [ ] On track with [Timeline](Timeline.md)?
- [ ] Any new blockers?
- [ ] Test coverage adequate?

---

## Related

- [Timeline](Timeline.md)
- [Features](Features.md)
- [NLP & AI](NLP%20%26%20AI.md)
- [Index](00%20-%20Index.md)
