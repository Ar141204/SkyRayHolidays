# SkyRay Holidays — connected travel platform

A multi-platform starter implementation based on **SkyRay Holidays Product Requirements Document v1.0** (uploaded 10 November 2026). The repository contains a responsive Next.js website and staff dashboard, a NestJS REST API with PostgreSQL/Prisma, a React Native/Expo application for Android and iOS, and an interactive static product preview.

> **Delivery status:** source code and preview assets are included. This is a production-oriented foundation, not a deployed or launch-certified travel business. It has not been built against live provider accounts in this environment because package installation could not complete. Run the build/test steps below in your development environment before accepting it as production-ready.

## Project map

```text
skyray-holidays/
├── apps/
│   ├── web/                 Next.js website + /admin staff console
│   ├── api/                 NestJS REST API + Prisma/PostgreSQL
│   └── mobile/              Expo React Native app (Android + iOS)
├── preview/                 Interactive website / app / admin preview
├── docs/                    Architecture, deployment and API notes
├── docker-compose.yml
├── .env.example
└── package.json             npm workspaces and project scripts
```

## Features in this source tree

### Customer website

- Home, About, Packages, package detail, Hajj & Umrah, Contact, enquiry, Privacy and Terms pages.
- Responsive navigation, destination-led hero, package cards, pilgrimage promotion and reviews fallback.
- Package catalogue search, category/type filtering and sort controls.
- Enquiry fields aligned to the PRD: full name, phone, email, member count, package selection, preferred date, duration, instructions and privacy acknowledgement.
- Phone/email/map/WhatsApp contact actions appear only when configured business values are available.
- Development-only preview packages are used if the API is unavailable. Production does **not** substitute demo data when the API is down.

### Admin web console (`/admin`)

- Staff sign-in (no public registration) and role enforcement at API routes.
- Dashboard metrics are calculated from PostgreSQL records.
- Enquiry search/list, status changes, CSV export and staff notes API.
- Package creation and editing for details, price, itinerary/departure-date/inclusion/exclusion JSON, pilgrimage-specific detail fields and publish/unpublish workflow. Images are currently entered by approved URL/path; upload and ordering need a separate media-storage implementation.
- Staff provisioning for Super Admin, plus team listing.
- Business contact settings editor, integration job visibility and retry actions.
- Audit records for login, package changes, staff provisioning, settings and enquiry status changes.

### API (`/api/v1`)

- NestJS, TypeScript, Prisma and PostgreSQL.
- Published package read endpoints; protected package create/update endpoints.
- Enquiry validation, consent requirement, future-date validation, unique human-readable reference, package-name snapshot, idempotency key and initial status-history record.
- Enquiry record and three durable integration jobs are created in one database transaction.
- Role-based access control; active staff record is checked per authenticated request so disabled staff cannot keep using a stale JWT.
- A lightweight per-process enquiry rate limit; use Redis-backed distributed throttling before horizontally scaling the API.
- CSV export and operational audit trail.
- SMTP notifications and Microsoft Graph Excel Online jobs are processed independently of the enquiry save.
- Google Places review retrieval uses an authorized Place ID/API key and returns a non-fabricated pending fallback when unconfigured.

### Android and iOS app

- One Expo/React Native TypeScript project with native navigation, Home, Packages, Hajj & Umrah, About, Contact, package detail and enquiry screens.
- Shares the same API and published packages as the website.
- Enquiry submission includes mobile source metadata and an idempotency key.
- Configure device-reachable `EXPO_PUBLIC_API_URL` before running on a physical phone.

## Local development

### Prerequisites

- Node.js 22 LTS and npm 10 or later.
- Docker Desktop / Docker Engine with Compose, or a PostgreSQL 16 instance.
- For mobile builds: Expo tooling; Android Studio for Android native builds; macOS + Xcode for iOS native builds.

### 1. Install and configure

From the repository root:

```bash
cp .env.example .env
# Edit .env. Set a unique PostgreSQL password and a random JWT_SECRET.
npm install
```

Generate a JWT secret using:

```bash
openssl rand -base64 48
```

Set `JWT_SECRET` to the output. Leave integration settings empty until the relevant business-owned provider accounts are available. Never commit `.env`.

### 2. Start PostgreSQL and create the schema

```bash
docker compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
```

The seed creates `SiteSettings` and draft package records. It creates a Super Admin **only** when all three of these variables are set before the seed runs:

- `SEED_ADMIN_NAME`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD` (minimum 14 characters)

Provision with a temporary strong password, then rotate/remove it from your environment. Do not create a shared default admin login.

### 3. Start API and website

Use separate terminals from the repository root:

```bash
npm run dev:api
npm run dev:web
```

- Website: `http://localhost:3000`
- Staff console: `http://localhost:3000/admin`
- API health: `http://localhost:4000/api/v1/health`
- API packages: `http://localhost:4000/api/v1/packages`

The API loads root `.env` using `dotenv`. Next.js reads its own `.env.local` or shell environment. The default public API URL is `http://localhost:4000/api/v1`; set `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` when it differs.

### 4. Start mobile app

Create `apps/mobile/.env` with an API URL reachable from your device:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000/api/v1
```

Replace the LAN IP with your development computer's local IP. Then run:

```bash
npm run dev:mobile
```

Open the Expo project on Android or iOS. A phone's `localhost` points to the phone, not your development computer.

## Mobile release preparation

The Expo project includes branded icon/splash artwork and `apps/mobile/eas.json` build profiles. Run Android builds from a configured Android toolchain or use EAS Build; iOS archive/TestFlight delivery requires Apple Developer credentials and a macOS/Xcode or EAS build environment. The app package is not signed or published by this source archive.

## Docker starting point

After `.env` is configured:

```bash
docker compose up --build -d
```

This Compose setup is a local/staging starting point. For production, deploy behind HTTPS ingress, place secrets in a managed secret store, isolate PostgreSQL from public access, configure backups and restore drills, and add monitoring/alerting. The web container needs the correct `NEXT_PUBLIC_API_URL` at build time for browser-side calls and `API_INTERNAL_URL` for server-side calls.

## API reference

### Public endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | API and database health |
| GET | `/api/v1/packages` | Published package list; optional `?kind=TOUR\|HAJJ\|UMRAH` |
| GET | `/api/v1/packages/:slug` | Published package detail |
| POST | `/api/v1/enquiries` | Save customer enquiry |
| GET | `/api/v1/settings/public` | Verified public contact settings |
| GET | `/api/v1/integrations/google-reviews` | Authorized Google review sample or pending fallback |
| GET | `/api/v1/integrations/microsoft/callback` | Microsoft OAuth redirect handler |

For an enquiry, send JSON with `fullName`, `phone`, `email`, `members`, `preferredDate` (ISO date), `days` and `consent: true`. Include a unique `Idempotency-Key` header. Optional fields are `packageId`, `packageName`, `instructions` and `sourcePlatform`. The API returns a reference only after the transaction commits.

### Staff endpoints

Authenticate with `POST /api/v1/auth/login`. The API returns a bearer token and sets an HttpOnly session cookie. Use the cookie in same-origin requests or the bearer token for API clients.

| Method | Endpoint | Permission / purpose |
|---|---|---|
| POST | `/api/v1/auth/login` | Staff login |
| POST | `/api/v1/auth/logout` | Clear session cookie |
| GET | `/api/v1/auth/me` | Current active staff identity |
| GET | `/api/v1/admin/dashboard` | Role-authorized database metrics |
| GET | `/api/v1/admin/enquiries` | Search/list enquiries; supports page, take, search and status |
| GET | `/api/v1/admin/staff-directory` | Active staff options for enquiry assignment (Super Admin / Enquiry Manager) |
| PATCH | `/api/v1/admin/enquiries/:id/status` | Change status and write history |
| POST | `/api/v1/admin/enquiries/:id/notes` | Add internal note |
| PATCH | `/api/v1/admin/enquiries/:id/assign` | Assign staff member |
| GET | `/api/v1/admin/enquiries/export` | CSV export (authorized roles) |
| GET | `/api/v1/admin/packages` | Staff package list |
| GET | `/api/v1/admin/jobs` | Integration job health/list |
| POST | `/api/v1/admin/jobs/:id/retry` | Super Admin retry |
| GET | `/api/v1/admin/users` | Super Admin staff list |
| POST | `/api/v1/admin/users` | Super Admin provision staff |
| PATCH | `/api/v1/admin/users/:id/access` | Super Admin enable/disable staff |
| POST | `/api/v1/packages` | Content Manager / Super Admin draft creation |
| PATCH | `/api/v1/packages/:id` | Content Manager / Super Admin package update/publish |
| PATCH | `/api/v1/settings` | Super Admin update public contact settings |
| GET | `/api/v1/integrations/microsoft/connect-url` | Super Admin start Microsoft OAuth |
| GET | `/api/v1/integrations/microsoft/status` | Super Admin connection status |

Status values: `NEW`, `PENDING`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `NOT_INTERESTED`, `CLOSED`, `SPAM`.

## External integrations

### SMTP email

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` and `ENQUIRY_NOTIFICATION_EMAIL`. Company and customer email jobs are processed in the background. If SMTP is not configured, those jobs become `BLOCKED`; the enquiry itself remains safely stored. Use authenticated sender domains and monitor provider delivery/bounce events.

### Microsoft 365 Excel Online

The integration uses a delegated Microsoft Graph authorization-code flow. Create an Entra app registration and configure:

- `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_REDIRECT_URI`
- Delegated Graph `Files.ReadWrite` (and `User.Read` for the sign-in scope)
- `MS_TOKEN_ENCRYPTION_KEY` (32 bytes, base64-encoded)
- `MS_DRIVE_ID`, `MS_WORKBOOK_ITEM_ID`, `MS_TABLE_NAME`

Generate the encryption key with `openssl rand -base64 32`. The designated Super Admin signs in to Microsoft through the `/integrations/microsoft/connect-url` endpoint. The resulting token data is encrypted using AES-256-GCM before it is stored in PostgreSQL. The Excel table's first column must contain the immutable enquiry reference; the sync checks that key before appending and updates the matching row on retry. Confirm the workbook columns, location and permissions with the workbook owner first. Workbook row operations require delegated access; use the current Microsoft Graph permissions documentation when setting up the tenant.

### Google reviews

Set `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` and optionally `GOOGLE_REVIEWS_URL` only after the business owner authorizes the correct Google Business listing. The Places API returns a provider-limited review sample; this platform does not invent review text or ratings and does not promise every historical review.

### WhatsApp, phone and maps

Use Admin → Settings to enter verified contact details. The public site reads contact settings from `/settings/public`. WhatsApp remains hidden until the business number is configured. Store the number in international format; the front end strips punctuation before creating the `wa.me` link.

## Preview and screenshots

The interactive preview is a static design showcase (not a running deployment), independent of the live API, and contains **illustrative demo content** only:

- Open `preview/index.html` in a browser, or run `python -m http.server 8000` from the repository root and visit `http://localhost:8000/preview/`.
- Use the preview tabs to switch between Website, Mobile application and Admin dashboard.
- Screenshots are in `preview/website-preview.png`, `preview/mobile-preview.png` and `preview/admin-preview.png`.

The included web/mobile logo is a temporary crop from the PRD concept board, not a source-quality approved logo. The destination SVGs are illustrative artwork, not licensed photography. Replace both with official approved brand/media assets for release.

## Known release gaps / launch checklist

This codebase is a functional foundation, but do not describe it as go-live ready until these items are completed and tested:

1. Install dependencies and run `npm run build:web` and `npm run build:api`; fix any toolchain-specific issues before deployment. Package installation could not complete in the creation environment, so no successful production build is claimed here.
2. Implement and test a Redis-backed rate limiter for multi-instance deployment, brute-force login throttling, MFA, password reset and documented account recovery. The current enquiry limiter is in-memory and per-process.
3. Add a complete CMS for Home/About/footer sections and secure media upload/storage; the package editor supports structured text and JSON fields but not direct image upload/order.
4. Extend the enquiry workspace with follow-up dates, contact-attempt outcomes and a full activity timeline. The admin currently supports assignment, status updates and internal notes; the API also stores status history.
5. Validate the Graph workbook table schema against the client's actual Microsoft 365 workbook, handle tenant-specific consent/token revocation and exercise refresh/retry behavior end-to-end.
6. Complete genuine Google Business authorization, SMTP sender verification, workbook and package data entry, and publish only business-approved content.
7. Replace the placeholder Privacy and Terms pages with approved Indian privacy disclosures, retention and deletion policy, cancellation/refund terms and business contact/legal entity information.
8. Replace all illustration assets with approved media and the original high-resolution logo.
9. Run automated unit/API/browser tests, WCAG 2.2 AA checks, security review, dependency scanning, load tests and a database backup/restore drill.
10. Build and test signed Android and iOS releases on physical devices, add store screenshots/privacy declarations, and publish using company-owned Play Console and Apple Developer accounts.

The PRD's out-of-scope features remain out of scope for this release: online payments, automated flight ticket issuance, live flight/hotel inventory, flight tracking, automatic visa approval, customer loyalty accounts and a full ERP.
