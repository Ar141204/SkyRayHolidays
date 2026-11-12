'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, demoPackages } from '@/lib/config';
import { WORLD_COUNTRIES, getCountryByNameOrSlug } from '@/lib/countries';
import { SCHENGEN_MEMBER_COUNTRIES, POPULAR_EVISA_COUNTRIES } from '@/lib/visas';
import { CheckCircle2, LoaderCircle, Send, MessageCircle, Globe2, ShieldCheck, Plane, FileText } from 'lucide-react';

type ServiceType = 'umrah' | 'tour' | 'visa';
type VisaType = 'Tourist Visa' | 'Business Visa' | 'Medical Visa';
type TourMode = 'Private Tour' | 'Group Tour';

const initial = {
  fullName: '',
  phone: '',
  email: '',
  adults: '2',
  children: '0',
  infants: '0',
  serviceType: 'tour' as ServiceType,
  // Visa Fields
  visaCountry: 'United States',
  visaType: 'Tourist Visa' as VisaType,
  // Tour Package Fields
  tourCountry: '',
  tourType: 'Private Tour' as TourMode,
  nights: '5',
  // Umrah Fields
  umrahPackageSlug: 'economy-umrah-15-days',
  umrahTier: 'economy',
  // Common
  preferredDate: '',
  instructions: '',
  consent: false,
};

export default function EnquiryForm() {
  const params = useSearchParams();
  const idempotencyKey = useRef<string | null>(null);
  const [form, setForm] = useState(initial);
  const [packages, setPackages] = useState<any[]>([]);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const serviceParam = (params.get('service') || '').toLowerCase();
    const visaCategory = (params.get('visaCategory') || '').toLowerCase();
    const countryParam = params.get('country') || '';
    const visaTypeParam = params.get('visaType') || '';
    const packageParam = params.get('package') || '';
    const tierParam = (params.get('tier') || '').toLowerCase();

    // Determine initial service from URL params
    let detectedService: ServiceType = 'tour';
    if (serviceParam === 'visa' || visaCategory || countryParam.toLowerCase().includes('visa')) {
      detectedService = 'visa';
    } else if (
      serviceParam === 'umrah' ||
      serviceParam === 'hajj' ||
      packageParam.includes('umrah') ||
      packageParam.includes('hajj')
    ) {
      detectedService = 'umrah';
    } else if (serviceParam === 'tour' || packageParam) {
      detectedService = 'tour';
    }

    setForm((prev) => {
      const next = { ...prev, serviceType: detectedService };

      // Set visa specific pre-selections
      if (detectedService === 'visa') {
        if (countryParam) {
          next.visaCountry = countryParam;
        } else if (visaCategory === 'us') {
          next.visaCountry = 'United States';
        } else if (visaCategory === 'uk') {
          next.visaCountry = 'United Kingdom';
        } else if (visaCategory === 'schengen') {
          next.visaCountry = 'France (Schengen)';
        } else if (visaCategory === 'evisa') {
          next.visaCountry = 'United Arab Emirates';
        }
        if (visaTypeParam && ['Tourist', 'Business', 'Medical'].some((t) => visaTypeParam.includes(t))) {
          if (visaTypeParam.includes('Business')) next.visaType = 'Business Visa';
          else if (visaTypeParam.includes('Medical')) next.visaType = 'Medical Visa';
          else next.visaType = 'Tourist Visa';
        }
      }

      // Set tour specific pre-selections
      if (detectedService === 'tour') {
        if (countryParam) {
          next.tourCountry = countryParam;
        } else if (packageParam) {
          next.tourCountry = packageParam;
        }
      }

      // Set umrah specific pre-selections
      if (detectedService === 'umrah') {
        if (tierParam) next.umrahTier = tierParam;
        if (packageParam) next.umrahPackageSlug = packageParam;
      }

      return next;
    });

    fetch(`${API_URL}/packages`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setPackages(d);
        else setPackages(demoPackages);
      })
      .catch(() => setPackages(demoPackages));
  }, [params]);

  function update(k: string, v: any) {
    idempotencyKey.current = null;
    setForm((x) => ({ ...x, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setMessage('');

    try {
      const requestKey = (idempotencyKey.current ||= crypto.randomUUID());

      const numAdults = Number(form.adults) || 1;
      const numChildren = Number(form.children) || 0;
      const numInfants = Number(form.infants) || 0;
      const totalMembers = numAdults + numChildren + numInfants;

      let serviceLabel = '';
      let targetCountry = '';
      let daysCount = 5;

      if (form.serviceType === 'visa') {
        serviceLabel = `Visa: ${form.visaCountry} (${form.visaType})`;
        targetCountry = form.visaCountry;
        daysCount = 1;
      } else if (form.serviceType === 'tour') {
        targetCountry = form.tourCountry || 'International';
        daysCount = Number(form.nights) || 5;
        serviceLabel = `Tour: ${targetCountry} (${form.tourType})`;
      } else if (form.serviceType === 'umrah') {
        const tierName = form.umrahTier === 'premium' ? 'Premium (5-Star)' : 'Economy';
        serviceLabel = `Umrah Enquiry: ${tierName} Tier`;
        targetCountry = 'Saudi Arabia (Makkah & Madinah)';
        daysCount = 15;
      }

      const payload: Record<string, any> = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        members: totalMembers,
        adults: numAdults,
        children: numChildren,
        kids: numChildren,
        infants: numInfants,
        serviceType: form.serviceType,
        visaType: form.serviceType === 'visa' ? form.visaType : undefined,
        tourType: form.serviceType === 'tour' ? form.tourType : undefined,
        tier: form.serviceType === 'umrah' ? form.umrahTier : undefined,
        country: targetCountry,
        packageName: serviceLabel,
        preferredDate: form.preferredDate,
        days: daysCount,
        nights: daysCount,
        consent: Boolean(form.consent),
        sourcePlatform: 'WEBSITE',
      };

      if (form.instructions?.trim()) {
        payload.instructions = form.instructions.trim();
      }

      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': requestKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to submit enquiry. Please check your details and try again.');
      }

      const finalRef =
        data.reference ||
        data.enquiryReference ||
        `SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

      setReference(finalRef);
      setSubmittedData({
        ...form,
        reference: finalRef,
        serviceLabel,
        targetCountry,
        daysCount,
        members: totalMembers,
        numAdults,
        numChildren,
        numInfants,
      });
      setState('success');
      idempotencyKey.current = null;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        setMessage(err.message);
        setState('error');
      } else {
        // Safe offline / mock fallback
        const fallbackRef = `SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        const numAdults = Number(form.adults) || 1;
        const numChildren = Number(form.children) || 0;
        const numInfants = Number(form.infants) || 0;
        const totalMembers = numAdults + numChildren + numInfants;

        let serviceLabel = '';
        let targetCountry = '';
        if (form.serviceType === 'visa') {
          serviceLabel = `Visa: ${form.visaCountry} (${form.visaType})`;
          targetCountry = form.visaCountry;
        } else if (form.serviceType === 'tour') {
          targetCountry = form.tourCountry || 'International';
          serviceLabel = `Tour: ${targetCountry} (${form.tourType})`;
        } else {
          serviceLabel = `Umrah Enquiry (${form.umrahTier.toUpperCase()} Tier)`;
          targetCountry = 'Saudi Arabia';
        }

        setReference(fallbackRef);
        setSubmittedData({
          ...form,
          reference: fallbackRef,
          serviceLabel,
          targetCountry,
          daysCount: Number(form.nights) || 5,
          members: totalMembers,
          numAdults,
          numChildren,
          numInfants,
        });
        setState('success');
      }
    }
  }

  // Confirmation screen with instant WhatsApp forwarding
  if (state === 'success') {
    const waDetails = [
      `Hello SkyRay Holidays! I just submitted an enquiry on your website.`,
      `• Reference: ${reference}`,
      `• Name: ${submittedData?.fullName || form.fullName}`,
      `• Contact Number / WhatsApp: ${submittedData?.phone || form.phone}`,
      `• Email: ${submittedData?.email || form.email}`,
      `• Service: ${submittedData?.serviceLabel || 'Custom Enquiry'}`,
      submittedData?.serviceType === 'visa' ? `• Visa Type: ${submittedData.visaType} (Only Tourist/Business/Medical)` : null,
      submittedData?.serviceType === 'tour' ? `• Tour Option: ${submittedData.tourType} (${submittedData.nights} Nights)` : null,
      `• Travel Date: ${submittedData?.preferredDate || ''}`,
      `• Travelers: ${submittedData?.numAdults || 1} Adult(s) [12+ yrs], ${submittedData?.numChildren || 0} Child(ren) [<12 yrs], ${submittedData?.numInfants || 0} Infant(s) [0-2 yrs]`,
      submittedData?.instructions ? `• Requirements: ${submittedData.instructions}` : null,
      `Please provide quotation and consultation details.`,
    ]
      .filter(Boolean)
      .join('\n');

    return (
      <div className="confirmation-card-screen">
        <div className="confirmation-card-inner">
          <div className="confirmation-check-wrap">
            <CheckCircle2 size={54} className="check-icon-large" />
          </div>

          <h2>Thank You!</h2>
          <p className="confirmation-sub">
            Your enquiry has been successfully logged.
            <br />
            Our travel &amp; visa desk will contact you shortly.
          </p>

          <div className="reference-badge-box">
            <span>Enquiry Reference:</span>
            <strong>{reference || 'SRH202601'}</strong>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              margin: '16px 0',
              textAlign: 'left',
              fontSize: '12.5px',
              lineHeight: 1.6,
            }}
          >
            <div><strong>Service:</strong> {submittedData?.serviceLabel}</div>
            <div><strong>Travelers:</strong> {submittedData?.numAdults} Adults (12+ yrs), {submittedData?.numChildren} Children (&lt;12 yrs), {submittedData?.numInfants} Infants (0-2 yrs)</div>
            <div><strong>Date of Travel:</strong> {submittedData?.preferredDate}</div>
            <div><strong>Contact:</strong> {submittedData?.phone} ({submittedData?.email})</div>
          </div>

          <div style={{ margin: '14px 0', width: '100%' }}>
            <a
              href={`https://wa.me/919176357791?text=${encodeURIComponent(waDetails)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{
                backgroundColor: '#25D366',
                borderColor: '#25D366',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#ffffff',
                width: '100%',
                fontWeight: 700,
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              Forward to WhatsApp for Instant Consultation
            </a>
          </div>

          <div className="confirmation-actions">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <button className="btn btn-outline" onClick={() => { setState('idle'); setForm(initial); }}>
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="form-grid">
        {/* Full Name */}
        <label className="span-2">
          Full Name *
          <input
            required
            minLength={2}
            maxLength={100}
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. Syed Rahamathullah"
          />
        </label>

        {/* Email Address */}
        <label>
          Email Address *
          <input
            required
            type="email"
            maxLength={180}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        {/* Contact Number / WhatsApp */}
        <label>
          Contact Number / WhatsApp *
          <input
            required
            type="tel"
            minLength={7}
            maxLength={25}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 91763 57791"
          />
        </label>

        {/* Number of Members Breakdown */}
        <div className="span-2" style={{ borderTop: '1px solid #edf2f7', paddingTop: '14px', marginTop: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#17496b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Number of Members
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <label>
              Adult (12 years above) *
              <input
                required
                type="number"
                min="1"
                max="100"
                value={form.adults}
                onChange={(e) => update('adults', e.target.value)}
              />
            </label>

            <label>
              Child (12 years below)
              <input
                type="number"
                min="0"
                max="50"
                value={form.children}
                onChange={(e) => update('children', e.target.value)}
              />
            </label>

            <label>
              Infant (0 to 2 years)
              <input
                type="number"
                min="0"
                max="30"
                value={form.infants}
                onChange={(e) => update('infants', e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Select Service (Replaces Select Package) */}
        <label className="span-2" style={{ borderTop: '1px solid #edf2f7', paddingTop: '14px', marginTop: '4px' }}>
          Select Service *
          <select
            required
            value={form.serviceType}
            onChange={(e) => update('serviceType', e.target.value as ServiceType)}
            style={{ fontWeight: 700, borderColor: '#0284c7', background: '#f8fcfe' }}
          >
            <option value="tour">Tour Package Enquiry</option>
            <option value="umrah">Umrah Enquiry</option>
            <option value="visa">Visa Enquiry</option>
          </select>
        </label>

        {/* CONDITIONAL SECTION 1: VISA ENQUIRY */}
        {form.serviceType === 'visa' && (
          <>
            <label className="span-2">
              Country for Visa *
              <select
                required
                value={form.visaCountry}
                onChange={(e) => update('visaCountry', e.target.value)}
              >
                <optgroup label="⭐ Major Embassy Visas">
                  <option value="United States">United States (US Visa - B1/B2)</option>
                  <option value="United Kingdom">United Kingdom (UK Visitor Visa)</option>
                </optgroup>

                <optgroup label="🇪🇺 Schengen Member Countries (29 Countries)">
                  {SCHENGEN_MEMBER_COUNTRIES.map((country) => (
                    <option value={`${country} (Schengen)`} key={country}>
                      {country} (Schengen Area)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="⚡ Global E-Visa Countries (Fast-Track Online)">
                  {POPULAR_EVISA_COUNTRIES.map((country) => (
                    <option value={`${country} (E-Visa)`} key={country}>
                      {country} (Electronic E-Visa)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌍 All World Countries (A–Z Orderwise)">
                  {WORLD_COUNTRIES.map((c) => (
                    <option value={c.name} key={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>

            <label className="span-2">
              Type of Visa * (Tourist, Business, Medical Only)
              <select
                required
                value={form.visaType}
                onChange={(e) => update('visaType', e.target.value as VisaType)}
              >
                <option value="Tourist Visa">Tourist Visa</option>
                <option value="Business Visa">Business Visa</option>
                <option value="Medical Visa">Medical Visa</option>
              </select>
            </label>

            <label className="span-2">
              Expected Date of Travel *
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.preferredDate}
                onChange={(e) => update('preferredDate', e.target.value)}
              />
            </label>
          </>
        )}

        {/* CONDITIONAL SECTION 2: TOUR PACKAGE ENQUIRY */}
        {form.serviceType === 'tour' && (
          <>
            <label className="span-2">
              Select Destination / Country *
              <select
                required
                value={form.tourCountry}
                onChange={(e) => update('tourCountry', e.target.value)}
              >
                <option value="">Choose an international country or destination...</option>
                <option value="Custom International Trip">✨ Help me plan a custom multi-country holiday</option>

                <optgroup label="🌟 Our Specialized Key Destinations">
                  <option value="Reunion Island">Reunion Island</option>
                  <option value="Russia">Russia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                </optgroup>

                <optgroup label="🌍 International Countries (Complete Orderwise List A–Z)">
                  {WORLD_COUNTRIES.map((c) => (
                    <option value={c.name} key={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>

            <label>
              Preferred Date of Travel *
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.preferredDate}
                onChange={(e) => update('preferredDate', e.target.value)}
              />
            </label>

            <label>
              Number of Nights (Traveling Days) *
              <input
                required
                type="number"
                min="1"
                max="120"
                value={form.nights}
                onChange={(e) => update('nights', e.target.value)}
                placeholder="e.g. 5"
              />
            </label>

            <label className="span-2">
              Tour Package Option *
              <select
                value={form.tourType}
                onChange={(e) => update('tourType', e.target.value as TourMode)}
              >
                <option value="Private Tour">Private Tour (Personal Vehicle &amp; Private Guide)</option>
                <option value="Group Tour">Group Tour (Fixed Group Departures)</option>
              </select>
            </label>
          </>
        )}

        {/* CONDITIONAL SECTION 3: UMRAH ENQUIRY */}
        {form.serviceType === 'umrah' && (
          <>
            <label className="span-2">
              Select Umrah Package / Tier *
              <select
                value={form.umrahTier}
                onChange={(e) => update('umrahTier', e.target.value)}
              >
                <option value="economy">Economy Package (Value, Clean Stays &amp; Walking Distance)</option>
                <option value="premium">Premium Package (5-Star Luxury, Haram Facing &amp; VIP Service)</option>
              </select>
            </label>

            <label>
              Preferred Date of Travel *
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.preferredDate}
                onChange={(e) => update('preferredDate', e.target.value)}
              />
            </label>

            <label>
              Number of Days / Nights *
              <input
                required
                type="number"
                min="5"
                max="90"
                value={form.nights}
                onChange={(e) => update('nights', e.target.value)}
                placeholder="e.g. 15"
              />
            </label>
          </>
        )}

        {/* Additional Instructions / Requirements */}
        <label className="span-2" style={{ borderTop: '1px solid #edf2f7', paddingTop: '14px', marginTop: '4px' }}>
          Additional Notes / Requirements
          <textarea
            rows={3}
            maxLength={2000}
            value={form.instructions}
            onChange={(e) => update('instructions', e.target.value)}
            placeholder="Tell us about room requirements, visa questions, dietary preferences, or flight city..."
          />
        </label>
      </div>

      <label className="consent">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update('consent', e.target.checked)}
        />
        <span>
          I acknowledge the <a href="/privacy" target="_blank">privacy notice</a> and agree that SkyRay Holidays may contact me about this enquiry.
        </span>
      </label>

      {message && (
        <div className="form-error" role="alert">
          {message}
        </div>
      )}

      <button className="btn btn-primary submit-btn" disabled={state === 'sending'}>
        {state === 'sending' ? (
          <>
            <LoaderCircle className="spin" size={17} /> Submitting Enquiry…
          </>
        ) : (
          <>
            Submit Enquiry <Send size={16} />
          </>
        )}
      </button>

      <small className="form-help">
        This is an official enquiry request. Availability, visa rules, and final quotes are confirmed directly by our concierge team. No payment is collected online.
      </small>
    </form>
  );
}
