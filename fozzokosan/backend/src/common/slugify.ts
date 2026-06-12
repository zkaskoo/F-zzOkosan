/**
 * URL-barát slug készítése magyar szövegből.
 * "Házi hamburger" → "hazi-hamburger"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // ékezetes betűk felbontása (í → i + ékezet)
    .replace(/[̀-ͯ]/g, '') // ékezetek eldobása (á→a, ő→o, ű→u)
    .replace(/[^a-z0-9]+/g, '-') // minden nem alfanumerikus → kötőjel
    .replace(/^-+|-+$/g, ''); // kötőjelek levágása a szélekről
}
