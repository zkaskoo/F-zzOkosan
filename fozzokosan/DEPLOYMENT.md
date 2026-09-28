# FőzzOkosan – Deployment útmutató (ingyenes)

Ez az útmutató a rendszer élesítését írja le a felhasználói teszteléshez, **0 Ft** költséggel.

## Architektúra

| Réteg | Szolgáltatás | Ingyenes |
|---|---|---|
| Adatbázis (PostgreSQL) | **Neon** | 0,5 GB, tartós |
| Backend (NestJS) | **Render** | free web service (15 perc után elalszik, ~1 perc feléledés) |
| Frontend (React/Vite) | **Vercel** | Hobby |
| NLP | **Google Gemini** | ingyenes kvóta |

A kód-oldali előkészítés kész: `render.yaml` (a repó gyökerében), `fozzokosan/frontend/vercel.json`, környezetfüggő API-URL, CORS env-alapú beállítás, `/api/health` health-check.

> **Repó-szerkezet:** a GitHub repó (`F-zzOkosan`) gyökerében van a `render.yaml`, és az alkalmazás a **`fozzokosan/` almappában** található (`fozzokosan/backend`, `fozzokosan/frontend`). Ezért fontosak lentebb a `fozzokosan/...` elérési utak.

---

## 1. lépés – Neon (adatbázis)

1. Regisztrálj: https://neon.tech (GitHub-bal a leggyorsabb).
2. Hozz létre egy projektet: név `fozzokosan`, régió Europe (Frankfurt).
3. Másold ki a **connection stringet** (Dashboard → Connect).
   - **Fontos:** a migrációkhoz a **közvetlen (nem pooled)** kapcsolatot használd, tehát ahol az endpoint NEM tartalmazza a `-pooler` részt. A `?sslmode=require` maradjon a végén.
   - Példa: `postgresql://<user>:<pass>@ep-xxx.eu-central-1.aws.neon.tech/fozzokosan?sslmode=require`
4. Ezt a sztringet fogjuk `DATABASE_URL`-ként használni.

## 2. lépés – Kód a GitHubon

A Render és a Vercel is GitHubról deployol. Győződj meg róla, hogy a legfrissebb kód (a deployment-configokkal együtt) fel van tolva:
```bash
git push origin main
```
Repo: https://github.com/zkaskoo/F-zzOkosan

## 3. lépés – Render (backend)

1. Regisztrálj: https://render.com (Connect GitHub).
2. **New → Blueprint**, válaszd ki a repót. A Render felismeri a `render.yaml`-t, és létrehozza a `fozzokosan-backend` szolgáltatást.
3. A telepítés előtt állítsd be a kézi env változókat (a `sync: false`-al jelölteket):
   - `DATABASE_URL` = a Neon **közvetlen** connection stringje (1. lépés)
   - `GEMINI_API_KEY` = a Google AI Studio kulcsod (opcionális; nélküle a szabályalapú NLP-tartalék fut)
   - `CORS_ORIGIN` = egyelőre hagyd üresen, az 5. lépés után töltjük ki
   - (`JWT_SECRET` automatikusan generálódik)
4. **Apply / Create** → az első build indul. A `startCommand` automatikusan lefuttatja a `prisma migrate deploy`-t, tehát a táblák létrejönnek a Neonban.
5. A kész backend URL-je: `https://fozzokosan-backend.onrender.com` (a pontosat a Render kiírja).
6. Ellenőrzés: nyisd meg a `https://.../api/health` címet → `{"status":"ok"}`.

## 4. lépés – Tesztadat feltöltése a Neonba

A migráció létrehozza a táblákat, de üresek. A demo-adatot (felhasználók + ~90 recept) a saját gépedről töltheted fel a Neonba mutatva:

```bash
cd fozzokosan/backend
DATABASE_URL="<Neon közvetlen connection string>" npm run db:seed
DATABASE_URL="<Neon közvetlen connection string>" npm run db:seed:bulk
```

(Ezt egyszer kell lefuttatni. Idempotens: újrafuttatva nem hoz létre duplikátumot.)

## 5. lépés – Vercel (frontend)

1. Regisztrálj: https://vercel.com (Connect GitHub).
2. **Add New → Project**, válaszd ki a repót.
3. Beállítások:
   - **Root Directory:** `fozzokosan/frontend`
   - **Framework Preset:** Vite (általában automatikus)
   - **Environment Variables:** `VITE_API_URL` = a Render backend URL-je (a `/api` nélkül!), pl. `https://fozzokosan-backend.onrender.com`
4. **Deploy.** A kész frontend URL-je pl. `https://fozzokosan.vercel.app`.

## 6. lépés – CORS bekötése

1. Menj vissza a Renderre → `fozzokosan-backend` → Environment.
2. `CORS_ORIGIN` = a Vercel URL, pl. `https://fozzokosan.vercel.app`
3. Mentés → a Render automatikusan újraindul.

## 7. lépés – Végső ellenőrzés

- Nyisd meg a Vercel URL-t, regisztrálj egy tesztfiókot, böngéssz a receptek között, generálj bevásárlólistát.
- Ha az első kérés lassú (~1 perc), az a Render hidegindítása — normális.

---

## Ismert korlátok (a demóban elfogadható)

- **Render hidegindítás:** 15 perc tétlenség után az első kérés ~1 perc. Teszt előtt „melegítsd be" egy `/api/health` hívással, vagy szólj a tesztelőknek.
- **Feltöltött képek nem maradnak meg:** a Render ingyenes fájlrendszere ideiglenes, újraindításkor a feltöltött receptképek elvesznek. A teszteléshez javasolt **külső kép-URL** használata (a seed-receptek is így működnek). Tartós képtárhoz S3/Cloudinary kellene (későbbi bővítés).
- Az ingyenes csomagok feltételei változhatnak.

## Környezeti változók összefoglalva

| Változó | Hol | Érték |
|---|---|---|
| `DATABASE_URL` | Render | Neon közvetlen connection string |
| `JWT_SECRET` | Render | automatikusan generált |
| `JWT_EXPIRES_IN` | Render | `7d` |
| `GEMINI_API_KEY` | Render | Google AI Studio kulcs (opcionális) |
| `CORS_ORIGIN` | Render | a Vercel frontend URL |
| `NODE_ENV` | Render | `production` |
| `VITE_API_URL` | Vercel | a Render backend URL (`/api` nélkül) |
