# Production release gate

## Business content

- [ ] Replace the preview logo crop with the supplied high-resolution official logo and approved variants.
- [ ] Replace sample vector destination illustrations with company-approved, correctly licensed photography.
- [ ] Enter verified company phone, WhatsApp, email, office address, map URL and business hours.
- [ ] Enter current packages, itinerary, pricing, departures, inclusions and exclusions; keep records in Draft until approved.
- [ ] Verify the Google Business listing and authorize review API access. Never replace unavailable review data with fabricated copy.
- [ ] Approve privacy, retention, cancellation/refund, terms and contact wording with the company and qualified Indian counsel.

## Infrastructure and security

- [ ] Set production secrets in a secret manager; do not commit `.env`.
- [ ] Use HTTPS, secure cookies, a restricted CORS allowlist and a production database with encryption and backups.
- [ ] Replace process-local rate limiting with shared Redis-backed limits; test brute-force protections.
- [ ] Add MFA and a controlled password reset/invitation workflow before exposing the staff portal publicly.
- [ ] Configure log redaction, error monitoring, uptime alerts and incident response.
- [ ] Complete vulnerability scanning, dependency review, authorization tests and security assessment.
- [ ] Run a PostgreSQL restore drill and prove enquiry recovery from backups.

## Integrations

- [ ] Verify SMTP sender domain and notification recipient; test delivery, bounces and retries.
- [ ] Create the Microsoft Entra app registration, delegated Graph access, redirect URI and workbook table; test update-by-reference and retry behavior.
- [ ] Connect the real Google Business listing and verify provider attribution/usage terms.

## QA and mobile publishing

- [ ] Test every page and enquiry journey at desktop, tablet and small phone widths.
- [ ] Test every protected endpoint with each staff role, including disabled accounts and expired sessions.
- [ ] Exercise API/provider outage, duplicate taps, retries, stale jobs and archived package references.
- [ ] Complete WCAG 2.2 AA review, keyboard/screen-reader checks and performance testing.
- [ ] Create signed Android and iOS builds, test on physical devices, configure privacy disclosures and store listing assets, and publish using company-owned Play Console and Apple Developer accounts.

A successful source build is not equivalent to production acceptance. All checks above require customer data, provider access, real deployment infrastructure and recorded QA evidence.
