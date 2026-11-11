# SkyRay Holidays — Connected Travel & Pilgrimage Platform

> **"Explore. Plan. Travel."** — The all-in-one travel technology platform for SkyRay Holidays, delivering curated domestic escapes, international tours, and sacred Hajj & Umrah journeys across Web, iOS, and Android.

---

## Overview

SkyRay Holidays is a modern, full-stack travel platform architected as a TypeScript monorepo using npm workspaces. The platform features an **enquiry-first custom quote model**, presenting authentic high-resolution destination photography and structured itineraries while masking fixed prices to encourage personalized consultations.

### Core Ecosystem
- **Customer Web Portal & Admin Console (`apps/web`)**: Next.js 15 (App Router), React 19, responsive desktop & mobile navigation, destination showcase, and an internal staff management dashboard (`/admin`).
- **Mobile Application (`apps/mobile`)**: React Native & Expo (Android & iOS) with native navigation, spacious travel feeds, offline fallback packages, and seamless WhatsApp/enquiry dispatch.
- **Backend REST API (`apps/api`)**: NestJS, Prisma ORM, PostgreSQL, role-based JWT authentication with HttpOnly cookies, login rate limiting, and durable background integration jobs.

---

## Highlights & Features

### 1. Customer Web Portal (`apps/web`)
- **Redesigned Navbar**: Prominent brand logo aligned to the far-left corner, centered navigation links (**Home**, **About**, **Packages**, **Hajj & Umrah**, **Contact**), and dedicated **Admin Panel** + **Enquire Now** buttons on the far-right corner.
- **14 Curated Travel Packages**:
  - **Within India (Domestic)**: Kashmir Paradise, Kerala God’s Own Country, Golden Triangle Heritage, Andaman Emerald Islands, Goa Coastal Escape.
  - **Surrounding Destinations**: Sri Lanka Wonder Island, Maldives Luxury Lagoon Escape, Nepal Himalayan Splendor.
  - **International**: Dubai Holiday, Turkey Cappadocia & Istanbul, Bali Island Tropical, Europe Grand Discovery.
  - **Sacred Pilgrimage**: Premium Hajj Package (Holy Kaaba in Mecca), Premium Umrah Package (Prophet's Mosque in Madinah).
- **Enquiry-First Pricing**: Transparent **"Price on Enquiry"** / **"Custom Quote"** badges across cards, detail sheets, and exploration grids.
- **Authentic Photography**: High-resolution travel photography across all destinations, including the Holy Kaaba in Mecca, Prophet's Mosque in Madinah, and scenic tropical panoramas.
- **Dynamic Enquiry Form**: Multi-field booking requests with member count, package selection, preferred departure date, duration, special requirements, and privacy consent.

### 2. Staff Admin Console (`/admin`)
- **Role-Based Access Control**: Strict permissions enforced via NestJS guards (`SUPER_ADMIN`, `ENQUIRY_MANAGER`, `CONTENT_MANAGER`).
- **Enquiry Pipeline**: Real-time management across statuses: `NEW`, `PENDING`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `CLOSED`, `SPAM`.
- **Catalogue Management**: Create, edit, publish, and unpublish tour and pilgrimage packages with inclusions, exclusions, and itineraries.
- **Audit Trail & CSV Export**: Immutable operational history for staff actions, package updates, and one-click enquiry data exports.

### 3. Mobile Application (`apps/mobile`)
- **Spacious & Clean Layout**: Designed with generous white space, fluid scrolling, and branded headers displaying the official SkyRay Holidays logo.
- **Dedicated Pilgrimage Section**: Sacred Hajj & Umrah showcase banner on the home screen linking to dedicated pilgrimage packages with authentic Mecca and Madinah imagery.
- **Dual Action Cards**: Prominent `View Details →` and `Enquire Now` buttons on every tour card.
- **Instant WhatsApp Integration**: Floating action and header buttons for 1-tap customer chat support.

### 4. Backend Engine (`apps/api`)
- **PostgreSQL with Prisma ORM**: ACID-compliant transaction safety for enquiries and integration jobs.
- **Security & Rate Limiting**: In-memory sliding window brute-force login protection (`LoginRateGuard`), Helmet HTTP headers, CORS origin whitelisting, and HttpOnly session cookies.
- **Durable Integration Workers**:
  - **SMTP Transporter**: Email confirmations to pilgrims/travelers and immediate admin notifications.
  - **Microsoft Graph**: Delegated OAuth sync with Microsoft 365 Excel Online workbooks.
  - **Google Places**: Authoritative Google Reviews retrieval with fallback handling.

---

## Project Structure

```text
skyray-holidays/
├── apps/
│   ├── web/                    # Next.js 15 Website & Staff Dashboard (/admin)
│   │   ├── app/                # App Router (pages: /, /packages, /hajj-umrah, /admin, etc.)
│   │   ├── components/         # SiteHeader, PackageGrid, PilgrimageExplorer, AdminConsole
│   │   ├── lib/                # Config, API clients, and mock data fallbacks
│   │   └── public/             # Brand logos & high-res destination photography
│   │
│   ├── mobile/                 # React Native & Expo Mobile Application
│   │   ├── assets/             # Brand assets, app icons, and bundled destination photos
│   │   ├── src/
│   │   │   ├── screens/        # HomeScreen, PackagesScreen, PilgrimageScreen, PackageDetailScreen
│   │   │   ├── components/     # UI design system, BrandHeader, Badges, Buttons
│   │   │   ├── navigation/     # Bottom Tab and Native Stack navigation
│   │   │   └── lib/            # API integration, fallback catalogue, and asset loaders
│   │   ├── app.json            # Expo project configuration
│   │   └── eas.json            # Expo Application Services build profiles
│   │
│   └── api/                    # NestJS REST API Server
│       ├── src/
│       │   ├── auth/           # Staff JWT auth, roles, and session management
│       │   ├── packages/       # Tour and pilgrimage catalogue services & controllers
│       │   ├── enquiries/      # Customer enquiry pipeline & idempotency
│       │   ├── integrations/   # Microsoft Graph, SMTP email, Google Reviews
│       │   ├── common/         # Login rate limit guard, audit interceptor
│       │   └── prisma/         # PrismaService and database lifecycle
│       └── prisma/
│           ├── schema.prisma   # PostgreSQL database schema
│           └── seed.ts         # Database seeder (settings, super admin, packages)
│
├── docker-compose.yml          # Container configuration for PostgreSQL, API, and Web
├── .env.example                # Canonical environment variable template
├── .gitignore                  # Monorepo git exclusion configuration
├── SETUP.md                    # Detailed developer & DevOps onboarding guide
└── package.json                # Root workspaces and unified lifecycle scripts
```

---

## Quick Start

### 1. Prerequisites
- **Node.js**: v20+ LTS or v22 LTS
- **npm**: v10+
- **Docker & Docker Compose**: (Optional, recommended for PostgreSQL)

### 2. Installation
Clone the repository and install all workspace dependencies from the root:

```bash
git clone https://github.com/your-org/skyray-holidays.git
cd skyray-holidays
npm install
```

### 3. Environment Configuration
Copy the template and configure your secrets:

```bash
cp .env.example .env
```

Generate a secure JWT secret:
```bash
openssl rand -base64 48
```
Paste this value into `JWT_SECRET` in `.env`.

### 4. Database Setup (PostgreSQL)
Start the PostgreSQL container:

```bash
docker compose up -d postgres
```

Generate Prisma client, apply migrations, and seed initial packages and settings:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Running the Monorepo

Open separate terminal tabs or run concurrently:

```bash
# Start NestJS API (http://localhost:4000)
npm run dev:api

# Start Next.js Website & Admin Portal (http://localhost:3000)
npm run dev:web

# Start Expo Mobile App Bundler (http://localhost:8081)
npm run dev:mobile
```

---

## Available npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev:web` | Starts Next.js development server on port `3000` |
| `npm run dev:api` | Starts NestJS API with hot-reload on port `4000` |
| `npm run dev:mobile` | Starts Expo Metro bundler on port `8081` |
| `npm run build:web` | Produces an optimized Next.js production build (`standalone`) |
| `npm run build:api` | Compiles NestJS backend into `apps/api/dist` |
| `npm run typecheck:web` | Runs TypeScript verification across `apps/web` |
| `npm run typecheck:api` | Runs TypeScript verification across `apps/api` |
| `npm run typecheck:mobile` | Runs TypeScript verification across `apps/mobile` |
| `npm run db:generate` | Generates `@prisma/client` from schema |
| `npm run db:migrate` | Applies Prisma migrations |
| `npm run db:seed` | Seeds database with staff accounts and travel packages |

---

## API Reference

### Public Endpoints (`/api/v1`)
- `GET /api/v1/health` — Service health and database connectivity check.
- `GET /api/v1/packages` — Retrieve list of published packages (filters: `?kind=TOUR|HAJJ|UMRAH`).
- `GET /api/v1/packages/:slug` — Retrieve single package details by unique slug.
- `POST /api/v1/enquiries` — Submit customer booking enquiry (requires idempotency key).
- `GET /api/v1/settings/public` — Retrieve verified company contact details (phone, email, WhatsApp).
- `GET /api/v1/integrations/google-reviews` — Retrieve authentic Google customer reviews.

### Protected Staff Endpoints (`/api/v1/admin`)
- `POST /api/v1/auth/login` — Staff sign-in (issues JWT HttpOnly cookie and bearer token).
- `GET /api/v1/auth/me` — Retrieve active staff profile and permissions.
- `GET /api/v1/admin/dashboard` — Aggregated enquiry metrics and conversion analytics.
- `GET /api/v1/admin/enquiries` — Paginated and searchable enquiry list.
- `PATCH /api/v1/admin/enquiries/:id/status` — Transition enquiry status with audit history.
- `POST /api/v1/admin/enquiries/:id/notes` — Append internal staff communication notes.
- `GET /api/v1/admin/enquiries/export` — Download CSV export of filtered enquiries.
- `POST /api/v1/packages` — Create draft tour or pilgrimage package.
- `PATCH /api/v1/packages/:id` — Update package details, itinerary, or publishing status.

---

## Testing & Quality Assurance

Ensure zero regressions before commits or deployments:

```bash
# Typecheck all three workspaces simultaneously
npm run typecheck:web && npm run typecheck:api && npm run typecheck:mobile

# Build validation
npm run build:web
npm run build:api
```

---

## Documentation

For comprehensive setup guidelines, environment variable reference, mobile device testing, and production deployment checklists, refer to:
- [**SETUP.md**](./SETUP.md) — Step-by-step developer onboarding and deployment manual.

---

## License

Proprietary © SkyRay Holidays. All rights reserved.
