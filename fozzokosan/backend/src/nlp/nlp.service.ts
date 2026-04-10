import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

const SYSTEM_PROMPT = `Te egy magyar nyelvű recept hozzávaló elemző vagy.
A felhasználó magyar nyelvű szabadszöveges hozzávalólistát ad meg, és neked JSON tömböt kell visszaadnod.

Minden elemnek tartalmaznia kell:
- "name": a hozzávaló neve (kisbetűvel, magyarul)
- "quantity": a mennyiség (szám, pl. 0.5 ha "fél")
- "unit": az egység (g, kg, dkg, ml, dl, l, ek, tk, db, csésze, csipet, gerezd, szál, fej, csokor, csomag, szelet)
- "notes": opcionális megjegyzés (pl. "finomra vágva", "apróra kockázva")

Magyar szóalakok kezelése:
- "fél" = 0.5, "negyed" = 0.25, "másfél" = 1.5
- "evőkanál" = "ek", "teáskanál" = "tk", "darab" = "db"
- "kiló" / "kilogramm" = "kg", "deka" / "dekagramm" = "dkg"

Példa bemenet: "2 evőkanál olívaolaj, fél kiló csirkemell, 3 gerezd fokhagyma finomra vágva"
Példa kimenet:
[
  {"name": "olívaolaj", "quantity": 2, "unit": "ek"},
  {"name": "csirkemell", "quantity": 0.5, "unit": "kg"},
  {"name": "fokhagyma", "quantity": 3, "unit": "gerezd", "notes": "finomra vágva"}
]

CSAK a JSON tömböt add vissza, semmi mást.`;

@Injectable()
export class NlpService {
  private readonly logger = new Logger(NlpService.name);
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your-gemini-api-key') {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  async parseIngredients(text: string): Promise<ParsedIngredient[]> {
    if (!this.model) {
      this.logger.warn('Gemini API kulcs nincs konfigurálva, visszatérés üres eredménnyel');
      return [];
    }

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nBemenet:\n' + text }] },
      ]);

      const response = result.response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        this.logger.warn('Nem sikerült JSON-t kinyerni a válaszból');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]) as ParsedIngredient[];

      // Validate structure
      return parsed.filter(
        (item) =>
          typeof item.name === 'string' &&
          typeof item.quantity === 'number' &&
          typeof item.unit === 'string',
      );
    } catch (error) {
      this.logger.error('Gemini API hiba:', error);
      return [];
    }
  }

  isConfigured(): boolean {
    return !!this.model;
  }
}
