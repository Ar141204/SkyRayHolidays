'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  VISA_SERVICES,
  SCHENGEN_MEMBER_COUNTRIES,
  POPULAR_EVISA_COUNTRIES,
  type VisaServiceItem,
} from '@/lib/visas';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Calendar,
  Globe2,
  FileCheck2,
  ShieldCheck,
  Plane,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function VisaExplorer() {
  const [showAllSchengen, setShowAllSchengen] = useState(false);
  const [showAllEvisa, setShowAllEvisa] = useState(false);

  return (
    <div className="visa-explorer-wrap">
      {/* 4 Visa Columns / Small Boxes arranged just like holiday packages */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
          gap: '20px',
        }}
      >
        {VISA_SERVICES.map((v) => {
          const isUS = v.slug === 'us-visa';
          const isUK = v.slug === 'uk-visa';
          const isSchengen = v.slug === 'schengen-visa';
          const isEvisa = v.slug === 'e-visa';

          // Build Enquire URL with appropriate pre-selection
          let enquireUrl = `/enquire?service=visa`;
          if (isUS) {
            enquireUrl = `/enquire?service=visa&visaCategory=us&country=United%20States`;
          } else if (isUK) {
            enquireUrl = `/enquire?service=visa&visaCategory=uk&country=United%20Kingdom`;
          } else if (isSchengen) {
            enquireUrl = `/enquire?service=visa&visaCategory=schengen`;
          } else if (isEvisa) {
            enquireUrl = `/enquire?service=visa&visaCategory=evisa`;
          }

          return (
            <article
              key={v.id}
              className="package-card visa-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '14px',
                border: '1px solid #e2edf3',
                background: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(15, 35, 50, 0.04)',
                position: 'relative',
              }}
            >
              {/* Card Photo Header */}
              <div
                style={{
                  position: 'relative',
                  height: '175px',
                  width: '100%',
                  overflow: 'hidden',
                  background: '#0f172a',
                }}
              >
                <Image
                  src={
                    isUS
                      ? '/images/destinations/us-visa.jpg'
                      : isUK
                      ? '/images/destinations/uk-visa.jpg'
                      : isSchengen
                      ? '/images/destinations/europe.jpg'
                      : '/images/destinations/dubai.jpg'
                  }
                  alt={v.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.7) 100%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '4px 9px',
                    borderRadius: '5px',
                    textTransform: 'uppercase',
                    zIndex: 2,
                  }}
                >
                  {v.badge}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'rgba(2, 132, 199, 0.9)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock3 size={13} /> {v.processingTime}
                </span>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '4px',
                  }}
                >
                  {v.category}
                </div>

                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#17496b',
                    margin: '2px 0 8px',
                    lineHeight: 1.25,
                  }}
                >
                  {v.title}
                </h3>

                <p
                  style={{
                    fontSize: '12.5px',
                    color: '#475569',
                    lineHeight: 1.55,
                    marginBottom: '14px',
                  }}
                >
                  {v.shortDesc}
                </p>

                {/* Key Checklist Highlights */}
                <div style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#17496b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '8px',
                    }}
                  >
                    Services Included:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
                    {v.highlights.map((h, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#334155',
                        }}
                      >
                        <CheckCircle2 size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SPECIAL SECTION: Schengen Member Countries Display */}
                {isSchengen && (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Globe2 size={13} color="#0284c7" />
                        29 Schengen Member Countries:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAllSchengen(!showAllSchengen)}
                        style={{
                          background: 'none',
                          border: 0,
                          color: '#0284c7',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: 0,
                        }}
                      >
                        {showAllSchengen ? 'Less' : 'View All'}
                        {showAllSchengen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        maxHeight: showAllSchengen ? 'none' : '62px',
                        overflow: 'hidden',
                      }}
                    >
                      {SCHENGEN_MEMBER_COUNTRIES.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#334155',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPECIAL SECTION: E-Visa Applicable Countries Display */}
                {isEvisa && (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Globe2 size={13} color="#0284c7" />
                        Popular E-Visa Destinations:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAllEvisa(!showAllEvisa)}
                        style={{
                          background: 'none',
                          border: 0,
                          color: '#0284c7',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: 0,
                        }}
                      >
                        {showAllEvisa ? 'Less' : 'View All'}
                        {showAllEvisa ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        maxHeight: showAllEvisa ? 'none' : '62px',
                        overflow: 'hidden',
                      }}
                    >
                      {POPULAR_EVISA_COUNTRIES.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#334155',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Box with Enquire Now Button */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    <strong style={{ display: 'block', color: '#17496b', fontSize: '13px' }}>
                      Fast Assistance
                    </strong>
                    Tourist, Business &amp; Medical
                  </div>

                  <Link
                    href={enquireUrl}
                    className="btn btn-primary"
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: '1px solid #0284c7',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Enquire Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
