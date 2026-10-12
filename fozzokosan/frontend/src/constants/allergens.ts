import type { Allergen } from '../types';

/** Az allergének magyar megnevezései a felületen, kiválasztható opciókként. */
export const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: 'GLUTEN', label: 'Glutén' },
  { value: 'DAIRY', label: 'Tejtermék' },
  { value: 'EGG', label: 'Tojás' },
  { value: 'NUT', label: 'Dióféle' },
  { value: 'PEANUT', label: 'Mogyoró' },
  { value: 'SOY', label: 'Szója' },
  { value: 'FISH', label: 'Hal' },
  { value: 'SHELLFISH', label: 'Rák/Kagyló' },
  { value: 'SESAME', label: 'Szezám' },
  { value: 'CELERY', label: 'Zeller' },
  { value: 'MUSTARD', label: 'Mustár' },
  { value: 'SULPHITE', label: 'Szulfit' },
];
