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
  // --- DOMESTIC (WITHIN INDIA) ---
  {
    id: 'pkg-kashmir',
    slug: 'kashmir-paradise',
    title: 'Kashmir Paradise Experience',
    destination: 'Srinagar, Gulmarg & Pahalgam',
    kind: 'TOUR',
    category: 'Domestic',
    duration: '6 Days / 5 Nights',
    summary: 'Dal Lake shikara ride, Gulmarg Gondola over snowfields, and luxury houseboat stay.',
    description: 'Known as Paradise on Earth, Kashmir enchants with scenic alpine valleys, snowcapped Himalayan peaks, Mughal Gardens, and tranquil pine meadows.',
    inclusions: ['Luxury Houseboat Stay', 'Shikara Ride', 'Gulmarg Gondola Assistance', 'Private Sedan Cab', 'Daily Breakfast & Dinner'],
    exclusions: ['Pony / Horse Riding', 'Personal Expenses'],
  },
  {
    id: 'pkg-kerala',
    slug: 'kerala-backwaters',
    title: 'Kerala God’s Own Country',
    destination: 'Munnar & Alleppey Backwaters',
    kind: 'TOUR',
    category: 'Domestic',
    duration: '6 Days / 5 Nights',
    summary: 'Rolling tea gardens of Munnar and private traditional houseboat cruise in Alleppey.',
    description: 'Traverse mist-covered tea gardens, cruise serene palm-fringed backwaters, witness Kathakali, and savor authentic Malabar cuisine.',
    inclusions: ['Deluxe Houseboat with All Meals', 'Munnar Resort Stay', 'Spice Garden Tour', 'Private AC Vehicle'],
    exclusions: ['Ayurvedic Spa Treatments', 'Personal Expenses'],
  },
  {
    id: 'pkg-golden-triangle',
    slug: 'golden-triangle-tour',
    title: 'Golden Triangle & Royal Heritage',
    destination: 'Delhi, Agra (Taj Mahal) & Jaipur',
    kind: 'TOUR',
    category: 'Domestic',
    duration: '5 Days / 4 Nights',
    summary: 'Experience the Taj Mahal at sunrise, majestic Amber Fort in Jaipur, and historic Delhi.',
    description: 'India’s most celebrated cultural journey. Experience Mughal grandeur, vibrant Rajasthani royalty, colorful bazaars, and UNESCO World Heritage monuments.',
    inclusions: ['Heritage 4-Star Hotels', 'Monument English Guides', 'Private AC Chauffeur Car', 'Amber Fort Jeep Ride'],
    exclusions: ['Monument Entrance Tickets', 'Personal Expenses'],
  },
  {
    id: 'pkg-andaman',
    slug: 'andaman-escape',
    title: 'Andaman Island Discovery',
    destination: 'Port Blair & Havelock Island',
    kind: 'TOUR',
    category: 'Domestic',
    duration: '5 Days / 4 Nights',
    summary: 'Powder-white beaches at Radhanagar, coral reefs, Cellular Jail show, and cruise transfers.',
    description: 'Swim in crystal clear waters, explore natural coral bridges, snorkel with marine life, and relax under swaying coastal palms.',
    inclusions: ['Beachside Resort Stays', 'High-Speed Cruise', 'Snorkeling Session', 'Airport Transfers'],
    exclusions: ['Scuba Diving Tickets', 'Personal Water Sports'],
  },
  {
    id: 'pkg-goa',
    slug: 'goa-coastal-escape',
    title: 'Goa Coastal Getaway',
    destination: 'North & South Goa',
    kind: 'TOUR',
    category: 'Domestic',
    duration: '4 Days / 3 Nights',
    summary: 'Golden beaches, Portuguese heritage in Old Goa, water sports and sunset river cruise.',
    description: 'Enjoy beachside relaxation, heritage Latin Quarter walks, sunset river cruises, and vibrant coastal culture.',
    inclusions: ['4-Star Beach Resort', 'Daily Breakfast', 'Mandovi River Sunset Cruise', 'Airport Transfers'],
    exclusions: ['Water Sports Activity Fees', 'Lunch & Dinner'],
  },

  // --- SURROUNDING INDIA & INTERNATIONAL ---
  {
    id: 'pkg-srilanka',
    slug: 'sri-lanka-wonder',
    title: 'Sri Lanka Wonder Island',
    destination: 'Colombo, Kandy & Bentota',
    kind: 'TOUR',
    category: 'International',
    duration: '6 Days / 5 Nights',
    summary: 'Temple of the Tooth in Kandy, Ceylon tea hills, Bentota beaches and Colombo.',
    description: 'Visit sacred cultural temples, stroll through lush tea gardens, enjoy water sports at Bentota beach, and discover colonial heritage.',
    inclusions: ['4-Star Hotels', 'Tea Plantation Tour', 'Bentota River Safari', 'Private AC Guide Cab'],
    exclusions: ['Visa Fees', 'Personal Expenses'],
  },
  {
    id: 'pkg-maldives',
    slug: 'maldives-resort-escape',
    title: 'Maldives Luxury Lagoon',
    destination: 'South Male Atoll, Maldives',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    summary: 'Overwater villas suspended above turquoise lagoons and vibrant coral reef snorkeling.',
    description: 'Relax in premier overwater or beachfront villas with all-inclusive dining, snorkeling safaris, and crystal lagoon leisure.',
    inclusions: ['Overwater / Beach Villa', 'Speedboat Transfers', 'All-Inclusive Meals & Drinks', 'Snorkeling Gear'],
    exclusions: ['Spa Treatments', 'Personal Expenses'],
  },
  {
    id: 'pkg-nepal',
    slug: 'nepal-himalayan-splendor',
    title: 'Nepal Himalayan Splendor',
    destination: 'Kathmandu, Pokhara & Nagarkot',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    summary: 'UNESCO temples of Kathmandu, tranquil Phewa Lake, and Everest views from Nagarkot.',
    description: 'Marvel at historic Durbar Squares, holy Pashupatinath Temple, peaceful mountain lakes in Pokhara, and panoramic sunrise peaks.',
    inclusions: ['Deluxe Hotels', 'Phewa Lake Boating', 'Nagarkot Sunrise Tour', 'Private Sightseeing Vehicle'],
    exclusions: ['Monument Entrance Fees', 'Personal Expenses'],
  },
  {
    id: 'pkg-dubai',
    slug: 'dubai-holiday',
    title: 'Dubai Holiday Package',
    destination: 'Dubai, UAE',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    summary: 'Desert safaris, Burj Khalifa views, modern landmarks and luxury shopping.',
    description: 'Experience the best of Dubai with desert safaris, modern architectural marvels, Marina dinner cruises and luxury shopping.',
    inclusions: ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Desert Safari with BBQ', 'Transfers'],
    exclusions: ['Personal Expenses', 'Visa Fees'],
  },
  {
    id: 'pkg-turkey',
    slug: 'turkey-tour',
    title: 'Turkey Tour',
    destination: 'Istanbul & Cappadocia',
    kind: 'TOUR',
    category: 'International',
    duration: '7 Days / 6 Nights',
    summary: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys.',
    description: 'Ottoman history, Bosphorus scenic cruises, and dreamlike hot air balloon sunrises over Cappadocia.',
    inclusions: ['4-Star Hotels', 'Domestic Flights', 'Cappadocia Tour', 'Daily Breakfast'],
    exclusions: ['Hot Air Balloon Ride', 'International Flights'],
  },
  {
    id: 'pkg-bali',
    slug: 'bali-escape',
    title: 'Bali Escape',
    destination: 'Bali, Indonesia',
    kind: 'TOUR',
    category: 'International',
    duration: '6 Days / 5 Nights',
    summary: 'Lush rice terraces, sacred temples, beach sunsets and private pool villas.',
    description: 'Immerse yourself in Balinese culture, serene beaches in Seminyak, waterfalls, and Ubud art villages.',
    inclusions: ['Private Villa Stay', 'Daily Breakfast', 'Ubud Day Tour', 'Nusa Penida Trip'],
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
    summary: 'Romantic streets of Paris to the snowcapped peaks of Switzerland.',
    description: 'Tour the Eiffel Tower, Louvre Museum, Swiss Alps cable cars, scenic Lake Lucerne and Alpine villages.',
    inclusions: ['Scenic Train Transfers', '4-Star Hotels', 'Swiss Travel Pass', 'Seine River Cruise'],
    exclusions: ['Schengen Visa Fee'],
  },

  // --- PILGRIMAGE (HAJJ & UMRAH) ---
  {
    id: 'pkg-hajj',
    slug: 'premium-hajj-package',
    title: 'Premium Hajj Package',
    destination: 'Makkah & Madinah',
    kind: 'HAJJ',
    category: 'Hajj',
    duration: '14 Days',
    summary: 'Complete guidance and 5-star accommodations near the Haram for your sacred journey.',
    description: 'Experience a peaceful and fully guided pilgrimage with luxury hotel accommodations walking distance from Haram, dedicated scholars, and full logistics support.',
    inclusions: ['5-Star Hotel near Haram', 'VIP Transport', 'Full-board Buffet Meals', 'Experienced Religious Guidance'],
    exclusions: ['Emergency Medical Insurance'],
  },
  {
    id: 'pkg-umrah',
    slug: 'premium-umrah',
    title: 'Premium Umrah Package',
    destination: 'Makkah & Madinah',
    kind: 'UMRAH',
    category: 'Umrah',
    duration: '10 Days',
    summary: 'A serene and comfortable Umrah experience with deluxe hotels close to the holy mosques.',
    description: 'Deluxe Umrah package tailored for families and individuals with Kaaba view options, direct flights, and comprehensive ground arrangements.',
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

