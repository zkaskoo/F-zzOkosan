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
      // gemini-2.5-flash: a 2026-os free tierben elérhető modell
      // (a gemini-2.0-flash kvótája az új kulcsokon 0)
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

  isConfigured(): boolean {
    return !!this.model;
  }
}
