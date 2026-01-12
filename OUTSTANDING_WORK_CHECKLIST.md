# NovaQuill — Outstanding Work Checklist (Priority Order)

This checklist is derived from a codebase review on **2026-01-12**. Items are ordered by priority (security/correctness first, then billing, then ops/UX).

## P0 — Correctness + security fixes (do these first)

- [ ] **Align dev/prod database configuration**
  - [ ] Update `SETUP.md` to match `prisma/schema.prisma` (PostgreSQL), remove SQLite `dev.db` guidance.
  - [ ] Decide on a supported local-dev story (local Postgres, Docker, or managed DB) and document it.

- [ ] **Stop committing local data/artifacts**
  - [ ] Remove tracked `prisma/dev.db` (and any `storage/` artifacts if present).
  - [ ] Update `.gitignore` to ignore `prisma/dev.db`, `storage/`, and other runtime artifacts.

- [ ] **Fix broken origin enforcement + rate limiting in usage tracking**
  - [ ] In `POST /api/usage`, validate origin using the *actual* request.
  - [ ] Replace timestamp-based rate limit keying with stable keys (by user/email and/or IP).

- [ ] **Harden registration endpoint**
  - [ ] Add origin validation + rate limiting to `POST /api/register`.
  - [ ] Add basic input validation (email normalize, password length policy, safe JSON parsing).

- [ ] **Harden document upload/storage endpoint**
  - [ ] Validate file size and PDF magic bytes in `POST /api/documents/create`.
  - [ ] Reject obviously invalid uploads server-side (don’t rely only on client checks).

- [ ] **Restrict analytics visibility**
  - [ ] Gate `GET /api/analytics` behind an admin allowlist (e.g., `ADMIN_EMAILS`) or remove it in production.

## P1 — Billing/subscription correctness (PayFast)

- [ ] **Improve PayFast ITN verification and robustness**
  - [ ] Validate merchant fields match your config.
  - [ ] Validate currency/amount/item for the plan purchased.
  - [ ] Add idempotency / duplicate notification handling.
  - [ ] Track subscription state beyond `PRO`/`FREE` (plan, status, timestamps, PayFast identifiers).

## P2 — Production readiness & operability

- [ ] **Add health checks**
  - [ ] Implement `GET /api/health` (DB ping; Redis ping if configured).

- [ ] **Make site URL configuration environment-driven**
  - [ ] Replace hardcoded `metadataBase: https://novaquill.com` with `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` (with safe fallback).

- [ ] **Add CI quality gates**
  - [ ] Add a `typecheck` script (`tsc --noEmit`) and run lint + typecheck in CI.

## P3 — Scale/UX follow-ups

- [ ] **Make DSAR export scalable**
  - [ ] Replace base64-in-JSON export with a streamed zip / signed URLs / async export job.

- [ ] **Improve auth gating UX**
  - [ ] Redirect unauthenticated users from `/dashboard` server-side (middleware or server components) instead of relying on 401s after render.

