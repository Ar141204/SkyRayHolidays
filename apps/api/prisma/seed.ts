import path from 'path';
import dotenv from 'dotenv';

// Load .env relative to seed file location or process cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  // 1. Seed Site Settings matching Preview Board
  await db.siteSettings.upsert({
    where: { id: 'global' },
    create: {
      id: 'global',
      companyName: 'SkyRay Holidays',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'info@skyrayholidays.com',
      address: '123 Travel Street, Chennai, TN 600001',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      mapUrl: 'https://maps.google.com/?q=Chennai+India',
      whatsappMessage: 'Hello SkyRay Holidays! I would like to know more about your tour packages.',
    },
    update: {
      companyName: 'SkyRay Holidays',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'info@skyrayholidays.com',
      address: '123 Travel Street, Chennai, TN 600001',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },
  });

  // 2. Seed Packages matching Preview Board
  const samples = [
    {
      slug: 'dubai-holiday',
      title: 'Dubai Holiday Package',
      destination: 'Dubai, UAE',
      kind: 'TOUR' as const,
      category: 'International',
      duration: '5 Days / 4 Nights',
      priceFrom: 499,
      currency: '$',
      summary: 'Experience the best of Dubai with our premium holiday package. Enjoy desert safaris, modern landmarks and luxury shopping.',
      description: 'Experience the best of Dubai with our premium holiday package. Enjoy premium stays and scenic shopping and unforgettable moments.',
      image: '/images/dubai.svg',
      featured: true,
      inclusions: ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Transfers'],
      exclusions: ['Personal Expenses', 'Visa Fees'],
    },
    {
      slug: 'turkey-tour',
      title: 'Turkey Tour',
      destination: 'Istanbul & Cappadocia, Turkey',
      kind: 'TOUR' as const,
      category: 'International',
      duration: '7 Days / 6 Nights',
      priceFrom: 699,
      currency: '$',
      summary: 'Explore Istanbul’s historic treasures and Cappadocia’s magical fairy chimneys and hot air balloons.',
      image: '/images/paris.svg',
      featured: true,
      inclusions: ['4-Star Hotels', 'Domestic Flights', 'Cappadocia Tour', 'Daily Breakfast', 'Airport Transfers'],
      exclusions: ['Hot Air Balloon Ride Ticket', 'International Flights'],
    },
    {
      slug: 'bali-escape',
      title: 'Bali Escape',
      destination: 'Bali, Indonesia',
      kind: 'TOUR' as const,
      category: 'International',
      duration: '6 Days / 5 Nights',
      priceFrom: 599,
      currency: '$',
      summary: 'A tropical island getaway with lush rice terraces, sacred temples, beach sunsets and private pool villas.',
      image: '/images/bali.svg',
      featured: true,
      inclusions: ['Private Villa Stay', 'Daily Breakfast', 'Ubud Day Tour', 'Nusa Penida Day Trip'],
      exclusions: ['Visa on Arrival', 'Personal Expenses'],
    },
    {
      slug: 'europe-tour',
      title: 'Europe Tour',
      destination: 'Paris & Swiss Alps',
      kind: 'TOUR' as const,
      category: 'International',
      duration: '10 Days / 9 Nights',
      priceFrom: 1299,
      currency: '$',
      summary: 'The quintessential European dream journey from Paris to the snowcapped peaks of Switzerland.',
      image: '/images/hero-coast.svg',
      featured: true,
      inclusions: ['Scenic Train Transfers', '4-Star Hotels', 'Swiss Travel Pass', 'Seine River Cruise'],
      exclusions: ['Schengen Visa Fee'],
    },
    {
      slug: 'premium-hajj-package',
      title: 'Premium Hajj Package',
      destination: 'Makkah & Madinah, Saudi Arabia',
      kind: 'HAJJ' as const,
      category: 'Hajj',
      duration: '14 Days',
      priceFrom: 4999,
      currency: '$',
      summary: 'Complete guidance and 5-star accommodations near the Haram for your sacred journey of a lifetime.',
      image: '/images/makkah.svg',
      featured: true,
      inclusions: ['5-Star Hotel near Haram', 'VIP Air-conditioned Transport', 'Full-board Buffet Meals', 'Experienced Religious Guidance'],
      exclusions: ['Emergency Medical Insurance'],
    },
    {
      slug: 'premium-umrah',
      title: 'Premium Umrah Package',
      destination: 'Makkah & Madinah, Saudi Arabia',
      kind: 'UMRAH' as const,
      category: 'Umrah',
      duration: '10 Days',
      priceFrom: 2499,
      currency: '$',
      summary: 'A serene and comfortable Umrah experience with deluxe hotels close to the holy mosques.',
      image: '/images/makkah.svg',
      featured: true,
      inclusions: ['Direct Return Flights', 'Luxury 5-Star Hotel Stay', 'Visa Processing Assistance', 'Private Chauffeur Transfers'],
      exclusions: ['Personal Expenses'],
    },
  ];

  for (const p of samples) {
    await db.package.upsert({
      where: { slug: p.slug },
      create: { ...p, status: 'PUBLISHED' },
      update: { ...p, status: 'PUBLISHED' },
    });
  }

  // 3. Provision Admin if environment variables are set
  const name = process.env.SEED_ADMIN_NAME || 'SkyRay Owner';
  const email = process.env.SEED_ADMIN_EMAIL || 'owner@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'SkyRayAdmin2026!Secure';

  await db.adminUser.upsert({
    where: { email: email.toLowerCase() },
    create: {
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: 'SUPER_ADMIN',
    },
    update: {},
  });
  console.log(`Provisioned super admin: ${email}`);
}

main().finally(() => db.$disconnect());
