'use client';

import { useState, useEffect } from 'react';
import { API_URL } from './config';

export type WebsiteContent = {
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroImage: string;
    heroImages?: string[];
    enableVideo?: boolean;
    heroVideoUrl?: string;
    slideInterval?: number;
    enableLiveOffers?: boolean;
    offerHeadline?: string;
    offerBadge?: string;
    offerLink?: string;
    offerExpiry?: string;
    badge1Title: string;
    badge1Desc: string;
    badge2Title: string;
    badge2Desc: string;
    badge3Title: string;
    badge3Desc: string;
    badge4Title: string;
    badge4Desc: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    story: string;
    image: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    whyUsTitle: string;
    whyUsDesc: string;
    promise1: string;
    promise2: string;
    promise3: string;
    promise4: string;
  };
  contact: {
    bannerEyebrow: string;
    bannerTitle: string;
    bannerDesc: string;
    phoneIndia: string;
    phoneSaudi: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
    whatsappMessage: string;
    googleReviewsUrl: string;
  };
  footer: {
    companyBio: string;
    ratingText: string;
    copyrightText: string;
    sloganText: string;
    pilgrimNotice: string;
  };
};

export const defaultWebsiteContent: WebsiteContent = {
  home: {
    eyebrow: 'WHERE EVERY TRIP BECOMES A MEMORY',
    title: 'Your Journey Begins with SkyRay Holidays',
    subtitle: 'Discover unforgettable destinations, thoughtfully planned holidays and meaningful pilgrimage journeys.',
    heroImage: '/images/banner/banner-1-swiss-alps.jpg',
    heroImages: [
      '/images/banner/banner-1-swiss-alps.jpg',
      '/images/banner/banner-2-santorini.jpg',
      '/images/banner/banner-3-cappadocia.jpg',
      '/images/banner/banner-4-kyoto-fuji.jpg',
      '/images/banner/banner-5-norway-fjords.jpg',
      '/images/banner/banner-6-singapore.jpg',
      '/images/banner/banner-7-amalfi.jpg',
      '/images/banner/banner-8-phuket.jpg',
    ],
    enableVideo: false,
    heroVideoUrl: '/videos/travel-hero.webm',
    slideInterval: 5,
    enableLiveOffers: true,
    offerHeadline: 'Special Offer: Flat ₹2,000 Off on US, UK & Schengen Visa Consultations | Fast-Track Slots Available!',
    offerBadge: 'LIMITED RUNNING OFFER',
    offerLink: '/visa',
    offerExpiry: 'Special Rates Valid This Month',
    badge1Title: 'Curated Itineraries',
    badge1Desc: 'Handcrafted travel plans tailored to your exact pace and preferences.',
    badge2Title: 'Verified Stays',
    badge2Desc: 'Premium 4-star and 5-star partner properties inspected for quality.',
    badge3Title: '24/7 Concierge Support',
    badge3Desc: 'Dedicated trip coordinator available throughout your journey.',
    badge4Title: 'Transparent Pricing',
    badge4Desc: 'Clear quotations with zero hidden surprises or booking fees.',
  },
  about: {
    eyebrow: 'YOUR TRUSTED TRAVEL PARTNER',
    title: 'About SkyRay Holidays',
    lead: "At SkyRay Holidays, we believe travel is more than just a journey — it's an experience that connects you to new cultures, beautiful places and lasting memories.",
    story: 'Whether you are discovering iconic world capitals, relaxing on pristine tropical beaches, or embarking on sacred pilgrimage journeys for Hajj & Umrah, our team is dedicated to providing personal care, transparent itineraries and seamless logistics.',
    image: '/images/hero.jpg',
    missionTitle: 'Our Mission',
    missionDesc: 'To make travel accessible, enriching, and memorable for everyone through thoughtful planning and transparent service.',
    visionTitle: 'Our Vision',
    visionDesc: 'To be a leading global travel brand recognized for unparalleled customer care, cultural appreciation, and trustworthy pilgrimage services.',
    whyUsTitle: 'Why Choose Us',
    whyUsDesc: 'Unmatched service, care and trust. We confirm every detail upfront and provide 24/7 support throughout your entire journey.',
    promise1: 'Verified 4-star and 5-star hotel partnerships worldwide',
    promise2: 'Dedicated Hajj & Umrah team with scholars and licensed guides',
    promise3: 'Transparent pricing with zero hidden booking charges',
    promise4: 'Custom tailored private and group holiday itineraries',
  },
  contact: {
    bannerEyebrow: 'GET IN TOUCH',
    bannerTitle: 'Get in Touch',
    bannerDesc: "We're here to help you plan your perfect journey. Reach out with any travel questions or custom requests.",
    phoneIndia: '+91 91763 57791',
    phoneSaudi: '+966 57 549 0602',
    whatsapp: '+91 91763 57791',
    email: 'syedrahamathullah@skyrayholidays.com',
    address: 'Chennai, Tamil Nadu, India',
    hours: '24/7 Dedicated Support',
    whatsappMessage: 'Hello SkyRay Holidays! I would like to plan a trip.',
    googleReviewsUrl: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
  },
  footer: {
    companyBio: 'Thoughtful journeys, meaningful experiences. Discover your next dream holiday or sacred pilgrimage with SkyRay Holidays.',
    ratingText: '5.0 Rating on Google Reviews',
    copyrightText: 'SkyRay Holidays. All rights reserved.',
    sloganText: 'Explore • Travel • Experience',
    pilgrimNotice: 'Official Licensed Pilgrim Travel Operator (Hajj & Umrah)',
  },
};

const STORAGE_KEY = 'skyray_website_content';

export function getWebsiteContent(): WebsiteContent {
  if (typeof window === 'undefined') return defaultWebsiteContent;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWebsiteContent;
    const parsed = JSON.parse(raw);
    return {
      home: { ...defaultWebsiteContent.home, ...(parsed.home || {}) },
      about: { ...defaultWebsiteContent.about, ...(parsed.about || {}) },
      contact: { ...defaultWebsiteContent.contact, ...(parsed.contact || {}) },
      footer: { ...defaultWebsiteContent.footer, ...(parsed.footer || {}) },
    };
  } catch {
    return defaultWebsiteContent;
  }
}

export function saveWebsiteContent(content: WebsiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('skyray_content_updated'));
  } catch (err) {
    console.error('Failed to save website content to localStorage:', err);
  }
}

export function useWebsiteContent(): {
  content: WebsiteContent;
  updateContent: (newContent: Partial<WebsiteContent>) => void;
} {
  const [content, setContent] = useState<WebsiteContent>(defaultWebsiteContent);

  useEffect(() => {
    setContent(getWebsiteContent());

    fetch(`${API_URL}/content`)
      .then((r) => (r.ok ? r.json() : null))
      .then((live) => {
        if (live && live.home) {
          saveWebsiteContent(live);
          setContent(live);
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      setContent(getWebsiteContent());
    };

    window.addEventListener('skyray_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skyray_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateContent = (newContent: Partial<WebsiteContent>) => {
    const current = getWebsiteContent();
    const updated: WebsiteContent = {
      home: { ...current.home, ...(newContent.home || {}) },
      about: { ...current.about, ...(newContent.about || {}) },
      contact: { ...current.contact, ...(newContent.contact || {}) },
      footer: { ...current.footer, ...(newContent.footer || {}) },
    };
    saveWebsiteContent(updated);
    setContent(updated);
  };

  return { content, updateContent };
}

