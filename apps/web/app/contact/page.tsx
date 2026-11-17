import type { Metadata } from 'next';
import ContactView from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Contact Us | Kumbakonam Office',
  description:
    'Get in touch with SkyRay Holidays. Reach our team by phone, email, or WhatsApp, or visit our office in Kumbakonam, Tamil Nadu.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Kumbakonam Office | SkyRay Holidays',
    description:
      'Get in touch with SkyRay Holidays. Reach our team by phone, email, or WhatsApp, or visit our office in Kumbakonam, Tamil Nadu.',
    url: 'https://www.skyrayholidays.com/contact',
    images: [
      {
        url: 'https://www.skyrayholidays.com/brand/skyray-logo.png',
        width: 880,
        height: 658,
        alt: 'SkyRay Holidays Official Logo',
      },
    ],
  },
};

export default function Contact() {
  return <ContactView />;
}
