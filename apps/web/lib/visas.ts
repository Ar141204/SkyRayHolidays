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

export const VISA_SERVICES: VisaServiceItem[] = [
  {
    id: 'visa-us',
    slug: 'us-visa',
    title: 'US Visa (B1/B2 Services)',
    category: 'Standard Embassy Visa',
    badge: 'USA B1/B2 Visitor',
    shortDesc:
      'Complete end-to-end guidance for US B1/B2 tourist, business, and medical visas. Includes DS-160 application submission, fee facilitation, consulate appointment scheduling, and personal mock interview preparation.',
    processingTime: 'Varies by consulate slot',
    validity: 'Up to 10 Years (Multiple Entry)',
    entryType: 'Multiple Entry',
    image: '/images/destinations/us-visa.jpg',
    defaultCountry: 'United States',
    highlights: [
      'Official DS-160 Form Review & Submission',
      'MRV Fee Payment & Appointment Booking',
      'Detailed Financial & Ties Document Checklist',
      'Personal 1-on-1 Mock Interview Guidance',
    ],
  },
  {
    id: 'visa-uk',
    slug: 'uk-visa',
    title: 'UK Visitor Visa Services',
    category: 'Standard Embassy Visa',
    badge: 'UK Standard Visitor',
    shortDesc:
      'Comprehensive processing for UK Standard Visitor Visas covering England, Scotland, Wales, and Northern Ireland. Includes document verification, tuberculosis certificate guidance, and VFS Global appointment booking.',
    processingTime: '15 working days standard',
    validity: '6 Months, 2 Years, 5 Years or 10 Years',
    entryType: 'Multiple Entry',
    image: '/images/destinations/uk-visa.jpg',
    defaultCountry: 'United Kingdom',
    highlights: [
      'Online UKVI Application Filing',
      'Bank Statement & Financial Audit',
      'VFS Global Biometrics Appointment Booking',
      'Tailored Invitation & Cover Letter Drafting',
    ],
  },
  {
    id: 'visa-schengen',
    slug: 'schengen-visa',
    title: 'Schengen Visa (29 Countries)',
    category: 'European Union Short-Stay',
    badge: 'Type-C Short Stay (29 Nations)',
    shortDesc:
      'One single visa unlocks seamless travel across all 29 European Schengen member states. We provide daily travel itineraries, flight reservation certificates, mandatory EUR 30,000+ medical insurance, and VFS/BLS/TLS appointment booking.',
    processingTime: '10–15 calendar days',
    validity: 'Up to 90 Days within 180 Days',
    entryType: 'Single or Multiple Entry',
    image: '/images/destinations/europe.jpg',
    applicableCountries: SCHENGEN_MEMBER_COUNTRIES,
    highlights: [
      'Valid across all 29 Schengen European Nations',
      'Confirmed Flight & Hotel Reservation Vouchers',
      'Schengen-Approved EUR 30,000+ Travel Insurance',
      'VFS Global, BLS International & TLScontact Slots',
    ],
  },
  {
    id: 'visa-evisa',
    slug: 'e-visa',
    title: 'Global E-Visa (Fast-Track Service)',
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
      'Fast 24 to 72-Hour Direct Processing',
      'Zero Embassy or Consulate Visits Required',
      'Passport & Photo Digital Quality Check',
      'Official PDF E-Visa Sent via Email & WhatsApp',
    ],
  },
];
