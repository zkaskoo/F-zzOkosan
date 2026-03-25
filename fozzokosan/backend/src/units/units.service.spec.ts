import { UnitsService } from './units.service';

describe('UnitsService', () => {
  let service: UnitsService;

  beforeEach(() => {
    service = new UnitsService();
  });

  describe('parseQuantity', () => {
    it('should parse numeric values', () => {
      expect(service.parseQuantity('2').value).toBe(2);
      expect(service.parseQuantity('1.5').value).toBe(1.5);
      expect(service.parseQuantity('1,5').value).toBe(1.5);
      expect(service.parseQuantity('0.25').value).toBe(0.25);
    });

    it('should parse Hungarian fraction words', () => {
      expect(service.parseQuantity('fél').value).toBe(0.5);
      expect(service.parseQuantity('negyed').value).toBe(0.25);
      expect(service.parseQuantity('háromnegyed').value).toBe(0.75);
      expect(service.parseQuantity('harmad').value).toBe(0.33);
      expect(service.parseQuantity('másfél').value).toBe(1.5);
    });

    it('should default to 1 for unparseable input', () => {
      expect(service.parseQuantity('valami').value).toBe(1);
    });
  });

  describe('normalizeUnit', () => {
    it('should return canonical unit names', () => {
      expect(service.normalizeUnit('dkg')).toBe('dkg');
      expect(service.normalizeUnit('ek')).toBe('ek');
      expect(service.normalizeUnit('tk')).toBe('tk');
    });

    it('should resolve aliases', () => {
      expect(service.normalizeUnit('evőkanál')).toBe('ek');
      expect(service.normalizeUnit('teáskanál')).toBe('tk');
      expect(service.normalizeUnit('kiló')).toBe('kg');
      expect(service.normalizeUnit('deka')).toBe('dkg');
      expect(service.normalizeUnit('liter')).toBe('l');
      expect(service.normalizeUnit('darab')).toBe('db');
    });

    it('should handle case insensitivity', () => {
      expect(service.normalizeUnit('DKG')).toBe('dkg');
      expect(service.normalizeUnit('Liter')).toBe('l');
    });

    it('should return unknown units as-is (lowercased)', () => {
      expect(service.normalizeUnit('gerezd')).toBe('gerezd');
      expect(service.normalizeUnit('szál')).toBe('szál');
    });
  });

  describe('convertToBase', () => {
    it('should convert weight units to grams', () => {
      const result = service.convertToBase(50, 'dkg');
      expect(result.quantity).toBe(500);
      expect(result.unit).toBe('g');
    });

    it('should convert kg to grams', () => {
      const result = service.convertToBase(2, 'kg');
      expect(result.quantity).toBe(2000);
      expect(result.unit).toBe('g');
    });

    it('should convert volume units to ml', () => {
      expect(service.convertToBase(2, 'ek').quantity).toBe(30);
      expect(service.convertToBase(2, 'ek').unit).toBe('ml');

      expect(service.convertToBase(1, 'tk').quantity).toBe(5);
      expect(service.convertToBase(1, 'tk').unit).toBe('ml');

      expect(service.convertToBase(2, 'dl').quantity).toBe(200);
      expect(service.convertToBase(1, 'l').quantity).toBe(1000);

      expect(service.convertToBase(1, 'csésze').quantity).toBe(250);
    });

    it('should convert csipet to grams', () => {
      const result = service.convertToBase(2, 'csipet');
      expect(result.quantity).toBe(1);
      expect(result.unit).toBe('g');
    });

    it('should pass through unconvertible units', () => {
      const result = service.convertToBase(3, 'gerezd');
      expect(result.quantity).toBe(3);
      expect(result.unit).toBe('gerezd');
    });

    it('should preserve original quantity and unit', () => {
      const result = service.convertToBase(50, 'dkg');
      expect(result.originalQuantity).toBe(50);
      expect(result.originalUnit).toBe('dkg');
    });

    it('should handle unit aliases in conversion', () => {
      const result = service.convertToBase(2, 'evőkanál');
      expect(result.quantity).toBe(30);
      expect(result.unit).toBe('ml');
    });
  });

  describe('areUnitsCompatible', () => {
    it('should detect compatible weight units', () => {
      expect(service.areUnitsCompatible('dkg', 'kg')).toBe(true);
      expect(service.areUnitsCompatible('g', 'dkg')).toBe(true);
    });

    it('should detect compatible volume units', () => {
      expect(service.areUnitsCompatible('ek', 'dl')).toBe(true);
      expect(service.areUnitsCompatible('ml', 'l')).toBe(true);
    });

    it('should detect same units', () => {
      expect(service.areUnitsCompatible('db', 'db')).toBe(true);
      expect(service.areUnitsCompatible('gerezd', 'gerezd')).toBe(true);
    });

    it('should detect incompatible units', () => {
      expect(service.areUnitsCompatible('g', 'ml')).toBe(false);
      expect(service.areUnitsCompatible('db', 'g')).toBe(false);
      expect(service.areUnitsCompatible('gerezd', 'db')).toBe(false);
    });
  });
});
