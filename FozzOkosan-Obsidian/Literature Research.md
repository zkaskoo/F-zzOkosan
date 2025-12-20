# Literature Research

> Tags: `research` `literature` `february`

---

## 1. Similar Applications Analysis

### 1.1 Cookpad

**Overview:** Global recipe-sharing platform with 100+ million monthly users in 70+ countries.

| Aspect | Details |
|--------|---------|
| **Primary Focus** | User-generated recipe sharing |
| **Platform** | iOS, Android, Web |
| **Business Model** | Freemium (Premium subscription) |

**Key Features:**
- 📝 User-generated recipes with photos
- 📅 "Plan" feature - weekly meal planning calendar
- 🤖 AI recipe assistant
- 📋 Recipe text copy for sharing
- 📚 Private/Public recipe organization
- 🔍 Advanced search filters (Premium)

**Strengths:**
- Large community of home cooks
- Simple, clean interface
- Strong social features

**Weaknesses:**
- No automatic shopping list generation
- No ingredient parsing/merging
- Limited meal planning in free version

**Source:** [Cookpad App Store](https://apps.apple.com/us/app/cookpad-recipes-homemade-food/id585332633)

---

### 1.2 Mealime

**Overview:** Meal planning app focused on healthy eating with smart shopping lists.

| Aspect | Details |
|--------|---------|
| **Primary Focus** | Meal planning & shopping |
| **Platform** | iOS, Android |
| **Business Model** | Freemium ($2.99/month Pro) |

**Key Features:**
- 🥗 200+ dietary customization options
- 🛒 Auto-generated shopping lists organized by store department
- ⏱️ All recipes under 30 minutes
- 🚫 Allergy filters (gluten, dairy, nuts, etc.)
- 🏪 Integration with Instacart, Walmart, etc.
- ♻️ Waste reduction - ingredients used across meals

**Strengths:**
- Excellent shopping list organization
- Strong dietary/allergy support
- Grocery store integration

**Weaknesses:**
- No user-generated recipes
- No social/community features
- Limited recipe customization

**Source:** [Mealime Official](https://www.mealime.com/)

---

### 1.3 Tasty (BuzzFeed)

**Overview:** Video-first recipe platform with AI-powered features.

| Aspect | Details |
|--------|---------|
| **Primary Focus** | Video recipes & cooking guidance |
| **Platform** | iOS, Android, Web |
| **Business Model** | Free with ads |

**Key Features:**
- 🎬 10,000+ recipes with video guides
- 🤖 "AI Botatouille" - ChatGPT-powered recipe assistant
- 🛒 Shoppable recipes via Walmart
- 🔄 "Recipe Remixes" - community variations
- 🥕 Ingredient search (find recipes by what you have)
- 📊 Adjustable serving sizes with metric conversion

**Strengths:**
- High-quality video content
- Strong AI integration
- Large recipe database

**Weaknesses:**
- No meal planning feature
- Shopping limited to Walmart
- Ad-heavy free version

**Source:** [Tasty Official](https://tasty.co/)

---

### 1.4 Yummly

**Overview:** Personalized recipe discovery with smart kitchen integration.

| Aspect | Details |
|--------|---------|
| **Primary Focus** | Personalized recipe discovery |
| **Platform** | iOS, Android, Web |
| **Business Model** | Freemium ($5/month Pro) |

**Key Features:**
- 🎯 2+ million recipes with smart filters
- 📦 Virtual Pantry - scan ingredients, get recipe suggestions
- 🎤 Voice control ("Hey Yummly")
- 🌡️ Smart Thermometer integration
- 📊 Nutritional information
- ⏰ Expiration reminders for ingredients

**Strengths:**
- Excellent personalization
- Smart hardware integration
- Voice-controlled cooking

**Weaknesses:**
- Expensive subscription
- No community features
- Limited meal planning

**Source:** [Yummly App](https://www.yummly.com/)

---

### 1.5 Whisk (Samsung Food)

**Overview:** All-in-one recipe management with strong community features.

| Aspect | Details |
|--------|---------|
| **Primary Focus** | Recipe saving & meal planning |
| **Platform** | iOS, Android, Web, Browser Extension |
| **Business Model** | Free |

**Key Features:**
- 📸 Recipe Scanner - digitize printed cookbooks
- 📅 Free meal planner
- 🛒 Collaborative shopping lists (real-time sync)
- 👥 Community & creator following
- 🔗 Ethical source linking
- 📏 Imperial/Metric conversion

**Strengths:**
- Completely free
- Recipe import from any source
- Real-time collaboration

**Weaknesses:**
- No NLP ingredient parsing
- No automatic list optimization
- Smaller recipe database

**Source:** [Whisk App](https://www.whisk.com/)

---

## 2. Feature Comparison Matrix

| Feature | Cookpad | Mealime | Tasty | Yummly | Whisk | **FőzzOkosan** |
|---------|---------|---------|-------|--------|-------|----------------|
| User recipes | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Social (like/comment) | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Meal planning | ✅ (paid) | ✅ | ❌ | ✅ (paid) | ✅ | ✅ |
| Shopping list | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NLP ingredient parsing** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Multi-recipe merge** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Unit conversion** | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Dietary filters | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| AI assistant | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Hungarian support | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Free tier | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Identified Gaps & Opportunities

### 3.1 Market Gaps

| Gap | Description | FőzzOkosan Solution |
|-----|-------------|---------------------|
| **No Hungarian app** | No major recipe app supports Hungarian language & units | Native Hungarian support with local units (dkg, ek, tk) |
| **No NLP parsing** | Users must manually structure ingredients | AI-powered free-text parsing with Gemini |
| **Limited merging** | Only Mealime merges, but no user recipes | Smart ingredient merging from any recipe |
| **Social + Smart** | Apps are either social OR smart, not both | Instagram-like social + AI shopping lists |

### 3.2 Opportunities

1. **Hungarian Market**
   - No competitor targets Hungarian users
   - Local measurement units (dkg, ek, csésze)
   - Hungarian ingredient names and variations

2. **NLP Innovation**
   - Free-text ingredient input (no structured forms)
   - Automatic quantity extraction
   - Unit normalization and conversion

3. **Social Shopping**
   - Generate shopping lists from friends' recipes
   - Share weekly meal plans
   - Collaborative shopping

4. **Waste Reduction**
   - Suggest recipes using leftover ingredients
   - Optimize quantities across recipes

---

## 4. NLP Approaches for Ingredient Parsing

### 4.1 Available Technologies

| Technology | Description | Pros | Cons |
|------------|-------------|------|------|
| **spaCy + NER** | Named Entity Recognition | Fast, customizable | Needs training data |
| **ingredient-parser-nlp** | Python library for parsing | Ready to use | English only |
| **Transformer models** | BERT, GPT-based | High accuracy | Resource intensive |
| **LLM APIs** | GPT-4, Gemini, Claude | Best accuracy | API costs |
| **Rule-based** | Regex patterns | Simple, fast | Limited flexibility |

### 4.2 Challenges in Ingredient Parsing

| Challenge | Example | Solution |
|-----------|---------|----------|
| Fractions | "½ kg", "fél kiló" | Regex + mapping |
| Ranges | "1-2 gerezd" | Take average or max |
| Implicit units | "3 tojás" (no unit) | Default to "db" |
| Descriptors | "finomra vágott hagyma" | Extract base ingredient |
| Ambiguity | "só ízlés szerint" | Mark as optional |
| Hungarian units | "2 ek", "5 dkg" | Custom unit mapping |

### 4.3 Recommended Approach: Google Gemini API

**Why Gemini?**
- Free tier (1,500 requests/day)
- Excellent Hungarian language support
- JSON output formatting
- No training required

**Implementation Flow:**
```
User Input: "2 evőkanál olívaolaj, fél kg csirkemell"
                    │
                    ▼
            ┌───────────────┐
            │  Gemini API   │
            │  with Prompt  │
            └───────────────┘
                    │
                    ▼
            JSON Output:
            [
              { name: "olívaolaj", qty: 2, unit: "ek" },
              { name: "csirkemell", qty: 0.5, unit: "kg" }
            ]
                    │
                    ▼
            ┌───────────────┐
            │ Unit Normalizer│
            └───────────────┘
                    │
                    ▼
            Normalized:
            [
              { name: "olívaolaj", qty: 30, unit: "ml" },
              { name: "csirkemell", qty: 500, unit: "g" }
            ]
```

### 4.4 NLP Research Sources

- [ingredient-parser-nlp (PyPI)](https://pypi.org/project/ingredient-parser-nlp/) - Python ingredient parsing library
- [spaCy NER Parser](https://github.com/vishwapardeshi/NL_Parser_using_Spacy) - Custom NER for recipes
- [Frontiers AI Research](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2020.621577/full) - NLP for nutrition analysis

---

## 5. Competitive Advantage Summary

### What Makes FőzzOkosan Unique

```
┌─────────────────────────────────────────────────────────────┐
│                    FőzzOkosan USPs                          │
├─────────────────────────────────────────────────────────────┤
│  🇭🇺 First Hungarian recipe social network                  │
│  🧠 AI-powered ingredient parsing (NLP)                     │
│  🛒 Smart shopping list with auto-merge                     │
│  📱 Instagram-like social + smart features combined         │
│  🆓 Free tier with full functionality                       │
└─────────────────────────────────────────────────────────────┘
```

### Target User Comparison

| User Need | Current Solution | FőzzOkosan |
|-----------|------------------|------------|
| Share recipes (HU) | Facebook groups | Native app |
| Shopping list | Manual notes | Auto-generated |
| Meal planning | Paper/spreadsheet | In-app planner |
| Ingredient merging | Manual calculation | Automatic |

---

## 6. Conclusion

The literature research reveals a clear gap in the market for a Hungarian recipe application that combines:

1. **Social features** (like Cookpad) - user-generated content, likes, comments
2. **Smart shopping** (like Mealime) - auto-generated, merged shopping lists
3. **AI assistance** (like Tasty) - NLP-powered ingredient parsing
4. **Free access** (like Whisk) - full features without paywall

FőzzOkosan addresses all these needs while being the **first** to:
- Support Hungarian language natively
- Parse free-text ingredients with AI
- Combine social networking with smart shopping features

---

## Related

- [February](February.md) - Development timeline
- [NLP & AI](NLP%20%26%20AI.md) - Technical implementation
- [Features](Features.md) - Complete feature list
- [Index](00%20-%20Index.md)
