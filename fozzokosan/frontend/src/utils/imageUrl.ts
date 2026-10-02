/**
 * Validates an image URL. Elfogad abszolút http(s) URL-t, valamint a saját
 * szerverről származó, relatív /uploads/... útvonalat (feltöltött és seed-képek).
 * A javascript: és egyéb veszélyes sémák így továbbra is kiszűrődnek.
 */
export function isValidImageUrl(url?: string | null): url is string {
  if (!url) return false;
  return /^https?:\/\//.test(url) || url.startsWith('/uploads/');
}
