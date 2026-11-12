# Design System <!-- impeccable:design-schema 1 -->

## 1. Brand Identity & Design Philosophy

SkyRay Holidays is a bespoke travel and pilgrimage concierge. The visual language merges **authentic tropical wanderlust** with **sacred spiritual reverence**.

### Core Tenets
- **Authentic Photographic Immersion**: Real destination photography exclusively. Generic SVG illustrations, cartoon travel icons, and synthetic AI slop are strictly disallowed.
- **Enquiry-First Clarity**: Custom quote model ("Price on Enquiry"). No misleading eCommerce "Add to Cart" carts or rigid prices that break during seasonal fluctuations.
- **Spiritual Distinction**: Sacred pilgrimage journeys (Hajj & Umrah) are distinguished with solemn deep navy tones, sacred gold highlights, and exact landmark photography (Holy Kaaba in Mecca, Prophet's Mosque in Madinah).
- **Airy Tactile Surfaces**: Generous whitespace, readable typography, and accessible touch targets ($\ge 44\times 44\,\text{pt}$).

---

## 2. Color System & Design Tokens

### Core Color Palette

| Token Role | Web CSS Variable | Mobile Constant (`C`) | Hex Code | Visual Application |
| :--- | :--- | :--- | :--- | :--- |
| **Sky Primary** | `--sky` | `C.sky` | `#0ea5e9` / `#35a9e0` | Primary buttons, active tabs, focus rings, link accents |
| **Sky Dark / Vibrant** | `--sky-dark` | `C.skyDark` | `#0284c7` | Hover states, button gradients, eyebrow kickers |
| **Deep Aegean Navy** | `--deep` | `C.deep` | `#17496b` | Main headings, dark brand surfaces, primary cards |
| **Midnight Navy** | `--midnight` | &mdash; | `#102f45` | Footer background, administrative sidebars |
| **Pilgrimage Gold** | `--gold` | `C.gold` | `#f59e0b` / `#f4aa32` | Hajj/Umrah badges, star ratings, spiritual CTAs |
| **Sacred Gold Pale** | `--gold-pale` | `C.goldPale` | `#fef3c7` | Pilgrimage badge background, sacred highlight boxes |
| **Ice Blue Pale** | `--pale` | `C.pale` | `#eaf7fd` / `#f0f9ff` | Feature icon backgrounds, active category pills, callout cards |
| **Ink Text** | `--ink` | `C.ink` | `#0f172a` / `#202b36` | Primary body typography, high-contrast labels |
| **Muted Slate** | `--muted` | `C.muted` | `#64748b` / `#687785` | Secondary body text, metadata icons, review counts |
| **Subtle Border** | `--line` | `C.line` | `#e2e8f0` / `#e4ebef` | Card outlines, table dividers, input borders |
| **Pure Surface** | `--white` | `C.surface` | `#ffffff` | Card surfaces, modal dialogs, header backdrop |
| **Soft Off-White** | `--soft` | `C.background` | `#f8fafc` / `#f7fafb` | Section alternate backgrounds, screen canvas |

### Semantic & Interaction Accents

| Accent | Hex Code | Application |
| :--- | :--- | :--- |
| **WhatsApp Emerald** | `#25d366` / `#1eae67` | Floating WhatsApp button, instant chat badges |
| **Success Emerald** | `#10b981` | Inclusion checkmarks, published badges, confirmation toasts |
| **Error Crimson** | `#c0392b` / `#a33b31` | Form validation errors, destructive modal actions |

---

## 3. Typography Scale & Hierarchies

### Font Families
- **Display & Headings**: `Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Weights: `700` (Bold), `800` (Extra Bold), `900` (Black)
  - Letter Spacing: Tight (`-0.035em` to `-0.02em`)
  - Line Height: Compact (`1.1` to `1.25`)
- **Body & Controls**: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Weights: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold)
  - Line Height: Comfortable (`1.6` to `1.8`)

### Typographic Hierarchy Scale

| Level | Size (Web) | Size (Mobile) | Weight | Font | Transform / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `clamp(42px, 6vw, 74px)` | `34px - 40px` | `800 / 900` | Manrope | Negative tracking, italicized brand accent |
| **Section H1 / H2**| `clamp(30px, 4vw, 48px)` | `26px - 32px` | `800` | Manrope | Line height 1.15 |
| **Card H3** | `18px - 21px` | `18px - 20px` | `800` | Manrope | 2-line clamp max |
| **Eyebrow Kicker** | `10px - 11px` | `10px - 11px` | `800` | DM Sans | Uppercase, tracking `0.15em` to `0.18em` |
| **Lead Paragraph** | `17px - 19px` | `16px` | `500` | DM Sans | High readability lead copy |
| **Standard Body** | `14px - 15px` | `14px` | `400 / 500` | DM Sans | Line height 1.65, muted slate |
| **Caption / Meta** | `11px - 12.5px` | `11px - 12px` | `600 / 700` | DM Sans | Destination, duration, reviews |

---

## 4. Spacing, Elevation & Layout System

### Spatial Rhythm
- Base scale adheres to an 8pt / 4pt grid: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`.
- Touch target minimum: All interactive buttons and touchables must meet or exceed **$44\times 44\,\text{pt}$** for mobile accessibility.

### Elevation & Shadows
- **Level 1 (Subtle / Card Outline)**: `0 4px 14px rgba(23, 73, 107, 0.04)` with `1px solid #e2edf3` border.
- **Level 2 (Hover / Active)**: `0 20px 40px rgba(14, 165, 233, 0.14), 0 8px 16px rgba(15, 23, 42, 0.06)` with `-7px` vertical translation.
- **Level 3 (Modal / Floating FAB)**: `0 24px 60px rgba(15, 35, 50, 0.25)` or `0 8px 20px rgba(0, 0, 0, 0.20)`.

### Responsive Breakpoints
- **Desktop (Default)**: Container width `min(1160px, calc(100% - 48px))`. 4-column package and feature grids.
- **Tablet (`max-width: 1050px`)**: 2-column package grid, condensed navigation padding.
- **Mobile (`max-width: 880px`)**: Drawer navigation toggle, 2-column or 1-column cards, single-column detail and form layouts.
- **Compact Phone (`max-width: 390px`)**: Single-column package cards, 180px photo heights.

---

## 5. Component Patterns

### 1. Site Navigation Header
- **Desktop**: 3-column sticky grid (`grid-template-columns: auto 1fr auto`).
  - *Left*: Prominent brand mark (height $\ge 84\,\text{px}$) linking home.
  - *Center*: Clean centered navigation links with subtle sky hover pills.
  - *Right*: Dual CTA cluster: High-contrast `Admin Panel` badge button + Sky gradient `Enquire Now` action.
- **Mobile**: Sticky white bar, 60px brand mark, WhatsApp instant chat pill, accessible hamburger menu toggle.

### 2. Package Cards
- **Photo Banner**: Fixed 210px (desktop) / 160-180px (mobile) aspect frame with subtle dark vignette (`rgba(15, 23, 42, 0.55)`).
- **Interactive Hover**: Smooth 500ms cubic-bezier zoom (`transform: scale(1.08)`).
- **Metadata Badges**: Floating uppercase category chip (`DOMESTIC`, `INTERNATIONAL`, `PILGRIMAGE`).
- **Footer Actions**: Distinct "Custom Quote" / "Price on Enquiry" label paired with an emerald or sky gradient `View Details →` pill button.

### 3. Pilgrimage Showcase
- **Sacred Card**: 2-column layout (Left: Verified inclusions, spiritual copy, scholar assurances; Right: Full-bleed authentic photography of Mecca / Madinah).
- **Inclusion Checklist**: Green circular checkmarks (`#10b981`) paired with explicit proximity guarantees (e.g., "5-Star Hotel within walking distance of Haram").

### 4. Interactive Forms & Admin Interface
- **Form Controls**: Crisp inputs with 3px focus glow (`box-shadow: 0 0 0 3px rgba(53, 169, 224, 0.12)`).
- **Admin Shell**: Two-pane operational layout (Dark sidebar navigation `#102f45` + light content stage `#f5f8fa`).
- **CRM Pipeline**: Status pills (`NEW` in blue, `CONTACTED` in gold, `QUOTED` in purple, `CONFIRMED` in emerald).

---

## 6. Anti-Slop Safeguards & Quality Rules

1. **No Synthetic AI Placeholders**: Every destination must reference real photographic assets from `public/images/destinations/` or mobile `assets/destinations/`.
2. **No E-Commerce Cart Metaphors**: Travel packages are high-consideration bespoke bookings. Do not introduce cart icons, checkout funnels, or deceptive "Rs. 99" price tags.
3. **No Low-Contrast Overlays**: Hero text over photographic backgrounds must always include a minimum 40%-88% linear dark gradient overlay to guarantee WCAG 2.2 AA compliance ($>4.5:1$).
4. **No Unbounded Mobile Tap Targets**: All clickable icons, chips, and buttons must reserve at least $44\times 44\,\text{pt}$ hit areas to avoid touch congestion.

