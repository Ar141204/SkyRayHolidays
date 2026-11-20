'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PackageExplorer from '@/components/PackageExplorer';
import VisaExplorer from '@/components/VisaExplorer';
import AttestationExplorer from '@/components/AttestationExplorer';
import InsuranceExplorer from '@/components/InsuranceExplorer';
import { Plane, FileText, LayoutGrid, ArrowRight, ShieldCheck, Clock, Award, Sparkles, FileCheck } from 'lucide-react';

export default function ServicesHub() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'visa' | 'attestation' | 'insurance'>('all');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'packages' || tab === 'tours') {
      setActiveTab('packages');
    } else if (tab === 'visa' || tab === 'visas') {
      setActiveTab('visa');
    } else if (tab === 'attestation' || tab === 'apostille') {
      setActiveTab('attestation');
    } else if (tab === 'insurance' || tab === 'travel-insurance') {
      setActiveTab('insurance');
    } else {
      setActiveTab('all');
    }
  }, [searchParams]);

  return (
    <div className="services-hub-wrapper">
      {/* 1. Top Service Switcher Navigation */}
      <div
        className="service-switcher-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '36px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: activeTab === 'all' ? '#0284c7' : '#cbd5e1',
            background: activeTab === 'all' ? '#0284c7' : '#ffffff',
            color: activeTab === 'all' ? '#ffffff' : '#334155',
            boxShadow: activeTab === 'all' ? '0 4px 14px rgba(2, 132, 199, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <LayoutGrid size={16} /> All Services (Tours &amp; Visas)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: activeTab === 'packages' ? '#0284c7' : '#cbd5e1',
            background: activeTab === 'packages' ? '#0284c7' : '#ffffff',
            color: activeTab === 'packages' ? '#ffffff' : '#334155',
            boxShadow: activeTab === 'packages' ? '0 4px 14px rgba(2, 132, 199, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <Plane size={16} /> Tour Packages
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visa')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: activeTab === 'visa' ? '#0284c7' : '#cbd5e1',
            background: activeTab === 'visa' ? '#0284c7' : '#ffffff',
            color: activeTab === 'visa' ? '#ffffff' : '#334155',
            boxShadow: activeTab === 'visa' ? '0 4px 14px rgba(2, 132, 199, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <FileText size={16} /> Visa Services (US, UK, Schengen, E-Visa)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attestation')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: activeTab === 'attestation' ? '#0284c7' : '#cbd5e1',
            background: activeTab === 'attestation' ? '#0284c7' : '#ffffff',
            color: activeTab === 'attestation' ? '#ffffff' : '#334155',
            boxShadow: activeTab === 'attestation' ? '0 4px 14px rgba(2, 132, 199, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <Award size={16} /> Certificate Attestation &amp; Apostille
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insurance')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: activeTab === 'insurance' ? '#0284c7' : '#cbd5e1',
            background: activeTab === 'insurance' ? '#0284c7' : '#ffffff',
            color: activeTab === 'insurance' ? '#ffffff' : '#334155',
            boxShadow: activeTab === 'insurance' ? '0 4px 14px rgba(2, 132, 199, 0.28)' : '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <ShieldCheck size={16} /> Travel Insurance (Europe, US, UK, Global)
        </button>
      </div>

      {/* 2. Tour Packages Section */}
      {(activeTab === 'all' || activeTab === 'packages') && (
        <section id="tour-packages" style={{ marginBottom: activeTab === 'all' ? '60px' : '20px' }}>
          <div className="section-head" style={{ marginBottom: '24px' }}>
            <div>
              <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Plane size={13} color="#0284c7" /> CURATED JOURNEYS &amp; HOLIDAYS
              </div>
              <h2>Tour Packages &amp; Key Destinations</h2>
              <p>
                Handcrafted holiday packages featuring our specialized key destinations (Reunion Island, Russia, Turkey, Mauritius, Maldives, Seychelles, Armenia, Georgia, Azerbaijan) and custom international getaways.
              </p>
            </div>
            {activeTab === 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                className="text-link"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
              >
                Focus on Packages <ArrowRight size={15} />
              </button>
            )}
          </div>

          <PackageExplorer />
        </section>
      )}

      {/* Divider when in 'all' view */}
      {activeTab === 'all' && (
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
            margin: '40px 0',
          }}
        />
      )}

      {/* 3. International Visa Services Section */}
      {(activeTab === 'all' || activeTab === 'visa') && (
        <section id="visa-services" style={{ marginBottom: activeTab === 'all' ? '60px' : '20px' }}>
          <div className="section-head" style={{ marginBottom: '24px' }}>
            <div>
              <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={13} color="#0284c7" /> OFFICIAL EMBASSY &amp; FAST-TRACK VISAS
              </div>
              <h2>International Visa Services</h2>
              <p>
                Arranged in small boxes just like our holiday packages. Choose from US B1/B2, UK Visitor, all 29 Schengen member states, and 50+ Global E-Visas.
              </p>
            </div>
            {activeTab === 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('visa')}
                className="text-link"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
              >
                Focus on Visas <ArrowRight size={15} />
              </button>
            )}
          </div>

          <VisaExplorer />
        </section>
      )}

      {/* Divider when in 'all' view */}
      {activeTab === 'all' && (
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
            margin: '40px 0',
          }}
        />
      )}

      {/* 4. Certificate Attestation & Apostille Services Section */}
      {(activeTab === 'all' || activeTab === 'attestation') && (
        <section id="attestation-services">
          <div className="section-head" style={{ marginBottom: '24px' }}>
            <div>
              <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Award size={13} color="#0284c7" /> OFFICIAL EMBASSY &amp; MEA APOSTILLE LEGALIZATION
              </div>
              <h2>Certificate Attestation &amp; Apostille Services</h2>
              <p>
                Complete document verification for UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, and 120+ Hague Apostille nations. Educational degrees, marriage certificates, birth certificates, and commercial documents.
              </p>
            </div>
            {activeTab === 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('attestation')}
                className="text-link"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
              >
                Focus on Attestation <ArrowRight size={15} />
              </button>
            )}
          </div>

          <AttestationExplorer />
        </section>
      )}

      {/* 4. Travel Insurance Section */}
      {(activeTab === 'all' || activeTab === 'insurance') && (
        <section id="travel-insurance" style={{ marginBottom: activeTab === 'all' ? '60px' : '20px' }}>
          <div className="section-head" style={{ marginBottom: '24px' }}>
            <div>
              <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} color="#0284c7" /> EMBASSY APPROVED PROTECTION &bull; ALL COUNTRIES
              </div>
              <h2>International Travel Insurance</h2>
              <p>
                Comprehensive emergency medical cover, COVID hospitalization, baggage protection, and flight cancellation assistance across Europe (Schengen €30,000+), the United States, the United Kingdom, and all countries worldwide with automatic day calculation.
              </p>
            </div>
            {activeTab === 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('insurance')}
                className="text-link"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
              >
                Focus on Insurance <ArrowRight size={15} />
              </button>
            )}
          </div>

          <InsuranceExplorer />
        </section>
      )}

      {/* 4. Service Assurance Guarantee */}
      <section style={{ marginTop: '54px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
        <div className="feature-grid">
          <article>
            <div className="feature-icon"><Award /></div>
            <h3>Transparent Pricing</h3>
            <p>Clear inclusions, upfront government fee details, and zero hidden costs on all tours and visas.</p>
          </article>
          <article>
            <div className="feature-icon"><ShieldCheck /></div>
            <h3>99% Audit Accuracy</h3>
            <p>Complete document pre-screening and mock preparation to ensure maximum approval confidence.</p>
          </article>
          <article>
            <div className="feature-icon"><Clock /></div>
            <h3>Fast Response Desk</h3>
            <p>Direct assistance via phone, WhatsApp, and email from our Kumbakonam and Saudi support teams.</p>
          </article>
          <article>
            <div className="feature-icon"><Sparkles /></div>
            <h3>Customized For You</h3>
            <p>Tailored private or group packages, custom flight routing, and hotel upgrades to match your pace.</p>
          </article>
        </div>
      </section>

      {/* 5. Bottom Consultation Banner */}
      <div
        className="cta-section"
        style={{
          marginTop: '44px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div className="eyebrow light">READY TO PLAN?</div>
          <h2>Need Guidance on a Tour or Visa?</h2>
          <p>
            Tell us about your destination or visa query. Our concierge desk will prepare an itinerary or checklist within hours.
          </p>
        </div>
        <Link className="btn btn-gold" href="/enquire">
          Start an Enquiry <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

