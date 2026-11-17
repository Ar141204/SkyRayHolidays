import type { Metadata } from 'next';
import Link from 'next/link';
import PackageExplorer from '@/components/PackageExplorer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Tour Packages',
  description:
    'Handcrafted holiday packages and specialized global destinations curated by SkyRay Holidays. Transparent pricing and confirmed itineraries.',
  alternates: {
    canonical: '/services/packages',
  },
  openGraph: {
    title: 'Curated Tour Packages | SkyRay Holidays',
    description:
      'Handcrafted holiday packages and specialized global destinations curated by SkyRay Holidays. Transparent pricing and confirmed itineraries.',
    url: 'https://www.skyrayholidays.com/services/packages',
  },
};

export default function ServicesPackagesPage() {
  return (
    <>
      <section className="packages-banner">
        <div className="container">
          <div className="eyebrow light">
            <Link href="/services" style={{ color: '#bdeaff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={13} /> SERVICES HUB
            </Link>
          </div>
          <h1>Tour Packages</h1>
          <p>
            Explore our carefully curated holiday packages across specialized key destinations and popular world getaways.
          </p>
        </div>
      </section>

      <section className="section container">
        <PackageExplorer />
      </section>
    </>
  );
}

