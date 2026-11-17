import type { Metadata } from 'next';
import AboutView from '@/components/AboutView';

export const metadata: Metadata = {
  title: 'About Us | Trusted Travel Partner',
  description:
    'About SkyRay Holidays — Your trusted travel concierge in Kumbakonam, Tamil Nadu. Connecting you to new cultures, sacred journeys, and lasting memories.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Trusted Travel Partner',
    description:
      'About SkyRay Holidays — Your trusted travel concierge in Kumbakonam, Tamil Nadu. Connecting you to new cultures, sacred journeys, and lasting memories.',
    url: 'https://www.skyrayholidays.com/about',
  },
};

export default function About() {
  return <AboutView />;
}
