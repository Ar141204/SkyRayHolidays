import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Smile,
  MapPin,
  Calendar,
  Users,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import PackageGrid from '@/components/PackageGrid';
import GoogleReviews from '@/components/GoogleReviews';

export default function Home() {
  return (
    <>
      {/* 1. Hero Section matching Preview Screen 1 */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="eyebrow light">
            <span></span> WHERE EVERY TRIP BECOMES A MEMORY
          </div>
          <h1>
            Your Journey Begins
            <br />
            <em>with SkyRay Holidays</em>
          </h1>
          <p>
            Discover unforgettable destinations, thoughtfully planned holidays and meaningful pilgrimage journeys.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/packages">
              Explore Packages <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-ghost" href="/enquire">
              Plan Your Trip
            </Link>
          </div>
          <div className="hero-footnote">
            <span>✦ Curated travel experiences</span>
            <span>✦ Personal guidance</span>
            <span>✦ Journeys that matter</span>
          </div>
        </div>
        <div className="hero-stamp">
          <span>YOUR NEXT</span>
          <strong>great<br />escape</strong>
          <small>starts here</small>
        </div>
      </section>

      {/* 2. Stat Counter Strip matching Preview Screen 1 */}
      <section className="stats-strip">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-icon-wrap"><Smile className="stat-icon" /></div>
            <div className="stat-text">
              <strong>10,000+</strong>
              <span>Happy Travellers</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrap"><MapPin className="stat-icon" /></div>
            <div className="stat-text">
              <strong>50+</strong>
              <span>Destinations</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrap"><Calendar className="stat-icon" /></div>
            <div className="stat-text">
              <strong>12+ Years</strong>
              <span>Of Experience</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrap"><Users className="stat-icon" /></div>
            <div className="stat-text">
              <strong>500+</strong>
              <span>Group Tours</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Packages matching Preview Screen 1 */}
      <section className="section container">
        <div className="section-head">
          <div>
            <div className="eyebrow">FIND YOUR NEXT ESCAPE</div>
            <h2>Our Featured <em>Packages</em></h2>
            <p>From quick getaways to once-in-a-lifetime adventures, explore our most popular journeys.</p>
          </div>
          <Link href="/packages" className="text-link">
            View All Packages <ArrowRight size={16} />
          </Link>
        </div>
        <PackageGrid featured />
      </section>

      {/* 4. Hajj & Umrah Pilgrimage Band */}
      <section className="pilgrim-band">
        <div className="container pilgrim-inner">
          <div className="pilgrim-image">
            <Image
              src="/images/destinations/makkah.jpg"
              alt="Makkah Grand Mosque Kaaba View"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="pilgrim-copy">
            <div className="eyebrow light">A JOURNEY OF FAITH</div>
            <h2>
              Hajj &amp; Umrah Services
              <br />
              <em>A Blessed Journey</em>
            </h2>
            <p>
              Dedicated guidance, 5-star accommodations near the Haram, and personalized pilgrimage packages.
              Speak with our team about current arrangements, visa assistance, and verified dates.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link className="btn btn-gold" href="/hajj-umrah">
                Explore Hajj &amp; Umrah <ArrowRight size={17} />
              </Link>
              <Link className="btn btn-ghost" href="/enquire">
                Send Pilgrimage Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features: The SkyRay Way */}
      <section className="section container">
        <div className="section-head centered">
          <div className="eyebrow">THE SKYRAY WAY</div>
          <h2>
            Travel with confidence.
            <br />
            <em>Enjoy every moment.</em>
          </h2>
          <p>Great travel starts with clear information, transparent pricing and people who care about every detail.</p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon"><Compass /></span>
            <h3>Thoughtful planning</h3>
            <p>Explore trip ideas and receive an itinerary crafted to fit your dates, pace and budget.</p>
          </article>
          <article>
            <span className="feature-icon"><HeartHandshake /></span>
            <h3>Personal guidance</h3>
            <p>Speak directly with our experienced team to understand every package detail before deciding.</p>
          </article>
          <article>
            <span className="feature-icon"><ShieldCheck /></span>
            <h3>Clear information</h3>
            <p>No hidden surprises. Inclusions, exclusions, flight details and cancellation conditions are upfront.</p>
          </article>
          <article>
            <span className="feature-icon"><Sparkles /></span>
            <h3>Memories that last</h3>
            <p>From dream family holidays to spiritual pilgrimages, we ensure unforgettable moments.</p>
          </article>
        </div>
      </section>

      {/* 6. Google Reviews Feedback */}
      <section className="reviews-section">
        <div className="container reviews-inner">
          <div>
            <div className="eyebrow">TRAVELLER FEEDBACK</div>
            <h2>
              Good journeys begin
              <br />
              <em>with trust.</em>
            </h2>
            <p>
              Real traveller reviews and feedback. Our verified Google review integration shows authentic feedback from people who explored the world with us.
            </p>
            <Link href="/contact" className="text-link">
              Talk to our team <ArrowRight size={16} />
            </Link>
          </div>
          <GoogleReviews />
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="cta-section container">
        <div>
          <div className="eyebrow light">LET&apos;S PLAN SOMETHING SPECIAL</div>
          <h2>
            Where would you
            <br />
            like to go next?
          </h2>
          <p>Tell us what you have in mind. Our team will tailor the journey of your dreams.</p>
        </div>
        <Link className="btn btn-gold" href="/enquire">
          Start an enquiry <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
