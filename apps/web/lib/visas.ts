export interface VisaServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  processingTime: string;
  validity: string;
  entryType: string;
  image: string;
  badge: string;
  highlights: string[];
  applicableCountries?: string[];
  defaultCountry?: string;
  status?: string;
  hasOffer?: boolean;
  offerBadge?: string;
  originalPrice?: string;
  offerPrice?: string;
  offerRunningText?: string;
}

export function getStoredVisaServices(): VisaServiceItem[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('skyray_custom_visas');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return VISA_SERVICES;
}

export function saveStoredVisaServices(items: VisaServiceItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('skyray_custom_visas', JSON.stringify(items));
    } catch {}
  }
}

export const SCHENGEN_MEMBER_COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
].sort((a, b) => a.localeCompare(b));

export const POPULAR_EVISA_COUNTRIES = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Sri Lanka',
  'Turkey',
  'Egypt',
  'Vietnam',
  'Indonesia',
  'Georgia',
  'Azerbaijan',
  'Armenia',
  'Russia',
  'Oman',
  'Qatar',
  'Bahrain',
  'Kuwait',
  'Kenya',
  'Tanzania',
  'Cambodia',
  'Laos',
  'Australia',
  'New Zealand',
].sort((a, b) => a.localeCompare(b));

export const GCC_COUNTRIES = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Oman',
  'Kuwait',
  'Qatar',
  'Bahrain',
];

export const VISA_SERVICES: VisaServiceItem[] = [
  {
    id: 'visa-us',
    slug: 'us-visa',
    title: 'US Visa (Tourist, Business & Education)',
    category: 'Standard Embassy Visa',
    badge: 'USA B1/B2 & F1/M1',
    shortDesc:
      'Complete end-to-end guidance for US B1/B2 tourist, business, medical, and F1 student visas. Includes official DS-160 application submission, MRV fee facilitation, consulate appointment scheduling, and 1-on-1 mock interview preparation.',
    processingTime: 'Varies by consulate slot',
    validity: 'Up to 10 Years (Multiple Entry)',
    entryType: 'Multiple Entry',
    image: '/images/destinations/us-visa.jpg',
    defaultCountry: 'United States',
    hasOffer: true,
    offerBadge: 'FLAT ₹2,000 OFF',
    originalPrice: '₹8,500',
    offerPrice: '₹6,500',
    offerRunningText: '⚡ DS-160 Filing + Appointment Slot + Mock Interview included',
    highlights: [
      'Tourist (B2), Business (B1) & Student (F1/M1) Options',
      'Official DS-160 Form Review & Submission',
      'Consulate Biometrics & Interview Slot Booking',
      'Personal 1-on-1 Mock Interview Preparation',
    ],
  },
  {
    id: 'visa-uk',
    slug: 'uk-visa',
    title: 'UK Visa (Tourist, Business & Education)',
    category: 'Standard Embassy Visa',
    badge: 'UK Visitor & Student',
    shortDesc:
      'Comprehensive processing for UK Standard Visitor Visas (Tourist, Business, Family) and Student Visas covering England, Scotland, Wales, and Northern Ireland. Includes document verification, financial audits, and VFS Global appointment booking.',
    processingTime: '15 working days standard',
    validity: '6 Months, 2 Years, 5 Years or 10 Years',
    entryType: 'Multiple Entry',
    image: '/images/destinations/uk-visa.jpg',
    defaultCountry: 'United Kingdom',
    hasOffer: true,
    offerBadge: 'SPECIAL ₹1,500 OFF',
    originalPrice: '₹7,500',
    offerPrice: '₹6,000',
    offerRunningText: '⚡ UKVI Filing + Financial Verification + VFS Slot included',
    highlights: [
      'Tourist, Business & Higher Education Student Categories',
      'Online UKVI Application Filing & Verification',
      'VFS Global Biometrics Appointment Booking',
      'Tailored Invitation & Cover Letter Drafting',
    ],
  },
  {
    id: 'visa-schengen',
    slug: 'schengen-visa',
    title: 'Schengen Visa (Tourist & Business - 29 Countries)',
    category: 'European Union Short-Stay',
    badge: 'Type-C Short Stay (29 Nations)',
    shortDesc:
      'One single visa unlocks seamless travel across all 29 European Schengen member states for Tourism and Business. We provide daily travel itineraries, confirmed flight reservations, hotel vouchers, mandatory EUR 30,000+ medical insurance, and VFS/BLS/TLS appointment booking.',
    processingTime: '10–15 calendar days',
    validity: 'Up to 90 Days within 180 Days',
    entryType: 'Single or Multiple Entry',
    image: '/images/destinations/europe.jpg',
    applicableCountries: SCHENGEN_MEMBER_COUNTRIES,
    hasOffer: true,
    offerBadge: '29 COUNTRIES PASS',
    originalPrice: '₹8,000',
    offerPrice: '₹6,200',
    offerRunningText: '⚡ Flight/Hotel Vouchers + EUR 30K Insurance included',
    highlights: [
      'Tourist & Business Purpose for 29 European Nations',
      'Confirmed Flight & Hotel Reservation Vouchers',
      'Schengen-Approved EUR 30,000+ Travel Medical Insurance',
      'VFS Global, BLS International & TLScontact Slots',
    ],
  },
  {
    id: 'visa-canada',
    slug: 'canada-visa',
    title: 'Canada Visa (Tourist & Business)',
    category: 'Standard Embassy Visa',
    badge: 'Canada V1 / Business',
    shortDesc:
      'Official guidance and document preparation for Canada Tourist (Visitor Visa - V1), Business (B1), and Super Visa for parents/grandparents. Includes IRCC online portal submission, financial auditing, and VFS Global biometrics appointment booking.',
    processingTime: '20–30 working days',
    validity: 'Up to 10 Years (Passport Validity Linked)',
    entryType: 'Multiple Entry',
    image: '/images/destinations/us-visa.jpg',
    defaultCountry: 'Canada',
    highlights: [
      'Tourist (V1) & Business (B1) Application Filing',
      'Super Visa Guidance for Parents & Grandparents',
      'Family Ties & Financial Proof Documentation Audit',
      'VFS Global Biometrics Slot Scheduling',
    ],
  },
  {
    id: 'visa-gcc',
    slug: 'gcc-visa',
    title: 'GCC Visas (Saudi, UAE, Oman, Kuwait, Qatar)',
    category: 'Gulf Cooperation Council E-Visa',
    badge: 'Single/Multiple & GCC Resident',
    shortDesc:
      'Express online tourist and business visas for Gulf Cooperation Council countries: Saudi Arabia, United Arab Emirates (Dubai), Oman, Kuwait, and Qatar. Features single and multiple entry options, plus the specialized GCC Resident Visa scheme for valid Iqama / residence holders.',
    processingTime: '24 to 48 Hours',
    validity: '30 to 90 Days / 1 Year',
    entryType: 'Single or Multiple Entry',
    image: '/images/destinations/dubai.jpg',
    defaultCountry: 'Saudi Arabia',
    applicableCountries: GCC_COUNTRIES,
    hasOffer: true,
    offerBadge: 'EXPRESS 24H DELIVERY',
    originalPrice: '₹4,500',
    offerPrice: '₹3,200',
    offerRunningText: '⚡ 100% Online Paperless Approval via WhatsApp & Email',
    highlights: [
      'Saudi Arabia, UAE, Oman, Kuwait & Qatar Coverage',
      'Single Entry and Multiple Entry Options',
      'Specialized GCC Resident Visa Option for Iqama Holders',
      'Fast 24 to 48-Hour Approval Delivery via WhatsApp & Email',
    ],
  },
  {
    id: 'visa-evisa',
    slug: 'e-visa',
    title: 'Global E-Visa (Country List Fast-Track)',
    category: 'Fast-Track Electronic Visa',
    badge: '100% Online Paperless',
    shortDesc:
      'Lightning-fast electronic visas for top international tourist and business destinations. Zero embassy visits, 100% online processing, document upload via WhatsApp/email, and official approval delivered in 24 to 72 hours.',
    processingTime: '24 to 72 Hours',
    validity: '30 to 90 Days depending on country',
    entryType: 'Single or Multiple Entry',
    image: '/images/destinations/dubai.jpg',
    applicableCountries: POPULAR_EVISA_COUNTRIES,
    highlights: [
      'Over 25+ Global E-Visa Countries Supported',
      'Fast 24 to 72-Hour Direct Processing',
      'Zero Embassy or Consulate Visits Required',
      'Official PDF E-Visa Sent via Email & WhatsApp',
    ],
  },
];
