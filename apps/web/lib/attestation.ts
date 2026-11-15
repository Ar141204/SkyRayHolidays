export interface AttestationServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'Gulf Embassy' | 'Apostille' | 'Educational' | 'Personal' | 'Commercial';
  shortDesc: string;
  badge: string;
  processingTime: string;
  validity: string;
  targetCountries: string[];
  requirements: string[];
  workflow: string[];
  image: string;
  startingPrice?: string;
  governmentFeeNote?: string;
  status?: string;
  hasOffer?: boolean;
  offerBadge?: string;
  originalPrice?: string;
  offerPrice?: string;
  offerRunningText?: string;
}

export const ATTESTATION_SERVICES: AttestationServiceItem[] = [
  {
    id: 'attest-uae-embassy',
    slug: 'uae-embassy-attestation',
    title: 'UAE Embassy Attestation & MOFA Legalization',
    category: 'Gulf Embassy',
    badge: 'High Demand · Dubai & Abu Dhabi',
    shortDesc:
      'Mandatory document legalization for UAE employment visas, family residence visas, higher education admission, and business setup across Dubai, Abu Dhabi, and Sharjah.',
    processingTime: '5 – 8 Working Days (Express 3 Days Available)',
    validity: 'Permanent / Lifetime Authentication',
    targetCountries: ['United Arab Emirates (Dubai, Abu Dhabi, Sharjah, Ajman)'],
    requirements: [
      'Original Certificate (Degree / Diploma / Marriage / Birth)',
      'Clear Passport copy of the applicant (First & Last pages)',
      'Aadhaar / National ID copy',
      'Offer letter or company invitation (for employment / commercial)',
    ],
    workflow: [
      '1. Notary Public Attestation',
      '2. State HRD / Home Department Authentication',
      '3. Ministry of External Affairs (MEA India) Attestation',
      '4. UAE Embassy (New Delhi / Mumbai) Legalization',
      '5. MOFA UAE Final Attestation (Optional / Upon Request)',
    ],
    image: '/images/dubai.svg',
    startingPrice: '₹3,500',
    governmentFeeNote: 'Inclusive of MEA & Embassy verification fees',
    status: 'Active',
    hasOffer: true,
    offerBadge: 'EXPRESS ASSISTANCE',
    originalPrice: '₹4,500',
    offerPrice: '₹3,500',
    offerRunningText: 'Special Flat Discount on UAE Degree & Marriage Certificate Attestations this month!',
  },
  {
    id: 'attest-saudi-embassy',
    slug: 'saudi-embassy-attestation',
    title: 'Saudi Arabia Embassy & Cultural (SACM) Attestation',
    category: 'Gulf Embassy',
    badge: 'Work Visa & Iqama Mandatory',
    shortDesc:
      'Official authentication by the Royal Embassy of Saudi Arabia and Saudi Arabian Cultural Mission (SACM). Essential for medical professionals, engineers, educators, and family visas.',
    processingTime: '7 – 12 Working Days',
    validity: 'Permanent Authentication',
    targetCountries: ['Saudi Arabia (Riyadh, Jeddah, Dammam, Mecca, Medina)'],
    requirements: [
      'Original Degree certificate with final year mark sheet',
      'Regular university study verification letter',
      'Saudi Employment Offer Letter / Contract approved by Chamber of Commerce',
      'Passport copy valid for 6+ months',
    ],
    workflow: [
      '1. University Verification / Genuine Letter',
      '2. State HRD Attestation',
      '3. Ministry of External Affairs (MEA India)',
      '4. Saudi Culture (SACM) Verification',
      '5. Royal Embassy of Saudi Arabia Legalization',
    ],
    image: '/images/makkah.svg',
    startingPrice: '₹4,200',
    governmentFeeNote: 'SACM and Embassy consular fee included',
    status: 'Active',
    hasOffer: true,
    offerBadge: 'TOP SERVICE',
    originalPrice: '₹5,500',
    offerPrice: '₹4,200',
    offerRunningText: 'Guaranteed genuine SACM & Saudi Embassy endorsement for all Indian university degrees.',
  },
  {
    id: 'attest-qatar-embassy',
    slug: 'qatar-embassy-attestation',
    title: 'Qatar Embassy Attestation Services',
    category: 'Gulf Embassy',
    badge: 'Doha Employment & Family Visa',
    shortDesc:
      'Full legalization for Qatar Ministry of Foreign Affairs (MOFA Qatar) and Qatar Embassy. Required for job visas, engineer classification (UPDA / MMUP), and family residence.',
    processingTime: '6 – 9 Working Days',
    validity: 'Permanent Authentication',
    targetCountries: ['Qatar (Doha, Al Wakrah, Al Rayyan)'],
    requirements: [
      'Original Certificate (along with Consolidated Mark Sheet & Bonafide Letter)',
      'Passport copy of candidate',
      'Qatar ID (QID) copy of sponsor or Qatar employment offer',
    ],
    workflow: [
      '1. Notary & Sub-Divisional Magistrate (SDM) / HRD',
      '2. MEA Attestation, New Delhi',
      '3. Embassy of Qatar, New Delhi Legalization',
      '4. MOFA Qatar Attestation in Doha (Optional)',
    ],
    image: '/images/destinations/doha.svg',
    startingPrice: '₹3,800',
    governmentFeeNote: 'Includes MEA and Embassy official seals',
    status: 'Active',
  },
  {
    id: 'attest-kuwait-embassy',
    slug: 'kuwait-embassy-attestation',
    title: 'Kuwait Embassy & PCC Attestation',
    category: 'Gulf Embassy',
    badge: 'Kuwait Work Permit & Medical',
    shortDesc:
      'Document and Police Clearance Certificate (PCC) attestation from Kuwait Embassy. Crucial for nurses, technicians, engineers, and workers relocating to Kuwait.',
    processingTime: '7 – 10 Working Days',
    validity: 'PCC valid for 3 months; Certificates Permanent',
    targetCountries: ['Kuwait (Kuwait City, Hawalli, Farwaniya)'],
    requirements: [
      'Original Certificate & PCC (Police Clearance Certificate from Passport Seva Kendra)',
      'Valid Passport copy',
      'Kuwait Work Permit copy (Visa / No-Objection Certificate)',
    ],
    workflow: [
      '1. State Home Department / GAD Verification',
      '2. Ministry of External Affairs (MEA)',
      '3. Embassy of Kuwait Legalization',
    ],
    image: '/images/destinations/kuwait.svg',
    startingPrice: '₹3,900',
    governmentFeeNote: 'Mandatory Kuwait consular sticker fee included',
    status: 'Active',
  },
  {
    id: 'attest-oman-bahrain',
    slug: 'oman-bahrain-embassy-attestation',
    title: 'Oman & Bahrain Embassy Attestation',
    category: 'Gulf Embassy',
    badge: 'Sultanate of Oman & Kingdom of Bahrain',
    shortDesc:
      'Fast-track consular legalization for Muscat, Salalah, and Manama. Covering employment degrees, marriage certificates for family joining, and trade licenses.',
    processingTime: '5 – 7 Working Days',
    validity: 'Permanent Authentication',
    targetCountries: ['Oman (Muscat)', 'Bahrain (Manama)'],
    requirements: [
      'Original Certificate',
      'Applicant Passport front & back copies',
      'Sponsor ID or Visa copy',
    ],
    workflow: [
      '1. Notary Authentication',
      '2. MEA India Attestation',
      '3. Embassy of Oman / Bahrain Legalization',
    ],
    image: '/images/destinations/oman.svg',
    startingPrice: '₹3,200',
    status: 'Active',
  },
  {
    id: 'attest-hague-apostille',
    slug: 'hague-apostille-service',
    title: 'Hague Apostille Certification (MEA India)',
    category: 'Apostille',
    badge: '120+ Hague Nations · US, UK, Europe, Australia',
    shortDesc:
      'Official MEA Hague Apostille sticker with unique tracking code. Recognized across 120+ Hague Convention member nations including USA, UK, Germany, France, Italy, Spain, Australia, and Netherlands.',
    processingTime: '3 – 5 Working Days (Fast-Track)',
    validity: 'Internationally Accepted across all 120+ Hague Convention Signatories',
    targetCountries: [
      'United States',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Italy',
      'Spain',
      'Netherlands',
      'Poland',
      'Sweden',
      'Switzerland',
      'Japan',
      'New Zealand',
      '120+ Countries',
    ],
    requirements: [
      'Original Certificate (Degree, Birth, Marriage, Affidavit, PCC, Commercial)',
      'Passport Copy (First & Last Page)',
      'Aadhaar / Identity Proof',
    ],
    workflow: [
      '1. State Notary Public Attestation',
      '2. Sub-Divisional Magistrate (SDM) / State Home Department',
      '3. Ministry of External Affairs (MEA) Holographic Apostille Sticker Placement',
    ],
    image: '/images/paris.svg',
    startingPrice: '₹2,200',
    governmentFeeNote: 'Direct MEA official Apostille barcode sticker',
    status: 'Active',
    hasOffer: true,
    offerBadge: 'FASTEST TURNAROUND',
    originalPrice: '₹3,000',
    offerPrice: '₹2,200',
    offerRunningText: 'Express Hague Apostille completed in 3 working days with door-to-door courier.',
  },
  {
    id: 'attest-educational-degree',
    slug: 'educational-certificate-attestation',
    title: 'Educational Degree & Diploma Certificate Attestation',
    category: 'Educational',
    badge: 'HRD / GAD + MEA Verification',
    shortDesc:
      'Complete state education department authentication for B.Tech, B.Sc, B.Com, MBBS, Nursing, MBA, M.Tech, Ph.D., and State Board diplomas for employment and migration.',
    processingTime: '4 – 8 Working Days (Dependent on State HRD)',
    validity: 'Lifetime Validity',
    targetCountries: ['Worldwide (Gulf, Europe, Americas, Asia, Oceania)'],
    requirements: [
      'Original Degree / Diploma Certificate',
      'All semester / year-wise mark sheets copy',
      'Passport copy',
      'Two recent passport size color photographs',
    ],
    workflow: [
      '1. University Authenticity Check',
      '2. State HRD (Higher Education Dept) Authentication',
      '3. Ministry of External Affairs (MEA) Stamp',
      '4. Target Country Embassy Legalization (as required)',
    ],
    image: '/images/destinations/degree.svg',
    startingPrice: '₹2,800',
    status: 'Active',
  },
  {
    id: 'attest-personal-certificates',
    slug: 'personal-certificate-attestation',
    title: 'Personal Certificates (Birth, Marriage, Death, Medical & PCC)',
    category: 'Personal',
    badge: 'Family Visa & Spouse Sponsorship',
    shortDesc:
      'Seamless legalization for Marriage Certificates (Spouse Visa), Birth Certificates (Child Visa & School Admission), Medical Certificates, and Police Clearance Certificates.',
    processingTime: '3 – 6 Working Days',
    validity: 'Permanent (PCC 3-6 Months)',
    targetCountries: ['Gulf Nations, UK, Europe, North America, Southeast Asia'],
    requirements: [
      'Original Marriage / Birth / Death Certificate',
      'Husband & Wife Passport copies (for Marriage certificate)',
      'Child & Parents Passport copies (for Birth certificate)',
    ],
    workflow: [
      '1. Notary Public Authentication',
      '2. Home Department / SDM Delhi Verification',
      '3. MEA Attestation',
      '4. Embassy Legalization',
    ],
    image: '/images/destinations/family.svg',
    startingPrice: '₹2,500',
    status: 'Active',
  },
  {
    id: 'attest-commercial-documents',
    slug: 'commercial-document-attestation',
    title: 'Commercial Document & Power of Attorney (POA) Attestation',
    category: 'Commercial',
    badge: 'Corporate, Export & Property Legalization',
    shortDesc:
      'Specialized corporate attestation for Chamber of Commerce certificates, Power of Attorney (POA), Board Resolutions, Invoices, Packing Lists, Trade Licenses, and Partnership Deeds.',
    processingTime: '4 – 7 Working Days',
    validity: 'Document / Agreement Term Dependent',
    targetCountries: ['UAE, Saudi Arabia, Qatar, Kuwait, Europe, Americas'],
    requirements: [
      'Original Commercial Document / Power of Attorney',
      'Company Covering Letter on Official Letterhead',
      'Authorized Signatory Passport & PAN copy',
      'Chamber of Commerce Membership Proof',
    ],
    workflow: [
      '1. Chamber of Commerce Verification',
      '2. Notary Attestation',
      '3. MEA India Attestation',
      '4. Embassy Commercial Legalization',
    ],
    image: '/images/destinations/commercial.svg',
    startingPrice: '₹4,500',
    governmentFeeNote: 'Fee varies by commercial invoice valuation and Embassy slabs',
    status: 'Active',
  },
];

export function getStoredAttestationServices(): AttestationServiceItem[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('skyray_custom_attestations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return ATTESTATION_SERVICES;
}

export function saveStoredAttestationServices(items: AttestationServiceItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('skyray_custom_attestations', JSON.stringify(items));
    } catch {}
  }
}
