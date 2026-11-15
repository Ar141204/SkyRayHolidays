'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  Globe2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  Building,
  Award,
  Stamp,
  PhoneCall,
} from 'lucide-react';
import {
  ATTESTATION_SERVICES,
  getStoredAttestationServices,
  type AttestationServiceItem,
} from '@/lib/attestation';

export default function AttestationExplorer() {
  const [items, setItems] = useState<AttestationServiceItem[]>(() => getStoredAttestationServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<AttestationServiceItem | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Attestations' },
    { key: 'Gulf Embassy', label: '🏛️ Gulf Embassies (UAE, Saudi, Qatar, Kuwait)' },
    { key: 'Apostille', label: '🌍 Hague Apostille (120+ Nations)' },
    { key: 'Educational', label: '🎓 Educational & Degree' },
    { key: 'Personal', label: '💍 Marriage, Birth & PCC' },
    { key: 'Commercial', label: '🏢 Commercial & Power of Attorney' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.targetCountries.some((c) => c.toLowerCase().includes(q)) ||
        item.badge.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="attestation-explorer-wrap">
      {/* 1. Header & Trust Stats */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2e48 0%, #17496b 50%, #0284c7 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.14)',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <ShieldCheck size={14} color="#38bdf8" /> Official Government &amp; Consular Legalization
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
            Certificate Attestation &amp; Hague Apostille Services
          </h2>
          <p style={{ fontSize: '14.5px', color: '#e0f2fe', lineHeight: 1.6, margin: 0 }}>
            Fast-track, 100% genuine certificate attestation for UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, and MEA Hague Apostille for 120+ countries (USA, UK, Europe, Australia). Safe document collection and insured courier return.
          </p>
        </div>

        {/* 4 Feature Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>100% Genuine Seals</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#38bdf8" />
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Express 3-Day Turnaround</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe2 size={18} color="#4ade80" />
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>MEA &amp; All Embassies</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={18} color="#f472b6" />
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Tamil Nadu &amp; All State HRDs</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '520px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            placeholder="Search certificate or country (e.g., UAE, Degree, Marriage, Apostille, Saudi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 42px',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px',
              outline: 'none',
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCategory === c.key ? '#0284c7' : '#cbd5e1',
                background: selectedCategory === c.key ? '#0284c7' : '#ffffff',
                color: selectedCategory === c.key ? '#ffffff' : '#334155',
                boxShadow: selectedCategory === c.key ? '0 4px 12px rgba(2, 132, 199, 0.22)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Attestation Service Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="hover-lift"
          >
            {/* Card Header & Badge */}
            <div style={{ padding: '20px 20px 14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    background: '#e0f2fe',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.badge}
                </span>

                {item.hasOffer && (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#b45309',
                      background: '#fef3c7',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={11} /> {item.offerBadge || 'OFFER'}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#17496b', margin: '0 0 8px', lineHeight: 1.35 }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, margin: '0 0 14px' }}>
                {item.shortDesc}
              </p>

              {/* Running offer banner if present and price display is enabled */}
              {item.showPrice && item.hasOffer && item.offerRunningText && (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px dashed #86efac',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    color: '#166534',
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}
                >
                  🎉 {item.offerRunningText}
                </div>
              )}

              {/* Specs: Timeline & Scope */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '6px',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                  <Clock size={13} color="#0284c7" />
                  <strong>Timeline:</strong> {item.processingTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                  <Globe2 size={13} color="#10b981" />
                  <strong>Scope:</strong> {item.targetCountries[0]}
                </div>
              </div>

              {/* Process Workflow Steps */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Legalization Flow:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                  {item.workflow.slice(0, 3).map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '11.5px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={12} color="#10b981" />
                      <span>{w}</span>
                    </div>
                  ))}
                  {item.workflow.length > 3 && (
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, paddingLeft: '18px' }}>
                      + {item.workflow.length - 3} more authentication steps
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer: Pricing & Action Buttons */}
            <div
              style={{
                padding: '12px 20px 16px',
                borderTop: '1px solid #f1f5f9',
                background: '#fafbfc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                  {item.showPrice ? 'Starting from' : 'Service Pricing'}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  {item.showPrice ? (
                    <>
                      <strong style={{ fontSize: '18px', color: '#17496b' }}>
                        {item.offerPrice || item.startingPrice || '₹2,500'}
                      </strong>
                      {item.hasOffer && item.originalPrice && (
                        <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                          {item.originalPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <strong style={{ fontSize: '14.5px', color: '#0284c7', fontWeight: 800 }}>
                      Custom Quote on Enquiry
                    </strong>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                  title="View Required Documents"
                >
                  Checklist
                </button>

                <Link
                  href={`/enquire?service=Attestation&title=${encodeURIComponent(item.title)}`}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  Enquire <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Complete Document Checklist Modal */}
      {activeModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setActiveModalItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 0,
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 800,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {activeModalItem.category} Legalization
            </div>

            <h3 style={{ fontSize: '20px', color: '#17496b', fontWeight: 800, margin: '0 0 10px' }}>
              {activeModalItem.title}
            </h3>

            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>
              {activeModalItem.shortDesc}
            </p>

            {/* Checklist */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#17496b', fontWeight: 800, marginBottom: '8px' }}>
                📋 Required Documents:
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeModalItem.requirements.map((req, i) => (
                  <li key={i} style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Complete Workflow */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13.5px', color: '#17496b', fontWeight: 800, marginBottom: '8px' }}>
                🏛️ Step-by-Step Government Workflow:
              </h4>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {activeModalItem.workflow.map((step, i) => (
                  <div key={i} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#0284c7', fontWeight: 800 }}>{i + 1}.</span>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                Close
              </button>

              <Link
                href={`/enquire?service=Attestation&title=${encodeURIComponent(activeModalItem.title)}`}
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
                onClick={() => setActiveModalItem(null)}
              >
                Start Attestation Enquiry →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
