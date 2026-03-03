# NovaQuill Setup Guide

## Supported local development database story

NovaQuill uses **PostgreSQL** in `prisma/schema.prisma`, and the supported local setup is:

- **Dockerized PostgreSQL 16** via `docker-compose.dev.yml`

Using a local Postgres container keeps local/dev/prod behavior aligned and avoids drift.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## 1) Start local PostgreSQL

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts PostgreSQL on `localhost:5432` with:

- database: `novaquill`
- user: `postgres`
- password: `postgres`

To stop it:

```bash
docker compose -f docker-compose.dev.yml down
```

To stop and remove the DB volume:

```bash
docker compose -f docker-compose.dev.yml down -v
```

## 2) Create `.env.local`

Create a `.env.local` file in the project root:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/novaquill?schema=public"

# App URL + auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"

# Storage encryption (AES-256-GCM key in base64)
STORAGE_ENCRYPTION_KEY="replace-with-32-byte-base64-key"

# Optional auth providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""

# Optional additional allowed origins (hostnames, comma-separated)
ALLOWED_ORIGINS="localhost:3000"

# Optional PayFast sandbox values
PAYFAST_ENV="sandbox"
PAYFAST_MERCHANT_ID=""
PAYFAST_MERCHANT_KEY=""
PAYFAST_PASSPHRASE=""

NODE_ENV="development"
```

### Generate required secrets

```bash
# NEXTAUTH_SECRET (base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# STORAGE_ENCRYPTION_KEY (base64, 32 bytes)
openssl rand -base64 32
```

## 3) Install dependencies

```bash
npm install
```

## 4) Initialize Prisma and database schema

```bash
npm run postinstall
npx prisma db push
```

## 5) Start the app

```bash
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm run typecheck
```

## Runtime artifacts

Local runtime artifacts are intentionally ignored by git:

- `prisma/dev.db`
- `storage/`

Do not commit runtime-generated data.
