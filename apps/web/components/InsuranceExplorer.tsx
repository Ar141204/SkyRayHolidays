'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Plane,
  HeartPulse,
  Luggage,
  AlertCircle,
  FileCheck,
  Sparkles,
  PhoneCall,
  Loader2,
  Send,
} from 'lucide-react';
import { API_URL } from '@/lib/config';
import {
  INSURANCE_CATEGORIES,
  DEFAULT_INSURANCE_SERVICES,
  getStoredInsuranceServices,
  type InsuranceCategory,
  type InsurancePlanItem,
} from '@/lib/insurance';

export default function InsuranceExplorer() {
  const [plans, setPlans] = useState<InsurancePlanItem[]>(() => getStoredInsuranceServices());
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>('Europe');

  // Form State
  const [formCategory, setFormCategory] = useState<InsuranceCategory>('Europe');
  const [destinationCountry, setDestinationCountry] = useState<string>('France (Schengen Zone)');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [calculatedDays, setCalculatedDays] = useState<number>(0);

  // Customer Contact Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Set today's minimum date for entry
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // AUTOMATIC DAY COUNT CALCULATION
  // "Date of Entry and Return - Idha enter pan a, No of days - Automatic count"
  useEffect(() => {
    if (!entryDate || !returnDate) {
      setCalculatedDays(0);
      return;
    }

    const start = new Date(entryDate);
    const end = new Date(returnDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setCalculatedDays(0);
      return;
    }

    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) {
      setCalculatedDays(0);
      return;
    }

    // Inclusive days: e.g. entry Nov 20, return Nov 20 = 1 day; return Nov 24 = 5 days
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCalculatedDays(diffDays);
  }, [entryDate, returnDate]);

  // Adjust suggested destination country when category changes
  const handleCategoryChange = (cat: InsuranceCategory) => {
    setFormCategory(cat);
    if (cat === 'Europe') {
      setDestinationCountry('France & 29 Schengen Countries');
    } else if (cat === 'United States') {
      setDestinationCountry('United States of America');
    } else if (cat === 'United Kingdom') {
      setDestinationCountry('United Kingdom (England, Scotland, Wales)');
    } else {
      setDestinationCountry('Worldwide (Asia, Middle East, Americas, etc.)');
    }
  };

  async function handleInsuranceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!entryDate || !returnDate) {
      setErrorMsg('Please select both Date of Entry and Date of Return.');
      return;
    }

    if (calculatedDays <= 0) {
      setErrorMsg('Date of Return must be on or after Date of Entry.');
      return;
    }

    setSubmitting(true);

    const totalMembers = adults + children;
    const notes = [
      `Travel Insurance Category: ${formCategory}`,
      `Target Destination / Countries: ${destinationCountry}`,
      `Adults (12+ yrs): ${adults}`,
      `Children (<12 yrs): ${children}`,
      `Date of Entry (Departure): ${entryDate}`,
      `Date of Return: ${returnDate}`,
      `Trip Duration: ${calculatedDays} Days (Automatic Count)`,
      city ? `Customer City: ${city}` : null,
      specialNotes ? `Special Requirements / Pre-existing conditions: ${specialNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      members: totalMembers,
      adults,
      children,
      kids: children,
      serviceType: 'insurance',
      country: destinationCountry,
      packageName: `Travel Insurance (${formCategory}) - ${calculatedDays} Days`,
      preferredDate: entryDate,
      days: calculatedDays,
      nights: calculatedDays,
      instructions: notes,
      sourcePlatform: 'WEBSITE',
      consent: true,
    };

    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      const ref =
        data.reference ||
        `SKY-INS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // Notify business team via serverless mailer
      fetch('/api/enquiry-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          fullName,
          phone,
          email,
          members: totalMembers,
          preferredDate: entryDate,
          days: calculatedDays,
          instructions: notes,
          packageName: `Travel Insurance: ${formCategory} (${calculatedDays} Days)`,
        }),
      }).catch(() => {});

      setSubmittedRef(ref);
    } catch {
      // Offline fallback
      const fallbackRef = `SKY-INS-${Date.now().toString().slice(-6)}`;
      setSubmittedRef(fallbackRef);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="insurance-explorer-container" style={{ margin: '0 auto', maxWidth: '1200px' }}>
      {/* 1. Header Banner & Trust Badges */}
      <div
        style={{
          background: 'linear-gradient(135deg, #09263e 0%, #17496b 55%, #0284c7 100%)',
          borderRadius: '16px',
          padding: '32px 28px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
            }}
          >
            🛡️ GLOBAL TRAVEL &amp; MEDICAL PROTECTION
          </span>
          <span style={{ fontSize: '11px', color: '#bdeaff' }}>• For All Countries</span>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff' }}>
          International Travel Insurance
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#e0f2fe', maxWidth: '780px', lineHeight: 1.6 }}>
          Embassy-approved travel medical protection with cashless emergency hospitalization, baggage loss, flight cancellation, and 24/7 global doctor helpline. Instant digital policy delivery for all destinations worldwide.
        </p>

        {/* 4 Trust Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              padding: '12px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={20} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>100% Embassy Approved</div>
              <small style={{ color: '#cbd5e1', fontSize: '11px' }}>Schengen, US &amp; UK Compliant</small>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              padding: '12px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <HeartPulse size={20} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Cashless Medical Network</div>
              <small style={{ color: '#cbd5e1', fontSize: '11px' }}>Direct hospital settlements</small>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              padding: '12px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FileCheck size={20} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Instant Digital Policy</div>
              <small style={{ color: '#cbd5e1', fontSize: '11px' }}>Delivered via WhatsApp &amp; Email</small>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              padding: '12px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={20} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>24/7 Global Helpline</div>
              <small style={{ color: '#cbd5e1', fontSize: '11px' }}>Assistance in multi-languages</small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Form Section & Category Showcase Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '28px',
          alignItems: 'start',
          marginBottom: '36px',
        }}
        className="insurance-main-grid"
      >
        {/* LEFT: THE INTERACTIVE TRAVEL INSURANCE ENQUIRY FORM */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2edf3',
            borderRadius: '16px',
            padding: '24px 26px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          {submittedRef ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#17496b', marginBottom: '8px' }}>
                Travel Insurance Enquiry Submitted!
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Your enquiry reference is <strong>{submittedRef}</strong>. Our insurance desk will review your trip details and send you instant comparative quotes and policy issuance options via WhatsApp.
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'left',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                <div><strong>Category:</strong> {formCategory}</div>
                <div><strong>Destination:</strong> {destinationCountry}</div>
                <div><strong>Travelers:</strong> {adults} Adult(s), {children} Child(ren)</div>
                <div><strong>Dates:</strong> {entryDate} to {returnDate} ({calculatedDays} Days)</div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSubmittedRef(null);
                  setEntryDate('');
                  setReturnDate('');
                  setCalculatedDays(0);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                }}
              >
                Get Another Quote
              </button>
            </div>
          ) : (
            <form onSubmit={handleInsuranceSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  STEP 1 &bull; SELECT DESTINATION CATEGORY
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 10px 0' }}>
                  Get Instant Travel Insurance Quote
                </h3>

                {/* 4 Category Selection Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  {INSURANCE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleCategoryChange(cat.key)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: formCategory === cat.key ? '#0284c7' : '#cbd5e1',
                        background: formCategory === cat.key ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: formCategory === cat.key ? '#0284c7' : '#334155',
                          }}
                        >
                          {cat.key}
                        </div>
                        <small style={{ fontSize: '10.5px', color: '#64748b' }}>
                          {cat.key === 'Europe' ? 'Schengen Approved' : cat.key === 'Rest of World' ? 'All Countries' : 'Comprehensive'}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>

                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Specific Destination Country / Region (For all Countries):
                </label>
                <input
                  type="text"
                  required
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  placeholder="e.g. France, Switzerland, USA, UK, Singapore, Dubai..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>

              {/* STEP 2: TRAVELERS COUNT (ADULT & CHILD) */}
              <div style={{ marginBottom: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  STEP 2 &bull; NUMBER OF TRAVELERS
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      No of Adult (12+ yrs) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      No of Child (&lt;12 yrs)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: DATES & AUTOMATIC DAY COUNT */}
              {/* "Date of Entry and Return - Idha enter pan a, No of days - Automatic count" */}
              <div style={{ marginBottom: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#0284c7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    STEP 3 &bull; TRIP DATES &amp; DURATION
                  </span>

                  {/* AUTOMATIC COUNT BADGE */}
                  {calculatedDays > 0 && (
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Sparkles size={13} /> {calculatedDays} Days (Automatic count)
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Date of Entry (Departure) *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Date of Return *
                    </label>
                    <input
                      type="date"
                      required
                      min={entryDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                {/* Duration Notification Pill */}
                {entryDate && returnDate && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: calculatedDays > 0 ? '#f0fdf4' : '#fef2f2',
                      border: '1px solid',
                      borderColor: calculatedDays > 0 ? '#bbf7d0' : '#fecaca',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {calculatedDays > 0 ? (
                      <>
                        <span style={{ color: '#166534', fontWeight: 700 }}>
                          📅 Total Coverage Period: {calculatedDays} Days (Inclusive)
                        </span>
                        <span style={{ color: '#15803d', fontSize: '11.5px' }}>Calculated Automatically</span>
                      </>
                    ) : (
                      <span style={{ color: '#b91c1c', fontWeight: 600 }}>
                        ⚠️ Return date must be after or on the Date of Entry.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 4: CONTACT INFORMATION */}
              <div style={{ marginBottom: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  STEP 4 &bull; CONTACT DETAILS FOR POLICY QUOTE
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>
                      City of Residence
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai / Bangalore"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
                  {errorMsg}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                }}
              >
                {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                {submitting ? 'Submitting Travel Insurance Enquiry...' : 'Get Policy Quote & Submit'}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT: CATEGORIES & POLICY HIGHLIGHTS */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Coverage Categories &amp; Limits
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Tailored insurance policies accepted by all world embassies, consulates, and international airports.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plans.map((p) => {
              const isSelected = formCategory === p.category;
              return (
                <div
                  key={p.id}
                  onClick={() => handleCategoryChange(p.category)}
                  style={{
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    border: '1.5px solid',
                    borderColor: isSelected ? '#0284c7' : '#e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : '0 1px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: isSelected ? '#0284c7' : '#e2e8f0',
                          color: isSelected ? '#ffffff' : '#475569',
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.category}
                      </span>
                      <h4 style={{ margin: '6px 0 2px 0', fontSize: '14.5px', fontWeight: 800, color: '#0f2942' }}>
                        {p.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {p.showPrice ? (
                        <>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>From</span>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7' }}>
                            {p.startingPrice}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
                          Quote on Request
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    {p.shortDesc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      🏥 Medical: {p.medicalCoverage}
                    </span>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Support Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                Need Immediate Policy Assistance?
              </div>
              <small style={{ color: '#64748b' }}>Emergency quotes issued within 15 minutes.</small>
            </div>
            <a
              href="https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays%2C%20I%20need%20Travel%20Insurance%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline small"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <PhoneCall size={13} color="#16a34a" /> WhatsApp Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
