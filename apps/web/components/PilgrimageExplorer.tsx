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

      {/* Grid of Pilgrimage Cards (Economy and Premium) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        {filteredPackages.map((pkg) => {
          const isPremium = pkg.category?.toLowerCase() === 'premium' || pkg.title.toLowerCase().includes('premium');
          return (
            <div
              key={pkg.id || pkg.slug}
              className="pilgrim-featured-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: isPremium ? '2px solid #bae6fd' : '1px solid #e2e8f0',
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
                    padding: '4px 10px',
                    borderRadius: '20px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} /> 5-STAR LUXURY
                </div>
              )}

              <div className="p-card-left" style={{ flex: 1 }}>
                <div className="p-eyebrow" style={{ color: isPremium ? '#0284c7' : '#059669' }}>
                  {pkg.category?.toUpperCase() || (isPremium ? 'PREMIUM TIER' : 'ECONOMY TIER')} &bull; {activeTab}
                </div>
                <h2>{pkg.title}</h2>
                <div className="p-meta">
                  <span className="p-duration"><Clock3 size={15} /> {pkg.duration}</span>
                  <span className="p-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {pkg.rating?.toFixed(1) || '4.9'} ({pkg.reviewCount || 150}+ Verified Pilgrims)
                  </span>
                </div>
                <p className="p-summary">{pkg.summary}</p>

                <div className="p-checklist">
                  <h4>Package Inclusions &amp; Standards:</h4>
                  <ul>
                    {pkg.inclusions?.map((inc, i) => (
                      <li key={i}>
                        <CheckCircle2 size={18} className="p-check-icon" style={{ color: isPremium ? '#0284c7' : '#10b981' }} />
                        {inc}
                      </li>
                    )) || (
                      <>
                        <li><CheckCircle2 size={18} className="p-check-icon" /> Air-conditioned hotels &amp; transfers</li>
                        <li><CheckCircle2 size={18} className="p-check-icon" /> Religious scholar guidance</li>
                        <li><CheckCircle2 size={18} className="p-check-icon" /> Complete visa &amp; Nusuk support</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-action-box" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <div className="p-price">
                    <strong>Custom Itinerary Quote</strong>
                    <small>Options available for Quad, Triple, Double &amp; Single sharing</small>
                  </div>
                  <Link
                    href={`/enquire?package=${pkg.slug}&tier=${isPremium ? 'premium' : 'economy'}`}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: isPremium ? '#0284c7' : '#059669',
                      borderColor: isPremium ? '#0284c7' : '#059669',
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

