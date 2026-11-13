# SkyRay Holidays — Connected Travel & Pilgrimage Platform

<div align="center">

![SkyRay Holidays Logo](apps/web/public/brand/skyray-logo.png)

### *"Where Every Trip Becomes A Memory"*

**Full-Stack Monorepo Platform for Curated International Holidays, Specialized Escapes, Global Visa Services, and Sacred Hajj & Umrah Pilgrimages.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4.7-red?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?logo=prisma)](https://www.prisma.io/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_Cloud-336791?logo=postgresql)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)

---

[Key Features](#key-features) •
[Architecture](#architecture--workspaces) •
[Quick Start](#quick-start) •
[Admin Portal](#staff-admin-console) •
[Real-Time Sync](#real-time-admin--mobile-sync) •
[API Reference](#api-reference) •
[Contributors](#contributors--credits)

</div>

---

## Overview

**SkyRay Holidays** is an enterprise-grade travel technology ecosystem architected as a TypeScript monorepo using npm workspaces. Engineered around an **enquiry-first custom quote model**, the platform delivers structured itineraries, verified hotel partnerships, transparent inclusions/exclusions, and instant concierge communication without upfront pricing friction.

### Architecture & Workspaces

```text
skyray-holidays/
├── apps/
│   ├── web/                    # Next.js 15 (App Router), React 19 Customer Web Portal & Admin Console
│   │   ├── app/                # Public routes (/, /about, /services, /visa, /packages, /hajj-umrah, /contact, /enquire)
│   │   │   └── syedrahamathullah@portal-1614/  # Secure, isolated Staff Admin Portal
│   │   ├── components/         # PackageExplorer, VisaExplorer, PilgrimageExplorer, EnquiryForm, AdminConsole
│   │   ├── lib/                # Client config, dynamic content hooks, visa catalog
│   │   └── public/             # Brand logos & high-resolution destination assets
│   │
│   ├── mobile/                 # React Native & Expo (iOS & Android) Native Mobile Application
│   │   ├── assets/             # Branded icons, splash screens, destination photography
│   │   ├── src/
│   │   │   ├── screens/        # HomeScreen, ServicesScreen, EnquiryScreen, InfoScreens, PilgrimageScreen
│   │   │   ├── components/     # UI design system, BrandHeader, Action Badges, Buttons
│   │   │   ├── navigation/     # Bottom Tab and Native Stack navigation
│   │   │   └── lib/            # Multi-network API client, fallback catalogues, and asset loaders
│   │   ├── app.json            # Expo configuration
│   │   └── eas.json            # Expo Application Services build profiles
│   │
│   └── api/                    # NestJS Backend REST API Engine
│       ├── src/
│       │   ├── auth/           # Staff JWT auth, login rate limiter, lockout & 6-digit unlock
│       │   ├── packages/       # Tour, Hajj & Umrah package services & controllers
│       │   ├── enquiries/      # Customer enquiry pipeline, validation & randomized reference generator
│       │   ├── settings/       # Dynamic content, visa catalogue, company contact settings
│       │   ├── integrations/   # SMTP email notifications, Microsoft Graph, Google Reviews
│       │   ├── common/         # Security guards, audit log interceptors
│       │   └── prisma/         # PrismaService and database lifecycle management
│       └── prisma/
│           ├── schema.prisma   # PostgreSQL database schema with Prisma Client v6
│           └── seed.ts         # Database seeder (settings, super admin, packages)
│
├── .vscode/settings.json       # Workspace editor settings
├── .env.example                # Canonical environment variable template
├── .gitignore                  # Production monorepo exclusion rules
├── SETUP.md                    # Developer & DevOps onboarding guide
└── package.json                # Root workspaces and unified scripts
```

---

## Key Features

### 1. Customer Web Portal (`apps/web`)
- **Responsive Layout**: Designed for seamless browsing across mobile phones, tablets, and ultra-wide desktops.
- **Curated Tour Packages**: Domestic escapes (Kashmir, Kerala, Golden Triangle, Andaman, Goa), regional wonders (Sri Lanka, Maldives, Nepal), and international getaways (Dubai, Bali, Europe, Turkey).
- **Specialized Destination Keys**: Dedicated focus on Reunion Island, Russia, Turkey, Mauritius, Maldives, Seychelles, Armenia, Georgia, and Azerbaijan.
- **Global Visa Services**: Full-service concierge for US B1/B2, UK Standard Visitor, 29-Country Schengen, Canada Visitor (V-1), GCC Visas, and 50+ Fast-Track Global E-Visas.
- **Sacred Pilgrimage (Hajj & Umrah)**: Premium & economy packages featuring authentic high-resolution photography of the Holy Kaaba in Makkah and the Prophet's Mosque in Madinah, walking proximity to Harams, and scholar guidance.
- **Custom Quote Enquiry Form**: Interactive service selection, travel dates calendar picker, group size counter, special requirements notes, and automated reference generation.

### 2. Native Mobile Application (`apps/mobile`)
- **Cross-Platform**: Built on React Native and Expo SDK 52 for iOS and Android.
- **Direct Concierge Channels**: Clear contact cards for India and Saudi Arabia desks with 1-tap WhatsApp and phone dialing.
- **Clean Layout**: Physical office addresses omitted from mobile screens to avoid traveller confusion and prioritize direct concierge communication.
- **Offline Resilient**: Displays verified local travel itineraries and visa catalogs even during weak network conditions.
- **Smart LAN / Production API Routing**: Automatically detects whether running inside desktop web, an Android emulator (`10.0.2.2`), a physical phone on LAN (`192.168.x.x`), or production.

### 3. Staff Admin Console (`/syedrahamathullah@portal-1614`)
- **Session Persistence**: Secure, 30-day auto-restoring session with instant safety timeouts to prevent loading hangs.
- **Role-Based Security**: Strict access control (`SUPER_ADMIN`, `CONTENT_MANAGER`, `ENQUIRY_MANAGER`, `AUDITOR`) with 5-attempt lockout and 6-digit emergency unlock codes.
- **Enquiry Pipeline**: Real-time management across statuses: `NEW`, `PENDING`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `CLOSED`, `SPAM`.
- **Live Content Management**: Direct editing of hero banners, value pillars, why choose us promises, mission, and vision statements.
- **Visa & Package Catalogue CMS**: Add, edit, publish, or delete tour packages and visa services with live preview.
- **Audit Logs & CSV Export**: Immutable operational history for staff actions and 1-click CSV enquiry exports.

### 4. Real-Time Admin ⇄ Mobile Sync
Any update made in the Admin Console is instantly stored in Cloud PostgreSQL and propagates automatically to both the Web Portal and Mobile App:
- **Hero & Value Pillars**: Text edited in Admin immediately updates the mobile home screen.
- **Visa Catalog**: Visas added or modified in Admin appear instantly on both platforms.
- **Tour Packages**: Packages added, updated, or removed reflect live across all search and detail views.
- **Pull-to-Refresh**: Both platforms include pull-to-refresh to pull live database changes on demand.

---

## Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` LTS
- **npm**: `v10.x`+
- **Supabase / PostgreSQL**: Cloud database or local Docker instance

### 2. Installation
Clone the repository and install all workspace dependencies from the root:

```bash
git clone https://github.com/SkyRayHolidays/SkyRayHolidays.git
cd SkyRayHolidays
npm install
```

### 3. Environment Configuration
Copy the canonical template:

```bash
cp .env.example .env
```

Configure your credentials in `.env`:
- `DATABASE_URL`: Supabase Transaction Pooler URL (port `6543`, `pgbouncer=true`)
- `DIRECT_URL`: Supabase Direct Session URL (port `5432`)
- `JWT_SECRET`: Random 32+ character string (`openssl rand -base64 48`)
- `SEED_ADMIN_EMAIL`: Initial admin login email
- `SEED_ADMIN_PASSWORD`: Initial admin login password
- `EXPO_PUBLIC_API_URL`: Your backend API URL (e.g. `http://localhost:4000/api/v1` or LAN IP `http://192.168.1.3:4000/api/v1`)

### 4. Database Setup
Push the schema to PostgreSQL and seed initial records:

```bash
# Push schema to Supabase Cloud
npx prisma db push --schema=apps/api/prisma/schema.prisma

# Generate Prisma Client
npm run db:generate

# (Optional) Seed initial demo packages & admin
npm run db:seed
```

### 5. Running the Monorepo

Start all services in separate terminal tabs:

```bash
# Terminal 1: NestJS Backend API (http://localhost:4000)
npm run dev:api

# Terminal 2: Next.js Website & Admin Console (http://localhost:3000)
npm run dev:web

# Terminal 3: Expo Mobile App (http://localhost:8081 / exp://<LAN_IP>:8081)
npm run dev:mobile
```

---

## Available Scripts

| Script | Workspace | Description |
|---|---|---|
| `npm run dev:web` | `@skyray/web` | Starts Next.js development server on port `3000` |
| `npm run dev:api` | `@skyray/api` | Starts NestJS API with hot-reload on port `4000` |
| `npm run dev:mobile` | `@skyray/mobile` | Starts Expo Metro bundler on port `8081` |
| `npm run build:web` | `@skyray/web` | Produces an optimized Next.js production build |
| `npm run build:api` | `@skyray/api` | Compiles NestJS backend into `apps/api/dist` |
| `npm run typecheck:web` | `@skyray/web` | Runs TypeScript verification across `apps/web` |
| `npm run typecheck:api` | `@skyray/api` | Runs TypeScript verification across `apps/api` |
| `npm run typecheck:mobile` | `@skyray/mobile` | Runs TypeScript verification across `apps/mobile` |
| `npm run db:generate` | `@skyray/api` | Generates `@prisma/client` from schema |
| `npm run db:migrate` | `@skyray/api` | Applies Prisma migrations |
| `npm run db:seed` | `@skyray/api` | Seeds initial staff accounts and travel packages |

---

## API Reference

### Public Endpoints (`/api/v1`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health & database connectivity status |
| `GET` | `/api/v1/packages` | Retrieve published packages (`?kind=TOUR\|HAJJ\|UMRAH`) |
| `GET` | `/api/v1/packages/:slug` | Retrieve single package details by unique slug |
| `GET` | `/api/v1/visas` | Retrieve live international visa services catalog |
| `GET` | `/api/v1/content` | Retrieve dynamic website and mobile content |
| `GET` | `/api/v1/settings/public` | Retrieve verified contact desk details |
| `POST` | `/api/v1/enquiries` | Submit customer booking enquiry (`Idempotency-Key` required) |
| `GET` | `/api/v1/integrations/google-reviews` | Retrieve authentic Google customer reviews |

### Staff Admin Endpoints (`/api/v1/admin`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Staff sign-in (issues HttpOnly cookie & JWT) |
| `GET` | `/api/v1/auth/me` | Retrieve active staff profile and role |
| `GET` | `/api/v1/admin/dashboard` | Aggregated enquiry metrics & pipeline analytics |
| `GET` | `/api/v1/admin/enquiries` | Searchable enquiry list with status filters |
| `PATCH` | `/api/v1/admin/enquiries/:id/status` | Transition enquiry status with audit logging |
| `POST` | `/api/v1/admin/enquiries/:id/notes` | Append internal staff communication notes |
| `GET` | `/api/v1/admin/enquiries/export` | Download CSV export of customer enquiries |
| `POST` | `/api/v1/packages` | Create new tour, Hajj, or Umrah package |
| `PATCH` | `/api/v1/packages/:id` | Update package details, itineraries, or publishing status |
| `PATCH` | `/api/v1/content` | Update dynamic website & mobile content |
| `PATCH` | `/api/v1/visas` | Update international visa catalog |
| `PATCH` | `/api/v1/settings` | Update company phone, WhatsApp, and operational hours |

---

## Contributors & Credits

- **Lead Engineer & Contributor**: [Ar141204](https://github.com/Ar141204)
- **Client Organization**: [SkyRay Holidays](https://github.com/SkyRayHolidays)
- **Client Repository**: [SkyRayHolidays/SkyRayHolidays](https://github.com/SkyRayHolidays/SkyRayHolidays.git)

---

## License

Proprietary © 2026 [SkyRay Holidays](https://github.com/SkyRayHolidays). All rights reserved.
