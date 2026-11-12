import type { Metadata } from 'next';
import Link from 'next/link';
import VisaExplorer from '@/components/VisaExplorer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Services | Services | SkyRay Holidays',
  description:
    'Reliable international visa services for US B1/B2, UK Visitor, 29 Schengen member states, and Global E-Visas.',
};

export default function ServicesVisaPage() {
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
          <h1>Visa Services</h1>
          <p>
            Official visa guidance and appointments for the United States, United Kingdom, all 29 Schengen European countries, and 50+ Global E-Visas.
          </p>
        </div>
      </section>

      <section className="section container">
        <VisaExplorer />
      </section>
    </>
  );
}
