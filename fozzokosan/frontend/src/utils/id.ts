/**
 * Egyedi (kliensoldali) azonosító generálása űrlap-elemekhez / React key-ekhez.
 *
 * A crypto.randomUUID() csak "secure context"-ben érhető el (HTTPS VAGY localhost).
 * Sima HTTP-n (pl. IP-címen) a crypto.randomUUID undefined, és a hívása hibát dob,
 * ami fehér képernyőhöz vezet. Ezért van determinisztikus tartalék.
 */
export function genId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // secure-context hiba esetén megyünk a tartalékra
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
