export type InsuranceCategory = 'Europe' | 'Rest of World' | 'United States' | 'United Kingdom';

export interface InsurancePlanItem {
  id: string;
  slug: string;
  title: string;
  category: InsuranceCategory;
  badge: string;
  shortDesc: string;
  medicalCoverage: string;
  coverageHighlights: string[];
  targetCountries: string;
  status: 'PUBLISHED' | 'DRAFT';
  startingPrice: string;
  currency: string;
  popular?: boolean;
  showPrice?: boolean;
}

export const INSURANCE_CATEGORIES: { key: InsuranceCategory; label: string; icon: string; desc: string }[] = [
  {
    key: 'Europe',
    label: 'Europe (Schengen Compliant)',
    icon: '🇪🇺',
    desc: 'Mandatory €30,000+ medical cover for 29 Schengen member states. 100% Embassy & VFS approved.',
  },
  {
    key: 'United States',
    label: 'United States',
    icon: '🇺🇸',
    desc: 'High-limit emergency medical protection up to $500,000 USD for B1/B2 visitors, tourists, and students.',
  },
  {
    key: 'United Kingdom',
    label: 'United Kingdom',
    icon: '🇬🇧',
    desc: 'NHS-independent private medical cover, flight delays, emergency dental, and baggage protection across England, Scotland & Wales.',
  },
  {
    key: 'Rest of World',
    label: 'Rest of World (All Countries)',
    icon: '🌍',
    desc: 'Worldwide protection for Asia, Middle East, Australia, Africa & Americas. Comprehensive cashless medical assistance.',
  },
];

export const DEFAULT_INSURANCE_SERVICES: InsurancePlanItem[] = [
  {
    id: 'ins-europe-schengen',
    slug: 'europe-schengen-travel-insurance',
    title: 'Europe & Schengen Visa Approved Travel Insurance',
    category: 'Europe',
    badge: '100% Embassy & VFS Compliant',
    shortDesc:
      'Official Schengen-compliant travel medical insurance with minimum €30,000 / $50,000 emergency medical cover, zero deductible, and medical repatriation accepted by all 29 European consulates.',
    medicalCoverage: '€30,000 – €100,000',
    coverageHighlights: [
      '€30,000+ Emergency Medical & Hospitalization Cover',
      'Emergency Medical Repatriation & Evacuation',
      'Zero Deductible / Zero Co-Pay options available',
      'Direct Cashless Hospitalization across 29 Schengen States',
      'Trip Cancellation & Flight Delay Reimbursement',
      'Loss of Checked-in Baggage & Passport Protection',
    ],
    targetCountries: 'All 29 Schengen Countries (France, Germany, Switzerland, Italy, Spain, etc.)',
    status: 'PUBLISHED',
    startingPrice: '₹750',
    currency: '₹',
    popular: true,
    showPrice: false,
  },
  {
    id: 'ins-united-states',
    slug: 'united-states-travel-insurance',
    title: 'United States Comprehensive Visitor & Business Insurance',
    category: 'United States',
    badge: 'High-Limit US Healthcare Protection',
    shortDesc:
      'Tailored high-coverage medical insurance designed for the high cost of US healthcare. Covers emergency hospital stays, urgent care, physician visits, and accidental injury across all 50 US states.',
    medicalCoverage: '$50,000 – $500,000 USD',
    coverageHighlights: [
      'Up to $500,000 USD Emergency Medical & ICU Cover',
      'Acute Onset of Pre-Existing Medical Conditions cover available',
      'Cashless Network Hospitals (UnitedHealthcare / PPO Networks)',
      'Emergency Dental & Accidental Injury Treatment',
      'Trip Interruption & Hijack Distress Allowance',
      'Baggage Delay & Passport Loss Assistance',
    ],
    targetCountries: 'United States of America (All 50 States & Territories)',
    status: 'PUBLISHED',
    startingPrice: '₹1,200',
    currency: '₹',
    popular: true,
    showPrice: false,
  },
  {
    id: 'ins-united-kingdom',
    slug: 'united-kingdom-travel-insurance',
    title: 'United Kingdom Standard Visitor & Tourist Insurance',
    category: 'United Kingdom',
    badge: 'Private Medical & Delay Shield',
    shortDesc:
      'Comprehensive UK medical insurance shielding you against expensive private treatments and unexpected travel mishaps across London, Manchester, Scotland, Wales, and Northern Ireland.',
    medicalCoverage: '£50,000 – £250,000 GBP',
    coverageHighlights: [
      'Emergency Hospitalization & Private Clinic Treatment',
      'UK National & Private Doctor Consultation Fees',
      'Trip Curtailment & Urgent Travel Delay Compensation',
      'Checked-in Baggage Loss & Delayed Delivery Cover',
      'Personal Accident & Third-Party Personal Liability',
      '24/7 English-speaking UK Medical Helpline Support',
    ],
    targetCountries: 'United Kingdom (England, Scotland, Wales & Northern Ireland)',
    status: 'PUBLISHED',
    startingPrice: '₹950',
    currency: '₹',
    popular: false,
    showPrice: false,
  },
  {
    id: 'ins-rest-of-world',
    slug: 'worldwide-rest-of-world-travel-insurance',
    title: 'Worldwide Travel Insurance (Asia, Middle East, Americas & Oceania)',
    category: 'Rest of World',
    badge: 'Global Coverage for All Countries',
    shortDesc:
      'Affordable multi-risk international travel insurance covering leisure, business, and family getaways across UAE, Saudi Arabia, Thailand, Singapore, Malaysia, Australia, Turkey, and beyond.',
    medicalCoverage: '$50,000 – $100,000 USD',
    coverageHighlights: [
      'Cashless In-patient Medical Treatment in 150+ Countries',
      'Adventure Sports & Leisure Activity Coverage Options',
      'COVID-19 Medical Hospitalization Included',
      'Baggage Delay & Total Loss Compensation',
      'Trip Cancellation due to Medical Emergency',
      'Instant Digital Policy Certificate with QR Code for Immigration',
    ],
    targetCountries: 'For all Countries (UAE, Saudi, Singapore, Thailand, Australia, Canada, Japan, etc.)',
    status: 'PUBLISHED',
    startingPrice: '₹650',
    currency: '₹',
    popular: true,
    showPrice: false,
  },
];

const STORAGE_KEY = 'skyray_travel_insurance_services_v1';

export function getStoredInsuranceServices(): InsurancePlanItem[] {
  if (typeof window === 'undefined') {
    return DEFAULT_INSURANCE_SERVICES.map((i) => ({ ...i, showPrice: Boolean(i.showPrice) }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INSURANCE_SERVICES));
      return DEFAULT_INSURANCE_SERVICES.map((i) => ({ ...i, showPrice: Boolean(i.showPrice) }));
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map((i: any) => ({ ...i, showPrice: Boolean(i.showPrice) }))
      : DEFAULT_INSURANCE_SERVICES.map((i) => ({ ...i, showPrice: Boolean(i.showPrice) }));
  } catch {
    return DEFAULT_INSURANCE_SERVICES.map((i) => ({ ...i, showPrice: Boolean(i.showPrice) }));
  }
}

export function saveStoredInsuranceServices(items: InsurancePlanItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save travel insurance services to localStorage:', e);
  }
}
