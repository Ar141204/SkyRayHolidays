import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Heart, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';
import PilgrimageExplorer from '@/components/PilgrimageExplorer';

export const metadata: Metadata = {
  title: 'Hajj & Umrah Services | A Blessed Journey',
  description:
    'Dedicated Hajj and Umrah pilgrimage services with SkyRay Holidays. 5-star accommodations near the Haram, experienced guidance, and comprehensive support.',
};

const HOLY_CITIES_GALLERY = [
  {
    title: 'The Holy Kaaba & Mataf Courtyard',
    city: 'Makkah Al-Mukarramah',
    caption: 'Tawaf around the sacred Baitullah and prayers inside the Grand Mosque.',
    image: '/images/destinations/makkah-kaaba.jpg',
    badge: 'Masjid Al-Haram',
  },
  {
    title: 'Clock Tower & Haram Night View',
    city: 'Makkah Al-Mukarramah',
    caption: 'Serene night prayers with panoramic views of the illuminated Haram.',
    image: '/images/destinations/makkah-night.jpg',
    badge: 'Luxury Haram View',
  },
  {
    title: 'The Sacred Green Dome (Al-Qubbah)',
    city: 'Al-Madinah Al-Munawwarah',
    caption: 'Paying peace upon the Prophet Muhammad (PBUH) in the City of Light.',
    image: '/images/destinations/madinah-green-dome.jpg',
    badge: "Prophet's Mosque",
  },
  {
    title: 'Piazza Umbrellas & Grand Minarets',
    city: 'Al-Madinah Al-Munawwarah',
    caption: 'Comfortable prayers in the shaded courtyards of Masjid an-Nabawi.',
    image: '/images/destinations/madinah-courtyard.jpg',
    badge: 'Al-Rawdah Ash-Sharifah',
  },
];

export default function Pilgrimage() {
  return (
    <>
      {/* Top Main Showcase Section (Directly underneath Navbar matching user's view) */}
      <section className="section container" style={{ paddingTop: '28px', paddingBottom: '36px' }}>
        <PilgrimageExplorer />
      </section>

      {/* Dedicated Holy Cities Imagery Gallery */}
      <section className="section container" style={{ paddingTop: '20px' }}>
        <div className="section-head centered">
          <div className="eyebrow">TWO HOLY SANCTUARIES</div>
          <h2>Sacred Destinations: Makkah &amp; Madinah</h2>
          <p>
            Experience the profound spirituality of Islam&apos;s two holiest cities with prime hotel locations,
            walking proximity to the Harams, and guided ziyarat visits.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
          {HOLY_CITIES_GALLERY.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                <Image
                  src={item.image}
                  alt={`${item.city} - ${item.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.badge}
                </span>
              </div>
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0284c7',
                    marginBottom: '4px',
                  }}
                >
                  <MapPin size={12} /> {item.city}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#17496b', margin: '4px 0 6px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="soft-section">
        <div className="container">
          <div className="section-head centered">
            <div className="eyebrow">DEDICATED PILGRIMAGE SUPPORT</div>
            <h2>Why Travel with SkyRay for Hajj &amp; Umrah?</h2>
            <p>Every pilgrimage is treated with utmost reverence, ensuring comfort so you can focus entirely on your worship.</p>
          </div>

          <div className="feature-grid">
            <article>
              <span className="feature-icon"><BookOpen /></span>
              <h3>Experienced Guidance</h3>
              <p>Accompanied by knowledgeable scholars who provide step-by-step guidance on all rites and rituals.</p>
            </article>
            <article>
              <span className="feature-icon"><Heart /></span>
              <h3>Proximity to Haram</h3>
              <p>Carefully selected hotels within easy walking distance from Masjid al-Haram and Masjid an-Nabawi.</p>
            </article>
            <article>
              <span className="feature-icon"><ShieldCheck /></span>
              <h3>Seamless Logistics</h3>
              <p>Private transfers, high-speed Haramain train tickets, airport reception and 24/7 on-ground assistance.</p>
            </article>
            <article>
              <span className="feature-icon"><CheckCircle2 /></span>
              <h3>Complete Peace of Mind</h3>
              <p>Comprehensive visa facilitation, group coordination, and luggage handling.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container disclaimer-box">
        <strong>Important Notice:</strong> Package details, departure dates, hotel reservations, and official government
        permits are subject to Saudi Ministry of Hajj &amp; Umrah regulations. Our team confirms exact arrangements upon enquiry.
      </section>

      <section className="cta-section container">
        <div>
          <div className="eyebrow light">PLAN YOUR SPIRITUAL JOURNEY</div>
          <h2>Speak with Our Pilgrimage Advisors</h2>
          <p>Let our specialists help you select the ideal package for you and your family.</p>
        </div>
        <Link className="btn btn-gold" href="/enquire">
          Enquire Now <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
