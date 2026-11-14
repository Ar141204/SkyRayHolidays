'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { useWebsiteContent } from '@/lib/content';

const DEFAULT_BANNER_IMAGES = [
  '/images/banner/banner-1-swiss-alps.jpg',
  '/images/banner/banner-2-santorini.jpg',
  '/images/banner/banner-3-cappadocia.jpg',
  '/images/banner/banner-4-kyoto-fuji.jpg',
  '/images/banner/banner-5-norway-fjords.jpg',
  '/images/banner/banner-6-singapore.jpg',
  '/images/banner/banner-7-amalfi.jpg',
  '/images/banner/banner-8-phuket.jpg',
];

export default function HeroBanner() {
  const { content } = useWebsiteContent();
  const h = content.home;

  const images: string[] =
    Array.isArray(h.heroImages) && h.heroImages.length >= 2
      ? h.heroImages
      : DEFAULT_BANNER_IMAGES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Video state
  const isVideoEnabled = Boolean(h.enableVideo && h.heroVideoUrl);

  // Auto-slide interval: normalize to milliseconds (handles both 5s and 5000ms)
  const rawInterval = Number(h.slideInterval);
  const intervalMs = rawInterval && rawInterval >= 100 ? rawInterval : (rawInterval || 5) * 1000;

  useEffect(() => {
    if (isVideoEnabled || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs, isVideoEnabled]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  // Touch handlers for mobile/tablet swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      nextSlide();
      setTouchStart(null);
    } else if (diff < -50) {
      prevSlide();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div className="hero-banner-wrapper">
      {/* 1. Live Running Offer Banner Ticker (if enabled in Admin Panel) */}
      {h.enableLiveOffers && (
        <div className="live-offer-ticker-bar">
          <div className="container live-offer-ticker-inner">
            <div className="live-offer-pill">
              <Flame size={14} className="offer-flame-icon" />
              <span>{h.offerBadge || 'LIVE RUNNING OFFER'}</span>
            </div>
            <div className="live-offer-marquee">
              <span className="live-offer-text">
                {h.offerHeadline ||
                  'Special Offer: Flat ₹2,000 Off on US, UK & Schengen Visa Services | Fast-Track Slots Available!'}
              </span>
            </div>
            <Link href={h.offerLink || '/visa'} className="live-offer-cta">
              Claim Offer <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Main Hero Banner Container */}
      <section
        className="hero hero-dynamic-banner"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Layer: Video Mode */}
        {isVideoEnabled ? (
          <div className="hero-media-layer hero-video-layer">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="hero-background-video"
              src={h.heroVideoUrl}
            />
            <div className="hero-gradient-overlay" />
          </div>
        ) : (
          /* Background Layer: 5 to 8 Continuous Sliding Images */
          <div className="hero-media-layer hero-slider-layer">
            {images.map((imgUrl, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={idx}
                  className={`hero-slide-item ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 2 : 1,
                    transform: isActive ? 'scale(1)' : 'scale(1.05)',
                    transition: 'opacity 1s ease-in-out, transform 5s ease-out',
                  }}
                >
                  <Image
                    src={imgUrl}
                    alt={`SkyRay Holidays Travel Destination ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('/uploads')}
                  />
                </div>
              );
            })}
            <div className="hero-gradient-overlay" />
          </div>
        )}

        {/* Foreground Hero Content & Typography */}
        <div className="container hero-content">
          <div className="eyebrow light">
            <span></span> {h.eyebrow || 'WHERE EVERY TRIP BECOMES A MEMORY'}
          </div>

          <h1>
            {h.title ? (
              h.title.includes('with') ? (
                <>
                  {h.title.split('with')[0]}
                  <br />
                  <em>with {h.title.split('with')[1]?.trim() || 'SkyRay Holidays'}</em>
                </>
              ) : (
                h.title
              )
            ) : (
              <>
                Your Journey Begins
                <br />
                <em>with SkyRay Holidays</em>
              </>
            )}
          </h1>

          <p>
            {h.subtitle ||
              'Discover unforgettable destinations, thoughtfully planned holidays and meaningful pilgrimage journeys.'}
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" href="/packages">
              Explore Packages <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-ghost" href="/enquire">
              Plan Your Trip
            </Link>
          </div>

          <div className="hero-footnote">
            <span>✦ Curated travel experiences</span>
            <span>✦ Personal guidance</span>
            <span>✦ Journeys that matter</span>
          </div>
        </div>
      </section>
    </div>
  );
}
