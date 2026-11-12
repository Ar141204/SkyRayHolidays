# SkyRay Holidays — Developer & Deployment Setup Guide (`SETUP.md`)

This guide provides end-to-end instructions for configuring, developing, testing, and deploying the **SkyRay Holidays** platform across its **Next.js Web & Admin Console**, **NestJS REST API**, and **React Native / Expo Mobile App**.

---

## Table of Contents
1. [System Prerequisites](#1-system-prerequisites)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Provisioning & Prisma](#4-database-provisioning--prisma)
5. [Running the Services in Development](#5-running-the-services-in-development)
   - [Starting the API Backend](#starting-the-api-backend)
   - [Starting the Web & Admin Portal](#starting-the-web--admin-portal)
   - [Starting the Mobile App](#starting-the-mobile-app)
6. [Testing on Physical Mobile Devices](#6-testing-on-physical-mobile-devices)
7. [Production Builds & Deployment](#7-production-builds--deployment)
   - [Docker Compose (Full Stack)](#docker-compose-full-stack)
   - [Next.js Standalone Production Server](#nextjs-standalone-production-server)
   - [NestJS Production Server](#nestjs-production-server)
   - [Mobile Release Builds (EAS / APK)](#mobile-release-builds-eas--apk)
8. [Typechecking & Verification](#8-typechecking--verification)
9. [Troubleshooting & Common Issues](#9-troubleshooting--common-issues)

---

## 1. System Prerequisites

Before starting, ensure your system has the following tools installed:

| Tool | Recommended Version | Purpose |
|---|---|---|
| **Node.js** | `v20.x` or `v22.x` LTS | JavaScript/TypeScript runtime |
| **npm** | `v10.x` or later | Package manager supporting npm workspaces |
| **Docker & Compose** | Docker Desktop 4.x+ | Local PostgreSQL containerization |
| **Git** | `2.40+` | Version control |
| **Expo CLI** | Latest (`npx expo`) | Mobile development toolchain |
| **Android Studio** | Latest (Optional) | For running Android Emulator |
| **Xcode** | 15+ (macOS only, Optional) | For running iOS Simulator |

---

## 2. Monorepo Structure

SkyRay Holidays utilizes native **npm workspaces** configured in the root `package.json`:

```text
skyray-holidays/
├── apps/
│   ├── web/        # Next.js 15 App Router (@skyray/web)
│   ├── api/        # NestJS 11 REST API (@skyray/api)
│   └── mobile/     # Expo 54 / React Native 0.81 (@skyray/mobile)
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── SETUP.md
```

All npm scripts can be executed directly from the root repository without changing directories.

---

## 3. Environment Configuration

### Step 3.1: Copy `.env.example`
In the root directory, create your working `.env` file:

```bash
cp .env.example .env
```

### Step 3.2: Configure Core Secrets

Edit `.env` and configure the following parameters:

```ini
# Shared Environment
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000/api/v1
CORS_ORIGINS=http://localhost:3000,http://localhost:8081

# PostgreSQL Database
POSTGRES_DB=skyray
POSTGRES_USER=skyray
POSTGRES_PASSWORD=your_secure_postgres_password_here
DATABASE_URL=postgresql://skyray:your_secure_postgres_password_here@localhost:5432/skyray?schema=public

# API Security & JWT Authentication
# Generate with: openssl rand -base64 48
JWT_SECRET=paste_your_generated_secret_key_here
JWT_EXPIRES_IN=8h
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
TRUST_PROXY=false

# Initial Admin Seeding (Optional)
# If provided, `npm run db:seed` will create this Super Admin user automatically
SEED_ADMIN_NAME="SkyRay Super Admin"
SEED_ADMIN_EMAIL=admin@skyrayholidays.com
SEED_ADMIN_PASSWORD=YourStrongPassword123!

# Mobile Expo Endpoint (use development LAN IP for real devices, e.g. http://192.168.1.5:4000/api/v1)
EXPO_PUBLIC_API_URL=http://localhost:4000/api/v1
```

> **Security Rule:** Never commit `.env` to Git. The `.gitignore` is pre-configured to exclude all `.env` files except `.env.example`.

---

## 4. Database Provisioning & Prisma

### Step 4.1: Launch PostgreSQL with Docker
Start the isolated PostgreSQL 16 database container in the background:

```bash
docker compose up -d postgres
```

Verify that PostgreSQL is healthy and listening on port `5432`:
```bash
docker compose ps
```

### Step 4.2: Generate Prisma Client & Migrate Schema
Run the database lifecycle scripts from the repository root:

```bash
# Generate TypeScript definitions from prisma.schema
npm run db:generate

# Apply database migrations to PostgreSQL
npm run db:migrate
```

### Step 4.3: Seed Data & Admin Account
Populate the database with site contact defaults, staff roles, and pre-configured tour & pilgrimage packages:

```bash
npm run db:seed
```

> If `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` were set in `.env`, you can now log in at `http://localhost:3000/admin`.

---

## 5. Running the Services in Development

Open three terminal windows (or tabs) to run each service simultaneously:

### Terminal 1: Starting the API Backend
```bash
npm run dev:api
```
- **Port:** `http://localhost:4000`
- **Health check:** `http://localhost:4000/api/v1/health`
- **Published packages:** `http://localhost:4000/api/v1/packages`

### Terminal 2: Starting the Web & Admin Portal
```bash
npm run dev:web
```
- **Customer Portal:** `http://localhost:3000`
- **Staff Admin Console:** `http://localhost:3000/admin`
- **Pilgrimage Section:** `http://localhost:3000/hajj-umrah`

### Terminal 3: Starting the Mobile App
```bash
npm run dev:mobile
```
- **Metro Bundler:** `http://localhost:8081`
- Press `i` to open in iOS Simulator (macOS required).
- Press `a` to open in Android Emulator.
- Press `w` to open in Web Preview mode.

---

## 6. Testing on Physical Mobile Devices

To test the mobile app on a physical Android or iOS device using **Expo Go**:

1. Ensure your computer and your phone are connected to the **same Wi-Fi network**.
2. Find your computer's local network IP address:
   - **macOS / Linux:** `ipconfig getifaddr en0` or `hostname -I`
   - **Windows:** `ipconfig`
3. Update `EXPO_PUBLIC_API_URL` in root `.env` or `apps/mobile/.env`:
   ```ini
   EXPO_PUBLIC_API_URL=http://192.168.1.50:4000/api/v1
   ```
4. Start Metro with the LAN option:
   ```bash
   npm run dev:mobile
   ```
5. Scan the terminal's QR code using:
   - **iOS:** The default Camera app (opens Expo Go).
   - **Android:** The Expo Go app's QR scanner.

---

## 7. Production Builds & Deployment

### Docker Compose (Full Stack)
To build and start the entire production-grade stack (PostgreSQL + NestJS API + Next.js Web) in containerized mode:

```bash
docker compose up --build -d
```

### Next.js Standalone Production Server
The web application is configured with `output: 'standalone'` in `apps/web/next.config.js`:

```bash
# 1. Build the production bundle
npm run build:web

# 2. Sync static assets to standalone directory (if deploying standalone)
cp -R apps/web/public apps/web/.next/standalone/apps/web/
cp -R apps/web/.next/static apps/web/.next/standalone/apps/web/.next/

# 3. Launch the high-performance standalone server
PORT=3000 HOSTNAME=0.0.0.0 node apps/web/.next/standalone/apps/web/server.js
```

### NestJS Production Server
To build and run the API in production mode:

```bash
# 1. Build TypeScript dist
npm run build:api

# 2. Run the compiled server
node apps/api/dist/main.js
```

### Mobile Release Builds (EAS / APK)
The mobile app configuration is maintained in `apps/mobile/app.json` and `apps/mobile/eas.json`.

To build an installable Android APK with Expo Application Services (EAS):
```bash
cd apps/mobile
npx eas-cli build --platform android --profile preview
```

---

## 8. Typechecking & Verification

To verify that all types across the monorepo are completely synchronized and error-free:

```bash
# Run all workspace typechecks
npm run typecheck:web && npm run typecheck:api && npm run typecheck:mobile
```

Expected output:
```text
> typecheck:web
> npm --workspace @skyray/web exec tsc -- --noEmit

> typecheck:api
> npm --workspace @skyray/api exec tsc -- --noEmit

> typecheck:mobile
> npm --workspace @skyray/mobile exec tsc -- --noEmit
```

---

## 9. Troubleshooting & Common Issues

### Issue 1: `Port 5432 is already in use`
**Cause:** A local PostgreSQL daemon is already running on port 5432.  
**Resolution:** Either stop your local PostgreSQL (`brew services stop postgresql` on macOS, or `sudo systemctl stop postgresql` on Linux), or change the external port mapping in `docker-compose.yml` (e.g. `5433:5432`) and update `DATABASE_URL` in `.env`.

### Issue 2: Mobile app fails to load packages on physical phone
**Cause:** The mobile app is trying to connect to `http://localhost:4000`. On a physical phone, `localhost` points to the mobile device itself, not your development workstation.  
**Resolution:** Set `EXPO_PUBLIC_API_URL` to your workstation's LAN IP (e.g. `http://192.168.1.15:4000/api/v1`).

### Issue 3: `PrismaClientInitializationError: Can't reach database server`
**Cause:** PostgreSQL container is not running or credentials do not match.  
**Resolution:**
```bash
docker compose up -d postgres
docker compose logs postgres
```
Check that `DATABASE_URL` matches the user, password, and database specified in `POSTGRES_*` variables.

### Issue 4: `SecItemCopyMatching failed -50` in terminal during `next dev`
**Cause:** Harmless macOS Keychain warning when Node processes attempt to check platform-level certificates in certain sandboxed shell environments.  
**Resolution:** Does not affect functionality. You can safely run `npm run dev:web` or execute the standalone server `node apps/web/.next/standalone/apps/web/server.js`.

### Issue 5: Changes to `schema.prisma` are not reflected in TypeScript
**Cause:** Prisma client has not been regenerated after schema updates.  
**Resolution:**
```bash
npm run db:generate
```
Restart the API server afterwards.

