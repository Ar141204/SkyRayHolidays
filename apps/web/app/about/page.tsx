import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Your Trusted Travel Partner',
  description:
    'About SkyRay Holidays — Your Trusted Travel Partner. We connect you to new cultures, beautiful places and lasting memories.',
};

export default function About() {
  return (
    <>
      {/* 1. About Hero matching Preview Screen 2 */}
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <div className="eyebrow">YOUR TRUSTED TRAVEL PARTNER</div>
            <h1>About SkyRay Holidays</h1>
            <p className="about-lead">
              At SkyRay Holidays, we believe travel is more than just a journey — it&apos;s an experience that connects
              you to new cultures, beautiful places and lasting memories.
            </p>
            <p>
              Whether you are discovering iconic world capitals, relaxing on pristine tropical beaches, or embarking
              on sacred pilgrimage journeys for Hajj &amp; Umrah, our team is dedicated to providing personal care,
              transparent itineraries and seamless logistics.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" href="/packages">
                Explore Packages <ArrowRight size={16} />
              </Link>
              <Link className="btn btn-outline" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="about-hero-image">
            <div className="plane-art-card">
              <div className="plane-tag">SkyRay Travel</div>
              <Image
                src="/images/hero-coast.svg"
                alt="Airplane flying towards travel destination"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars matching Preview Screen 2: Our Mission, Our Vision, Why Choose Us */}
      <section className="section container">
        <div className="section-head centered">
          <div className="eyebrow">CORE VALUES</div>
          <h2>What Guides <em>Everything We Do</em></h2>
          <p>Delivering unforgettable travel experiences built on integrity, expertise, and personalized service.</p>
        </div>

        <div className="three-pillars-grid">
          <article className="pillar-card">
            <div className="pillar-icon">
              <Target size={28} />
            </div>
            <h3>Our Mission</h3>
            <p>To make travel accessible, enriching, and memorable for everyone through thoughtful planning and transparent service.</p>
          </article>

          <article className="pillar-card highlight">
            <div className="pillar-icon">
              <Eye size={28} />
            </div>
            <h3>Our Vision</h3>
            <p>To be a leading global travel brand recognized for unparalleled customer care, cultural appreciation, and trustworthy pilgrimage services.</p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>Why Choose Us</h3>
            <p>Unmatched service, care and trust. We confirm every detail upfront and provide 24/7 support throughout your entire journey.</p>
          </article>
        </div>
      </section>

      {/* 3. Credentials & Service Assurances */}
      <section className="soft-section">
        <div className="container credentials-inner">
          <div className="credentials-copy">
            <div className="eyebrow">THE SKYRAY PROMISE</div>
            <h2>Peace of Mind on Every Step</h2>
            <p>From initial enquiry to your safe return home, we handle every detail with precision and care.</p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> Verified 4-star and 5-star hotel partnerships worldwide</li>
              <li><CheckCircle2 size={18} /> Dedicated Hajj &amp; Umrah team with scholars and licensed guides</li>
              <li><CheckCircle2 size={18} /> Transparent pricing with zero hidden booking charges</li>
              <li><CheckCircle2 size={18} /> Custom tailored private and group holiday itineraries</li>
            </ul>
          </div>
          <div className="credentials-stats">
            <div className="c-stat"><strong>10,000+</strong><span>Travellers Served</span></div>
            <div className="c-stat"><strong>99.4%</strong><span>Customer Satisfaction</span></div>
            <div className="c-stat"><strong>50+</strong><span>Global Destinations</span></div>
            <div className="c-stat"><strong>12+</strong><span>Years in Tourism</span></div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="cta-section container">
        <div>
          <div className="eyebrow light">READY TO EXPLORE?</div>
          <h2>Let&apos;s plan your next adventure together.</h2>
          <p>Connect with our destination specialists for tailored quotes and itinerary planning.</p>
        </div>
        <Link className="btn btn-gold" href="/enquire">
          Start Your Enquiry <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
