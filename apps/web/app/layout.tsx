import type { Metadata } from 'next';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';

const appUrl =
  process.env.APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'https://www.skyrayholidays.com';

export const metadata: Metadata = {
  title: {
    default: 'SkyRay Holidays | Official Tour Operator & Pilgrimage Specialist',
    template: '%s | SkyRay Holidays',
  },
  description:
    'SkyRay Holidays is a premier tour operator in Kumbakonam, Tamil Nadu. Specializing in customized international holidays, Hajj & Umrah pilgrimage packages, and fast-track global visa services.',
  keywords: [
    'SkyRay Holidays',
    'skyrayholidays',
    'skyray holidays',
    'Sky Ray Holidays',
    'SkyRay Travel',
    'SkyRay Holidays Kumbakonam',
    'tour operator in Kumbakonam',
    'Hajj and Umrah packages',
    'international visa concierge',
    'Maldives tour packages',
    'Europe Schengen visa',
    'Tamil Nadu travel agency',
  ],
  authors: [{ name: 'SkyRay Holidays' }],
  creator: 'SkyRay Holidays',
  publisher: 'SkyRay Holidays',
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: 'https://www.skyrayholidays.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.skyrayholidays.com',
    siteName: 'SkyRay Holidays',
    title: 'SkyRay Holidays | Official Tour Operator & Pilgrimage Specialist',
    description:
      'Official website of SkyRay Holidays. Curated holiday tours, personalized Hajj & Umrah pilgrimage packages, and seamless visa processing.',
    images: [
      {
        url: '/brand/skyray-logo.png',
        width: 880,
        height: 658,
        alt: 'SkyRay Holidays Official Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyRay Holidays | Official Tour Operator & Pilgrimage Specialist',
    description:
      'Official website of SkyRay Holidays. Curated holiday tours, personalized Hajj & Umrah pilgrimage packages, and seamless visa processing.',
    images: ['/brand/skyray-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      '@id': 'https://www.skyrayholidays.com/#organization',
      name: 'SkyRay Holidays',
      alternateName: [
        'skyrayholidays',
        'Sky Ray Holidays',
        'SkyRay Travel',
        'SkyRay Holidays Kumbakonam',
      ],
      url: 'https://www.skyrayholidays.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.skyrayholidays.com/brand/skyray-logo.png',
        width: 880,
        height: 658,
      },
      image: 'https://www.skyrayholidays.com/brand/skyray-logo.png',
      telephone: '+919176357791',
      email: 'syedrahamathullah@skyrayholidays.com',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No 3, Rahamath Complex, 5th Cross Road, ESMP Nagar, Melacavery',
        addressLocality: 'Kumbakonam',
        addressRegion: 'Tamil Nadu',
        postalCode: '612002',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.9602,
        longitude: 79.3845,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '20:30',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '34',
        bestRating: '5',
        worstRating: '1',
      },
      hasMap: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
      sameAs: [
        'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
        'https://www.instagram.com/skyray_holidays',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.skyrayholidays.com/#website',
      url: 'https://www.skyrayholidays.com',
      name: 'SkyRay Holidays',
      alternateName: 'skyrayholidays',
      publisher: {
        '@id': 'https://www.skyrayholidays.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.skyrayholidays.com/packages?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
