import { Platform } from 'react-native';

const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:4000/api/v1' : 'http://localhost:4000/api/v1';
export const API = process.env.EXPO_PUBLIC_API_URL || defaultHost;

export type TourPackage = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  kind: string;
  category?: string;
  duration: string;
  summary: string;
  description?: string | null;
  image?: string;
  priceFrom?: number | null;
  currency?: string;
  departureDates?: any[];
  itinerary?: any[];
  inclusions?: any[];
  exclusions?: any[];
  details?: Record<string, any> | null;
};

export const FALLBACK_PACKAGES: TourPackage[] = [
  {
    id: '1',
    slug: 'dubai-holiday',
    title: 'Dubai Holiday Package',
    destination: 'Dubai, UAE',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    priceFrom: 499,
    currency: '$',
    summary: 'Experience the best of Dubai with our premium holiday package. Enjoy desert safaris, modern landmarks and luxury shopping.',
    description: 'Experience the best of Dubai with our premium holiday package. Enjoy premium stays and scenic shopping and unforgettable moments.',
    inclusions: ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Transfers'],
    exclusions: ['Personal Expenses', 'Visa Fees'],
  },
  {
    id: '2',
    slug: 'turkey-tour',
    title: 'Turkey Tour',
    destination: 'Istanbul & Cappadocia',
    kind: 'TOUR',
    category: 'International',
    duration: '7 Days / 6 Nights',
    priceFrom: 699,
    currency: '$',
    summary: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys and hot air balloons.',
    description: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys and hot air balloons.',
    inclusions: ['4-Star Hotels', 'Domestic Flights', 'Cappadocia Tour', 'Daily Breakfast'],
    exclusions: ['Hot Air Balloon Ride', 'International Flights'],
  },
  {
    id: '3',
    slug: 'bali-escape',
    title: 'Bali Escape',
    destination: 'Bali, Indonesia',
    kind: 'TOUR',
    category: 'International',
    duration: '6 Days / 5 Nights',
    priceFrom: 599,
    currency: '$',
    summary: 'A tropical island getaway with lush rice terraces, sacred temples, beach sunsets and private pool villas.',
    description: 'A tropical island getaway with lush rice terraces, sacred temples, beach sunsets and private pool villas.',
    inclusions: ['Private Villa Stay', 'Daily Breakfast', 'Ubud Day Tour', 'Nusa Penida Trip'],
    exclusions: ['Visa on Arrival', 'Personal Expenses'],
  },
  {
    id: '4',
    slug: 'europe-tour',
    title: 'Europe Tour',
    destination: 'Paris & Swiss Alps',
    kind: 'TOUR',
    category: 'International',
    duration: '10 Days / 9 Nights',
    priceFrom: 1299,
    currency: '$',
    summary: 'The quintessential European dream journey from Paris to the snowcapped peaks of Switzerland.',
    description: 'The quintessential European dream journey from Paris to the snowcapped peaks of Switzerland.',
    inclusions: ['Scenic Train Transfers', '4-Star Hotels', 'Swiss Travel Pass', 'Seine River Cruise'],
    exclusions: ['Schengen Visa Fee'],
  },
  {
    id: '5',
    slug: 'premium-hajj-package',
    title: 'Premium Hajj Package',
    destination: 'Makkah & Madinah',
    kind: 'HAJJ',
    category: 'Hajj',
    duration: '14 Days',
    priceFrom: 4999,
    currency: '$',
    summary: 'Complete guidance and 5-star accommodations near the Haram for your sacred journey of a lifetime.',
    description: 'Complete guidance and 5-star accommodations near the Haram for your sacred journey of a lifetime.',
    inclusions: ['5-Star Hotel near Haram', 'VIP Transport', 'Full-board Buffet Meals', 'Experienced Religious Guidance'],
    exclusions: ['Emergency Medical Insurance'],
  },
  {
    id: '6',
    slug: 'premium-umrah',
    title: 'Premium Umrah Package',
    destination: 'Makkah & Madinah',
    kind: 'UMRAH',
    category: 'Umrah',
    duration: '10 Days',
    priceFrom: 2499,
    currency: '$',
    summary: 'A serene and comfortable Umrah experience with deluxe hotels close to the holy mosques.',
    description: 'A serene and comfortable Umrah experience with deluxe hotels close to the holy mosques.',
    inclusions: ['Direct Return Flights', 'Luxury 5-Star Hotel Stay', 'Visa Processing Assistance', 'Private Chauffeur Transfers'],
    exclusions: ['Personal Expenses'],
  },
];

export function getFallbackPackage(slug?: string): TourPackage {
  if (!slug) return FALLBACK_PACKAGES[0];
  const found = FALLBACK_PACKAGES.find((p) => p.slug === slug);
  return found || FALLBACK_PACKAGES[0];
}

export async function getPackages(): Promise<TourPackage[]> {
  try {
    const r = await fetch(`${API}/packages`);
    if (!r.ok) throw new Error('Unable to load packages');
    const data = await r.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PACKAGES;
  } catch {
    return FALLBACK_PACKAGES;
  }
}

export async function sendEnquiry(data: any, key: string) {
  const r = await fetch(`${API}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(data),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.message || 'Unable to submit enquiry');
  return d;
}

