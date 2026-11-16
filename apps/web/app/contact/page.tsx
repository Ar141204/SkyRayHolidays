import type { Metadata } from 'next';
import ContactView from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Contact Us | SkyRay Holidays Kumbakonam',
  description:
    'Get in touch with SkyRay Holidays. Reach our team by phone, email, or WhatsApp, or visit our office in Kumbakonam, Tamil Nadu.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Contact() {
  return <ContactView />;
}
