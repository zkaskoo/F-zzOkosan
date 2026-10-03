/**
 * Kiszedi a backend által küldött hibaüzenetet egy axios-hibából.
 * A NestJS validáció tömbként is küldhet üzenetet.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const resp = (error as { response?: { data?: { message?: string | string[] } } }).response;
    const msg = resp?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) return msg.join(' ');
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
}

/** A belépés megtagadva, mert nincs megerősítve az email (HTTP 403). */
export function isEmailNotVerifiedError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    return status === 403;
  }
  return false;
}
