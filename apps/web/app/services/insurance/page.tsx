import type { Metadata } from 'next';
import Link from 'next/link';
import InsuranceExplorer from '@/components/InsuranceExplorer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'International Travel Insurance | Europe, USA, UK & Worldwide Coverage',
  description:
    'Comprehensive travel medical insurance for all countries: Europe Schengen compliant (€30,000+), USA, UK, and worldwide. Instant quotes and fast policy issuance.',
  alternates: {
    canonical: '/services/insurance',
  },
  openGraph: {
    title: 'International Travel Insurance | SkyRay Holidays',
    description:
      'Comprehensive travel medical insurance for all countries: Europe Schengen compliant (€30,000+), USA, UK, and worldwide. Instant quotes and fast policy issuance.',
    url: 'https://www.skyrayholidays.com/services/insurance',
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

export default function ServicesInsurancePage() {
  return (
    <>
      <section
        className="packages-banner"
        style={{ background: 'linear-gradient(135deg,#0c3452 0%,#18547c 60%,#0284c7 100%)' }}
      >
        <div className="container">
          <div className="eyebrow light">
            <Link href="/services" style={{ color: '#bdeaff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={13} /> SERVICES HUB
            </Link>
          </div>
          <h1>International Travel Insurance</h1>
          <p>
            Official embassy-approved travel medical protection for Europe (Schengen €30,000+), the United States, the United Kingdom, and all countries worldwide with instant online policy delivery.
          </p>
        </div>
      </section>

      <section className="section container">
        <InsuranceExplorer />
      </section>
    </>
  );
}
