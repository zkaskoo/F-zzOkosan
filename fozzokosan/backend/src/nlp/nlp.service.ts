import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UnitsService } from '../units/units.service';

export interface ParsedIngredient {
  name: string;
  // null = nincs konkrét mennyiség (pl. "ízlés szerint")
  quantity: number | null;
  unit: string;
  notes?: string;
}

export type ParsedDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ParsedRecipeDraft {
  title: string;
  description: string | null;
  servings: number | null;
  cookingTime: number | null;
  difficulty: ParsedDifficulty | null;
  ingredients: ParsedIngredient[];
  steps: string[];
}

const SYSTEM_PROMPT = `Te egy magyar nyelvű recept hozzávaló elemző vagy.
A felhasználó magyar nyelvű szabadszöveges hozzávalólistát ad meg, és neked JSON tömböt kell visszaadnod.

Minden elemnek tartalmaznia kell:
- "name": a hozzávaló neve (kisbetűvel, magyarul)
- "quantity": a mennyiség (szám, pl. 0.5 ha "fél"), vagy null ha nincs konkrét mennyiség
- "unit": az egység (g, kg, dkg, ml, dl, l, ek, tk, db, csésze, csipet, gerezd, szál, fej, csokor, csomag, szelet)
- "notes": opcionális megjegyzés (pl. "finomra vágva", "apróra kockázva")

Magyar szóalakok kezelése:
- "fél" = 0.5, "negyed" = 0.25, "másfél" = 1.5
- "evőkanál" = "ek", "teáskanál" = "tk", "darab" = "db"
- "kiló" / "kilogramm" = "kg", "deka" / "dekagramm" = "dkg"
- "ízlés szerint" = quantity: null, unit: ""
- tartomány (pl. "1-2 gerezd") = a két érték átlaga (1.5)
- ha csak darabszám van egység nélkül (pl. "3 tojás") = unit: "db"

Példa bemenet: "2 evőkanál olívaolaj, fél kiló csirkemell, só ízlés szerint"
Példa kimenet:
[
  {"name": "olívaolaj", "quantity": 2, "unit": "ek"},
  {"name": "csirkemell", "quantity": 0.5, "unit": "kg"},
  {"name": "só", "quantity": null, "unit": ""}
]

CSAK a JSON tömböt add vissza, semmi mást.`;

const RECIPE_SYSTEM_PROMPT = `Te egy magyar recept-kinyerő asszisztens vagy.
A bemenet egy szabadszöveges recept (pl. egy közösségi média poszt vagy Instagram leírás),
amely hashtageket, emojikat, linkeket és fölösleges reklámszöveget is tartalmazhat.
Nyerd ki belőle a receptet, és CSAK egy JSON objektumot adj vissza a következő mezőkkel:
- "title": rövid, magyar recept cím (string)
- "description": 1-2 mondatos leírás, vagy null
- "servings": adagok száma egész számként, vagy null
- "cookingTime": elkészítési idő percben egész számként, vagy null
- "difficulty": "EASY" | "MEDIUM" | "HARD", becsüld meg, vagy null
- "ingredients": tömb, minden elem {"name": string (kisbetűvel, magyarul), "quantity": szám vagy null, "unit": string, "notes": opcionális string}
- "steps": az elkészítési lépések tömbje (rövid magyar mondatok, helyes sorrendben)

Egység- és mennyiség-szabályok (mint a hozzávaló-elemzésnél):
- "fél" = 0.5, "negyed" = 0.25, "másfél" = 1.5
- egységek: g, kg, dkg, ml, dl, l, ek, tk, db, csésze, csipet, gerezd, szál, fej, csokor, csomag, szelet
- "evőkanál" = "ek", "teáskanál" = "tk", "darab" = "db", "kiló" = "kg", "deka" = "dkg"
- "ízlés szerint" = quantity: null, unit: ""
- ha csak darabszám van egység nélkül (pl. "3 tojás") = unit: "db"

Hagyd ki a hashtageket, emojikat, linkeket és a reklámszöveget.
Ha egy mező nem állapítható meg, használj null-t (vagy üres tömböt a listáknál).
CSAK a JSON objektumot add vissza, semmi mást.`;

const TASTE_PHRASES = ['ízlés szerint', 'izlés szerint', 'ízlés szerinti'];

@Injectable()
export class NlpService {
  private readonly logger = new Logger(NlpService.name);
  private model: any;
  private readonly knownUnits: Set<string>;
  private readonly fractions: Record<string, number>;

  constructor(
    private configService: ConfigService,
    private unitsService: UnitsService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your-gemini-api-key') {
      const genAI = new GoogleGenerativeAI(apiKey);
      // A modell env-ből felülírható (GEMINI_MODEL), mert a Google időnként
      // kivezet régi modelleket új kulcsokhoz. Alapértelmezett: gemini-3.8-flash.
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.8-flash';
      this.model = genAI.getGenerativeModel({ model: modelName });
      this.logger.log(`Gemini modell: ${modelName}`);
    }

    const { conversions, fractions, aliases } =
      this.unitsService.getSupportedConversions();
    this.fractions = fractions;
    this.knownUnits = new Set([
      ...Object.keys(conversions),
      ...Object.keys(aliases),
      ...Object.values(aliases),
    ]);
  }

  async parseIngredients(text: string): Promise<ParsedIngredient[]> {
    if (!this.model) {
      this.logger.warn(
        'Gemini API kulcs nincs konfigurálva, szabály alapú feldolgozás',
      );
      return this.fallbackParse(text);
    }

    try {
      const result = await this.model.generateContent(
        SYSTEM_PROMPT + '\n\nBemenet:\n' + text,
      );

      const response = result.response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        this.logger.warn(
          'Nem sikerült JSON-t kinyerni a válaszból, szabály alapú feldolgozás',
        );
        return this.fallbackParse(text);
      }

      const parsed = JSON.parse(jsonMatch[0]) as ParsedIngredient[];

      // Validate structure
      return parsed.filter(
        (item) =>
          typeof item.name === 'string' &&
          (typeof item.quantity === 'number' || item.quantity === null) &&
          typeof item.unit === 'string',
      );
    } catch (error) {
      this.logger.error('Gemini API hiba, szabály alapú feldolgozás:', error);
      return this.fallbackParse(text);
    }
  }

  /**
   * Szabály alapú magyar hozzávaló-elemző, ha a Gemini API nem elérhető.
   * Szegmensenként (vessző/sortörés): [mennyiség] [egység] név
   */
  fallbackParse(text: string): ParsedIngredient[] {
    // A vessző szegmenshatár, kivéve számjegyek között (tizedesvessző: "1,5")
    return text
      .split(/[;\n]+|(?<=\D),|,(?=\D|$)/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0)
      .map((segment) => this.parseSegment(segment))
      .filter((item): item is ParsedIngredient => item !== null);
  }

  private parseSegment(segment: string): ParsedIngredient | null {
    let working = segment.toLowerCase();
    let toTaste = false;

    for (const phrase of TASTE_PHRASES) {
      if (working.includes(phrase)) {
        toTaste = true;
        working = working.replace(phrase, ' ').trim();
      }
    }

    const tokens = working.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return null;

    let quantity: number | null = null;
    let unit = '';
    let index = 0;

    const parsedQuantity = this.parseQuantityToken(tokens[0]);
    if (parsedQuantity !== null) {
      quantity = parsedQuantity;
      index = 1;
    }

    if (index < tokens.length && this.knownUnits.has(tokens[index])) {
      unit = this.unitsService.normalizeUnit(tokens[index]);
      index += 1;
    }

    const name = tokens.slice(index).join(' ').trim();
    if (!name) return null;

    if (toTaste) {
      return { name, quantity: null, unit: '' };
    }

    // Darabszám egység nélkül (pl. "3 tojás") → db
    if (quantity !== null && !unit) {
      unit = 'db';
    }

    return { name, quantity, unit };
  }

  /**
   * Mennyiség token értelmezése: szám ("2", "1,5"), tartomány ("1-2" → átlag),
   * vagy magyar törtszó ("fél" → 0.5). null, ha nem mennyiség.
   */
  private parseQuantityToken(token: string): number | null {
    if (this.fractions[token] !== undefined) {
      return this.fractions[token];
    }

    const rangeMatch = token.match(/^(\d+(?:[.,]\d+)?)-(\d+(?:[.,]\d+)?)$/);
    if (rangeMatch) {
      const low = parseFloat(rangeMatch[1].replace(',', '.'));
      const high = parseFloat(rangeMatch[2].replace(',', '.'));
      return (low + high) / 2;
    }

    if (/^\d+(?:[.,]\d+)?$/.test(token)) {
      return parseFloat(token.replace(',', '.'));
    }

    return null;
  }

  /**
   * Teljes recept kinyerése szabadszövegből (pl. Instagram leírásból).
   * Gemini-vel, ha elérhető; egyébként minimális tartalék-vázlat.
   */
  async parseRecipe(text: string): Promise<ParsedRecipeDraft> {
    const clean = (text || '').trim();
    if (!clean) {
      return this.emptyRecipeDraft();
    }

    if (!this.model) {
      this.logger.warn(
        'Gemini API kulcs nincs konfigurálva, minimális recept-vázlat',
      );
      return this.fallbackRecipe(clean);
    }

    try {
      const result = await this.model.generateContent(
        RECIPE_SYSTEM_PROMPT + '\n\nBemenet:\n' + clean,
      );
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        this.logger.warn('Nem sikerült JSON-t kinyerni, recept-fallback');
        return this.fallbackRecipe(clean);
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      return this.normalizeRecipeDraft(parsed, clean);
    } catch (error) {
      this.logger.error('Gemini recept-kinyerés hiba, fallback:', error);
      return this.fallbackRecipe(clean);
    }
  }

  private normalizeRecipeDraft(
    parsed: Record<string, unknown>,
    original: string,
  ): ParsedRecipeDraft {
    const asString = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null;
    const asInt = (v: unknown): number | null => {
      const n = typeof v === 'string' ? parseInt(v, 10) : (v as number);
      return typeof n === 'number' && Number.isFinite(n) && n > 0
        ? Math.round(n)
        : null;
    };

    const difficultyRaw = asString(parsed.difficulty)?.toUpperCase();
    const difficulty: ParsedDifficulty | null =
      difficultyRaw === 'EASY' ||
      difficultyRaw === 'MEDIUM' ||
      difficultyRaw === 'HARD'
        ? difficultyRaw
        : null;

    const ingredients: ParsedIngredient[] = Array.isArray(parsed.ingredients)
      ? (parsed.ingredients as Record<string, unknown>[])
          .filter((item) => item && typeof item.name === 'string')
          .map((item) => ({
            name: (item.name as string).trim(),
            quantity: typeof item.quantity === 'number' ? item.quantity : null,
            unit: typeof item.unit === 'string' ? item.unit : '',
            notes:
              typeof item.notes === 'string' && item.notes.trim()
                ? item.notes.trim()
                : undefined,
          }))
      : [];

    const steps: string[] = Array.isArray(parsed.steps)
      ? (parsed.steps as unknown[])
          .filter(
            (s): s is string => typeof s === 'string' && s.trim().length > 0,
          )
          .map((s) => s.trim())
      : [];

    const title =
      asString(parsed.title) ??
      this.firstLineAsTitle(original) ??
      'Importált recept';

    return {
      title,
      description: asString(parsed.description),
      servings: asInt(parsed.servings),
      cookingTime: asInt(parsed.cookingTime),
      difficulty,
      ingredients,
      steps,
    };
  }

  /**
   * Gemini nélküli tartalék: a szöveget nyersen visszaadjuk, hogy a
   * felhasználó kézzel tudja pontosítani az űrlapon.
   */
  private fallbackRecipe(text: string): ParsedRecipeDraft {
    return {
      title: this.firstLineAsTitle(text) ?? 'Importált recept',
      description: text.length > 500 ? text.slice(0, 500) + '…' : text,
      servings: null,
      cookingTime: null,
      difficulty: null,
      ingredients: [],
      steps: [],
    };
  }

  private emptyRecipeDraft(): ParsedRecipeDraft {
    return {
      title: '',
      description: null,
      servings: null,
      cookingTime: null,
      difficulty: null,
      ingredients: [],
      steps: [],
    };
  }

  private firstLineAsTitle(text: string): string | null {
    const firstLine = text
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.length > 0);
    if (!firstLine) return null;
    return firstLine.length > 100 ? firstLine.slice(0, 100) : firstLine;
  }

  isConfigured(): boolean {
    return !!this.model;
  }
}
