/**
 * Validates that a URL string starts with http:// or https://.
 * Returns true only for valid HTTP(S) URLs, preventing javascript: URIs
 * and other potentially dangerous schemes.
 */
export function isValidImageUrl(url?: string | null): url is string {
  return !!url && /^https?:\/\//.test(url);
}
