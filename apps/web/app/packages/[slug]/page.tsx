import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle2,
  XCircle,
  Star,
  Moon,
  Sparkles,
} from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

async function getPackage(slug: string): Promise<PackageItem | null> {
  try {
    const r = await fetch(`${API_URL}/packages/${slug}`, { next: { revalidate: 60 } });
    if (r.ok) return await r.json();
  } catch { }
  return demoPackages.find((x) => x.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPackage(slug);
  return {
    title: p?.title || 'Package Details | SkyRay Holidays',
    description: p?.summary,
  };
}

export default async function PackageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPackage(slug);
  if (!p) notFound();

  const inclusions = Array.isArray(p.inclusions) && p.inclusions.length > 0
    ? p.inclusions
    : ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Transfers'];

  const exclusions = Array.isArray(p.exclusions) && p.exclusions.length > 0
    ? p.exclusions
    : ['Personal Expenses', 'Visa Fees', 'Optional Activities'];

  const itinerary = Array.isArray(p.itinerary) ? p.itinerary : [];
  const dates = Array.isArray(p.departureDates) ? p.departureDates : [];

  const mainImage = p.image || '/images/destinations/dubai.jpg';
  const thumbnails = [
    mainImage,
    p.kind === 'HAJJ'
      ? '/images/destinations/mecca.jpg'
      : p.kind === 'UMRAH'
      ? '/images/destinations/madinah.jpg'
      : '/images/destinations/maldives.jpg',
    p.kind === 'HAJJ' || p.kind === 'UMRAH'
      ? '/images/destinations/madinah.jpg'
      : '/images/destinations/kashmir.jpg',
  ];

  return (
    <div className="package-detail-page">
      {/* Top Breadcrumb & Hero */}
      <section className="detail-top-strip">
        <div className="container">
          <div className="detail-breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <Link href="/packages">Packages</Link> <span>/</span> <strong>{p.title}</strong>
          </div>
        </div>
      </section>

      {/* Main Split Layout matching Preview Screen 5 */}
      <section className="container detail-hero-grid">
        {/* Left Column: Photo Gallery (Main Photo + 3 Thumbnails) */}
        <div className="detail-gallery">
          <div className="main-photo-frame">
            <Image
              src={mainImage}
              alt={p.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <span className="gallery-kind-tag">
              {p.kind === 'TOUR' ? p.category || 'HOLIDAY' : p.kind}
            </span>
          </div>

          <div className="gallery-thumbnails">
            {thumbnails.map((thumb, idx) => (
              <div key={idx} className={`thumb-item ${idx === 0 ? 'active' : ''}`}>
                <Image
                  src={thumb}
                  alt={`${p.title} preview ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="120px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Details, Inclusions & Enquire CTA matching Preview Screen 5 */}
        <div className="detail-info-panel">
          <h1>{p.title}</h1>

          <div className="detail-rating-row">
            <div className="stars-cluster">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <strong>{p.rating ? p.rating.toFixed(1) : '4.8'}</strong>
            <span>({p.reviewCount || 120} Reviews)</span>
          </div>

          <div className="detail-price-badge">
            <span className="price-amount" style={{ fontSize: '20px' }}>Price on Enquiry</span>
            <span className="meta-pills">
              <span className="pill-item"><Clock3 size={13} /> {p.duration}</span>
              <span className="pill-item"><Moon size={13} /> {p.duration.includes('Night') ? p.duration.split('/')[1]?.trim() : '4 Nights'}</span>
              <span className="pill-item"><MapPin size={13} /> {p.destination}</span>
            </span>
          </div>

          <div className="detail-overview-box">
            <h4>Overview</h4>
            <p>{p.description || p.summary}</p>
          </div>

          <div className="whats-included-card">
            <h4>What&apos;s Included</h4>
            <ul className="included-list">
              {inclusions.map((item, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} className="check-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/enquire?package=${p.slug}`} className="btn btn-primary full-btn">
            Enquire Now <ArrowRight size={17} />
          </Link>
          <small className="enquire-hint">No payment required. Our travel experts will get in touch with you.</small>
        </div>
      </section>

      {/* Itinerary & Additional Details */}
      <section className="section container detail-secondary-section">
        <div className="detail-two-col">
          <div>
            <div className="eyebrow">DAY BY DAY JOURNEY</div>
            <h2>Full Itinerary</h2>
            {itinerary.length > 0 ? (
              <div className="itinerary-timeline">
                {itinerary.map((day: any, i: number) => (
                  <article key={i} className="timeline-day">
                    <span className="day-number">{day.day || `DAY ${i + 1}`}</span>
                    <div className="day-body">
                      <h3>{day.title || 'Travel Day'}</h3>
                      <p>{day.description || 'Day program confirmed upon final booking.'}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="itinerary-placeholder">
                <p>Complete custom day-by-day itinerary will be customized to your travel dates and group preferences.</p>
              </div>
            )}

            {dates.length > 0 && (
              <div className="departure-dates-block">
                <h3><CalendarDays size={18} /> Available Departure Dates</h3>
                <div className="dates-chips">
                  {dates.map((d: any, idx: number) => (
                    <span key={idx} className="date-chip">
                      {typeof d === 'string' ? d : d.date || JSON.stringify(d)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="inclusions-exclusions-sidebar">
            <div className="sidebar-box">
              <h3><CheckCircle2 className="check-green" size={20} /> Included</h3>
              <ul>
                {inclusions.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-box">
              <h3><XCircle className="cross-red" size={20} /> Not Included</h3>
              <ul>
                {exclusions.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-cta-card">
              <Sparkles size={24} color="#f59e0b" />
              <h4>Custom Itineraries</h4>
              <p>Want to extend your stay or customize activities? Speak with our travel designers.</p>
              <Link href={`/enquire?package=${p.slug}`} className="text-link">
                Customize this trip →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
