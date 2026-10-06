# Raveena Sharma — Cybersecurity Portfolio

A database-backed Next.js portfolio with a protected admin editor, PostgreSQL persistence, contact inbox, audit events, and private file upload endpoint.

## Architecture

- Next.js 14 App Router / React / TypeScript
- PostgreSQL through Prisma (`Portfolio` JSON document, `AdminUser`, `ContactMessage`, `AuditLog`)
- HS256 signed, HTTP-only, same-site session cookie; bcrypt password hashes
- Public pages read portfolio data from PostgreSQL, with a source-controlled starter document used only when the database is unavailable or not seeded
- Admin editor changes the portfolio document and public pages reflect changes after save
- Contact submissions are validated and stored in the database

## Requirements

- Node.js 20 or later and npm
- PostgreSQL 14 or later, running locally or provided by your deployment platform

No extra frontend software needs downloading. PostgreSQL is the one service you need to install or provision.

## Local setup

1. Install PostgreSQL and create an empty database named `raveena_portfolio`.
2. Edit the prepared `.env` and set `DATABASE_URL` with the PostgreSQL password you chose during installation, plus a unique `ADMIN_PASSWORD` of at least 12 characters. `SESSION_SECRET` is generated for this workspace. Percent-encode reserved URL characters in the database password (for example `@` becomes `%40`).
3. Install dependencies with `npm install`.
4. Apply the schema with `npx prisma migrate dev --name init`.
5. Insert the initial admin and portfolio data with `npm run db:seed`.
6. Start with `npm run dev`; visit `http://localhost:3000` and `/login`.

The seed command creates the admin only if absent and does not reset an existing password. Change the admin password by generating a bcrypt hash and updating `AdminUser.passwordHash` through a trusted database administration path.

## Content and uploads

`/admin` is protected on the server. The **Portfolio content** editor stores structured JSON, so content edits do not require source changes. Keep the top-level fields and record shapes consistent with `src/lib/portfolio.ts`. Contact messages and recent admin events are viewable in the console.

Upload accepts PNG, JPEG, WebP, SVG and PDF up to 8 MB, checks MIME type and file signatures, and generates random filenames. Add the returned `/uploads/...` path to `profile.portrait` or `profile.resume`. Provide a transparent cutout PNG/WebP portrait; no personal portrait was present in the supplied files. Resume PDF is included at `/resume.pdf`.

Uploads use local `public/uploads` storage. For horizontally scaled or ephemeral production hosting, replace that storage with a private object-storage bucket and signed upload flow. Configure persistent backups for the database and uploaded files.

## Deployment

Provision managed PostgreSQL, set all `.env.example` variables in the host, run `npm ci`, `npx prisma migrate deploy`, `npm run db:seed` once, and `npm run build`. Start with `npm start`. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin. Never commit `.env`.

The CSP and security headers are set in `next.config.mjs`; review them alongside hosting requirements before adding third-party analytics, remote images, or scripts. Login/contact rate limits currently use process memory and are appropriate only for a single instance; use a shared store such as Redis before multi-instance public deployment. The initial CSP allows inline scripts for the Next.js runtime; tighten it with nonces when the hosting setup is finalized.

## Admin account recovery

The admin account is provisioned by the seed process from environment variables. Passwords are bcrypt hashed; the original is never stored. For password rotation, use a secure database operation to replace `passwordHash` with a fresh bcrypt hash; do not expose public account registration.
