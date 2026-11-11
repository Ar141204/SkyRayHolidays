import type { Metadata } from 'next';
import PackageExplorer from '@/components/PackageExplorer';

export const metadata: Metadata = {
  title: 'Our Tour Packages | Handcrafted Holiday Experiences',
  description: 'Explore our carefully curated travel packages — from international escapes to spiritual journeys.',
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
