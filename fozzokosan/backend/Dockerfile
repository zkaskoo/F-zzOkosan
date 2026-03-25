FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

EXPOSE 3001

# Development-only: generate prisma client, run migrations, then start dev server
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate dev --skip-generate && npm run start:dev"]
