'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Video, Camera, Play, Pause } from 'lucide-react';

interface PackageMediaGalleryProps {
  images: string[];
  videoUrl?: string | null;
  mediaType?: 'IMAGES' | 'VIDEO';
  title: string;
  badgeText?: string;
}

export default function PackageMediaGallery({
  images = [],
  videoUrl = null,
  mediaType = 'IMAGES',
  title,
  badgeText = 'HOLIDAY',
}: PackageMediaGalleryProps) {
  // Ensure we have at least one fallback image
  const mediaImages = images.length > 0 ? images : ['/images/destinations/dubai.jpg'];
  const [activeMedia, setActiveMedia] = useState<'IMAGES' | 'VIDEO'>(
    mediaType === 'VIDEO' && videoUrl ? 'VIDEO' : 'IMAGES'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 5-Second Auto-Slider with Smooth Transition Effects
  useEffect(() => {
    if (activeMedia !== 'IMAGES' || mediaImages.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeMedia, mediaImages.length, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaImages.length);
  };

  return (
    <div className="package-media-gallery-wrap">
      {/* Main Showcase Frame */}
      <div
        className="main-photo-frame"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {activeMedia === 'VIDEO' && videoUrl ? (
          /* Video Showcase Mode */
          <div className="pkg-video-container">
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="pkg-main-video"
            />
            <span className="gallery-kind-tag">
              <Video size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Video Tour
            </span>
          </div>
        ) : (
          /* 5-Second Auto-Sliding Image Showcase */
          <div className="pkg-slider-container">
            {mediaImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`pkg-slide-layer ${idx === currentIndex ? 'active' : ''}`}
                aria-hidden={idx !== currentIndex}
              >
                <Image
                  src={imgUrl}
                  alt={`${title} - Photo ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 55vw"
                  unoptimized={Boolean(imgUrl.startsWith('data:') || imgUrl.startsWith('/uploads'))}
                />
              </div>
            ))}

            {/* Subtle Gradient Vignette */}
            <div className="pkg-slide-gradient" />

            {/* Badge Tag */}
            <span className="gallery-kind-tag">{badgeText}</span>

            {/* Slider Navigation Arrows (when more than 1 image) */}
            {mediaImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="pkg-gallery-arrow prev"
                  onClick={handlePrev}
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="pkg-gallery-arrow next"
                  onClick={handleNext}
                  aria-label="Next Photo"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Progress / Counter Pill */}
                <div className="pkg-slide-counter">
                  <span>
                    {currentIndex + 1} / {mediaImages.length}
                  </span>
                </div>

                {/* Slide Dots Indicator */}
                <div className="pkg-slide-dots">
                  {mediaImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      className={`pkg-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Jump to photo ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Media Switcher Toggle Button (Visible when video is available) */}
        {videoUrl && (
          <div className="pkg-media-switcher">
            <button
              type="button"
              className={`switcher-pill ${activeMedia === 'IMAGES' ? 'active' : ''}`}
              onClick={() => setActiveMedia('IMAGES')}
            >
              <Camera size={13} /> Photos ({mediaImages.length})
            </button>
            <button
              type="button"
              className={`switcher-pill ${activeMedia === 'VIDEO' ? 'active' : ''}`}
              onClick={() => setActiveMedia('VIDEO')}
            >
              <Video size={13} /> Video
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Row (allows direct 1-click photo selection) */}
      {mediaImages.length > 1 && activeMedia === 'IMAGES' && (
        <div className="gallery-thumbnails">
          {mediaImages.map((thumb, idx) => (
            <button
              key={idx}
              type="button"
              className={`thumb-item ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={thumb}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="120px"
                unoptimized={Boolean(thumb.startsWith('data:') || thumb.startsWith('/uploads'))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
