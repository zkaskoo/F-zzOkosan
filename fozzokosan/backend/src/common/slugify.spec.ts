import { slugify } from './slugify';

describe('slugify', () => {
  it('should convert Hungarian accented characters', () => {
    expect(slugify('Házi hamburger')).toBe('hazi-hamburger');
    expect(slugify('Túrós csusza')).toBe('turos-csusza');
    expect(slugify('Marhapörkölt nokedlivel')).toBe('marhaporkolt-nokedlivel');
    expect(slugify('Hűtött őszibarackleves')).toBe('hutott-oszibarackleves');
  });

  it('should replace special characters with hyphens', () => {
    expect(slugify('BBQ oldalas (csípős!)')).toBe('bbq-oldalas-csipos');
    expect(slugify('Tej & tojás')).toBe('tej-tojas');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('  Almás pite  ')).toBe('almas-pite');
    expect(slugify('!!!Pizza!!!')).toBe('pizza');
  });

  it('should return empty string for non-alphanumeric input', () => {
    expect(slugify('!!!')).toBe('');
  });
});
