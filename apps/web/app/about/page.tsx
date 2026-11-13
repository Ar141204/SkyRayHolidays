import type { Metadata } from 'next';
import AboutView from '@/components/AboutView';

export const metadata: Metadata = {
  title: 'About Us | Your Trusted Travel Partner',
  description:
    'About SkyRay Holidays — Your Trusted Travel Partner. We connect you to new cultures, beautiful places and lasting memories.',
};

export default function About() {
  return <AboutView />;
}
