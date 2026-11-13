'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

export default function PilgrimageExplorer() {
  const [activeTab, setActiveTab] = useState<'HAJJ' | 'UMRAH'>('HAJJ');
  const [items, setItems] = useState<PackageItem[]>(demoPackages);

  useEffect(() => {
    fetch(`${API_URL}/packages`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const published = data.filter((p: any) => p.status !== 'DRAFT');
          if (published.some((p: any) => p.kind === 'HAJJ' || p.kind === 'UMRAH')) {
            setItems(published);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Filter packages by kind (HAJJ vs UMRAH) and guarantee Premium is first, followed by Economy
  const packages = items
    .filter((p) => p.kind === activeTab)
    .sort((a, b) => {
      const aIsPrem = a.category?.toUpperCase() === 'PREMIUM' || a.title.toUpperCase().includes('PREMIUM');
      const bIsPrem = b.category?.toUpperCase() === 'PREMIUM' || b.title.toUpperCase().includes('PREMIUM');
      if (aIsPrem && !bIsPrem) return -1;
      if (!aIsPrem && bIsPrem) return 1;
      return 0;
    });

  return (
    <div className="pilgrim-showcase-wrapper">
      {/* 1. Top Type Switcher: Hajj Packages vs Umrah Packages (matching user screenshot) */}
      <div className="pilgrim-type-switch-bar">
        <button
          type="button"
          className={`pilgrim-switch-pill ${activeTab === 'HAJJ' ? 'active' : ''}`}
          onClick={() => setActiveTab('HAJJ')}
        >
          Hajj Packages
        </button>

        <button
          type="button"
          className={`pilgrim-switch-pill ${activeTab === 'UMRAH' ? 'active' : ''}`}
          onClick={() => setActiveTab('UMRAH')}
        >
          Umrah Packages
        </button>
      </div>

      {/* 2. Horizontal Split Cards List (matching user screenshot with Economy & Premium packages) */}
      <div className="pilgrim-cards-stack">
        {packages.map((pkg) => {
          const isPremium =
            pkg.category?.toLowerCase() === 'premium' ||
            pkg.title.toLowerCase().includes('premium');

          // Photo selection matching high-res spiritual imagery:
          // Premium Hajj: Makkah Clock Tower & Haram (from user screenshot)
          // Economy Hajj: Makkah Haram Courtyard
          // Premium Umrah: Sacred Madinah Green Dome
          // Economy Umrah: Madinah Courtyard Umbrellas
          const cardImage =
            activeTab === 'HAJJ'
              ? isPremium
                ? '/images/destinations/makkah-night.jpg'
                : '/images/destinations/makkah-kaaba.jpg'
              : isPremium
              ? '/images/destinations/madinah-green-dome.jpg'
              : '/images/destinations/madinah-courtyard.jpg';

          const eyebrowText =
            activeTab === 'HAJJ'
              ? isPremium
                ? 'FEATURED HAJJ JOURNEY'
                : 'ECONOMY HAJJ JOURNEY'
              : isPremium
              ? 'FEATURED UMRAH JOURNEY'
              : 'ECONOMY UMRAH JOURNEY';

          const subtitleCaption = isPremium
            ? 'CUSTOMIZED PACKAGES BASED ON DATES & HOTEL CATEGORY'
            : 'BUDGET-FRIENDLY & COMFORTABLE PACKAGES FOR FAMILIES & GROUPS';

          return (
            <article key={pkg.id || pkg.slug} className="pilgrim-split-card">
              {/* Left Column: Full Package Details & Inclusions */}
              <div className="pilgrim-split-content">
                <span className="pilgrim-eyebrow">{eyebrowText}</span>

                <h2 className="pilgrim-title">{pkg.title}</h2>

                {/* Duration & Star Rating Meta Row */}
                <div className="pilgrim-meta-row">
                  <div className="pilgrim-meta-item">
                    <Clock size={15} color="#0284c7" />
                    <span>{pkg.duration}</span>
                  </div>

                  <div className="pilgrim-meta-item">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span className="rating-text">
                      {pkg.rating ? pkg.rating.toFixed(1) : '5.0'} (Verified Pilgrim Reviews)
                    </span>
                  </div>
                </div>

                {/* Summary Description */}
                <p className="pilgrim-desc">{pkg.summary}</p>

                {/* Key Inclusions Checklist */}
                <div className="pilgrim-inclusions-wrap">
                  <h4 className="pilgrim-inclusions-title">KEY INCLUSIONS:</h4>
                  <ul className="pilgrim-inclusions-list">
                    {pkg.inclusions?.map((inc, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} color="#0284c7" className="pilgrim-check-icon" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Footer */}
                <div className="pilgrim-footer-row">
                  <div className="pilgrim-price-box">
                    <strong className="pilgrim-price-val">Price on Enquiry</strong>
                    <span className="pilgrim-price-caption">{subtitleCaption}</span>
                  </div>

                  <Link
                    href={`/enquire?package=${pkg.slug}&tier=${isPremium ? 'premium' : 'economy'}&service=${activeTab.toLowerCase()}`}
                    className="btn btn-primary pilgrim-enquire-btn"
                  >
                    Enquire Now <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Full-Height Photography with Floating Badge */}
              <div className="pilgrim-split-media">
                <Image
                  src={cardImage}
                  alt={`${pkg.title} - SkyRay Holidays`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority={isPremium}
                  unoptimized={Boolean(cardImage?.startsWith('data:') || cardImage?.startsWith('/uploads'))}
                />

                {/* Subtle vignette gradient overlay */}
                <div className="pilgrim-media-overlay" />

                {/* Floating "Licensed Pilgrim Operator" Badge */}
                <div className="pilgrim-operator-badge">
                  <ShieldCheck size={14} color="#38bdf8" />
                  <span>Licensed Pilgrim Operator</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
