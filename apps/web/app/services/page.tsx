import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServicesHub from '@/components/ServicesHub';

export const metadata: Metadata = {
  title: 'Our Services | Tour Packages, Visas & Certificate Attestation',
  description:
    'Explore SkyRay Holidays comprehensive services: Handcrafted international tour packages, specialized destinations, US, UK, Schengen visa concierge, and official UAE, Saudi, Gulf & Hague Apostille certificate attestation.',
};

export default function ServicesPage() {
  return (
    <>
      {/* 1. Page Hero Banner */}
      <section
        className="packages-banner"
        style={{ background: 'linear-gradient(135deg,#0c3452 0%,#18547c 60%,#0284c7 100%)' }}
      >
        <div className="container">
          <div className="eyebrow light">ONE-STOP TRAVEL, VISA &amp; ATTESTATION CONCIERGE</div>
          <h1>Our Services</h1>
          <p>
            Explore handcrafted holiday tour packages, specialized key destinations, official visa assistance for the US, UK, 29 Schengen countries, and certified Embassy Attestation &amp; Hague Apostille legalization.
          </p>
        </div>
      </section>

      {/* 2. Main Services Section housing Tour Packages & Visa Services */}
      <section className="section container">
        <Suspense fallback={<div>Loading services…</div>}>
          <ServicesHub />
        </Suspense>
      </section>
    </>
  );
}

