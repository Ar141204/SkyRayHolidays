import type { Metadata } from 'next';
import Link from 'next/link';
import AttestationExplorer from '@/components/AttestationExplorer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Certificate Attestation & Apostille',
  description:
    'Certified Embassy Attestation for UAE, Saudi, Qatar, Kuwait, and MEA Hague Apostille for 120+ countries. Fast-track turnaround for all certificates.',
  alternates: {
    canonical: '/services/attestation',
  },
  openGraph: {
    title: 'Certificate Attestation & Apostille | SkyRay Holidays',
    description:
      'Certified Embassy Attestation for UAE, Saudi, Qatar, Kuwait, and MEA Hague Apostille for 120+ countries. Fast-track turnaround for all certificates.',
    url: 'https://www.skyrayholidays.com/services/attestation',
  },
};

export default function ServicesAttestationPage() {
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
          <h1>Certificate Attestation &amp; Apostille</h1>
          <p>
            Official government legalization and consular attestation for the UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, and 120+ Hague Apostille countries (USA, UK, Europe, Australia).
          </p>
        </div>
      </section>

      <section className="section container">
        <AttestationExplorer />
      </section>
    </>
  );
}
