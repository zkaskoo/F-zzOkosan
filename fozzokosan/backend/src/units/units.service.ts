import { Injectable } from '@nestjs/common';

export interface ConversionResult {
  quantity: number;
  unit: string;
  originalQuantity: number;
  originalUnit: string;
}

export interface ParsedQuantity {
  value: number;
  originalText: string;
}

// Hungarian unit conversions to base units (g for weight, ml for volume)
const UNIT_CONVERSIONS: Record<string, { to: string; multiply: number }> = {
  // Weight → grams
  dkg: { to: 'g', multiply: 10 },
  kg: { to: 'g', multiply: 1000 },
  g: { to: 'g', multiply: 1 },

  // Volume → milliliters
  ek: { to: 'ml', multiply: 15 }, // evőkanál
  tk: { to: 'ml', multiply: 5 }, // teáskanál
  dl: { to: 'ml', multiply: 100 },
  l: { to: 'ml', multiply: 1000 },
  ml: { to: 'ml', multiply: 1 },
  csésze: { to: 'ml', multiply: 250 },

  // Small amounts
  csipet: { to: 'g', multiply: 0.5 },
};

// Hungarian fraction words
const FRACTIONS: Record<string, number> = {
  fél: 0.5,
  negyed: 0.25,
  háromnegyed: 0.75,
  harmad: 0.33,
  másfél: 1.5,
  kétharmad: 0.67,
};

// Unit aliases (normalize variations)
const UNIT_ALIASES: Record<string, string> = {
  evőkanál: 'ek',
  'evő kanál': 'ek',
  teáskanál: 'tk',
  'teás kanál': 'tk',
  kanál: 'ek',
  deciliter: 'dl',
  liter: 'l',
  gramm: 'g',
  kilogramm: 'kg',
  kilógramm: 'kg',
  kiló: 'kg',
  dekagramm: 'dkg',
  decagramm: 'dkg',
  deka: 'dkg',
  milliliter: 'ml',
  csészényi: 'csésze',
  db: 'db',
  darab: 'db',
  szelet: 'szelet',
  gerezd: 'gerezd',
  szál: 'szál',
  fej: 'fej',
  csokor: 'csokor',
  csomag: 'csomag',
};

@Injectable()
export class UnitsService {
  /**
   * Parse Hungarian fraction words and numbers into a numeric value
   */
  parseQuantity(text: string): ParsedQuantity {
    const trimmed = text.trim().toLowerCase();

    // Check if it's a known fraction word
    if (FRACTIONS[trimmed] !== undefined) {
      return { value: FRACTIONS[trimmed], originalText: text };
    }

    // Check for compound fractions like "másfél" at the start
    for (const [word, value] of Object.entries(FRACTIONS)) {
      if (trimmed.startsWith(word)) {
        return { value, originalText: text };
      }
    }

    // Parse numeric value (handles both "1.5" and "1,5")
    const normalized = trimmed.replace(',', '.');
    const num = parseFloat(normalized);

    if (!isNaN(num)) {
      return { value: num, originalText: text };
    }

    // Default to 1 if unparseable
    return { value: 1, originalText: text };
  }

  /**
   * Normalize a unit string to its canonical form
   */
  normalizeUnit(unit: string): string {
    const lower = unit.trim().toLowerCase();

    // Direct match
    if (UNIT_CONVERSIONS[lower]) return lower;

    // Alias match
    if (UNIT_ALIASES[lower]) return UNIT_ALIASES[lower];

    // Return as-is for units without conversion (db, gerezd, szál, etc.)
    return lower;
  }

  /**
   * Convert a quantity from one unit to its base unit (g or ml)
   */
  convertToBase(quantity: number, unit: string): ConversionResult {
    const normalizedUnit = this.normalizeUnit(unit);
    const conversion = UNIT_CONVERSIONS[normalizedUnit];

    if (!conversion) {
      // No conversion available (db, gerezd, szál, etc.)
      return {
        quantity,
        unit: normalizedUnit,
        originalQuantity: quantity,
        originalUnit: unit,
      };
    }

    return {
      quantity: Math.round(quantity * conversion.multiply * 100) / 100,
      unit: conversion.to,
      originalQuantity: quantity,
      originalUnit: unit,
    };
  }

  /**
   * Check if two units are compatible (can be merged)
   */
  areUnitsCompatible(unit1: string, unit2: string): boolean {
    const n1 = this.normalizeUnit(unit1);
    const n2 = this.normalizeUnit(unit2);

    // Same unit
    if (n1 === n2) return true;

    const c1 = UNIT_CONVERSIONS[n1];
    const c2 = UNIT_CONVERSIONS[n2];

    // Both convert to the same base unit
    if (c1 && c2 && c1.to === c2.to) return true;

    return false;
  }

  /**
   * Get all supported conversions (for API/documentation)
   */
  getSupportedConversions() {
    return {
      conversions: UNIT_CONVERSIONS,
      fractions: FRACTIONS,
      aliases: UNIT_ALIASES,
    };
  }
}
