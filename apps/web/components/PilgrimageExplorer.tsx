'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock3, Star, Sparkles } from 'lucide-react';
import { demoPackages, type PackageItem } from '@/lib/config';

export default function PilgrimageExplorer() {
  const [activeTab, setActiveTab] = useState<'HAJJ' | 'UMRAH'>('HAJJ');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'PREMIUM' | 'ECONOMY'>('ALL');

  const packages = demoPackages.filter((p) => p.kind === activeTab);
  const filteredPackages = packages.filter((p) => {
    if (tierFilter === 'ALL') return true;
    return p.category?.toUpperCase() === tierFilter || p.title?.toUpperCase().includes(tierFilter);
  });

  return (
    <div className="pilgrim-showcase">
      {/* Tab Switcher: Hajj vs Umrah */}
      <div className="pilgrim-tabs">
        <button
          className={`pilgrim-tab-btn ${activeTab === 'HAJJ' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('HAJJ');
            setTierFilter('ALL');
          }}
        >
          🕋 Hajj Packages
        </button>
        <button
          className={`pilgrim-tab-btn ${activeTab === 'UMRAH' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('UMRAH');
            setTierFilter('ALL');
          }}
        >
          🌙 Umrah Packages
        </button>
      </div>

      {/* Tier Switcher Pills: All, Premium, Economy */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0 28px' }}>
        <button
          className={`category-pill ${tierFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setTierFilter('ALL')}
        >
          All {activeTab === 'HAJJ' ? 'Hajj' : 'Umrah'} Packages
        </button>
        <button
          className={`category-pill ${tierFilter === 'PREMIUM' ? 'active' : ''}`}
          onClick={() => setTierFilter('PREMIUM')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <Sparkles size={14} color="#f59e0b" /> Premium (5-Star &amp; Haram View)
        </button>
        <button
          className={`category-pill ${tierFilter === 'ECONOMY' ? 'active' : ''}`}
          onClick={() => setTierFilter('ECONOMY')}
        >
          Economy (Comfort &amp; Proximity)
        </button>
      </div>

      {/* Responsive Grid of Pilgrimage Cards (Economy and Premium) */}
      <div className="pilgrim-cards-responsive-grid">
        {filteredPackages.map((pkg) => {
          const isPremium = pkg.category?.toLowerCase() === 'premium' || pkg.title.toLowerCase().includes('premium');
          const meccaImg =
            pkg.meccaImage ||
            (isPremium ? '/images/destinations/makkah-night.jpg' : '/images/destinations/makkah-kaaba.jpg');
          const madinahImg =
            pkg.madinahImage ||
            (isPremium ? '/images/destinations/madinah-green-dome.jpg' : '/images/destinations/madinah-courtyard.jpg');

          return (
            <div
              key={pkg.id || pkg.slug}
              className="pilgrim-featured-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: isPremium ? '2px solid #38bdf8' : '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: isPremium ? '0 10px 30px rgba(2, 132, 199, 0.12)' : '0 6px 20px rgba(15, 23, 42, 0.05)',
                position: 'relative',
              }}
            >
              {isPremium && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '20px',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  <Sparkles size={13} /> 5-STAR LUXURY
                </div>
              )}

              {/* Dual Holy Cities Image Showcase */}
              <div
                className="pilgrim-dual-showcase"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  height: '210px',
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  gap: '2px',
                }}
              >
                {/* Mecca Image Container */}
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  <Image
                    src={meccaImg}
                    alt="Makkah al-Mukarramah"
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.7) 100%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: 'rgba(15,23,42,0.82)',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    🕋 Makkah {pkg.details?.makkahNights ? `(${pkg.details.makkahNights})` : ''}
                  </span>
                </div>

                {/* Madina Image Container */}
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  <Image
                    src={madinahImg}
                    alt="Al-Madinah al-Munawwarah"
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.7) 100%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: 'rgba(15,23,42,0.82)',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    🕌 Madinah {pkg.details?.madinahNights ? `(${pkg.details.madinahNights})` : ''}
                  </span>
                </div>
              </div>

              {/* Package Content & Inclusions */}
              <div className="p-card-left pilgrim-card-body" style={{ flex: 1 }}>
                <div className="p-eyebrow" style={{ color: isPremium ? '#0284c7' : '#059669', fontWeight: 800 }}>
                  {pkg.category?.toUpperCase() || (isPremium ? 'PREMIUM TIER' : 'ECONOMY TIER')} &bull; {activeTab}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#17496b', margin: '8px 0 10px' }}>
                  {pkg.title}
                </h2>
                <div className="p-meta" style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="p-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                    <Clock3 size={15} color="#0284c7" /> {pkg.duration}
                  </span>
                  <span className="p-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {pkg.rating?.toFixed(1) || '4.9'} ({pkg.reviewCount || 150}+ Verified Pilgrims)
                  </span>
                </div>
                <p className="p-summary" style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>
                  {pkg.summary}
                </p>

                <div className="p-checklist" style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#17496b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Package Inclusions &amp; Standards:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
                    {pkg.inclusions?.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                        <CheckCircle2 size={16} className="p-check-icon" style={{ color: isPremium ? '#0284c7' : '#10b981', flexShrink: 0 }} />
                        {inc}
                      </li>
                    )) || (
                      <>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                          <CheckCircle2 size={16} className="p-check-icon" style={{ color: '#0284c7' }} /> Air-conditioned hotels &amp; transfers
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                          <CheckCircle2 size={16} className="p-check-icon" style={{ color: '#0284c7' }} /> Religious scholar guidance
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-action-box" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div className="p-price">
                    <strong style={{ fontSize: '15px', color: '#17496b', display: 'block' }}>Custom Itinerary Quote</strong>
                    <small style={{ fontSize: '11px', color: '#64748b' }}>Options for Quad, Triple, Double &amp; Single</small>
                  </div>
                  <Link
                    href={`/enquire?package=${pkg.slug}&tier=${isPremium ? 'premium' : 'economy'}`}
                    className="btn btn-primary"
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: '1px solid #0284c7',
                      fontWeight: 800,
                      borderRadius: '8px',
                      padding: '11px 18px',
                    }}
                  >
                    Enquire for {isPremium ? 'Premium' : 'Economy'} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

