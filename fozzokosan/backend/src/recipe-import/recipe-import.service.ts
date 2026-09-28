import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { NlpService, ParsedRecipeDraft } from '../nlp/nlp.service';

const ALLOWED_HOSTS = new Set([
  'instagram.com',
  'www.instagram.com',
  'm.instagram.com',
]);

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  'Accept-Language': 'hu-HU,hu;q=0.9,en;q=0.8',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

export interface RecipeImportResult {
  draft: ParsedRecipeDraft;
  /** honnan jött a nyersszöveg: 'url' = sikeres Instagram-lekérés, 'text' = beillesztett szöveg */
  source: 'url' | 'text';
  /** a feldolgozott nyersszöveg (a felhasználó ellenőrizheti / szerkesztheti) */
  caption: string;
}

@Injectable()
export class RecipeImportService {
  private readonly logger = new Logger(RecipeImportService.name);

  constructor(private readonly nlpService: NlpService) {}

  async import(params: {
    url?: string;
    text?: string;
  }): Promise<RecipeImportResult> {
    let caption = (params.text || '').trim();
    let source: 'url' | 'text' = 'text';

    if (!caption && params.url) {
      caption = await this.fetchInstagramCaption(params.url);
      source = 'url';
    }

    if (!caption) {
      throw new BadRequestException(
        'Adj meg egy Instagram linket, vagy illeszd be a recept szövegét.',
      );
    }

    const draft = await this.nlpService.parseRecipe(caption);
    return { draft, source, caption };
  }

  /**
   * A publikus Instagram poszt oldal lekérése és a leírás kinyerése.
   * Csak instagram.com hostokat enged (SSRF-védelem).
   */
  async fetchInstagramCaption(rawUrl: string): Promise<string> {
    const url = this.validateInstagramUrl(rawUrl);

    let html: string;
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: 'follow',
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      html = await res.text();
    } catch (error) {
      this.logger.warn(
        `Instagram lekérés sikertelen (${url}): ${String(error)}`,
      );
      throw new UnprocessableEntityException(
        'Nem sikerült elérni az Instagram bejegyzést. Másold be a leírás szövegét kézzel.',
      );
    }

    const caption = this.extractCaption(html);
    if (!caption) {
      throw new UnprocessableEntityException(
        'Nem sikerült kiolvasni a leírást az Instagram linkből (lehet, hogy privát vagy bejelentkezést kér). Másold be a szöveget kézzel.',
      );
    }
    return caption;
  }

  private validateInstagramUrl(rawUrl: string): string {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl.trim());
    } catch {
      throw new BadRequestException('Érvénytelen URL.');
    }

    if (parsed.protocol !== 'https:') {
      throw new BadRequestException(
        'Csak https:// Instagram linket lehet megadni.',
      );
    }
    if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
      throw new BadRequestException(
        'Csak instagram.com linket lehet importálni.',
      );
    }
    // Csak a path marad, a lekérdezési paramétereket elhagyjuk
    return `https://www.instagram.com${parsed.pathname}`;
  }

  /**
   * Réteges kinyerés a poszt HTML-jéből:
   * 1) ld+json "caption" / "articleBody"
   * 2) og:description meta (a "X likes, Y comments - user on Instagram:" előtag levágásával)
   */
  private extractCaption(html: string): string | null {
    const fromLdJson = this.extractFromLdJson(html);
    if (fromLdJson) return fromLdJson;

    const ogDescription = this.extractMeta(html, 'og:description');
    if (ogDescription) {
      return this.cleanOgDescription(ogDescription);
    }
    return null;
  }

  private extractFromLdJson(html: string): string | null {
    const regex =
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]) as Record<string, unknown>;
        const caption =
          (typeof data.caption === 'string' && data.caption) ||
          (typeof data.articleBody === 'string' && data.articleBody) ||
          (typeof data.description === 'string' && data.description);
        if (caption && caption.trim().length > 0) {
          return this.decodeEntities(caption.trim());
        }
      } catch {
        // következő ld+json blokk
      }
    }
    return null;
  }

  private extractMeta(html: string, property: string): string | null {
    const patterns = [
      new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`,
        'i',
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`,
        'i',
      ),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return this.decodeEntities(match[1]);
      }
    }
    return null;
  }

  /**
   * Az og:description tipikus alakja:
   *   123 likes, 4 comments - felhasznalo on Instagram: "IGAZI LEÍRÁS"
   * Ha idézőjelek közti rész van, azt adjuk vissza; egyébként az egészet.
   */
  private cleanOgDescription(text: string): string {
    const quoted = text.match(/[:\-]\s*["“](.+)["”]\s*$/s);
    if (quoted?.[1]) {
      return quoted[1].trim();
    }
    const afterColon = text.match(/on Instagram:\s*(.+)$/s);
    if (afterColon?.[1]) {
      return afterColon[1].replace(/^["“]|["”]$/g, '').trim();
    }
    return text.trim();
  }

  private decodeEntities(text: string): string {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\\n/g, '\n')
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );
  }
}
