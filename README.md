# TPAV Class Action — setup and handover

This package extends the existing Next.js 16 / TypeScript / Prisma 7 / PostgreSQL / Better Auth project. The original authentication tables and migration history are retained. The public site uses the supplied designer logo, local Poppins fonts, illustrations, photography, colours and section structure. Public visitors have no account, password or profile.

## Install or replace your project

1. Back up your current source and PostgreSQL database.
2. Extract this ZIP into a **new folder**. Do not overlay the new `app` directory onto the old one: the old root `app/page.tsx` would conflict with the new route group.
3. Copy your existing `.env` privately into the extracted project. Keep the same `DATABASE_URL` and `BETTER_AUTH_SECRET` to retain accounts and sessions. Add the new values listed in `.env.example`. Never put `.env` in source control.
4. Use Node.js 24 LTS (tested with 24.20.0), then run:

```powershell
npm ci
npm run db:validate
npm run db:generate
npm run db:deploy
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

For development, use `npm run dev` instead of `npm run start`. Open `http://localhost:3000` and `http://localhost:3000/admin/login`.

`db:deploy` applies pending migrations only. The new `20261001080000_delivery_safety` migration adds rate-limit tables and delivery bookkeeping columns; it does not drop application tables or erase records. **Do not use `prisma migrate reset` or `db push --accept-data-loss`.** If your actual database has drifted from the supplied original migrations, resolve that drift before deploying. Use a direct database connection in `DIRECT_DATABASE_URL` when your runtime URL is pooled.

## Environment and services

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Existing PostgreSQL database; use provider-required TLS in production. |
| `DIRECT_DATABASE_URL` | Optional direct connection for migration commands. |
| `BETTER_AUTH_SECRET` | Keep your existing strong secret; for a new installation generate at least 32 random bytes. |
| `BETTER_AUTH_URL` | Exact site origin, e.g. `https://your-domain.com`. |
| `NEXT_PUBLIC_SITE_URL` | Same exact origin as above, without a trailing slash. Set before building. |
| `EMAIL_PROVIDER` | `resend`. |
| `RESEND_API_KEY` | Resend API key with permission to send from your domain. |
| `EMAIL_FROM` | Sender on a verified Resend domain, e.g. `TPAV Class Action <updates@your-domain.com>`. |
| `EMAIL_REPLY_TO` | Optional monitored reply address. |
| `BLOB_READ_WRITE_TOKEN` | Token for a **public** Vercel Blob store; optional if supplying HTTPS image URLs. |
| `CRON_SECRET` | Separate random secret for the email worker. |
| `TRUST_PROXY` | Set `true` only if your hosting proxy overwrites `x-forwarded-for`. Defaults to a conservative shared public request limit. |

Generate secrets with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Generate each secret separately; do not publish the result.

The implementation uses the [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [Vercel Blob server uploads](https://vercel.com/docs/vercel-blob/server-upload). No uploads are written to the application filesystem. Images are restricted to JPG/PNG/WebP, capped at 3 MB, decoded with a pixel limit, stripped of metadata and converted to WebP. Existing HTTPS image URLs also work. Unused uploaded objects are retained to avoid deleting an image that another post may reference; remove unused objects through the storage provider after checking references.

## Scheduled email delivery

`vercel.json` requests a worker run every minute. Your hosting plan must support that frequency. Alternatively, use an external scheduler to call:

```text
GET https://your-domain.com/api/cron/email
Authorization: Bearer YOUR_CRON_SECRET
```

The worker sends up to 10 messages per invocation, with a 40-second work budget and a 60-second route timeout. For a larger subscriber list, increase scheduler capacity deliberately and respect your email provider's rate limits. The **Process queue** button can run a batch manually. A configured secret alone does not prove that the scheduler is running: confirm delivery logs after deployment.

Recipients are snapshotted when a campaign is queued. Only verified, subscribed recipients qualify; eligibility is checked again before sending. Database leases coordinate overlapping workers. The exact message body and provider idempotency key are reused on retry. Resend retains [idempotency keys for 24 hours](https://resend.com/changelog/idempotency-keys); this application closes uncertain retries after 23 hours or five attempts and records a failure for manual investigation. Never automatically resend an uncertain delivery with a new key. Logs marked SENT mean provider acceptance, not proven inbox delivery. Bounce/complaint webhooks and open/click tracking are not implemented; use the provider dashboard for those events and configure its suppression settings.

## Admin account and acceptance walkthrough

Your existing admin account continues to work. No default password is shipped. On a fresh database only, run `npm run admin:create` and follow the terminal prompts. The password is hidden and must be 12–128 characters. This command refuses to overwrite an existing account. No public registration page or endpoint is enabled, and non-admin users cannot create login sessions.

1. Sign in at `/admin/login`; confirm the overview and navigation load.
2. Create a blog draft with an excerpt, rich content, image, slug and SEO fields. Confirm it is absent from `/updates`.
3. Publish it. Dates in the editor are explicitly **UTC**; a future publish date hides the article until that time. Tick **Notify verified subscribers on publish** only for immediate publication. It queues one notification campaign per post; later edits do not repeatedly notify subscribers. For a scheduled post, queue its notification by editing it after its publish date.
4. Subscribe through the homepage using an inbox you control. Open the verification email and explicitly confirm. Verification links expire after 24 hours and can be used once. Opening a link alone does not change subscription state, protecting against email-link scanners.
5. In Subscribers, check verified/subscribed status. Unsubscribe and request reactivation: reactivation requires the recipient to confirm again. A resend has a two-minute per-address cooldown. Deleting a subscriber anonymises their delivery history and removes their subscription record.
6. Create a manual email campaign, review its content, then confirm queuing it. Run the worker and inspect individual delivery logs. Queued/sent messages are immutable; only draft campaigns can be deleted.
7. Follow an email's unsubscribe link and confirm opt-out. Email providers also have an RFC 8058 one-click POST endpoint. Unsubscribe links are opaque bearer tokens; redact tokens from hosting request logs and avoid sharing them.
8. Save Settings, check the public pages, then log out and confirm admin pages require sign-in again.

## Content to finish before launch

In **Settings**, enter your contact email, approved author's story, privacy policy, terms, and any real social profile URLs. The designer archive supplied layout/demo text, not approved legal wording or the author's factual story. These pages intentionally show an honest unpublished message until populated. The contact page uses the configured email address. Homepage copy describes an expression of interest; it does not assert that subscribing enrols someone in litigation.

## Security and operational notes

- Every admin page data read and mutation checks the server session and admin role. Mutation routes check the exact request origin. Better Auth handles password hashing and session cookies; its rate limiter uses PostgreSQL.
- Subscriber verification tokens are stored as hashes. Opt-out tokens are random and only authorize unsubscribing. Consent is explicit on signup; verification time and subscription status are recorded.
- Rich content is sanitised both on write and public render. Slugs, dates, email addresses, image URLs, payload sizes and settings are validated. Public pages expose only published posts whose publish time has arrived.
- Concurrent edits to a blog use its last-updated timestamp to reject stale saves. Notification queuing and recipient selection are transactional.
- Credentials live only in server environment variables. Errors returned to visitors avoid database details. Set up your host's error monitoring, PostgreSQL backups and a log-retention policy.
- The package keeps existing application data and does not contain test accounts, database dumps, email transport mocks or credentials. Temporary browser testing used a separate database.

## Tests

`npm test` runs input-validation and HTML-sanitisation tests. `npm run test:e2e` uses Playwright with installed Chrome and an already-running local app. Supply `E2E_BASE_URL`, `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` for the browser admin tests, using an isolated test database. The mail round-trip test additionally requires a test-only intercepted outbox; it is skipped without `E2E_OUTBOX_PATH`. Expired-link database tests refuse to modify databases unless `E2E_DATABASE_URL` names a database containing `tpav_codex_test_`.

See `VERIFICATION.md` for the actual handover checks and limitations. Live Resend delivery and real Blob upload require your credentials and must be smoke-tested after configuration.
