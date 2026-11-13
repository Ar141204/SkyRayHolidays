import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard, Roles, RolesGuard } from '../common/auth.guard';
import { Request } from 'express';

export const DEFAULT_WEBSITE_CONTENT = {
  home: {
    eyebrow: 'WHERE EVERY TRIP BECOMES A MEMORY',
    title: 'Your Journey Begins with SkyRay Holidays',
    subtitle:
      'Discover unforgettable destinations, thoughtfully planned holidays and meaningful pilgrimage journeys.',
    heroImage: '/images/hero.jpg',
    badge1Title: 'Thoughtful Planning',
    badge1Desc: 'Itineraries tailored to your pace, dates & budget.',
    badge2Title: 'Personal Guidance',
    badge2Desc: 'Dedicated team with you before, during & after.',
    badge3Title: 'Clear Information',
    badge3Desc: 'No hidden surprises. Transparent quotes upfront.',
    badge4Title: 'Memories That Last',
    badge4Desc: 'Spiritual renewal, family joy & cultural wonder.',
  },
  about: {
    eyebrow: 'YOUR TRUSTED TRAVEL PARTNER',
    title: 'About SkyRay Holidays',
    lead:
      "At SkyRay Holidays, we believe travel is more than just a journey — it's an experience that connects you to new cultures, beautiful places and lasting memories.",
    story:
      'Whether you are discovering iconic world capitals, relaxing on pristine tropical beaches, or embarking on sacred pilgrimage journeys for Hajj & Umrah, our team is dedicated to providing personal care, transparent itineraries and seamless logistics.',
    image: '/images/hero.jpg',
    missionTitle: 'Our Mission',
    missionDesc:
      'To make travel accessible, enjoyable, and effortless for every traveler through thoughtful planning, transparent pricing, and personalized itineraries.',
    visionTitle: 'Our Vision',
    visionDesc:
      'To be the most trusted global travel and pilgrimage facilitator, celebrated for unwavering reliability, customer warmth, and spiritual integrity.',
    whyUsTitle: 'Why Choose Us',
    whyUsDesc:
      'Handpicked 4-star and 5-star hotels, verified private chauffeurs, on-ground tour guides, transparent custom quotes, and dedicated 24/7 concierge support.',
    promise1: 'Verified 4-star and 5-star handpicked accommodations',
    promise2: 'Dedicated Hajj & Umrah religious guides & scholars',
    promise3: 'Transparent pricing with zero hidden charges',
    promise4: 'Custom tailored private or group travel itineraries',
  },
  contact: {
    bannerEyebrow: 'WE ARE HERE TO HELP',
    bannerTitle: 'Get in Touch',
    bannerDesc:
      'Have questions about a destination or want a customized quote? Speak directly with our friendly travel specialists.',
    phoneIndia: '+91 91763 57791',
    phoneSaudi: '+966 57 549 0602',
    whatsapp: '+91 91763 57791',
    email: 'syedrahamathullah@skyrayholidays.com',
    hours: '24/7 Dedicated Support',
    whatsappMessage:
      'Hello SkyRay Holidays! I would like to enquire about your tour packages.',
    googleReviewsUrl: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
  },
  footer: {
    companyBio:
      'Curated international & domestic holiday packages, specialized world getaways, visa assistance, and spiritually enriching Hajj & Umrah pilgrimages.',
    ratingText: '4.9 ★ Rating on Google Maps (34 Verified Reviews)',
    copyrightText: '© 2026 SkyRay Holidays. All rights reserved.',
    sloganText: 'Where Every Trip Becomes A Memory',
    pilgrimNotice:
      'Official SkyRay Travel Concierge. Direct specialist support for Tours, Hajj & Umrah, and Global Visas.',
  },
};

export const DEFAULT_VISA_SERVICES = [
  {
    id: 'us',
    slug: 'us-visa',
    title: 'US Visa Assistance',
    category: 'Tourist, Business & Education',
    badge: 'Standard Embassy Visa',
    shortDesc:
      'End-to-end guidance for B1/B2 tourist, business visits, and student visa applications.',
    processingTime: '15-30 working days',
    validity: 'Up to 10 Years',
    entryType: 'Multiple Entry',
    defaultCountry: 'United States',
    image: '/images/destinations/us-visa.jpg',
    highlights: [
      'DS-160 Form Preparation & Expert Audit',
      'Consular Appointment Slot Monitoring',
      'One-on-One Mock Interview Preparation',
      'Customized Document Checklist',
    ],
    applicableCountries: ['United States'],
    status: 'PUBLISHED',
  },
  {
    id: 'uk',
    slug: 'uk-visa',
    title: 'UK Standard Visitor Visa',
    category: 'Tourist, Business & Education',
    badge: 'Standard Visitor Visa',
    shortDesc:
      'Full consultation for 6-month, 2-year, 5-year, or 10-year Standard Visitor and Student Visas.',
    processingTime: '15-20 working days',
    validity: '6 Months to 10 Years',
    entryType: 'Multiple Entry',
    defaultCountry: 'United Kingdom',
    image: '/images/destinations/uk-visa.jpg',
    highlights: [
      'Comprehensive Application Review',
      'VFS Global Appointment Scheduling',
      'Financial Document & Sponsor Letter Curation',
      'Priority Processing Assistance Available',
    ],
    applicableCountries: ['United Kingdom'],
    status: 'PUBLISHED',
  },
  {
    id: 'schengen',
    slug: 'schengen-visa',
    title: 'Schengen Visa (29 Nations)',
    category: 'Tourist & Business (29 Nations)',
    badge: 'Short-Stay Uniform Visa',
    shortDesc:
      'Explore France, Switzerland, Germany, Italy, Spain, and 24 more European countries on a single visa.',
    processingTime: '15-25 calendar days',
    validity: 'Up to 90 Days stay per 180 days',
    entryType: 'Single / Multiple Entry',
    defaultCountry: 'France',
    image: '/images/destinations/schengen-visa.jpg',
    highlights: [
      'Country Selection for Highest Approval Odds',
      'Confirmed Flight Itinerary & Hotel Vouchers',
      'Compliant Schengen Travel Insurance (EUR 30k+)',
      'VFS / TLScontact / BLS Appointment Booking',
    ],
    applicableCountries: [
      'Austria',
      'Belgium',
      'Bulgaria',
      'Croatia',
      'Czech Republic',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Iceland',
      'Italy',
      'Latvia',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Malta',
      'Netherlands',
      'Norway',
      'Poland',
      'Portugal',
      'Romania',
      'Slovakia',
      'Slovenia',
      'Spain',
      'Sweden',
      'Switzerland',
    ],
    status: 'PUBLISHED',
  },
  {
    id: 'canada',
    slug: 'canada-visa',
    title: 'Canada Visitor Visa (V-1)',
    category: 'Tourist (V1) & Business',
    badge: 'Temporary Resident Visa',
    shortDesc:
      'Travel to Canada for tourism, visiting family/friends, or attending business conferences.',
    processingTime: '20-35 working days',
    validity: 'Up to Passport Expiry (up to 10 yrs)',
    entryType: 'Multiple Entry',
    defaultCountry: 'Canada',
    image: '/images/destinations/us-visa.jpg',
    highlights: [
      'IRCC Portal Online Application Lodgement',
      'Biometrics Instruction Letter (BIL) Booking',
      'Purpose of Travel & Tie-Down Letter Guidance',
      'Super Visa for Parents & Grandparents Available',
    ],
    applicableCountries: ['Canada'],
    status: 'PUBLISHED',
  },
  {
    id: 'gcc',
    slug: 'gcc-visas',
    title: 'GCC Tourist & Resident Visas',
    category: 'Saudi, UAE, Oman, Kuwait, Qatar, Bahrain',
    badge: 'Fast-Track E-Visa',
    shortDesc:
      'Seamless visa assistance for Saudi Arabia, Dubai/UAE, Oman, Qatar, Bahrain, and Kuwait.',
    processingTime: '24 to 72 hours',
    validity: '30 to 90 Days / 1 Year Multiple',
    entryType: 'Single / Multiple Entry',
    defaultCountry: 'Saudi Arabia',
    image: '/images/destinations/dubai.jpg',
    highlights: [
      'Saudi Tourist & Umrah Visa (Instant E-Visa)',
      'Dubai & Abu Dhabi 30 / 60 Days Tourist Visas',
      'GCC Resident Visas with Express Turnaround',
      'Comprehensive Travel & Medical Cover Included',
    ],
    applicableCountries: [
      'Bahrain',
      'Kuwait',
      'Oman',
      'Qatar',
      'Saudi Arabia',
      'United Arab Emirates',
    ],
    status: 'PUBLISHED',
  },
  {
    id: 'evisa',
    slug: 'global-evisas',
    title: 'Global Fast-Track E-Visas (50+ Countries)',
    category: '50+ Fast-Track Countries',
    badge: 'Express Electronic Visa',
    shortDesc:
      'Quick electronic visa processing for Singapore, Malaysia, Vietnam, Thailand, Turkey, Egypt, and more.',
    processingTime: '1 to 5 working days',
    validity: '15 to 90 Days',
    entryType: 'Single / Double / Multiple Entry',
    defaultCountry: 'Singapore',
    image: '/images/destinations/dubai.jpg',
    highlights: [
      '100% Online Paperless Application Process',
      'Document Scanning & Precision Verification',
      'Real-Time Status Tracking & Timely Delivery',
      'Support for Urgent / Express Applications',
    ],
    applicableCountries: [
      'Armenia',
      'Australia',
      'Azerbaijan',
      'Bahrain',
      'Cambodia',
      'Egypt',
      'Georgia',
      'Indonesia',
      'Kenya',
      'Kuwait',
      'Laos',
      'Malaysia',
      'New Zealand',
      'Oman',
      'Qatar',
      'Russia',
      'Saudi Arabia',
      'Singapore',
      'Sri Lanka',
      'Tanzania',
      'Thailand',
      'Turkey',
      'United Arab Emirates',
      'Vietnam',
    ],
    status: 'PUBLISHED',
  },
];

@Controller('settings')
export class SettingsController {
  constructor(private db: PrismaService) {}

  @Get('public')
  async get() {
    try {
      const s = await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global' },
        update: {},
        select: {
          companyName: true,
          phone: true,
          whatsapp: true,
          email: true,
          address: true,
          hours: true,
          mapUrl: true,
          whatsappMessage: true,
          googleReviewsUrl: true,
        },
      });
      return {
        companyName: s.companyName || 'SkyRay Holidays',
        phone: s.phone || '+91 91763 57791',
        phoneSecondary: '+966 57 549 0602',
        whatsapp: s.whatsapp || '+91 91763 57791',
        whatsappSecondary: '+966 57 549 0602',
        email: s.email || 'syedrahamathullah@skyrayholidays.com',
        address: s.address || 'Chennai, Tamil Nadu, India',
        hours: s.hours || '24/7 Dedicated Support',
        mapUrl: s.mapUrl || '',
        whatsappMessage:
          s.whatsappMessage ||
          'Hello SkyRay Holidays! I would like to know more about your tour packages.',
        googleReviewsUrl:
          s.googleReviewsUrl || 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
      };
    } catch {
      return {
        companyName: 'SkyRay Holidays',
        phone: '+91 91763 57791',
        phoneSecondary: '+966 57 549 0602',
        whatsapp: '+91 91763 57791',
        whatsappSecondary: '+966 57 549 0602',
        email: 'syedrahamathullah@skyrayholidays.com',
        hours: '24/7 Dedicated Support',
        mapUrl: '',
        whatsappMessage:
          'Hello SkyRay Holidays! I would like to know more about your tour packages.',
        googleReviewsUrl: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
      };
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER')
  @Patch()
  async update(@Body() b: any, @Req() req: Request) {
    const allowed = [
      'companyName',
      'phone',
      'whatsapp',
      'email',
      'address',
      'hours',
      'mapUrl',
      'whatsappMessage',
      'googleReviewsUrl',
    ];
    const data: any = {};
    for (const k of allowed) if (b[k] !== undefined) data[k] = b[k];

    try {
      const result = await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global', ...data },
        update: data,
      });
      try {
        await this.db.auditLog.create({
          data: {
            actorId: (req as any).user?.id,
            actorLabel: (req as any).user?.email || 'admin',
            action: 'SETTINGS_UPDATED',
            entity: 'SiteSettings',
            entityId: 'global',
          },
        });
      } catch {}
      return result;
    } catch (dbErr) {
      return { id: 'global', ...data, status: 'saved_locally' };
    }
  }
}

@Controller('content')
export class ContentController {
  constructor(private db: PrismaService) {}

  @Get()
  async get() {
    try {
      const row = await this.db.siteSettings.findUnique({
        where: { id: 'global' },
        select: { contentJson: true },
      });
      if (row?.contentJson && typeof row.contentJson === 'object' && Object.keys(row.contentJson).length > 0) {
        return row.contentJson;
      }
    } catch {}
    return DEFAULT_WEBSITE_CONTENT;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER')
  @Patch()
  async update(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global', contentJson: body },
        update: { contentJson: body },
        select: { contentJson: true },
      });
      try {
        await this.db.auditLog.create({
          data: {
            actorId: (req as any).user?.id,
            actorLabel: (req as any).user?.email || 'admin',
            action: 'CONTENT_UPDATED',
            entity: 'SiteSettings.contentJson',
            entityId: 'global',
          },
        });
      } catch {}
      return { success: true, content: result.contentJson };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

@Controller('visas')
export class VisasController {
  constructor(private db: PrismaService) {}

  @Get()
  async get() {
    try {
      const row = await this.db.siteSettings.findUnique({
        where: { id: 'global' },
        select: { visasJson: true },
      });
      if (row?.visasJson && Array.isArray(row.visasJson) && row.visasJson.length > 0) {
        return row.visasJson;
      }
    } catch {}
    return DEFAULT_VISA_SERVICES;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER')
  @Patch()
  async update(@Body() body: any, @Req() req: Request) {
    try {
      const visasArray = Array.isArray(body) ? body : (body.visas || []);
      const result = await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global', visasJson: visasArray },
        update: { visasJson: visasArray },
        select: { visasJson: true },
      });
      try {
        await this.db.auditLog.create({
          data: {
            actorId: (req as any).user?.id,
            actorLabel: (req as any).user?.email || 'admin',
            action: 'VISAS_UPDATED',
            entity: 'SiteSettings.visasJson',
            entityId: 'global',
          },
        });
      } catch {}
      return { success: true, visas: result.visasJson };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
