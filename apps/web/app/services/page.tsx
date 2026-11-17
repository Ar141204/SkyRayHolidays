import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServicesHub from '@/components/ServicesHub';

export const metadata: Metadata = {
  title: 'Tours, Visas & Attestation Services',
  description:
    'Explore SkyRay Holidays services: Curated holiday tour packages, Hajj & Umrah pilgrimages, US/UK/Schengen visas, and embassy certificate attestation.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Tours, Visas & Attestation Services | SkyRay Holidays',
    description:
      'Explore SkyRay Holidays services: Curated holiday tour packages, Hajj & Umrah pilgrimages, US/UK/Schengen visas, and embassy certificate attestation.',
    url: 'https://www.skyrayholidays.com/services',
    images: [
      {
        url: 'https://www.skyrayholidays.com/brand/skyray-logo.png',
        width: 880,
        height: 658,
        alt: 'SkyRay Holidays Official Logo',
      },
    ],
  },
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

