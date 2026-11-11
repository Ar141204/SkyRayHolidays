export const API_URL =
  typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const contactDefaults = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@skyrayholidays.com',
  address: '123 Travel Street, Chennai, TN 600001',
  hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  mapUrl: 'https://maps.google.com/?q=Chennai+TN+India',
  whatsappMessage: 'Hello SkyRay Holidays! I would like to know more about your tour packages.',
};

export type PackageItem = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  kind: 'TOUR' | 'HAJJ' | 'UMRAH';
  category: string;
  duration: string;
  summary: string;
  priceFrom?: number | null;
  currency?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  published?: boolean;
  description?: string;
  departureDates?: any[];
  itinerary?: any[];
  inclusions?: string[];
  exclusions?: string[];
  details?: Record<string, any>;
};

export const demoPackages: PackageItem[] = [
  {
    id: 'pkg-dubai',
    slug: 'dubai-holiday',
    title: 'Dubai Holiday Package',
    destination: 'Dubai, UAE',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    summary: 'Experience the best of Dubai with our premium holiday package. Enjoy desert safaris, modern landmarks and luxury shopping.',
    description: 'Experience the best of Dubai with our premium holiday package. Enjoy premium stays and scenic shopping and unforgettable moments across Burj Khalifa, Marina Cruise, Desert Safari, and Dubai Mall.',
    priceFrom: 499,
    currency: '$',
    image: '/images/dubai.svg',
    rating: 4.8,
    reviewCount: 120,
    featured: true,
    inclusions: ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Transfers'],
    exclusions: ['Personal Expenses', 'Visa Fees', 'Travel Insurance'],
    departureDates: ['2026-12-15', '2026-12-28', '2027-01-10', '2027-01-25'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Dhow Marina Cruise', description: 'Arrive at Dubai International Airport, private transfer to luxury hotel, evening dinner cruise.' },
      { day: 'Day 2', title: 'Dubai City Tour & Burj Khalifa', description: 'Explore Old Dubai, Dubai Frame, and evening entry to Burj Khalifa 124th floor observation deck.' },
      { day: 'Day 3', title: 'Desert Safari with BBQ Dinner', description: '4x4 dune bashing, camel riding, sandboarding, belly dance show and Arabian buffet under the stars.' },
      { day: 'Day 4', title: 'Abu Dhabi Day Excursion', description: 'Visit the majestic Sheikh Zayed Grand Mosque and Louvre Abu Dhabi.' },
      { day: 'Day 5', title: 'Leisure & Departure', description: 'Last minute shopping at Dubai Mall followed by airport transfer.' },
    ],
  },
  {
    id: 'pkg-turkey',
    slug: 'turkey-tour',
    title: 'Turkey Tour',
    destination: 'Istanbul & Cappadocia, Turkey',
    kind: 'TOUR',
    category: 'International',
    duration: '7 Days / 6 Nights',
    summary: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys and hot air balloons.',
    description: 'A breathtaking 7-day Turkish journey blending Ottoman history, Bosphorus scenic cruises, and dreamlike hot air balloon sunrises over Cappadocia.',
    priceFrom: 699,
    currency: '$',
    image: '/images/paris.svg',
    rating: 4.9,
    reviewCount: 94,
    featured: true,
    inclusions: ['4-Star Hotels', 'Domestic Flights', 'Cappadocia Tour', 'Daily Breakfast', 'Airport Transfers'],
    exclusions: ['Hot Air Balloon Ride Ticket', 'International Flights', 'Gratuities'],
  },
  {
    id: 'pkg-bali',
    slug: 'bali-escape',
    title: 'Bali Escape',
    destination: 'Bali, Indonesia',
    kind: 'TOUR',
    category: 'International',
    duration: '6 Days / 5 Nights',
    summary: 'A tropical island getaway with lush rice terraces, sacred temples, beach sunsets and private pool villas.',
    description: 'Immerse yourself in Balinese culture, serene beaches in Seminyak, waterfalls, and Ubud art villages.',
    priceFrom: 599,
    currency: '$',
    image: '/images/bali.svg',
    rating: 4.8,
    reviewCount: 142,
    featured: true,
    inclusions: ['Private Villa Stay', 'Daily Breakfast', 'Ubud Day Tour', 'Nusa Penida Day Trip', 'Private Transfers'],
    exclusions: ['Visa on Arrival', 'Personal Expenses'],
  },
  {
    id: 'pkg-europe',
    slug: 'europe-tour',
    title: 'Europe Tour',
    destination: 'Paris & Swiss Alps',
    kind: 'TOUR',
    category: 'International',
    duration: '10 Days / 9 Nights',
    summary: 'The quintessential European dream journey from the romantic streets of Paris to the snowcapped peaks of Switzerland.',
    description: 'Tour the Eiffel Tower, Louvre Museum, Swiss Alps cable cars, scenic Lake Lucerne and Alpine villages.',
    priceFrom: 1299,
    currency: '$',
    image: '/images/hero-coast.svg',
    rating: 4.9,
    reviewCount: 78,
    featured: true,
    inclusions: ['Scenic Train Transfers', '4-Star Hotels', 'Swiss Travel Pass', 'Seine River Cruise', 'Daily Breakfast'],
    exclusions: ['Schengen Visa Fee', 'Lunch & Dinner'],
  },
  {
    id: 'pkg-hajj',
    slug: 'premium-hajj-package',
    title: 'Premium Hajj Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'HAJJ',
    category: 'Hajj',
    duration: '14 Days',
    summary: 'Complete guidance and 5-star accommodations near the Haram for your sacred journey of a lifetime.',
    description: 'Experience a peaceful and fully guided pilgrimage with luxury hotel accommodations walking distance from Haram, dedicated scholars, air-conditioned transport, and full logistics support.',
    priceFrom: 4999,
    currency: '$',
    image: '/images/makkah.svg',
    rating: 5.0,
    reviewCount: 210,
    featured: true,
    inclusions: ['5-Star Hotel near Haram', 'VIP Air-conditioned Transport', 'Full-board Buffet Meals', 'Experienced Religious Guidance', 'Ziyarat in Makkah & Madinah', 'Qurbani Included'],
    exclusions: ['Emergency Medical Insurance', 'Excess Baggage Fees'],
    details: {
      makkahHotel: 'Clock Royal Tower (Fairmont) or similar',
      madinahHotel: 'Dar Al Taqwa or Oberoi',
      makkahNights: '8 Nights',
      madinahNights: '6 Nights',
      transport: 'VIP Haramain High Speed Train & AC Coaches',
      guidance: 'English & Urdu Speaking Scholars',
    },
  },
  {
    id: 'pkg-umrah',
    slug: 'premium-umrah',
    title: 'Premium Umrah Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'UMRAH',
    category: 'Umrah',
    duration: '10 Days',
    summary: 'A serene and comfortable Umrah experience with deluxe hotels close to the holy mosques.',
    description: 'Deluxe Umrah package tailored for families and individuals. Enjoy premium rooms with Kaaba view options, direct flights, and comprehensive ground arrangements.',
    priceFrom: 2499,
    currency: '$',
    image: '/images/makkah.svg',
    rating: 4.9,
    reviewCount: 320,
    featured: true,
    inclusions: ['Direct Return Flights', 'Luxury 5-Star Hotel Stay', 'Visa Processing Assistance', 'Private Chauffeur Transfers', 'Daily Breakfast', 'Guided Holy Site Visits (Ziyarat)'],
    exclusions: ['Personal Expenses', 'Room Service'],
    details: {
      makkahHotel: 'Swissotel Al Maqam',
      madinahHotel: 'Pullman Zamzam Madina',
      makkahNights: '5 Nights',
      madinahNights: '5 Nights',
      transport: 'Private High-Speed Train & SUV',
    },
  },
];
