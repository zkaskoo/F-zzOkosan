# FőzzOkosan – Telepítés saját VPS-re (Docker Compose)

Éles környezet egyetlen `docker compose up`-pal: **PostgreSQL + NestJS backend + nginx (statikus frontend + reverse proxy)**.

## Architektúra

```
Internet ──▶ nginx (80)  ─┬─ /            → React statikus build
                          ├─ /api/        → backend:3001 (REST API)
                          └─ /uploads/    → backend:3001 (képek)
                                    │
                           backend (NestJS, belső)
                                    │
                            db (PostgreSQL, belső, volume)
```
Csak az **nginx** van kifelé nyitva (80-as port). A backend és a DB csak a belső Docker-hálózaton érhető el.

---

## 1. Előfeltételek a VPS-en (Ubuntu példa)

```bash
# Docker + Compose plugin telepítése
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # majd lépj ki/vissza, hogy érvényes legyen
docker compose version          # ellenőrzés
```

Ajánlott gép: **2 vCPU / 4 GB RAM / 40 GB SSD** (minimum 2 GB RAM + 2 GB swap a buildhez).

## 2. Kód a szerverre

```bash
git clone <a-repo-url>
cd <repo>/fozzokosan
```

## 3. Környezeti változók

```bash
cp .env.prod.example .env
nano .env    # töltsd ki: erős POSTGRES_PASSWORD és JWT_SECRET, opcionálisan GEMINI_API_KEY
```
Erős titok generálása: `openssl rand -base64 48`

## 4. Indítás

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
Ez felépíti a képeket, elindítja a DB-t, lefuttatja a **migrációkat automatikusan**, majd elindítja a backendet és az nginxet.
Az app ezután elérhető: **http://A-SZERVER-IP-CÍME**

Állapot / logok:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## 5. Demó-adatok feltöltése (egyszeri, opcionális)

Üres adatbázisnál a receptek/felhasználók feltöltése + képek hozzárendelése:
```bash
docker compose -f docker-compose.prod.yml exec backend npx ts-node prisma/seed.ts
docker compose -f docker-compose.prod.yml exec backend npx ts-node prisma/seed-bulk.ts
docker compose -f docker-compose.prod.yml exec backend node prisma/match-images.js
```
(A `match-images.js` valódi ételfotókat tölt le a receptekhez a `/app/uploads` volume-ba.)

> **Alternatíva – a jelenlegi adataid átvitele:** a helyi adatbázisod lementése és visszatöltése:
> ```bash
> # helyi gépen:
> docker exec fozzokosan-db pg_dump -U fozzokosan fozzokosan > dump.sql
> # a VPS-en (a stack fut):
> cat dump.sql | docker compose -f docker-compose.prod.yml exec -T db psql -U fozzokosan -d fozzokosan
> ```
> A képeket a `backend/uploads` mappából másold a VPS-re és töltsd a volume-ba, vagy futtasd a `match-images.js`-t.

## 6. Frissítés új verzióra

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## 7. Leállítás

```bash
docker compose -f docker-compose.prod.yml down           # konténerek leállítása (adatok megmaradnak)
docker compose -f docker-compose.prod.yml down -v        # + a volume-ok TÖRLÉSE (adatvesztés!)
```

---

## HTTPS (ajánlott éles használatra)

A domain + ingyenes Let's Encrypt tanúsítvány legegyszerűbben egy Caddy, vagy egy nginx+certbot réteggel tehető be. A minimál lépések nginx+certbot esetén:

1. Mutasson a domained A-rekordja a VPS IP-jére.
2. Nyisd meg a 443-as portot a compose-ban (az nginx service-nél) és vegyél fel egy TLS server blokkot a `frontend/nginx.conf`-ba a tanúsítványokkal.
3. A tanúsítványt szerezd be certbottal (pl. egy külön certbot konténerrel vagy a hoston), és mountold az nginxbe.

Ha szeretnéd, ezt a TLS-réteget is összerakom (domain megadásával).

---

## Hibaelhárítás

| Tünet | Teendő |
|---|---|
| Build OOM (megáll) | 2 GB swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` |
| 502 az nginxen | A backend még indul (migráció). `docker compose -f docker-compose.prod.yml logs backend` |
| Nincsenek képek | Futtasd az 5. pont `match-images.js` lépését |
| DB kapcsolat hiba | Ellenőrizd a `.env` POSTGRES_* értékeit; `docker compose ... logs db` |
