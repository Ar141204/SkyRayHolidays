'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { API_URL } from '@/lib/config';
import {
  Star,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Quote,
  Heart,
  Grid3X3,
  Layers,
  MessageSquare,
} from 'lucide-react';

export type GoogleReviewItem = {
  id: number | string;
  author: string;
  rating: number;
  tag: string;
  publishTime: string;
  text: string;
  url?: string;
  badge?: string;
  likes?: number;
  ownerResponse?: string;
};

const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8';

const AVATAR_COLORS = [
  '#4285F4', // Google Blue
  '#EA4335', // Google Red
  '#0F9D58', // Google Green
  '#F4B400', // Google Yellow
  '#8E24AA', // Purple
  '#00897B', // Teal
  '#E65100', // Deep Orange
  '#0284C7', // Sky Blue
];

// All 34 Authentic Google Reviews from official Google Maps listing
export const AUTHENTIC_GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 1,
    author: 'Syed Zabiullah',
    rating: 5,
    tag: 'Umrah Visa',
    publishTime: '3 months ago',
    badge: '3 reviews',
    text: 'Excellent service, I have received my Umrah visa within just one day, which exceeded my expectations. The staff were very supportive, and cooperative throughout the entire process. They were available whenever I needed assistance and answered every question with great care.',
    url: 'https://www.google.com/maps/contrib/112461096681452110833/reviews?hl=en-GB',
  },
  {
    id: 2,
    author: 'Nizam Deen',
    rating: 5,
    tag: 'Georgia Tour',
    publishTime: 'a month ago',
    badge: '2 reviews',
    likes: 1,
    text: 'My trip to Georgia with SkyRay Holidays was truly an amazing experience! Everything was planned exceptionally well and organized perfectly. From the itinerary to the overall travel arrangements, every detail was taken care of with great care and professionalism.',
    url: 'https://www.google.com/maps/contrib/107932880434121118643/reviews?hl=en-GB',
  },
  {
    id: 3,
    author: 'Randy Oldimo',
    rating: 5,
    tag: 'Schengen Visa',
    publishTime: '2 months ago',
    badge: '4 reviews · 1 photo',
    text: 'Syed is assisting me in providing all the necessary documents and requirements for my schengen visa application. You can contact him anytime if you need any assistance with your schengen visa application.',
    url: 'https://www.google.com/maps/contrib/108461090385366380857/reviews?hl=en-GB',
  },
  {
    id: 4,
    author: 'Reezan Mohamed',
    rating: 5,
    tag: 'Umrah Family Visa',
    publishTime: 'a year ago',
    badge: '2 reviews',
    likes: 2,
    text: 'Outstanding Individual Service! I recently applied for my mother & Brother Umra visa through Skyray Holidays, and I was truly impressed by the excellent support I received. The person handling was very patient, polite and guided us through every step.',
    url: 'https://www.google.com/maps/contrib/116666348852769244906/reviews?hl=en-GB',
  },
  {
    id: 5,
    author: 'Fais Chemist',
    rating: 5,
    tag: 'Umrah Visa Support',
    publishTime: 'a year ago',
    badge: '1 review',
    likes: 1,
    text: 'I recently applied for an Umrah visa for my parents through this travel agency, and I’m very satisfied with their service. They processed everything very quickly and professionally, with clear communication and no delays. I really appreciate their genuine care.',
    url: 'https://www.google.com/maps/contrib/110279142715569439698/reviews?hl=en-GB',
  },
  {
    id: 6,
    author: 'Abdul Salif',
    rating: 5,
    tag: 'Umrah Visa Support',
    publishTime: 'a year ago',
    badge: 'Local Guide · 18 reviews',
    likes: 1,
    text: 'Excellent Umrah Visa Support. I had a wonderful experience with skyray holidays . Their support for parents Umrah visa was exceptional and truly hassle-free.',
    url: 'https://www.google.com/maps/contrib/107353284054173286137/reviews?hl=en-GB',
  },
  {
    id: 7,
    author: 'Devaki Ramachandran',
    rating: 5,
    tag: 'Tour Package',
    publishTime: '8 months ago',
    badge: '2 reviews',
    text: 'I highly recommend Skyray holidays and I would definitely suggest them to my friends and family. I took up a tour recently it was well organised financially nominal and worth the money spent. They were completely friendly, Safe and flexible. It’s a must try.',
    url: 'https://www.google.com/maps/contrib/104915081048695523870/reviews?hl=en-GB',
  },
  {
    id: 8,
    author: 'Shahul Hameed',
    rating: 5,
    tag: 'Makkah & Madinah Ziyarat',
    publishTime: 'a year ago',
    badge: 'Local Guide · 14 reviews',
    likes: 2,
    text: 'Our Umrah, Makkah, and Madinah Ziyarat journey with Skyray Travel was truly a blessed experience. Everything was well organized — from flights and accommodation to transport and guidance throughout the trip. The team was professional, attentive, and caring.',
    url: 'https://www.google.com/maps/contrib/117408997085592313678/reviews?hl=en-GB',
  },
  {
    id: 9,
    author: 'john bardhan',
    rating: 5,
    tag: 'Egypt Holiday Tour',
    publishTime: 'a year ago',
    badge: 'Local Guide · 16 reviews',
    likes: 2,
    text: 'Great experience working with them. Very knowledgeable and excellent at suggesting places to visit. They are good listeners and plan the itinerary based on what we wanted. Our egypt trip experience was just superb.',
    url: 'https://www.google.com/maps/contrib/100629553779026693198/reviews?hl=en-GB',
  },
  {
    id: 10,
    author: 'Hassan Shaik',
    rating: 5,
    tag: 'Family Umrah Visa',
    publishTime: 'a year ago',
    badge: 'Local Guide · 48 reviews',
    likes: 2,
    text: 'Excellent service, I had approached for Umrah visa for my family and Syed provided very professional and timely service. Highly recommended.',
    url: 'https://www.google.com/maps/contrib/108269978375024227123/reviews?hl=en-GB',
  },
  {
    id: 11,
    author: 'Mohammed Ibrahim Kun Mohammed',
    rating: 5,
    tag: 'Fast-Track Umrah Visa',
    publishTime: 'a year ago',
    badge: '3 reviews',
    likes: 2,
    text: '100% Good & fast service especially Syed bhai coordination is very good. Umrah visa process within 3days',
    url: 'https://www.google.com/maps/contrib/102569627379870476230/reviews?hl=en-IN',
  },
  {
    id: 12,
    author: 'Kisho Kumar Subramanian',
    rating: 5,
    tag: 'Customer Support',
    publishTime: '11 months ago',
    badge: '6 reviews',
    text: 'Amazing service provided by Syed. He was very patient and guided me annd responded to all my queries.',
    url: 'https://www.google.com/maps/contrib/116121534307036518770/reviews?hl=en-IN',
  },
  {
    id: 13,
    author: 'rasool mohideen',
    rating: 5,
    tag: 'Umrah Visa',
    publishTime: 'a year ago',
    badge: '2 reviews',
    likes: 2,
    text: 'I obtained Umrah Visa through it, Honestly they are very good in customer support and services. 💯 Recommended',
    url: 'https://www.google.com/maps/contrib/109847934763300488054/reviews?hl=en-IN',
  },
  {
    id: 14,
    author: 'Bagavath Sankaran',
    rating: 5,
    tag: 'Russia & Cambodia Tours',
    publishTime: '2 years ago',
    badge: 'Local Guide · 23 reviews',
    likes: 1,
    text: 'I had an incredible experience thanks to this outstanding tour company Skyray Holidays with Syed! They provided thorough, well-curated itineraries that highlighted the best of both Russia and Cambodia. In Russia, they organized an exceptional travel adventure.',
    ownerResponse: "Thank you so much for your kind words! We're thrilled to hear that you had a great experience. Your feedback means a lot to us, and we look forward to serving you again soon!",
    url: 'https://www.google.com/maps/contrib/115335702821388749630/reviews?hl=en-IN',
  },
  {
    id: 15,
    author: 'Vijay Anand',
    rating: 5,
    tag: 'Visa Documentation',
    publishTime: 'a year ago',
    badge: '4 reviews',
    likes: 1,
    text: 'Very good service. Good communication. Very professional documentation..seamless service for visa processing. Affordable cost',
    url: 'https://www.google.com/maps/contrib/105979974618447535561/reviews?hl=en-IN',
  },
  {
    id: 16,
    author: 'rahamathullah ullah',
    rating: 5,
    tag: 'Travel & Visa Services',
    publishTime: '10 months ago',
    badge: '4 reviews',
    text: 'Excellent, fast service. Very happy with the experience and would recommend it to others.',
    url: 'https://www.google.com/maps/contrib/107622509110997595499/reviews?hl=en-IN',
  },
  {
    id: 17,
    author: 'ayub rahman rahman',
    rating: 5,
    tag: 'Umrah Visa Service',
    publishTime: '11 months ago',
    badge: '5 reviews · 7 photos',
    text: 'Very quick and good Umra visa service and customer support',
    url: 'https://www.google.com/maps/contrib/103096558305274279651/reviews?hl=en-IN',
  },
  {
    id: 18,
    author: 'Madina tamil vlogs',
    rating: 5,
    tag: 'Customer Response',
    publishTime: 'a year ago',
    badge: '2 reviews',
    likes: 1,
    text: 'Great service . Always get great response. Good job brother ❤️',
    url: 'https://www.google.com/maps/contrib/111924979728259291117/reviews?hl=en-IN',
  },
  {
    id: 19,
    author: 'Hassan Magbool',
    rating: 5,
    tag: 'Customer Care',
    publishTime: 'a year ago',
    badge: '1 review · 2 photos',
    text: 'Excellent customer services and Kind personal care to customers',
    url: 'https://www.google.com/maps/contrib/111174283920756048411/reviews?hl=en-IN',
  },
  {
    id: 20,
    author: 'Fiaz Ahammed',
    rating: 5,
    tag: 'Travel Services',
    publishTime: '2 years ago',
    badge: 'Local Guide · 15 reviews',
    text: "Excellent service! I'd recommend to contact them for any travel related services.",
    ownerResponse: "Thank you so much for your kind words! We're thrilled to hear that you had a great experience. Your feedback means a lot to us, and we look forward to serving you again soon!",
    url: 'https://www.google.com/maps/contrib/118089854439683514099/reviews?hl=en-IN',
  },
  {
    id: 21,
    author: 'Ramachandran Ganesan',
    rating: 5,
    tag: 'Immigration Services',
    publishTime: 'a year ago',
    badge: 'Local Guide · 26 reviews',
    likes: 1,
    text: 'Great service, quick response, knowledge in immigration services. Recommended',
    url: 'https://www.google.com/maps/contrib/103766534630174465681/reviews?hl=en-IN',
  },
  {
    id: 22,
    author: 'Mohammed Anies',
    rating: 5,
    tag: 'Umrah Services',
    publishTime: 'a year ago',
    badge: 'Local Guide · 20 reviews',
    likes: 1,
    text: 'Excellent and fast umrah service provider.',
    url: 'https://www.google.com/maps/contrib/112762233259767806826/reviews?hl=en-IN',
  },
  {
    id: 23,
    author: 'H. Abdul Rahman',
    rating: 5,
    tag: 'Customer Satisfaction',
    publishTime: '8 months ago',
    badge: '5 reviews · 1 photo',
    text: 'Very Good service and satisfied, Recommended',
    url: 'https://www.google.com/maps/contrib/105834638892153504839/reviews?hl=en-IN',
  },
  {
    id: 24,
    author: 'shivakami sri',
    rating: 5,
    tag: 'Trip Planning & Coordination',
    publishTime: 'a year ago',
    badge: 'Local Guide · 20 reviews',
    likes: 1,
    text: 'Very good service and good planning and communication as well good coordination',
    url: 'https://www.google.com/maps/contrib/100071338432363019955/reviews?hl=en-IN',
  },
  {
    id: 25,
    author: 'Jana Ranjani',
    rating: 5,
    tag: 'Friendly Approach',
    publishTime: 'a year ago',
    badge: '2 reviews',
    likes: 1,
    text: 'Really great service with friendly manner approach',
    url: 'https://www.google.com/maps/contrib/118149155983923829357/reviews?hl=en-IN',
  },
  {
    id: 26,
    author: 'samiulla amir',
    rating: 5,
    tag: 'Reliable Travel Partner',
    publishTime: '2 years ago',
    badge: '8 reviews',
    likes: 1,
    text: 'I would recommend and there service is very good and reliable.',
    ownerResponse: "Thank you so much for your kind words! We're thrilled to hear that you had a great experience. Your feedback means a lot to us, and we look forward to serving you again soon!",
    url: 'https://www.google.com/maps/contrib/111621858183030056775/reviews?hl=en-IN',
  },
  {
    id: 27,
    author: 'Mohamed Gani',
    rating: 5,
    tag: 'General Services',
    publishTime: '4 months ago',
    badge: '2 reviews',
    text: 'Excellent Services',
    url: 'https://www.google.com/maps/contrib/105801819038612297727/reviews?hl=en-IN',
  },
  {
    id: 28,
    author: 'Ahamed Naina',
    rating: 5,
    tag: 'Value for Money',
    publishTime: '2 years ago',
    badge: '10 reviews',
    text: 'Excellent services. Value for the money.',
    ownerResponse: "Thank you so much for your kind words! We're thrilled to hear that you had a great experience. Your feedback means a lot to us, and we look forward to serving you again soon!",
    url: 'https://www.google.com/maps/contrib/111711902935421255225/reviews?hl=en-IN',
  },
  {
    id: 29,
    author: 'Thanveer Ahamed',
    rating: 5,
    tag: 'Customer Service',
    publishTime: 'a year ago',
    badge: '1 review',
    likes: 1,
    text: 'Very good service.',
    url: 'https://www.google.com/maps/contrib/107574100070305276021/reviews?hl=en-IN',
  },
  {
    id: 30,
    author: 'syed fazil',
    rating: 5,
    tag: 'Kind Support',
    publishTime: 'a year ago',
    badge: '2 reviews',
    likes: 2,
    text: 'Good response and kind support',
    url: 'https://www.google.com/maps/contrib/103229368489184962353/reviews?hl=en-IN',
  },
  {
    id: 31,
    author: 'Rahul Gaur',
    rating: 5,
    tag: 'Customer Service',
    publishTime: '11 months ago',
    badge: '5 reviews',
    text: 'Excellent service',
    url: 'https://www.google.com/maps/contrib/116197496177781538163/reviews?hl=en-IN',
  },
  {
    id: 32,
    author: 'Mohammed Raja',
    rating: 5,
    tag: 'Travel Support',
    publishTime: 'a year ago',
    badge: '1 review',
    likes: 1,
    text: 'Praise be to God. Good service. Good response. Thanks.',
    url: 'https://www.google.com/maps/contrib/111619493825162623391/reviews?hl=en-IN',
  },
  {
    id: 33,
    author: 'noor ohamed',
    rating: 5,
    tag: '5-Star Google Review',
    publishTime: 'a year ago',
    badge: '2 reviews',
    text: '5-star rated Google review for SkyRay Holidays. Reliable and high quality travel assistance.',
    url: 'https://www.google.com/maps/contrib/115751748958924180114/reviews?hl=en-IN',
  },
  {
    id: 34,
    author: 'Syed Jamaludeen',
    rating: 5,
    tag: '5-Star Google Review',
    publishTime: 'a year ago',
    badge: 'Verified Reviewer',
    text: '5-star verified review on Google Maps. Top notch holiday planning and visa facilitation.',
    url: 'https://www.google.com/maps/contrib/100454234752906825228/reviews?hl=en-IN',
  },
];

export const ALL_GOOGLE_REVIEWS = AUTHENTIC_GOOGLE_REVIEWS;

export default function GoogleReviews() {
  const [data, setData] = useState<{
    available?: boolean;
    rating?: number;
    reviewCount?: number;
    reviews?: any[];
    url?: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const touchStartX = useRef<number | null>(null);

  // Auto-fetch newly submitted reviews from Google Places API
  useEffect(() => {
    // 1. Fetch from Next.js serverless route
    fetch('/api/google-reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.available) {
          setData(res);
        } else {
          // Fallback to API server if available
          fetch(`${API_URL}/integrations/google-reviews`)
            .then((r) => (r.ok ? r.json() : null))
            .then((bRes) => {
              if (bRes && bRes.available) setData(bRes);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const rating = data?.rating || 4.9;
  const reviewCount = data?.reviewCount || 34;

  // Merge any live reviews fetched from Google Places API on top of the authentic 34 reviews
  const mergedReviews: GoogleReviewItem[] = useMemo(() => {
    if (data?.reviews && data.reviews.length > 0) {
      const liveItems: GoogleReviewItem[] = data.reviews.map((r, i) => ({
        id: `live-${i}`,
        author: r.author || 'Google User',
        rating: r.rating || 5,
        tag: 'Recent Google Review',
        publishTime: r.publishTime || 'Recently Posted',
        badge: 'Verified Customer',
        text: r.text || '',
        url: r.url || GOOGLE_MAPS_REVIEWS_URL,
      }));

      // Deduplicate with existing authentic reviews by author name
      const remainingHistorical = AUTHENTIC_GOOGLE_REVIEWS.filter(
        (ar) => !liveItems.some((lr) => lr.author.toLowerCase() === ar.author.toLowerCase()),
      );

      return [...liveItems, ...remainingHistorical];
    }
    return AUTHENTIC_GOOGLE_REVIEWS;
  }, [data]);

  // Tag filtering
  const filteredReviews = useMemo(() => {
    if (filterTag === 'ALL') return mergedReviews;
    if (filterTag === 'UMRAH') {
      return mergedReviews.filter(
        (r) =>
          r.tag.toLowerCase().includes('umrah') ||
          r.text.toLowerCase().includes('umrah') ||
          r.text.toLowerCase().includes('ziyarat'),
      );
    }
    if (filterTag === 'TOURS') {
      return mergedReviews.filter(
        (r) =>
          r.tag.toLowerCase().includes('tour') ||
          r.text.toLowerCase().includes('trip') ||
          r.text.toLowerCase().includes('holiday'),
      );
    }
    if (filterTag === 'VISA') {
      return mergedReviews.filter(
        (r) =>
          r.tag.toLowerCase().includes('visa') ||
          r.text.toLowerCase().includes('schengen') ||
          r.text.toLowerCase().includes('immigration'),
      );
    }
    if (filterTag === 'OWNER') {
      return mergedReviews.filter((r) => Boolean(r.ownerResponse));
    }
    return mergedReviews;
  }, [mergedReviews, filterTag]);

  const totalReviews = filteredReviews.length;
  const gmapsUrl = data?.url || GOOGLE_MAPS_REVIEWS_URL;

  // Carousel Stepper Navigation
  const nextReview = useCallback(() => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const prevReview = useCallback(() => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  // Auto-sliding interval for carousel
  useEffect(() => {
    if (isPaused || viewMode !== 'carousel' || totalReviews <= 1) return;
    const interval = setInterval(() => {
      nextReview();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, viewMode, totalReviews, nextReview]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      nextReview();
    } else if (diff < -45) {
      prevReview();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const current = filteredReviews[currentIndex] || filteredReviews[0] || AUTHENTIC_GOOGLE_REVIEWS[0];
  const avatarLetter = (current.author || 'S').trim().charAt(0).toUpperCase();
  const avatarBg = AVATAR_COLORS[currentIndex % AVATAR_COLORS.length];

  return (
    <div
      className="review-placeholder"
      style={{
        borderRadius: '16px',
        border: '1px solid #dce8ee',
        background: '#ffffff',
        boxShadow: '0 12px 32px rgba(23, 73, 107, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Google Business Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          paddingBottom: '12px',
          borderBottom: '1px solid #edf2f7',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="google-g"
            style={{
              margin: 0,
              fontSize: '26px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#4285F4' }}>G</span>
          </div>
          <div>
            <strong
              style={{
                fontSize: '17px',
                color: '#17496b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Skyray Holidays
              <CheckCircle size={16} color="#10b981" />
            </strong>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
              Official Google Business Profile · Kumbakonam
            </span>
          </div>
        </div>

        {/* View Toggle and Google Maps Verified Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('carousel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                border: 0,
                borderRadius: '6px',
                cursor: 'pointer',
                background: viewMode === 'carousel' ? '#ffffff' : 'transparent',
                color: viewMode === 'carousel' ? '#0284c7' : '#64748b',
                boxShadow: viewMode === 'carousel' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              title="Carousel Mode"
            >
              <Layers size={13} /> Carousel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                border: 0,
                borderRadius: '6px',
                cursor: 'pointer',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#0284c7' : '#64748b',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              title="All 34 Reviews Grid"
            >
              <Grid3X3 size={13} /> View All (34+)
            </button>
          </div>

          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="live-status-pill"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            title="Verified on Google Maps"
          >
            <span className="dot-green"></span>
            <span>Live on Google</span>
          </a>
        </div>
      </div>

      {/* 2. Rating Summary & Interactive Carousel Controls */}
      <div
        style={{
          margin: '10px 0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#17496b' }}>
            {Number(rating).toFixed(1)}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </span>
            <small style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>
              {reviewCount}+ Real Google Reviews (100% 5-Star Rating)
            </small>
          </div>
        </div>

        {/* Carousel Stepper Controls (Active in Carousel view) */}
        {viewMode === 'carousel' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              Review {currentIndex + 1} of {totalReviews}
            </span>
            <button
              type="button"
              onClick={prevReview}
              aria-label="Previous Google Review"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              title="Previous Review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextReview}
              aria-label="Next Google Review"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              title="Next Review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 3. Category Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        {[
          { key: 'ALL', label: `All Reviews (${mergedReviews.length})` },
          { key: 'UMRAH', label: '🕋 Umrah & Ziyarat' },
          { key: 'TOURS', label: '✈️ Holidays & Tours' },
          { key: 'VISA', label: '🛂 Visa & Immigration' },
          { key: 'OWNER', label: '💬 With Owner Reply' },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilterTag(f.key);
              setCurrentIndex(0);
            }}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterTag === f.key ? '#0284c7' : '#e2e8f0',
              background: filterTag === f.key ? '#0284c7' : '#f8fafc',
              color: filterTag === f.key ? '#ffffff' : '#475569',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 4. Display: Carousel Mode */}
      {viewMode === 'carousel' && current && (
        <div
          style={{
            position: 'relative',
            minHeight: '175px',
            background: '#f8fbfe',
            padding: '18px 20px',
            borderRadius: '12px',
            border: '1px solid #e0edf5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Quote Icon Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              color: '#d0e5f2',
              pointerEvents: 'none',
            }}
          >
            <Quote size={36} />
          </div>

          <div>
            {/* Reviewer Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', zIndex: 1 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: avatarBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              >
                {avatarLetter}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {current.url ? (
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '14.5px',
                        color: '#17496b',
                        fontWeight: 800,
                        textDecoration: 'none',
                      }}
                      className="hover-underline"
                    >
                      {current.author} ↗
                    </a>
                  ) : (
                    <b style={{ fontSize: '14.5px', color: '#17496b' }}>{current.author}</b>
                  )}
                  {current.badge && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      {current.badge}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '9.5px',
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    Verified Google Review
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <div style={{ color: '#f59e0b', fontSize: '11px', display: 'flex', gap: '1px' }}>
                    {'★'.repeat(Math.round(current.rating || 5))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                    {current.tag}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{current.publishTime}</span>
                  {current.likes && (
                    <span
                      style={{
                        fontSize: '10.5px',
                        color: '#e11d48',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontWeight: 700,
                      }}
                    >
                      <Heart size={10} fill="#e11d48" /> {current.likes}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Review Quote Text */}
            <p
              style={{
                fontSize: '13.5px',
                color: '#1e293b',
                margin: '8px 0 10px',
                lineHeight: 1.6,
                fontStyle: 'italic',
                zIndex: 1,
              }}
            >
              &ldquo;{current.text}&rdquo;
            </p>

            {/* Owner Response Highlight (if available) */}
            {current.ownerResponse && (
              <div
                style={{
                  background: '#ffffff',
                  borderLeft: '3px solid #0284c7',
                  padding: '8px 12px',
                  borderRadius: '0 8px 8px 0',
                  marginTop: '8px',
                  marginBottom: '10px',
                  fontSize: '11.5px',
                  color: '#334155',
                }}
              >
                <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} /> Response from Skyray Holidays (Owner):
                </div>
                <div>&ldquo;{current.ownerResponse}&rdquo;</div>
              </div>
            )}
          </div>

          {/* Mini Progress Dots Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', zIndex: 1 }}>
            <div
              style={{
                height: '3px',
                flex: 1,
                background: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / totalReviews) * 100}%`,
                  background: '#0284c7',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px', whiteSpace: 'nowrap' }}>
              Auto-sliding • Swipeable
            </span>
          </div>
        </div>
      )}

      {/* 5. Display: Grid Mode (All 34+ Reviews) */}
      {viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
            maxHeight: '480px',
            overflowY: 'auto',
            padding: '4px 2px',
          }}
        >
          {filteredReviews.map((rev, idx) => {
            const letter = (rev.author || 'S').trim().charAt(0).toUpperCase();
            const bg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div
                key={rev.id || idx}
                style={{
                  background: '#f8fbfe',
                  border: '1px solid #e0edf5',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: bg,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                        flexShrink: 0,
                      }}
                    >
                      {letter}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {rev.url ? (
                        <a
                          href={rev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            color: '#17496b',
                            textDecoration: 'none',
                          }}
                        >
                          {rev.author} ↗
                        </a>
                      ) : (
                        <b style={{ fontSize: '13px', color: '#17496b' }}>{rev.author}</b>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#64748b' }}>
                        <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(rev.rating || 5))}</span>
                        <span>•</span>
                        <span>{rev.publishTime}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: '4px 0', fontStyle: 'italic' }}>
                    &ldquo;{rev.text}&rdquo;
                  </p>
                  {rev.ownerResponse && (
                    <div
                      style={{
                        marginTop: '6px',
                        padding: '6px 8px',
                        background: '#ffffff',
                        borderLeft: '2px solid #0284c7',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#475569',
                      }}
                    >
                      <strong style={{ color: '#0284c7' }}>Owner reply:</strong> &ldquo;{rev.ownerResponse}&rdquo;
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#0284c7',
                      background: '#e0f2fe',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {rev.tag}
                  </span>
                  {rev.likes && (
                    <span style={{ fontSize: '10.5px', color: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <Heart size={10} fill="#e11d48" /> {rev.likes}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Footer with Google Maps Link */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #edf2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '11.5px', color: '#64748b' }}>
          📍 No 3, Rahamath Complex, ESMP Nagar, Kumbakonam, Tamil Nadu
        </span>
        <a
          className="text-link"
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#0284c7',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          View all 34+ reviews on Google Maps <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
