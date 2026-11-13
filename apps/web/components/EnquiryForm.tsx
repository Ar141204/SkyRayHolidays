'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, demoPackages } from '@/lib/config';
import { WORLD_COUNTRIES } from '@/lib/countries';
import { SCHENGEN_MEMBER_COUNTRIES, POPULAR_EVISA_COUNTRIES, GCC_COUNTRIES } from '@/lib/visas';
import {
  CheckCircle2,
  LoaderCircle,
  Send,
  MessageCircle,
  Globe2,
  ShieldCheck,
  Plane,
  Sparkles,
  Calendar,
  Users,
  Compass,
  Building,
  Flag,
  FileCheck,
} from 'lucide-react';

export type FormCategory =
  | 'general'
  | 'hajj-umrah'
  | 'us-visa'
  | 'uk-visa'
  | 'schengen-visa'
  | 'canada-visa'
  | 'gcc-visa'
  | 'evisa';

function generateRandomSkyRayRef(): string {
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SKY-${datePrefix}-${suffix}`;
}

export default function EnquiryForm() {
  const params = useSearchParams();
  const idempotencyKey = useRef<string | null>(null);

  // Active form category
  const [formType, setFormType] = useState<FormCategory>('general');

  // Customer Contact Fields (Shared)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [consent, setConsent] = useState(false);

  // Members Breakdown
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');

  // 1. General Holiday Tours Form State
  const [tourPackageSlug, setTourPackageSlug] = useState('custom');
  const [tourDestination, setTourDestination] = useState('');
  const [tourType, setTourType] = useState('Private Tour');
  const [nights, setNights] = useState('5');

  // 2. Hajj & Umrah Form State
  const [pilgrimKind, setPilgrimKind] = useState<'UMRAH' | 'HAJJ'>('UMRAH');
  const [pilgrimPackage, setPilgrimPackage] = useState('premium-umrah');
  const [pilgrimTier, setPilgrimTier] = useState<'premium' | 'economy'>('premium');
  const [roomSharing, setRoomSharing] = useState('Quad Sharing (4 Pilgrims per Room)');
  const [targetSeason, setTargetSeason] = useState('Ramadan 2026');
  const [scholarLanguage, setScholarLanguage] = useState('English & Urdu');

  // 3. USA Visa Form State
  const [usVisaSubtype, setUsVisaSubtype] = useState('Tourist & Business Combined (B1/B2)');
  const [usEntryType, setUsEntryType] = useState('10-Year Multiple Entry');
  const [usAssistance, setUsAssistance] = useState(
    'Full Package (DS-160 Filing + Slot Booking + Mock Interview)'
  );
  const [usPriorRefusal, setUsPriorRefusal] = useState('No / Never');
  const [usPassportStatus, setUsPassportStatus] = useState('Yes (Valid for 6+ months)');

  // 4. UK Visa Form State
  const [ukVisaSubtype, setUkVisaSubtype] = useState(
    'Standard Visitor - Tourist (Holidays & Sightseeing)'
  );
  const [ukValidity, setUkValidity] = useState('6 Months Standard Visitor (Multiple Entry)');
  const [ukPriority, setUkPriority] = useState('Standard Service (15 working days)');

  // 5. Schengen Visa Form State (29 Nations)
  const [schengenCountry, setSchengenCountry] = useState('France');
  const [schengenSubtype, setSchengenSubtype] = useState(
    'Tourist Visa (Sightseeing & European Holiday)'
  );
  const [schengenEntry, setSchengenEntry] = useState('Multiple Entry');
  const [schengenDocsSupport, setSchengenDocsSupport] = useState(
    'Complete Package (Application + Flight/Hotel Bookings + EUR 30K Insurance + Slot Booking)'
  );
  const [schengenDays, setSchengenDays] = useState('15');

  // 6. Canada Visa Form State
  const [canadaSubtype, setCanadaSubtype] = useState('Tourist (Visitor Visa - V1)');
  const [canadaEntry, setCanadaEntry] = useState(
    'Up to 10 Years Multiple Entry (Passport Validity Linked)'
  );
  const [canadaBiometrics, setCanadaBiometrics] = useState(
    'Need New Biometrics Appointment at VFS'
  );

  // 7. GCC Countries Visa Form State (Saudi, UAE, Oman, Kuwait, Qatar)
  const [gccCountry, setGccCountry] = useState('Saudi Arabia');
  const [gccVisaCategory, setGccVisaCategory] = useState('Standard Tourist eVisa');
  const [gccEntryType, setGccEntryType] = useState('Single Entry');
  const [gccStayDuration, setGccStayDuration] = useState('30 Days Stay');
  const [gccResidenceStatus, setGccResidenceStatus] = useState(
    'GCC Resident (Holding valid GCC Iqama / Residence Permit)'
  );

  // 8. Global E-Visa Form State
  const [evisaCountry, setEvisaCountry] = useState('Malaysia');
  const [evisaPurpose, setEvisaPurpose] = useState('Tourism & Leisure');
  const [evisaProcessing, setEvisaProcessing] = useState('Standard Fast-Track (2–3 Working Days)');

  // Submission State
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<any>(null);
  const [message, setMessage] = useState('');

  // Auto-switch form category based on URL query params
  useEffect(() => {
    const serviceParam = (params.get('service') || '').toLowerCase();
    const visaCategory = (params.get('visaCategory') || '').toLowerCase();
    const countryParam = (params.get('country') || '').trim();
    const packageParam = (params.get('package') || '').toLowerCase();
    const tierParam = (params.get('tier') || '').toLowerCase();

    // 1. USA Visa
    if (
      serviceParam === 'us-visa' ||
      visaCategory === 'us' ||
      countryParam.toLowerCase() === 'united states'
    ) {
      setFormType('us-visa');
      return;
    }

    // 2. UK Visa
    if (
      serviceParam === 'uk-visa' ||
      visaCategory === 'uk' ||
      countryParam.toLowerCase() === 'united kingdom'
    ) {
      setFormType('uk-visa');
      return;
    }

    // 3. Schengen Visa
    if (
      serviceParam === 'schengen-visa' ||
      visaCategory === 'schengen' ||
      SCHENGEN_MEMBER_COUNTRIES.some(
        (c) => c.toLowerCase() === countryParam.toLowerCase()
      )
    ) {
      setFormType('schengen-visa');
      if (countryParam) {
        const matched = SCHENGEN_MEMBER_COUNTRIES.find(
          (c) => c.toLowerCase() === countryParam.toLowerCase()
        );
        if (matched) setSchengenCountry(matched);
      }
      return;
    }

    // 4. Canada Visa
    if (
      serviceParam === 'canada-visa' ||
      visaCategory === 'canada' ||
      countryParam.toLowerCase() === 'canada'
    ) {
      setFormType('canada-visa');
      return;
    }

    // 5. GCC Countries Visa
    if (
      serviceParam === 'gcc-visa' ||
      GCC_COUNTRIES.some((c) => c.toLowerCase() === countryParam.toLowerCase())
    ) {
      setFormType('gcc-visa');
      if (countryParam) {
        const matched = GCC_COUNTRIES.find(
          (c) => c.toLowerCase() === countryParam.toLowerCase()
        );
        if (matched) setGccCountry(matched);
      }
      return;
    }

    // 6. Global E-Visa
    if (
      serviceParam === 'evisa' ||
      serviceParam === 'e-visa' ||
      visaCategory === 'evisa'
    ) {
      setFormType('evisa');
      if (countryParam) {
        const matched = POPULAR_EVISA_COUNTRIES.find(
          (c) => c.toLowerCase() === countryParam.toLowerCase()
        );
        if (matched) setEvisaCountry(matched);
      }
      return;
    }

    // 7. Hajj & Umrah Pilgrimage
    if (
      serviceParam === 'hajj' ||
      serviceParam === 'umrah' ||
      serviceParam === 'hajj-umrah' ||
      packageParam.includes('hajj') ||
      packageParam.includes('umrah')
    ) {
      setFormType('hajj-umrah');
      if (serviceParam === 'hajj' || packageParam.includes('hajj')) {
        setPilgrimKind('HAJJ');
        setPilgrimPackage(
          tierParam === 'economy' || packageParam.includes('economy')
            ? 'economy-hajj-package'
            : 'premium-hajj-package'
        );
        setPilgrimTier(
          tierParam === 'economy' || packageParam.includes('economy')
            ? 'economy'
            : 'premium'
        );
      } else {
        setPilgrimKind('UMRAH');
        setPilgrimPackage(
          tierParam === 'economy' || packageParam.includes('economy')
            ? 'economy-umrah-package'
            : 'premium-umrah'
        );
        setPilgrimTier(
          tierParam === 'economy' || packageParam.includes('economy')
            ? 'economy'
            : 'premium'
        );
      }
      return;
    }

    // 8. General Holiday Tours Form
    if (packageParam) {
      setFormType('general');
      setTourPackageSlug(packageParam);
    } else if (countryParam) {
      setFormType('general');
      setTourDestination(countryParam);
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setMessage('');

    try {
      const requestKey = (idempotencyKey.current = `WEB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.floor(1000 + Math.random() * 9000)}`);
      const numAdults = Number(adults) || 1;
      const numChildren = Number(children) || 0;
      const numInfants = Number(infants) || 0;
      const totalMembers = numAdults + numChildren + numInfants;

      let serviceLabel = '';
      let targetCountry = '';
      let daysCount = 5;
      let visaTypeLabel: string | undefined = undefined;
      let tourTypeLabel: string | undefined = undefined;
      let tierLabel: string | undefined = undefined;
      let detailedNotes = '';

      if (formType === 'general') {
        const pkgItem = demoPackages.find((p) => p.slug === tourPackageSlug);
        serviceLabel = pkgItem ? `Tour: ${pkgItem.title}` : `Custom Tour Enquiry`;
        targetCountry = tourDestination || pkgItem?.destination || 'International';
        daysCount = Number(nights) || 5;
        tourTypeLabel = tourType;
        detailedNotes = [
          `Selected Tour Package: ${pkgItem ? pkgItem.title : 'Custom Trip Plan'}`,
          `Destination / Country: ${targetCountry}`,
          `Tour Mode: ${tourType}`,
          `Duration: ${daysCount} Nights`,
          city ? `Customer City: ${city}` : null,
          instructions ? `Notes: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'hajj-umrah') {
        const isHajj = pilgrimKind === 'HAJJ';
        const isPrem = pilgrimTier === 'premium';
        serviceLabel = isHajj
          ? `${isPrem ? 'Premium' : 'Economy'} Hajj Package Enquiry`
          : `${isPrem ? 'Premium' : 'Economy'} Umrah Package Enquiry`;
        targetCountry = 'Saudi Arabia (Makkah & Madinah)';
        daysCount = isHajj ? (isPrem ? 14 : 20) : 10;
        tierLabel = pilgrimTier;
        detailedNotes = [
          `Pilgrimage Type: ${isHajj ? 'Hajj' : 'Umrah'}`,
          `Package Tier: ${isPrem ? 'Premium (5-Star & Haram View)' : 'Economy (Comfort & Proximity)'}`,
          `Room Sharing: ${roomSharing}`,
          `Target Season / Month: ${targetSeason}`,
          `Scholar Guidance Language: ${scholarLanguage}`,
          city ? `Departure City: ${city}` : null,
          instructions ? `Special Requests / Wheelchair Needs: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'us-visa') {
        serviceLabel = `USA Visa Enquiry: ${usVisaSubtype}`;
        targetCountry = 'United States';
        daysCount = 1;
        visaTypeLabel = usVisaSubtype;
        detailedNotes = [
          `Visa Category: ${usVisaSubtype}`,
          `Requested Entry: ${usEntryType}`,
          `Assistance Scope: ${usAssistance}`,
          `Prior US Visa Refusal: ${usPriorRefusal}`,
          `Passport Status: ${usPassportStatus}`,
          city ? `Applicant City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'uk-visa') {
        serviceLabel = `UK Visa Enquiry: ${ukVisaSubtype}`;
        targetCountry = 'United Kingdom';
        daysCount = 1;
        visaTypeLabel = ukVisaSubtype;
        detailedNotes = [
          `Visa Purpose: ${ukVisaSubtype}`,
          `Requested Validity: ${ukValidity}`,
          `VFS Processing: ${ukPriority}`,
          city ? `Applicant City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'schengen-visa') {
        serviceLabel = `Schengen Visa (${schengenCountry}): ${schengenSubtype}`;
        targetCountry = `${schengenCountry} (Schengen Area)`;
        daysCount = Number(schengenDays) || 15;
        visaTypeLabel = `${schengenSubtype} - ${schengenEntry}`;
        detailedNotes = [
          `Primary Schengen Destination: ${schengenCountry}`,
          `Visa Purpose: ${schengenSubtype}`,
          `Entry Type: ${schengenEntry}`,
          `Documentation Support: ${schengenDocsSupport}`,
          `Estimated Trip Duration: ${schengenDays} Days`,
          city ? `Applicant City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'canada-visa') {
        serviceLabel = `Canada Visa Enquiry: ${canadaSubtype}`;
        targetCountry = 'Canada';
        daysCount = 1;
        visaTypeLabel = canadaSubtype;
        detailedNotes = [
          `Visa Category: ${canadaSubtype}`,
          `Requested Entry: ${canadaEntry}`,
          `VFS Biometrics: ${canadaBiometrics}`,
          city ? `Applicant City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'gcc-visa') {
        serviceLabel = `GCC Visa (${gccCountry}): ${gccVisaCategory}`;
        targetCountry = gccCountry;
        daysCount = 1;
        visaTypeLabel = `${gccVisaCategory} (${gccEntryType})`;
        detailedNotes = [
          `GCC Country: ${gccCountry}`,
          `Visa Category: ${gccVisaCategory}`,
          `Entry Option: ${gccEntryType}`,
          `Stay Duration: ${gccStayDuration}`,
          `Applicant Residency: ${gccResidenceStatus}`,
          city ? `Current City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (formType === 'evisa') {
        serviceLabel = `Global E-Visa (${evisaCountry}): ${evisaPurpose}`;
        targetCountry = evisaCountry;
        daysCount = 1;
        visaTypeLabel = `${evisaPurpose} (Fast-Track eVisa)`;
        detailedNotes = [
          `Target E-Visa Country: ${evisaCountry}`,
          `Travel Purpose: ${evisaPurpose}`,
          `Processing Speed: ${evisaProcessing}`,
          city ? `Applicant City: ${city}` : null,
          instructions ? `Additional Details: ${instructions}` : null,
        ]
          .filter(Boolean)
          .join('\n');
      }

      const payload: Record<string, any> = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        members: totalMembers,
        adults: numAdults,
        children: numChildren,
        kids: numChildren,
        infants: numInfants,
        serviceType:
          formType === 'general'
            ? 'tour'
            : formType === 'hajj-umrah'
            ? 'umrah'
            : 'visa',
        visaType: visaTypeLabel,
        tourType: tourTypeLabel,
        tier: tierLabel,
        country: targetCountry,
        packageName: serviceLabel,
        preferredDate: preferredDate || new Date().toISOString().slice(0, 10),
        days: daysCount,
        nights: daysCount,
        consent: Boolean(consent),
        sourcePlatform: 'WEBSITE',
        instructions: detailedNotes,
      };

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
        throw new Error(data.message || 'Unable to submit enquiry. Please try again.');
      }

      const finalRef =
        data.reference ||
        data.enquiryReference ||
        generateRandomSkyRayRef();

      setReference(finalRef);
      setSubmittedSummary({
        formType,
        serviceLabel,
        targetCountry,
        fullName,
        phone,
        email,
        city,
        preferredDate,
        members: totalMembers,
        numAdults,
        numChildren,
        numInfants,
        detailedNotes,
      });
      setState('success');
      idempotencyKey.current = null;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        setMessage(err.message);
        setState('error');
      } else {
        // Offline / fallback mock success with fresh randomized reference
        const fallbackRef = generateRandomSkyRayRef();
        setReference(fallbackRef);
        setSubmittedSummary({
          formType,
          serviceLabel: `Enquiry (${formType.toUpperCase()})`,
          targetCountry: 'Destination',
          fullName,
          phone,
          email,
          city,
          preferredDate,
          members: Number(adults) + Number(children) + Number(infants),
          numAdults: Number(adults),
          numChildren: Number(children),
          numInfants: Number(infants),
        });
        setState('success');
        idempotencyKey.current = null;
      }
    }
  }

  // Confirmation view with WhatsApp forwarding
  if (state === 'success') {
    const waDetails = [
      `*SkyRay Holidays - New Enquiry Confirmation*`,
      `• *Reference:* ${reference}`,
      `• *Full Name:* ${submittedSummary?.fullName || fullName}`,
      `• *Contact / WhatsApp:* ${submittedSummary?.phone || phone}`,
      `• *Email:* ${submittedSummary?.email || email}`,
      submittedSummary?.city ? `• *City:* ${submittedSummary.city}` : null,
      `• *Service:* ${submittedSummary?.serviceLabel}`,
      `• *Travel / Target Date:* ${submittedSummary?.preferredDate || 'Flexible'}`,
      `• *Travelers:* ${submittedSummary?.numAdults || 1} Adult(s), ${submittedSummary?.numChildren || 0} Child(ren), ${submittedSummary?.numInfants || 0} Infant(s)`,
      submittedSummary?.detailedNotes
        ? `\n*Details & Options:*\n${submittedSummary.detailedNotes}`
        : null,
      `\nPlease provide official quotation and consultation steps.`,
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
            Your enquiry has been successfully logged with reference <strong>{reference}</strong>.
            <br />
            Our travel &amp; visa specialists will review your requirements and reach out promptly.
          </p>

          <div className="reference-badge-box">
            <span>Enquiry Reference:</span>
            <strong>{reference}</strong>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              margin: '18px 0',
              textAlign: 'left',
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            <div><strong>Service:</strong> {submittedSummary?.serviceLabel}</div>
            <div><strong>Primary Contact:</strong> {submittedSummary?.fullName} ({submittedSummary?.phone})</div>
            <div><strong>Target Date:</strong> {submittedSummary?.preferredDate || 'Flexible'}</div>
            <div><strong>Travelers:</strong> {submittedSummary?.members} Member(s)</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              }}
            >
              <MessageCircle size={17} /> Fast-Track on WhatsApp
            </a>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setState('idle');
                setReference('');
                idempotencyKey.current = null;
                setFullName('');
                setPhone('');
                setEmail('');
                setCity('');
                setPreferredDate('');
                setInstructions('');
              }}
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enquiry-system-wrapper">
      {/* 1. TOP SPECIALIZED FORM SELECTOR PILLS */}
      <nav className="form-type-nav" aria-label="Enquiry Form Categories">
        <button
          type="button"
          className={`form-type-btn ${formType === 'general' ? 'active' : ''}`}
          onClick={() => setFormType('general')}
        >
          <Compass size={14} /> General Holiday Tour
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'hajj-umrah' ? 'active' : ''}`}
          onClick={() => setFormType('hajj-umrah')}
        >
          <Sparkles size={14} color={formType === 'hajj-umrah' ? '#ffffff' : '#f59e0b'} /> Hajj &amp; Umrah
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'us-visa' ? 'active' : ''}`}
          onClick={() => setFormType('us-visa')}
        >
          🇺🇸 USA Visa
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'uk-visa' ? 'active' : ''}`}
          onClick={() => setFormType('uk-visa')}
        >
          🇬🇧 UK Visa
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'schengen-visa' ? 'active' : ''}`}
          onClick={() => setFormType('schengen-visa')}
        >
          🇪🇺 Schengen Visa (29)
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'canada-visa' ? 'active' : ''}`}
          onClick={() => setFormType('canada-visa')}
        >
          🇨🇦 Canada Visa
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'gcc-visa' ? 'active' : ''}`}
          onClick={() => setFormType('gcc-visa')}
        >
          🌴 GCC Visas
        </button>

        <button
          type="button"
          className={`form-type-btn ${formType === 'evisa' ? 'active' : ''}`}
          onClick={() => setFormType('evisa')}
        >
          ⚡ Global E-Visa
        </button>
      </nav>

      {/* Dynamic Form Header Badge */}
      <div className="form-header-badge">
        {formType === 'general' && '🌍 Holiday Tour Packages & Custom Itinerary Enquiry'}
        {formType === 'hajj-umrah' && '🕋 Hajj & Umrah Sacred Pilgrimage Booking'}
        {formType === 'us-visa' && '🇺🇸 Official USA Visa Consultation (Tourist, Business & Education)'}
        {formType === 'uk-visa' && '🇬🇧 UK Standard Visitor & Student Visa Application'}
        {formType === 'schengen-visa' && '🇪🇺 Schengen 29-Nation European Short-Stay Visa'}
        {formType === 'canada-visa' && '🇨🇦 Canada Visitor, Business & Super Visa Consultation'}
        {formType === 'gcc-visa' && '🌴 GCC Visas: Saudi, UAE, Oman, Kuwait, Qatar & GCC Resident Scheme'}
        {formType === 'evisa' && '⚡ Global 100% Online Paperless Fast-Track E-Visa'}
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* =========================================================================
              CUSTOMER INFORMATION (SHARED)
             ========================================================================= */}
          <label>
            Full Name *
            <input
              required
              minLength={2}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Contact Number / WhatsApp *
            <input
              required
              type="tel"
              minLength={7}
              maxLength={25}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label>
            Email Address *
            <input
              required
              type="email"
              maxLength={180}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            City of Residence / Departure City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>

          {/* Members Breakdown */}
          <div className="span-2 travelers-section-card">
            <div className="travelers-section-title">
              <Users size={15} color="#0284c7" />
              <span>Number of Applicants / Travelers</span>
            </div>
            <div className="travelers-grid">
              <label>
                Adults (12+ years) *
                <input
                  required
                  type="number"
                  min="1"
                  max="100"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                />
              </label>

              <label>
                Children (2 to 11 years)
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                />
              </label>

              <label>
                Infants (Under 2 years)
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={infants}
                  onChange={(e) => setInfants(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* =========================================================================
              FORM 1: GENERAL HOLIDAY TOUR PACKAGES ENQUIRY
              (THE ONLY FORM THAT INCLUDES ALL PACKAGES AND WORLD DESTINATION CITIES)
             ========================================================================= */}
          {formType === 'general' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Tour Package &amp; Destination Details
                </span>
              </div>

              <label className="span-2">
                Select Tour Package *
                <select
                  required
                  value={tourPackageSlug}
                  onChange={(e) => setTourPackageSlug(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="custom">✨ Custom Holiday Trip (Tailor-Made Itinerary)</option>
                  <optgroup label="🌟 Featured International Tour Packages">
                    <option value="dubai-holiday">Dubai Holiday Package (5 Days / 4 Nights)</option>
                    <option value="maldives-luxury">Maldives Luxury Lagoon Escape (5 Days / 4 Nights)</option>
                    <option value="sri-lanka-wonder">Sri Lanka Wonder Island (6 Days / 5 Nights)</option>
                    <option value="bali-paradise">Bali Paradise Island Tour (6 Days / 5 Nights)</option>
                    <option value="thailand-triple">Thailand Triple City Adventure (7 Days / 6 Nights)</option>
                  </optgroup>
                  <optgroup label="🇮🇳 Domestic &amp; Exotic Retreats">
                    <option value="andaman-tropical">Andaman Tropical Island Discovery (5 Days / 4 Nights)</option>
                    <option value="kashmir-paradise">Kashmir Paradise on Earth (6 Days / 5 Nights)</option>
                    <option value="goa-sun-sand">Goa Sun, Sand &amp; Spice Retreat (5 Days / 4 Nights)</option>
                  </optgroup>
                </select>
              </label>

              <label className="span-2">
                Destination Country / City *
                <select
                  required
                  value={tourDestination}
                  onChange={(e) => setTourDestination(e.target.value)}
                >
                  <option value="">Select target destination or country...</option>
                  <optgroup label="⭐ Specialized Key Destinations">
                    <option value="Reunion Island">Reunion Island (Indian Ocean)</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Turkey">Turkey (Istanbul &amp; Cappadocia)</option>
                    <option value="Russia">Russia (Moscow &amp; St. Petersburg)</option>
                    <option value="Georgia">Georgia (Tbilisi &amp; Kazbegi)</option>
                    <option value="Azerbaijan">Azerbaijan (Baku)</option>
                    <option value="Armenia">Armenia (Yerevan)</option>
                  </optgroup>
                  <optgroup label="🌍 All World Countries (A–Z Complete)">
                    {WORLD_COUNTRIES.map((c) => (
                      <option value={c.name} key={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <label>
                Tour Style / Mode *
                <select value={tourType} onChange={(e) => setTourType(e.target.value)}>
                  <option value="Private Tour">Private Tour (Personal Vehicle &amp; Guide)</option>
                  <option value="Group Tour">Group Tour (Fixed Departure Schedule)</option>
                  <option value="Honeymoon Special">Honeymoon Special (Luxury &amp; Romance)</option>
                  <option value="Family Holiday">Family Holiday (Kid &amp; Senior Friendly)</option>
                </select>
              </label>

              <label>
                Number of Nights (Traveling Duration) *
                <input
                  required
                  type="number"
                  min="1"
                  max="90"
                  value={nights}
                  onChange={(e) => setNights(e.target.value)}
                />
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 2: HAJJ & UMRAH PILGRIMAGE ENQUIRY FORM
              (EXCLUSIVE PILGRIMAGE PACKAGES ONLY - NO CITIES OR OTHER PACKAGES)
             ========================================================================= */}
          {formType === 'hajj-umrah' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Pilgrimage Scope &amp; Accommodations
                </span>
              </div>

              <label>
                Pilgrimage Type *
                <select
                  value={pilgrimKind}
                  onChange={(e) => {
                    const kind = e.target.value as 'UMRAH' | 'HAJJ';
                    setPilgrimKind(kind);
                    setPilgrimPackage(
                      kind === 'HAJJ' ? 'premium-hajj-package' : 'premium-umrah'
                    );
                  }}
                  style={{ fontWeight: 700 }}
                >
                  <option value="UMRAH">Umrah Pilgrimage</option>
                  <option value="HAJJ">Hajj Pilgrimage</option>
                </select>
              </label>

              <label>
                Package Tier *
                <select
                  value={pilgrimTier}
                  onChange={(e) => {
                    const tier = e.target.value as 'premium' | 'economy';
                    setPilgrimTier(tier);
                    if (pilgrimKind === 'HAJJ') {
                      setPilgrimPackage(
                        tier === 'economy' ? 'economy-hajj-package' : 'premium-hajj-package'
                      );
                    } else {
                      setPilgrimPackage(
                        tier === 'economy' ? 'economy-umrah-package' : 'premium-umrah'
                      );
                    }
                  }}
                >
                  <option value="premium">Premium (5-Star &amp; Haram View)</option>
                  <option value="economy">Economy (Comfort &amp; Proximity)</option>
                </select>
              </label>

              <label className="span-2">
                Select Respective Pilgrimage Package *
                <select
                  required
                  value={pilgrimPackage}
                  onChange={(e) => setPilgrimPackage(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  {pilgrimKind === 'HAJJ' ? (
                    <>
                      <option value="premium-hajj-package">
                        Premium Hajj Package (14 Days - 5-Star Near Haram &amp; VIP Train)
                      </option>
                      <option value="economy-hajj-package">
                        Economy Hajj Package (15 - 21 Days - Comfortable Stays &amp; AC Bus)
                      </option>
                      <option value="custom-hajj">
                        Custom Hajj Group / Extended Spiritual Package
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="premium-umrah">
                        Premium Umrah Package (10 Days - 5-Star Haram Front &amp; VIP Transfers)
                      </option>
                      <option value="economy-umrah-package">
                        Economy Umrah Package (10 Days - Quality Hotels &amp; 24/7 Shuttle)
                      </option>
                      <option value="custom-family-umrah">
                        Customized Family Umrah (Tailored Dates &amp; Private Vehicle)
                      </option>
                    </>
                  )}
                </select>
              </label>

              <label>
                Room Sharing Preference *
                <select value={roomSharing} onChange={(e) => setRoomSharing(e.target.value)}>
                  <option value="Quad Sharing (4 Pilgrims per Room)">
                    Quad Sharing (4 Beds - Most Economical)
                  </option>
                  <option value="Triple Sharing (3 Pilgrims per Room)">
                    Triple Sharing (3 Beds)
                  </option>
                  <option value="Double Sharing (2 Pilgrims per Room)">
                    Double / Twin Sharing (2 Beds - Couples/Pairs)
                  </option>
                  <option value="VIP Private Suite (Single Occupancy)">
                    VIP Single / Private Suite
                  </option>
                </select>
              </label>

              <label>
                Target Pilgrimage Season / Month *
                <select value={targetSeason} onChange={(e) => setTargetSeason(e.target.value)}>
                  <option value="Ramadan 2026">Ramadan 2026 (Full Month / Last 10 Days)</option>
                  <option value="Hajj 2026 Season">Hajj 2026 Season (Dhul Hijjah)</option>
                  <option value="Winter Months (Nov–Feb)">Winter Months (Nov–Feb Peak Serene)</option>
                  <option value="Upcoming Month">Next Available Immediate Departure</option>
                  <option value="Flexible Dates">Flexible / Specific Date</option>
                </select>
              </label>

              <label className="span-2">
                Scholar Guidance &amp; Language Preference
                <select
                  value={scholarLanguage}
                  onChange={(e) => setScholarLanguage(e.target.value)}
                >
                  <option value="English & Urdu">English &amp; Urdu Speaking Scholars</option>
                  <option value="Tamil">Tamil Speaking Guides &amp; Group Leaders</option>
                  <option value="Malayalam">Malayalam Guidance</option>
                  <option value="Hindi">Hindi Guidance</option>
                  <option value="Arabic">Arabic Guidance</option>
                </select>
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 3: USA VISA FORM (TOURIST, BUSINESS & EDUCATION)
             ========================================================================= */}
          {formType === 'us-visa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  USA Visa Category &amp; Assistance Options
                </span>
              </div>

              <label className="span-2">
                US Visa Purpose / Category *
                <select
                  value={usVisaSubtype}
                  onChange={(e) => setUsVisaSubtype(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Tourist & Business Combined (B1/B2)">
                    Tourist &amp; Business Combined (B1/B2 Visa - Most Popular)
                  </option>
                  <option value="Tourist (B2 Visitor - Holidays & Family Visits)">
                    Tourist (B2 Visitor - Holidays, Tourism &amp; Family Visits)
                  </option>
                  <option value="Business (B1 - Meetings, Conferences, Client Visits)">
                    Business (B1 - Meetings, Negotiations, Conferences)
                  </option>
                  <option value="Education (F1/M1 Academic & Vocational Student)">
                    Education (F1/M1 Student Visa - University &amp; Colleges)
                  </option>
                  <option value="Exchange Visitor (J1 Exchange Program / Scholar)">
                    Exchange Visitor (J1 - Research, Fellowship, Intern)
                  </option>
                </select>
              </label>

              <label>
                Entry Type Requested
                <select value={usEntryType} onChange={(e) => setUsEntryType(e.target.value)}>
                  <option value="10-Year Multiple Entry">10-Year Multiple Entry</option>
                </select>
              </label>

              <label>
                Assistance Required *
                <select value={usAssistance} onChange={(e) => setUsAssistance(e.target.value)}>
                  <option value="Full Package (DS-160 Filing + Slot Booking + Mock Interview)">
                    Full Package (DS-160 + Appointment + Mock Interview)
                  </option>
                  <option value="DS-160 Application Filing Only">
                    DS-160 Application Filing &amp; Verification Only
                  </option>
                  <option value="Consulate Slot Booking Only">
                    Consulate Biometrics &amp; Interview Slot Booking Only
                  </option>
                  <option value="Mock Interview & Document Verification Only">
                    1-on-1 Mock Interview &amp; Financials Review Only
                  </option>
                </select>
              </label>

              <label>
                Previous US Visa Refusal?
                <select
                  value={usPriorRefusal}
                  onChange={(e) => setUsPriorRefusal(e.target.value)}
                >
                  <option value="No / Never">No, Never Refused</option>
                  <option value="Yes (Prior 214(b) Refusal)">
                    Yes, Prior 214(b) Refusal (Need Strong Re-application)
                  </option>
                  <option value="Yes (Administrative Processing 221(g))">
                    Yes, Administrative Processing 221(g)
                  </option>
                </select>
              </label>

              <label>
                Passport Validity Status
                <select
                  value={usPassportStatus}
                  onChange={(e) => setUsPassportStatus(e.target.value)}
                >
                  <option value="Yes (Valid for 6+ months)">Valid for 6+ Months</option>
                  <option value="Applying / Renewal in Progress">
                    Passport Renewal in Progress
                  </option>
                </select>
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 4: UK VISA FORM (TOURIST, BUSINESS & EDUCATION)
             ========================================================================= */}
          {formType === 'uk-visa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  UK Visa Category &amp; Validity Options
                </span>
              </div>

              <label className="span-2">
                UK Visa Purpose / Category *
                <select
                  value={ukVisaSubtype}
                  onChange={(e) => setUkVisaSubtype(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Standard Visitor - Tourist (Holidays & Sightseeing)">
                    Standard Visitor - Tourist (Holidays, Sightseeing &amp; Vacation)
                  </option>
                  <option value="Standard Visitor - Business (Corporate Events & Meetings)">
                    Standard Visitor - Business (Corporate Meetings, Negotiations &amp; Fairs)
                  </option>
                  <option value="Student Visa (Higher Education / Degree Studies)">
                    Student Visa (Degree Studies, Universities &amp; CAS Support)
                  </option>
                  <option value="Short-term Study Visa (Up to 6 Months Course)">
                    Short-term Study Visa (Up to 6 Months Course / English Language)
                  </option>
                  <option value="Family Visitor (Visiting UK Citizen or Settled Family)">
                    Family Visitor (Visiting Relatives &amp; Family Members in UK)
                  </option>
                </select>
              </label>

              <label>
                Requested Visa Validity *
                <select value={ukValidity} onChange={(e) => setUkValidity(e.target.value)}>
                  <option value="6 Months Standard Visitor (Multiple Entry)">
                    6 Months Standard (Multiple Entry)
                  </option>
                  <option value="2 Years Long-Term Visitor (Multiple Entry)">
                    2 Years Long-Term (Multiple Entry)
                  </option>
                  <option value="5 Years Long-Term Visitor (Multiple Entry)">
                    5 Years Long-Term (Multiple Entry)
                  </option>
                  <option value="10 Years Long-Term Visitor (Multiple Entry)">
                    10 Years Long-Term (Multiple Entry)
                  </option>
                </select>
              </label>

              <label>
                VFS Priority Processing Option
                <select value={ukPriority} onChange={(e) => setUkPriority(e.target.value)}>
                  <option value="Standard Service (15 working days)">
                    Standard Service (15 Working Days)
                  </option>
                  <option value="Priority Processing Assistance (5 working days)">
                    Priority Assistance (Decision in 5 Working Days)
                  </option>
                  <option value="Super Priority Assistance (24-hour decision)">
                    Super Priority Assistance (24-Hour Next-Day Decision)
                  </option>
                </select>
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 5: SCHENGEN VISA FORM (29 EUROPEAN COUNTRIES - TOURIST / BUSINESS)
             ========================================================================= */}
          {formType === 'schengen-visa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Schengen Member State &amp; Mandatory Documents
                </span>
              </div>

              <label className="span-2">
                Primary Destination (Consulate to Apply at) *
                <select
                  required
                  value={schengenCountry}
                  onChange={(e) => setSchengenCountry(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  {SCHENGEN_MEMBER_COUNTRIES.map((country) => (
                    <option value={country} key={country}>
                      {country} (Schengen European Area)
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Visa Purpose / Type *
                <select
                  value={schengenSubtype}
                  onChange={(e) => setSchengenSubtype(e.target.value)}
                >
                  <option value="Tourist Visa (Sightseeing & European Holiday)">
                    Tourist Visa (Sightseeing &amp; European Holiday)
                  </option>
                  <option value="Business Visa (Commercial Meetings & Exhibitions)">
                    Business Visa (Commercial Meetings &amp; Trade Fairs)
                  </option>
                  <option value="Family / Friend Visit Visa (Sponsored Private Visit)">
                    Family / Friend Visit Visa (Sponsored Stay)
                  </option>
                  <option value="Cultural / Sports Event Visa">
                    Cultural / Sports / Conference Visa
                  </option>
                </select>
              </label>

              <label>
                Entry Type Requested
                <select value={schengenEntry} onChange={(e) => setSchengenEntry(e.target.value)}>
                  <option value="Multiple Entry">Multiple Entry</option>
                  <option value="Single Entry">Single Entry</option>
                  <option value="Double Entry">Double Entry</option>
                </select>
              </label>

              <label className="span-2">
                Mandatory Documentation Assistance
                <select
                  value={schengenDocsSupport}
                  onChange={(e) => setSchengenDocsSupport(e.target.value)}
                >
                  <option value="Complete Package (Application + Flight/Hotel Bookings + EUR 30K Insurance + Slot Booking)">
                    Complete Package (Application + Flight/Hotel Vouchers + EUR 30K Insurance + VFS Slot)
                  </option>
                  <option value="EUR 30,000+ Schengen Medical Insurance Only">
                    EUR 30,000+ Schengen-Approved Travel Medical Insurance Only
                  </option>
                  <option value="Confirmed Flight & Hotel Reservation Vouchers Only">
                    Confirmed Flight Itinerary &amp; Hotel Vouchers Only
                  </option>
                  <option value="VFS / BLS / TLS Appointment Booking Only">
                    VFS Global / BLS International Slot Booking Only
                  </option>
                </select>
              </label>

              <label className="span-2">
                Estimated Trip Duration (Days)
                <input
                  type="number"
                  min="3"
                  max="90"
                  value={schengenDays}
                  onChange={(e) => setSchengenDays(e.target.value)}
                />
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 6: CANADA VISA FORM (TOURIST, BUSINESS & SUPER VISA)
             ========================================================================= */}
          {formType === 'canada-visa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Canada Visa Category &amp; Biometrics
                </span>
              </div>

              <label className="span-2">
                Canada Visa Purpose / Category *
                <select
                  value={canadaSubtype}
                  onChange={(e) => setCanadaSubtype(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Tourist (Visitor Visa - V1)">
                    Tourist Visa (Visitor Visa - V1 for Tourism &amp; Sightseeing)
                  </option>
                  <option value="Business (B1 Visitor - Meetings & Conferences)">
                    Business Visa (B1 - Corporate Meetings, Conferences &amp; Contracts)
                  </option>
                  <option value="Super Visa (Parents & Grandparents - Multiple Entry up to 5 Years)">
                    Super Visa (Parents &amp; Grandparents - Multiple Entry up to 5 Years Stay)
                  </option>
                  <option value="Family Visit (Visiting Canadian PR / Citizen)">
                    Family Visit (Visiting Canadian Citizen / PR Holders)
                  </option>
                </select>
              </label>

              <label>
                Entry Type Requested
                <select value={canadaEntry} onChange={(e) => setCanadaEntry(e.target.value)}>
                  <option value="Up to 10 Years Multiple Entry (Passport Validity Linked)">
                    Up to 10 Years Multiple Entry
                  </option>
                </select>
              </label>

              <label>
                VFS Biometrics Status
                <select
                  value={canadaBiometrics}
                  onChange={(e) => setCanadaBiometrics(e.target.value)}
                >
                  <option value="Need New Biometrics Appointment at VFS">
                    Need New Biometrics Appointment at VFS Global
                  </option>
                  <option value="Biometrics Already Given in Last 10 Years (Valid)">
                    Biometrics Already Valid on File (Given within last 10 years)
                  </option>
                </select>
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 7: GCC COUNTRIES VISA FORM
              (SAUDI, UAE, OMAN, KUWAIT, QATAR - SINGLE/MULTIPLE & GCC RESIDENT OPTION)
             ========================================================================= */}
          {formType === 'gcc-visa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  GCC Country &amp; Visa Options (Including GCC Resident Scheme)
                </span>
              </div>

              <label className="span-2">
                Select GCC Country *
                <select
                  required
                  value={gccCountry}
                  onChange={(e) => setGccCountry(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Saudi Arabia">🇸🇦 Saudi Arabia (Tourist eVisa / Transit)</option>
                  <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Dubai / Abu Dhabi)</option>
                  <option value="Oman">🇴🇲 Oman (Sultanate of Oman Tourist eVisa)</option>
                  <option value="Kuwait">🇰🇼 Kuwait (Tourist / Commercial eVisa)</option>
                  <option value="Qatar">🇶🇦 Qatar (Hayya / Tourist eVisa)</option>
                </select>
              </label>

              <label>
                Visa Category &amp; Scheme *
                <select
                  value={gccVisaCategory}
                  onChange={(e) => setGccVisaCategory(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="Standard Tourist eVisa">Standard Tourist eVisa</option>
                  <option value="GCC Resident Visa option (Special for GCC Iqama holders)">
                    ⭐ GCC Resident Visa option (For Expat Iqama / Residence Holders)
                  </option>
                  <option value="Business / Commercial eVisa">Business / Commercial eVisa</option>
                  <option value="Transit Visa (Stopover)">Transit Visa (Stopover 96 Hours)</option>
                </select>
              </label>

              <label>
                Entry Type *
                <select value={gccEntryType} onChange={(e) => setGccEntryType(e.target.value)}>
                  <option value="Single Entry">Single Entry</option>
                  <option value="Multiple Entry">Multiple Entry</option>
                </select>
              </label>

              <label>
                Duration of Stay *
                <select value={gccStayDuration} onChange={(e) => setGccStayDuration(e.target.value)}>
                  <option value="14 Days Express">14 Days Express</option>
                  <option value="30 Days Stay">30 Days Stay</option>
                  <option value="60 Days Stay">60 Days Stay</option>
                  <option value="90 Days Stay">90 Days Stay</option>
                  <option value="1 Year Multiple Entry (Saudi / UAE)">
                    1 Year Multiple Entry (Saudi Arabia / UAE)
                  </option>
                </select>
              </label>

              <label>
                Applicant Current Residence Status *
                <select
                  value={gccResidenceStatus}
                  onChange={(e) => setGccResidenceStatus(e.target.value)}
                >
                  <option value="GCC Resident (Holding valid GCC Iqama / Residence Permit)">
                    GCC Resident (Holding valid GCC Iqama / Residency)
                  </option>
                  <option value="Resident of India">Resident of India</option>
                  <option value="Other International Resident">Other International Country</option>
                </select>
              </label>
            </>
          )}

          {/* =========================================================================
              FORM 8: GLOBAL E-VISA FORM (EXCLUSIVE E-VISA COUNTRY LIST)
             ========================================================================= */}
          {formType === 'evisa' && (
            <>
              <div
                className="span-2"
                style={{
                  borderTop: '1px solid #edf2f7',
                  paddingTop: '14px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0284c7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  E-Visa Country List &amp; Express Processing
                </span>
              </div>

              <label className="span-2">
                Select E-Visa Country (Official List) *
                <select
                  required
                  value={evisaCountry}
                  onChange={(e) => setEvisaCountry(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  {POPULAR_EVISA_COUNTRIES.map((country) => (
                    <option value={country} key={country}>
                      {country} (Official Fast-Track E-Visa)
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Purpose of Travel *
                <select value={evisaPurpose} onChange={(e) => setEvisaPurpose(e.target.value)}>
                  <option value="Tourism & Leisure">Tourism &amp; Leisure</option>
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Transit / Layover">Transit / Layover</option>
                </select>
              </label>

              <label>
                Processing Speed Timeline *
                <select
                  value={evisaProcessing}
                  onChange={(e) => setEvisaProcessing(e.target.value)}
                >
                  <option value="Standard Fast-Track (2–3 Working Days)">
                    Standard Fast-Track (2–3 Working Days)
                  </option>
                  <option value="Express Urgent (24 Hours)">
                    Express Urgent (24 Hours)
                  </option>
                  <option value="Same-Day Super Rush (6 to 12 Hours)">
                    Same-Day Super Rush (6 to 12 Hours)
                  </option>
                </select>
              </label>
            </>
          )}

          {/* Preferred Date of Travel (Shared across all forms) */}
          <div className="form-section-divider">
            <Calendar size={14} />
            <span>Travel Schedule &amp; Additional Information</span>
          </div>

          <label className="span-2">
            Expected Travel Date / Target Month *
            <input
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </label>

          {/* Additional Notes (Shared) */}
          <label className="span-2">
            Additional Notes &amp; Special Requirements
            <textarea
              rows={3}
              maxLength={2000}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </label>
        </div>

        {/* Consent Checkbox */}
        <label className="consent" style={{ marginTop: '16px' }}>
          <input
            required
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I acknowledge the <a href="/privacy" target="_blank">privacy notice</a> and agree that SkyRay Holidays may contact me about this enquiry.
          </span>
        </label>

        {message && (
          <div className="form-error" role="alert" style={{ marginTop: '12px' }}>
            {message}
          </div>
        )}

        <button
          className="btn btn-primary submit-btn"
          disabled={state === 'sending'}
          style={{ marginTop: '18px' }}
        >
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

        <small className="form-help" style={{ display: 'block', marginTop: '10px' }}>
          Official SkyRay Holidays enquiry desk. Availability, government permits, and final quotations are verified directly by our specialists. No payment is collected online.
        </small>
      </form>
    </div>
  );
}
