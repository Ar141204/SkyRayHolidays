import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PilgrimageExplorer from '@/components/PilgrimageExplorer';

export const metadata: Metadata = {
  title: 'Hajj & Umrah Services | A Blessed Journey',
  description:
    'Dedicated Hajj and Umrah pilgrimage services with SkyRay Holidays. 5-star accommodations near the Haram, experienced guidance, and comprehensive support.',
};

export default function Pilgrimage() {
  return (
    <>
      <section className="pilgrim-hero-banner">
        <div className="container">
          <div className="eyebrow light">A JOURNEY OF FAITH</div>
          <h1>Hajj &amp; Umrah Services</h1>
          <p>A Blessed Journey. Experience spiritual peace with personalized guidance, comfort and care.</p>
        </div>
      </section>

      <section className="section container">
        <PilgrimageExplorer />
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
