import { Platform, NativeModules } from 'react-native';
import { VISA_SERVICES, VisaServiceItem } from './visas';

const PRODUCTION_API = 'https://skyray-holidays-api.onrender.com/api/v1';

function resolveApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Live production API deployed on Render so changes in web admin reflect on mobile immediately
  return PRODUCTION_API;
}

export const API = resolveApiUrl();

// Local High-Resolution Photography Assets
export const DESTINATION_IMAGES: Record<string, any> = {
  'kashmir-paradise': require('../../assets/destinations/kashmir.jpg'),
  'kerala-backwaters': require('../../assets/destinations/kerala.jpg'),
  'golden-triangle-tour': require('../../assets/destinations/golden-triangle.jpg'),
  'andaman-escape': require('../../assets/destinations/andaman.jpg'),
  'goa-coastal-escape': require('../../assets/destinations/goa.jpg'),
  'sri-lanka-wonder': require('../../assets/destinations/srilanka.jpg'),
  'maldives-resort-escape': require('../../assets/destinations/maldives.jpg'),
  'nepal-himalayan-splendor': require('../../assets/destinations/nepal.jpg'),
  'dubai-holiday': require('../../assets/destinations/dubai.jpg'),
  'turkey-tour': require('../../assets/destinations/turkey.jpg'),
  'bali-escape': require('../../assets/destinations/bali.jpg'),
  'europe-tour': require('../../assets/destinations/europe.jpg'),
  'reunion-island-escape': require('../../assets/destinations/reunion.jpg'),
  'russia-grand-explorer': require('../../assets/destinations/russia.jpg'),
  'mauritius-paradise': require('../../assets/destinations/mauritius.jpg'),
  'seychelles-archipelago': require('../../assets/destinations/seychelles.jpg'),
  'armenia-heritage-tour': require('../../assets/destinations/armenia.jpg'),
  'georgia-caucasus-wonder': require('../../assets/destinations/georgia.jpg'),
  'azerbaijan-land-of-fire': require('../../assets/destinations/azerbaijan.jpg'),
  'us-visa': require('../../assets/destinations/us-visa.jpg'),
  'uk-visa': require('../../assets/destinations/uk-visa.jpg'),
  'schengen-visa': require('../../assets/destinations/schengen-visa.jpg'),
  'premium-hajj-package': require('../../assets/destinations/makkah-kaaba.jpg'),
  'economy-hajj-package': require('../../assets/destinations/makkah-night.jpg'),
  'classic-umrah-package': require('../../assets/destinations/madinah-courtyard.jpg'),
  'premium-umrah': require('../../assets/destinations/madinah-green-dome.jpg'),
  'economy-umrah-package': require('../../assets/destinations/madinah-courtyard.jpg'),
};

export function getPackageImage(slug?: string) {
  if (slug && DESTINATION_IMAGES[slug]) {
    return DESTINATION_IMAGES[slug];
  }
  return DESTINATION_IMAGES['dubai-holiday'];
}

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

export const SPECIALIZED_DESTINATIONS = [
  { name: 'Reunion Island', slug: 'reunion-island-escape', duration: '6 Days / 5 Nights', image: 'reunion-island-escape', tag: 'Volcanic Island' },
  { name: 'Russia', slug: 'russia-grand-explorer', duration: '8 Days / 7 Nights', image: 'russia-grand-explorer', tag: 'Imperial Splendor' },
  { name: 'Turkey', slug: 'turkey-tour', duration: '7 Days / 6 Nights', image: 'turkey-tour', tag: 'Historic Gateway' },
  { name: 'Mauritius', slug: 'mauritius-paradise', duration: '6 Days / 5 Nights', image: 'mauritius-paradise', tag: 'Tropical Paradise' },
  { name: 'Maldives', slug: 'maldives-resort-escape', duration: '5 Days / 4 Nights', image: 'maldives-resort-escape', tag: 'Overwater Luxury' },
  { name: 'Seychelles', slug: 'seychelles-archipelago', duration: '6 Days / 5 Nights', image: 'seychelles-archipelago', tag: 'Granite Beaches' },
  { name: 'Armenia', slug: 'armenia-heritage-tour', duration: '5 Days / 4 Nights', image: 'armenia-heritage-tour', tag: 'Ancient Heritage' },
  { name: 'Georgia', slug: 'georgia-caucasus-wonder', duration: '6 Days / 5 Nights', image: 'georgia-caucasus-wonder', tag: 'Caucasus Wonders' },
  { name: 'Azerbaijan', slug: 'azerbaijan-land-of-fire', duration: '5 Days / 4 Nights', image: 'azerbaijan-land-of-fire', tag: 'Land of Fire' },
];

export const FALLBACK_PACKAGES: TourPackage[] = [
  // --- OUR SPECIALIZED KEY DESTINATIONS ---
  {
    id: 'pkg-reunion',
    slug: 'reunion-island-escape',
    title: 'Reunion Island Tropical Discovery',
    destination: 'Saint-Denis, Reunion Island',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '6 Days / 5 Nights',
    summary: 'Dramatic volcanic peaks, emerald lagoons, and French-Creole island charm in the Indian Ocean.',
    inclusions: ['4-Star Lagoon Resort', 'Volcano 4x4 Guided Tour', 'Daily Breakfast', 'Airport Transfers'],
    exclusions: ['Visa Fees', 'Personal Expenses'],
  },
  {
    id: 'pkg-russia',
    slug: 'russia-grand-explorer',
    title: 'Russia Grand Explorer',
    destination: 'Moscow & St. Petersburg, Russia',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '8 Days / 7 Nights',
    summary: 'Red Square, the Kremlin, opulent Hermitage Museum, imperial palaces, and high-speed Sapsan train.',
    inclusions: ['4-Star City Center Hotels', 'High-Speed Sapsan Train', 'Hermitage & Kremlin Entry', 'Daily Breakfast'],
    exclusions: ['Russian Tourist Visa', 'Flights'],
  },
  {
    id: 'pkg-turkey',
    slug: 'turkey-tour',
    title: 'Turkey Tour - Istanbul & Cappadocia',
    destination: 'Istanbul & Cappadocia, Turkey',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '7 Days / 6 Nights',
    summary: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys.',
    inclusions: ['4-Star Hotels', 'Domestic Flights', 'Cappadocia Tour', 'Daily Breakfast'],
    exclusions: ['Hot Air Balloon Ride', 'International Flights'],
  },
  {
    id: 'pkg-mauritius',
    slug: 'mauritius-paradise',
    title: 'Mauritius Paradise Island Getaway',
    destination: 'Port Louis & Belle Mare, Mauritius',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '6 Days / 5 Nights',
    summary: 'Powder-white beaches, 7 Colored Earth of Chamarel, and Ile aux Cerfs catamaran cruise.',
    inclusions: ['Beachfront Resort Stay', 'Ile aux Cerfs Catamaran Cruise', 'Chamarel Tour', 'Daily Breakfast & Dinner'],
    exclusions: ['Water Sports Activity Fees', 'Personal Expenses'],
  },
  {
    id: 'pkg-maldives',
    slug: 'maldives-resort-escape',
    title: 'Maldives Luxury Lagoon',
    destination: 'South Male Atoll, Maldives',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '5 Days / 4 Nights',
    summary: 'Overwater villas suspended above turquoise lagoons and vibrant coral reef snorkeling.',
    inclusions: ['Overwater / Beach Villa', 'Speedboat Transfers', 'All-Inclusive Meals & Drinks', 'Snorkeling Gear'],
    exclusions: ['Spa Treatments', 'Personal Expenses'],
  },
  {
    id: 'pkg-seychelles',
    slug: 'seychelles-archipelago',
    title: 'Seychelles Pristine Archipelago',
    destination: 'Mahé & Praslin, Seychelles',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '6 Days / 5 Nights',
    summary: 'Granite boulder beaches at Anse Source d’Argent and secluded luxury coves.',
    inclusions: ['Luxury Island Resort', 'Catamaran Ferry Passes', 'La Digue Tour', 'Daily Breakfast'],
    exclusions: ['Environmental Tourism Levy', 'Personal Expenses'],
  },
  {
    id: 'pkg-armenia',
    slug: 'armenia-heritage-tour',
    title: 'Armenia Ancient Heritage & Lakes',
    destination: 'Yerevan & Lake Sevan, Armenia',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '5 Days / 4 Nights',
    summary: 'Centuries-old mountaintop monasteries, views of Mount Ararat, and azure Lake Sevan.',
    inclusions: ['4-Star Yerevan Hotel', 'Lake Sevan Tour', 'Garni & Geghard Excursion', 'Daily Breakfast'],
    exclusions: ['Entrance Tickets', 'Personal Expenses'],
  },
  {
    id: 'pkg-georgia',
    slug: 'georgia-caucasus-wonder',
    title: 'Georgia Caucasus Wonder',
    destination: 'Tbilisi & Kazbegi, Georgia',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '6 Days / 5 Nights',
    summary: 'Old Tbilisi cobblestones, sulfur baths, and snowcapped Gergeti Trinity Church in Kazbegi.',
    inclusions: ['4-Star Boutique Hotels', 'Kazbegi 4WD Mountain Drive', 'Tbilisi Walking Tour', 'Daily Breakfast'],
    exclusions: ['Travel Insurance', 'Personal Expenses'],
  },
  {
    id: 'pkg-azerbaijan',
    slug: 'azerbaijan-land-of-fire',
    title: 'Azerbaijan Land of Fire',
    destination: 'Baku & Gabala, Azerbaijan',
    kind: 'TOUR',
    category: 'Specialized',
    duration: '5 Days / 4 Nights',
    summary: 'Futuristic Flame Towers, UNESCO Old City of Baku, and lush alpine Gabala.',
    inclusions: ['4-Star Baku Hotel', 'Flame Towers Tour', 'Gobustan Mud Volcanoes Trip', 'Daily Breakfast'],
    exclusions: ['Azerbaijan Visa', 'Personal Expenses'],
  },

  // --- PILGRIMAGE (HAJJ & UMRAH: ECONOMY & PREMIUM) ---
  {
    id: 'pkg-hajj-economy',
    slug: 'economy-hajj-package',
    title: 'Economy Hajj Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'HAJJ',
    category: 'Economy',
    duration: '15 - 21 Days',
    summary: 'Spiritual, affordable Hajj journey with compliant accommodations, shuttle services, and scholar guidance.',
    inclusions: ['Compliant Hotels with Shuttle', 'AC Bus Transfers', 'Full-board Buffet Meals', 'Religious Guidance'],
    exclusions: ['Personal Expenses'],
  },
  {
    id: 'pkg-hajj-premium',
    slug: 'premium-hajj-package',
    title: 'Premium Hajj Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'HAJJ',
    category: 'Premium',
    duration: '14 Days',
    summary: 'Complete guidance and luxury 5-star accommodations near the Haram for your sacred journey.',
    inclusions: ['5-Star Hotel near Haram', 'VIP Transport & Train', 'Full-board Buffet Meals', 'Scholars Guidance'],
    exclusions: ['Personal Expenses'],
  },
  {
    id: 'pkg-umrah-economy',
    slug: 'economy-umrah-package',
    title: 'Economy Umrah Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'UMRAH',
    category: 'Economy',
    duration: '10 Days / 9 Nights',
    summary: 'Affordable, serene Umrah pilgrimage with comfortable hotels, shuttle access, and guided Ziyarat.',
    inclusions: ['Verified Hotels with Shuttle', 'AC Transfers', 'Visa Processing Assistance', 'Daily Breakfast'],
    exclusions: ['Personal Expenses'],
  },
  {
    id: 'pkg-umrah-premium',
    slug: 'premium-umrah',
    title: 'Premium Umrah Package',
    destination: 'Makkah & Madinah, Saudi Arabia',
    kind: 'UMRAH',
    category: 'Premium',
    duration: '10 Days / 9 Nights',
    summary: 'A serene and comfortable 5-Star Umrah experience with deluxe hotels close to the holy mosques.',
    inclusions: ['Direct Flights', '5-Star Hotel Stay near Haram', 'Private Transfers & High-Speed Train', 'Daily Breakfast'],
    exclusions: ['Personal Expenses'],
  },
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
];

export function getFallbackPackage(slug?: string): TourPackage {
  if (!slug) return FALLBACK_PACKAGES[0];
  const found = FALLBACK_PACKAGES.find((p) => p.slug === slug);
  return found || FALLBACK_PACKAGES[0];
}

export async function getPackagesWithStatus(): Promise<{ packages: TourPackage[]; isOffline: boolean }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const r = await fetch(`${API}/packages`, { signal: controller.signal });
    clearTimeout(timer);
    if (!r.ok) throw new Error('Unable to load packages');
    const data = await r.json();
    if (Array.isArray(data) && data.length > 0) {
      return { packages: data, isOffline: false };
    }
    return { packages: FALLBACK_PACKAGES, isOffline: true };
  } catch {
    return { packages: FALLBACK_PACKAGES, isOffline: true };
  }
}

export async function getVisaServices(): Promise<VisaServiceItem[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const r = await fetch(`${API}/visas`, { signal: controller.signal });
    clearTimeout(timer);
    if (!r.ok) return VISA_SERVICES;
    const data = await r.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((v: any) => ({
        ...v,
        imageKey: v.imageKey || (v.slug ? v.slug.replace(/-visas?$/, '-visa') : 'dubai-holiday'),
      }));
    }
  } catch {}
  return VISA_SERVICES;
}

export async function getWebsiteContent(): Promise<any> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const r = await fetch(`${API}/content`, { signal: controller.signal });
    clearTimeout(timer);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}


export function generateRandomMobileReference(): string {
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SKY-${datePrefix}-${suffix}`;
}

export async function sendEnquiry(data: any, key: string) {
  try {
    const r = await fetch(`${API}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(data),
    });
    const d = await r.json();
    if (!r.ok) {
      if (d.message) throw new Error(d.message);
      throw new Error('Server returned an error');
    }
    return d;
  } catch (err: any) {
    // If backend was unreachable or threw network error, provide a freshly randomized reference
    console.warn('Network enquiry submission fallback:', err.message);
    return {
      reference: generateRandomMobileReference(),
      status: 'RECEIVED',
      fallback: true,
    };
  }
}

