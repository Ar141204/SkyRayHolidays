import type { Metadata } from 'next';
import Link from 'next/link';
import VisaExplorer from '@/components/VisaExplorer';
import { ShieldCheck, Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Services | US, UK, Schengen & Global E-Visas',
  description:
    'Reliable international visa services by SkyRay Holidays. Expert assistance for US B1/B2, UK Visitor, 29-Country Schengen, and Fast-Track Global E-Visas.',
};

export default function VisaPage() {
  return (
    <>
      {/* 1. Page Hero */}
      <section className="packages-banner" style={{ background: 'linear-gradient(135deg,#0c3452 0%,#18547c 60%,#0284c7 100%)' }}>
        <div className="container">
          <div className="eyebrow light">OFFICIAL CONCIERGE ASSISTANCE</div>
          <h1>International Visa Services</h1>
          <p>
            Fast, hassle-free visa guidance for the United States, United Kingdom, all 29 Schengen member states, and 50+ Global E-Visas.
          </p>
        </div>
      </section>

      {/* 2. Visa Explorer: 4 Arranged Boxes matching Holiday Packages */}
      <section className="section container">
        <div className="section-head centered">
          <div className="eyebrow">CHOOSE YOUR DESTINATION VISA</div>
          <h2>
            Arranged Visa Categories &amp; <em>Fast Processing</em>
          </h2>
          <p>
            Select from standard embassy appointments or lightning-fast electronic visas. Click &ldquo;Enquire Now&rdquo; to receive checklist guidance and quote details.
          </p>
        </div>

        <VisaExplorer />
      </section>

      {/* 3. Why Choose SkyRay for Visas */}
      <section className="section container" style={{ paddingTop: '10px' }}>
        <div className="feature-grid">
          <article>
            <div className="feature-icon"><ShieldCheck /></div>
            <h3>99% File Audit Accuracy</h3>
            <p>Every bank statement, employment letter, and cover note is checked to eliminate avoidable rejections.</p>
          </article>
          <article>
            <div className="feature-icon"><Clock /></div>
            <h3>Early Appointment Slots</h3>
            <p>Direct tracking and scheduling assistance for US consulate, UKVI VFS, and European BLS/TLS biometric slots.</p>
          </article>
          <article>
            <div className="feature-icon"><FileText /></div>
            <h3>Schengen Confirmed Itineraries</h3>
            <p>Official hotel vouchers, confirmed round-trip flight reservations, and EUR 30,000+ medical insurance certificates.</p>
          </article>
          <article>
            <div className="feature-icon"><CheckCircle2 /></div>
            <h3>Personal Mock Interview Prep</h3>
            <p>Experienced guidance to answer US and UK visa officer questions with calm confidence and clarity.</p>
          </article>
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="cta-section container">
        <div>
          <div className="eyebrow light">HAVE QUESTIONS ABOUT VISAS?</div>
          <h2>
            Need assistance for a specific
            <br />
            country or visa type?
          </h2>
          <p>Tell us your travel plans. Our visa specialists will review your passport and guide you through every step.</p>
        </div>
        <Link className="btn btn-gold" href="/enquire?service=visa">
          Submit Visa Enquiry <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
