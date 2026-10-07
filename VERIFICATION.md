# Verification report

Completed 2 October 2026. Checks ran against a separate local PostgreSQL test database, not the user's existing application database.

| Check | Result |
| --- | --- |
| Prisma schema validation | Passed |
| Prisma 7.10 client generation | Passed |
| All three migrations on isolated PostgreSQL | Passed |
| Migrated database versus schema diff | No differences |
| ESLint | Passed, zero errors/warnings |
| TypeScript strict check | Passed |
| Production `npm run build` | Passed, Next.js 16.3.8 |
| Unit tests | 4 passed |
| Playwright / Chrome browser and security tests | 4 passed |
| npm dependency audit | 0 reported vulnerabilities |

The browser suite verifies desktop/mobile homepage rendering without horizontal overflow; unauthenticated admin redirects; admin login; draft creation and public hiding; editing/publishing and public visibility; manual campaign creation; subscriber and settings screens; mobile navigation; logout; subscribing; confirmation email content; verification; reused-token rejection; campaign queuing and worker processing; per-recipient unsubscribe links; opt-out; cron/upload authorization; foreign-origin rejection; disabled public signup; non-admin login rejection; expired verification tokens; and malformed-token rejection.

Desktop and mobile screenshots were visually inspected. The original designer files supplied the logo, colours, fonts, illustration, photography and layout. Mobile grids/overflow and FAQ controls were repaired. Name and consent inputs were added. Public password/account instructions were replaced with the required subscription-only flow.

Email API calls were intercepted by a **test-only transport outside the delivered project**. No real subscribers were emailed during testing. This checks application flow and payloads, not deliverability or domain configuration. Real Resend delivery, a real Vercel Blob upload, and your production scheduler require a final smoke test with your own configured services. No provider credentials were available for those external checks.

The new migration is additive. Existing source migrations are preserved. The original desktop project and its database were not modified. The ZIP excludes `.env`, credentials, test fixtures/data, `node_modules`, `.next`, generated Prisma client files, traces, caches and temporary mail interception code.

Known launch requirements: configure environment variables, deploy migrations, activate the email scheduler, and enter approved contact/story/privacy/terms content in Settings. See `SETUP.md` for exact steps and the admin acceptance walkthrough. A passing test suite is not a guarantee against all future defects or hosting/provider failures.
