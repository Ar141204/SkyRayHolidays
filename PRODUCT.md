# Product <!-- impeccable:product-schema 1 -->

## Platform
adaptive

## Stack
- Frontend Web: Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS (Design Tokens)
- Mobile Application: React Native 0.81, Expo 54, React Navigation 7, TypeScript
- Backend API: NestJS 11, Prisma ORM 6, PostgreSQL 16, TypeScript
- Integrations: Microsoft Graph (Excel Online), SMTP (Nodemailer), Google Places API

## Users
1. **Discerning Leisure Travelers & Families**: Individuals, couples, and multi-generation families seeking memorable domestic getaways within India (Kashmir, Kerala, Goa, Andaman, Golden Triangle) and curated international holidays (Maldives, Sri Lanka, Nepal, Dubai, Turkey, Bali, Europe). They value authentic imagery, clear inclusions/exclusions, flexible date planning, and direct WhatsApp consultations over rigid booking engines.
2. **Sacred Pilgrims (Hajj & Umrah)**: Muslims seeking spiritually enriching pilgrimage experiences with dedicated scholarly guidance, verified proximity to the Holy Kaaba (Masjid al-Haram in Mecca) and Prophet's Mosque (Al-Masjid an-Nabawi in Madinah), VIP transfers, and official visa handling.
3. **SkyRay Holidays Travel Consultants & Admins**: Staff members operating through the internal `/admin` dashboard who triage customer enquiries, assign leads, draft custom quotes based on seasonality and accommodation tiers, and manage published packages.

## Product Purpose
SkyRay Holidays is a full-stack, connected travel and pilgrimage platform built to inspire authentic wanderlust and convert travel curiosity into personalized journeys. It replaces generic fixed-price eCommerce cards with an enquiry-first consultation model, enabling travelers to request tailored date-driven quotations while arming agency staff with an operational CRM pipeline.

Success means:
- Travelers quickly understand itinerary highlights and inclusions without confusion.
- Pilgrims feel immediate spiritual reverence and confidence in travel logistics.
- Zero generic placeholder imagery ("AI slop") across all touchpoints.
- Fast, frictionless inquiry submission across web and native mobile with instant WhatsApp escalations.
- Fast lead assignment and status transitions for travel consultants.

## Positioning
Unlike mass-market OTAs (MakeMyTrip, Booking.com) that present transactional pricing without personalized care, and unlike generic local agencies with fragmented manual workflows, SkyRay Holidays provides a bespoke, high-touch travel concierge. Every journey features transparent inclusion checklists, verified 5-star hotel allocations near sacred landmarks, and human consultation before payment commitments.

## Operating Context
- **Customer Web (`apps/web`)**: Desktop and mobile browser discovery (`http://localhost:3000`). Clean 3-section navigation with a prominent left-aligned brand mark, centered links, and right-aligned inquiry/admin shortcuts.
- **Mobile App (`apps/mobile`)**: Native iOS and Android application built with Expo (`http://localhost:8081`). Designed with generous white space, uncluttered touch targets, offline fallback catalogs, and 1-tap WhatsApp chat buttons.
- **Admin Console (`/admin`)**: Staff-only portal with role-based access control, metrics dashboard, enquiry lifecycle tracking, package authoring, and audit logging.
- **Backend API (`apps/api`)**: NestJS REST backend (`http://localhost:4000/api/v1`) with PostgreSQL transaction safety, idempotency checks, and login rate limiting.

## Evidence on Hand
- **Official Brand Identity**: High-resolution official brand logo (`apps/web/public/brand/skyray-logo.png`, `apps/mobile/assets/logo.png`) featuring tropical sunset, coconut tree, airplane, and "Sky Ray Holidays" wooden sign.
- **Curated Destination Photography**: 14 high-resolution photography assets stored locally in `apps/web/public/images/destinations/` and `apps/mobile/assets/destinations/`:
  - `mecca.jpg`: Authentic 1200x1600 photo of the Holy Kaaba in Masjid al-Haram.
  - `madinah.jpg`: Authentic 1200x800 photo of the Prophet's Mosque in Madinah with umbrellas and minarets.
  - `kashmir.jpg`, `kerala.jpg`, `golden-triangle.jpg`, `andaman.jpg`, `goa.jpg`, `srilanka.jpg`, `maldives.jpg`, `nepal.jpg`, `dubai.jpg`, `turkey.jpg`, `bali.jpg`, `europe.jpg`.
  - `hero.jpg`: Wanderlust tropical travel photography.
- **Verified Itineraries**: 14 structured packages in `apps/web/lib/config.ts` and `apps/mobile/src/lib/api.ts` complete with day-by-day breakdowns, key inclusions, and exclusions.
- **Zero Placeholder Absences**: Vector SVG illustrations and generic AI gradients have been systematically replaced; future iterations must not reintroduce mock placeholders.

## Product Principles
1. **Authentic Wanderlust over Generic Slop**: Real destination photography and culturally reverent imagery only. No generic purple-blue gradients, artificial AI vectors, or cookie-cutter templates.
2. **Enquiry-First Consultation over Inflexible Pricing**: Highlight "Price on Enquiry" and "Custom Quote". Never display rigid prices that fail to account for travel dates, flight fluctuations, or hotel room categories.
3. **Spiritual Reverence for Pilgrimage**: Hajj and Umrah require solemn respect, distinct iconography, scholar guidance assurances, and exact holy site representation (Kaaba for Hajj, Prophet's Mosque for Umrah).
4. **Airy, Uncluttered Mobile Experience**: Generous spacing, readable typography (DM Sans & Manrope), accessible touch targets, and focused action buttons (`View Details →`, `Enquire Now`).
5. **Operational Velocity for Staff**: The admin console must prioritize quick triage, clear statuses (`NEW` through `CONFIRMED`), notes, and zero friction.

## Accessibility & Inclusion
- Adherence to WCAG 2.2 AA standards: Minimum 4.5:1 contrast ratios on all text and UI elements.
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) on web.
- Accessible touch targets (minimum 44x44 pt) on mobile.
- Clean ARIA labels and descriptive alt text for all landmark photography.
- Dark overlays on hero image containers to ensure text remains 100% legible against photographic backgrounds.
