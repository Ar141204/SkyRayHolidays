import type { Metadata } from 'next';
import PackageExplorer from '@/components/PackageExplorer';

export const metadata: Metadata = {
  title: 'Handcrafted Tour Packages',
  description:
    'Discover curated holiday packages and pilgrimage tours. Handcrafted itineraries, confirmed accommodations, and transparent pricing with SkyRay Holidays.',
  alternates: {
    canonical: '/packages',
  },
  openGraph: {
    title: 'Handcrafted Tour Packages | SkyRay Holidays',
    description:
      'Discover curated holiday packages and pilgrimage tours. Handcrafted itineraries, confirmed accommodations, and transparent pricing with SkyRay Holidays.',
    url: 'https://www.skyrayholidays.com/packages',
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

export default function Packages() {
  return (
    <>
      <section className="packages-banner">
        <div className="container">
          <div className="eyebrow light">CURATED JOURNEYS</div>
          <h1>Our Tour Packages</h1>
          <p>Explore our carefully curated travel packages. Transparent pricing and handcrafted itineraries.</p>
        </div>
      </section>

      <section className="section container">
        <PackageExplorer />
      </section>
    </>
  );
}
