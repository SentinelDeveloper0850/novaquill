# NovaQuill — Outstanding Work Checklist (Priority Order)

This checklist is derived from a codebase review on **2026-01-12**. Items are ordered by priority (security/correctness first, then billing, then ops/UX).

## P0 — Correctness + security fixes (do these first)

- [x] **Align dev/prod database configuration**
  - [x] Update `SETUP.md` to match `prisma/schema.prisma` (PostgreSQL), remove SQLite `dev.db` guidance.
  - [x] Decide on a supported local-dev story (local Postgres, Docker, or managed DB) and document it.

- [x] **Stop committing local data/artifacts**
  - [x] Remove tracked `prisma/dev.db` (and any `storage/` artifacts if present). _(No such tracked artifacts currently present.)_
  - [x] Update `.gitignore` to ignore `prisma/dev.db`, `storage/`, and other runtime artifacts.

- [x] **Fix broken origin enforcement + rate limiting in usage tracking**
  - [x] In `POST /api/usage`, validate origin using the *actual* request.
  - [x] Replace timestamp-based rate limit keying with stable keys (by user/email and/or IP).

- [x] **Harden registration endpoint**
  - [x] Add origin validation + rate limiting to `POST /api/register`.
  - [x] Add basic input validation (email normalize, password length policy, safe JSON parsing).

- [x] **Harden document upload/storage endpoint**
  - [x] Validate file size and PDF magic bytes in `POST /api/documents/create`.
  - [x] Reject obviously invalid uploads server-side (don’t rely only on client checks).

- [x] **Restrict analytics visibility**
  - [x] Gate `GET /api/analytics` behind an admin allowlist (`ADMIN_EMAILS`).

## P1 — Billing/subscription correctness (PayFast)

- [x] **Improve PayFast ITN verification and robustness**
  - [x] Validate merchant fields match your config (basic `merchant_id` check).
  - [x] Validate currency/amount/item for the plan purchased.
  - [x] Add idempotency / duplicate notification handling (store ITNs via `PayfastEvent`).
  - [x] Track subscription state beyond `PRO`/`FREE` (adds `subscriptionPlan`, `lastPaymentAt`, `payfastLastPaymentId`).

## P2 — Production readiness & operability

- [x] **Add health checks**
  - [x] Implement `GET /api/health` (DB ping; Redis ping if configured).

- [x] **Make site URL configuration environment-driven**
  - [x] Replace hardcoded `metadataBase: https://novaquill.com` with `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` (with safe fallback).

- [x] **Add CI quality gates**
  - [x] Add a `typecheck` script (`tsc --noEmit`) and run lint + typecheck in CI.

## P3 — Scale/UX follow-ups

- [x] **Make DSAR export scalable**
  - [x] Replace base64-in-JSON export with metadata + per-document download URLs.

- [x] **Improve auth gating UX**
  - [x] Redirect unauthenticated users away from `/dashboard` (client-side guard).

