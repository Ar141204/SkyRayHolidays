# SkyRay Holidays — architecture notes

## System map

- `apps/web`: Next.js customer website and staff admin dashboard.
- `apps/api`: NestJS REST API, Prisma data access, role checks and background integration worker.
- `apps/mobile`: React Native / Expo customer app for Android and iOS.
- PostgreSQL: authoritative store for package records, enquiries, workflow history, settings, staff and integration jobs.
- External systems: SMTP for transactional messages, Microsoft Graph for Excel Online, Google Places for authorized public reviews.

All public clients use the same `/api/v1` service. Public customer accounts are not required. The API is the source of truth; notification and workbook tasks are queued after the enquiry transaction commits.

## Main request paths

1. Website or app submits an enquiry with an idempotency key and consent.
2. API validates the request and verifies that the selected package is published.
3. One database transaction stores the enquiry, status history and three integration jobs.
4. A worker sends company/customer email and synchronizes the row in Excel independently.
5. Staff manage status, assignment and notes in `/admin`; each material operation writes an audit entry.

If an external provider is unavailable, the enquiry remains saved and the related job is visible to a Super Admin for retry.

## Trust boundaries

- Staff authentication uses a signed JWT in an HttpOnly cookie; protected routes check the current database account and role.
- Provider credentials are server-side environment values. Microsoft refresh-token data is encrypted before database storage.
- The public API does not return integration secrets. The staff API is role guarded.
- Public package and contact data are read through the API; only published package records appear publicly.

## Local development topology

`docker-compose.yml` provides PostgreSQL, API and website. Expo runs separately on the developer machine and connects to the API using `EXPO_PUBLIC_API_URL`. Physical phones need a reachable LAN/HTTPS API address rather than `localhost`.

## Horizontal scale notes

The background worker uses a database claim to avoid multiple workers claiming the same job; stale `PROCESSING` jobs can be recovered. The simple API rate limiter is process-local. Before scaling API instances, replace it with a shared Redis-backed limiter and add a dedicated queue/worker topology with operational monitoring.
