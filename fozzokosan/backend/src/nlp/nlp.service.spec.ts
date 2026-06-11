import { ConfigService } from '@nestjs/config';
import { NlpService } from './nlp.service';
import { UnitsService } from '../units/units.service';

function createService(apiKey?: string): NlpService {
  const configService = {
    get: jest.fn().mockReturnValue(apiKey),
  } as unknown as ConfigService;
  return new NlpService(configService, new UnitsService());
}

describe('NlpService', () => {
  describe('isConfigured', () => {
    it('should be false without API key', () => {
      expect(createService().isConfigured()).toBe(false);
    });

    it('should be false with placeholder API key', () => {
      expect(createService('your-gemini-api-key').isConfigured()).toBe(false);
    });
  });

  describe('fallbackParse', () => {
    let service: NlpService;

    beforeEach(() => {
      service = createService();
    });

    it('should parse quantity with unit: "2 ek olaj"', () => {
      expect(service.fallbackParse('2 ek olaj')).toEqual([
        { name: 'olaj', quantity: 2, unit: 'ek' },
      ]);
    });

    it('should parse Hungarian fraction words: "fél kg liszt"', () => {
      expect(service.fallbackParse('fél kg liszt')).toEqual([
        { name: 'liszt', quantity: 0.5, unit: 'kg' },
      ]);
    });

    it('should default to db for unitless counts: "3 tojás"', () => {
      expect(service.fallbackParse('3 tojás')).toEqual([
        { name: 'tojás', quantity: 3, unit: 'db' },
      ]);
    });

    it('should return null quantity for "só ízlés szerint"', () => {
      expect(service.fallbackParse('só ízlés szerint')).toEqual([
        { name: 'só', quantity: null, unit: '' },
      ]);
    });

    it('should average ranges: "1-2 gerezd fokhagyma"', () => {
      expect(service.fallbackParse('1-2 gerezd fokhagyma')).toEqual([
        { name: 'fokhagyma', quantity: 1.5, unit: 'gerezd' },
      ]);
    });

    it('should resolve unit aliases: "2 evőkanál olívaolaj"', () => {
      expect(service.fallbackParse('2 evőkanál olívaolaj')).toEqual([
        { name: 'olívaolaj', quantity: 2, unit: 'ek' },
      ]);
    });

    it('should resolve "kiló" alias: "fél kiló csirkemell"', () => {
      expect(service.fallbackParse('fél kiló csirkemell')).toEqual([
        { name: 'csirkemell', quantity: 0.5, unit: 'kg' },
      ]);
    });

    it('should parse decimal comma: "1,5 dl tejszín"', () => {
      expect(service.fallbackParse('1,5 dl tejszín')).toEqual([
        { name: 'tejszín', quantity: 1.5, unit: 'dl' },
      ]);
    });

    it('should split on commas and newlines', () => {
      const result = service.fallbackParse(
        '2 ek olívaolaj, fél kg csirkemell\n3 gerezd fokhagyma',
      );
      expect(result).toEqual([
        { name: 'olívaolaj', quantity: 2, unit: 'ek' },
        { name: 'csirkemell', quantity: 0.5, unit: 'kg' },
        { name: 'fokhagyma', quantity: 3, unit: 'gerezd' },
      ]);
    });

    it('should return null quantity for name-only segments', () => {
      expect(service.fallbackParse('petrezselyem')).toEqual([
        { name: 'petrezselyem', quantity: null, unit: '' },
      ]);
    });

    it('should return empty array for empty input', () => {
      expect(service.fallbackParse('')).toEqual([]);
      expect(service.fallbackParse('  ,  \n ')).toEqual([]);
    });

    it('should parse multi-word names: "2 db zöld paprika"', () => {
      expect(service.fallbackParse('2 db zöld paprika')).toEqual([
        { name: 'zöld paprika', quantity: 2, unit: 'db' },
      ]);
    });
  });

  describe('parseIngredients without API key', () => {
    it('should use the rule-based fallback', async () => {
      const service = createService();
      const result = await service.parseIngredients('2 ek olaj, só ízlés szerint');
      expect(result).toEqual([
        { name: 'olaj', quantity: 2, unit: 'ek' },
        { name: 'só', quantity: null, unit: '' },
      ]);
    });
  });

  describe('parseIngredients with Gemini', () => {
    let service: NlpService;
    let generateContent: jest.Mock;

    beforeEach(() => {
      service = createService();
      generateContent = jest.fn();
      (service as any).model = { generateContent };
    });

    function mockGeminiResponse(text: string) {
      generateContent.mockResolvedValue({
        response: { text: () => text },
      });
    }

    it('should parse a valid JSON response', async () => {
      mockGeminiResponse(
        '[{"name": "olívaolaj", "quantity": 2, "unit": "ek"}]',
      );
      const result = await service.parseIngredients('2 ek olívaolaj');
      expect(result).toEqual([
        { name: 'olívaolaj', quantity: 2, unit: 'ek' },
      ]);
    });

    it('should extract JSON from markdown code blocks', async () => {
      mockGeminiResponse(
        '```json\n[{"name": "liszt", "quantity": 0.5, "unit": "kg"}]\n```',
      );
      const result = await service.parseIngredients('fél kg liszt');
      expect(result).toEqual([{ name: 'liszt', quantity: 0.5, unit: 'kg' }]);
    });

    it('should accept null quantity ("ízlés szerint")', async () => {
      mockGeminiResponse('[{"name": "só", "quantity": null, "unit": ""}]');
      const result = await service.parseIngredients('só ízlés szerint');
      expect(result).toEqual([{ name: 'só', quantity: null, unit: '' }]);
    });

    it('should filter out structurally invalid items', async () => {
      mockGeminiResponse(
        '[{"name": "olaj", "quantity": 2, "unit": "ek"}, {"name": 5, "quantity": "sok", "unit": null}]',
      );
      const result = await service.parseIngredients('2 ek olaj');
      expect(result).toEqual([{ name: 'olaj', quantity: 2, unit: 'ek' }]);
    });

    it('should fall back to rule-based parsing on API error', async () => {
      generateContent.mockRejectedValue(new Error('API unavailable'));
      const result = await service.parseIngredients('2 ek olaj');
      expect(result).toEqual([{ name: 'olaj', quantity: 2, unit: 'ek' }]);
    });

    it('should fall back when the response contains no JSON', async () => {
      mockGeminiResponse('Sajnálom, nem tudom feldolgozni.');
      const result = await service.parseIngredients('3 tojás');
      expect(result).toEqual([{ name: 'tojás', quantity: 3, unit: 'db' }]);
    });
  });
});
