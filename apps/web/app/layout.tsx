import type { Metadata } from 'next';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';

const appUrl =
  process.env.APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'https://skyrayholidays.com';

export const metadata: Metadata = {
  title: {
    default: 'SkyRay Holidays | Explore. Plan. Travel.',
    template: '%s | SkyRay Holidays',
  },
  description: 'Discover thoughtfully planned tours, holidays and pilgrimage services with SkyRay Holidays.',
  metadataBase: new URL(appUrl),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SkyRay Holidays',
    title: 'SkyRay Holidays | Explore. Plan. Travel.',
    description: 'Thoughtfully planned holidays and meaningful pilgrimage journeys.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyRay Holidays',
    description: 'Explore. Plan. Travel.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
