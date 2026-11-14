'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useWebsiteContent } from '@/lib/content';

const fallbackAboutImg = '/brand/skyray-about-logo.png';

function resolveImage(raw?: string) {
  if (!raw || !raw.trim() || raw === '/images/hero.jpg' || raw.includes('about-logo.jpg')) {
    return fallbackAboutImg;
  }
  const str = raw.trim();
  if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://')) return str;
  if (str.startsWith('/uploads/')) {
    return `https://skyray-holidays-api.onrender.com${str}`;
  }
  return str;
}

export default function AboutView() {
  const { content } = useWebsiteContent();
  const a = content.about;
  const [imgSrc, setImgSrc] = useState<string>(() => resolveImage(a.image));

  useEffect(() => {
    let active = true;
    const src = resolveImage(a.image);

    // If it's a data URL or image with black background, turn black pixels pure white
    if (src.startsWith('data:image/')) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            if (active) setImgSrc(src);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const d = imgData.data;
          // Check corner pixel for black background and make transparent
          if (d[0] < 50 && d[1] < 50 && d[2] < 50) {
            for (let i = 0; i < d.length; i += 4) {
              if (d[i] < 45 && d[i + 1] < 45 && d[i + 2] < 45) {
                d[i + 3] = 0;
              }
            }
            ctx.putImageData(imgData, 0, 0);
            if (active) setImgSrc(canvas.toDataURL('image/png'));
            return;
          }
        } catch {
          // fallback gracefully
        }
        if (active) setImgSrc(src);
      };
      img.onerror = () => {
        if (active) setImgSrc(fallbackAboutImg);
      };
      img.src = src;
    } else {
      setImgSrc(src);
    }

    return () => {
      active = false;
    };
  }, [a.image]);

  return (
    <>
      {/* 1. About Hero matching Preview Screen 2 */}
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <div className="eyebrow">{a.eyebrow || 'YOUR TRUSTED TRAVEL PARTNER'}</div>
            <h1>{a.title || 'About SkyRay Holidays'}</h1>
            <p className="about-lead">{a.lead}</p>
            <p>{a.story}</p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" href="/packages">
                Explore Packages <ArrowRight size={16} />
              </Link>
              <Link className="btn btn-outline" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="about-hero-image">
            <div className="plane-art-card seamless-brand-logo">
              <Image
                src={imgSrc}
                alt="SkyRay Holidays"
                fill
                style={{ objectFit: 'contain' }}
                priority
                unoptimized
                onError={() => {
                  if (imgSrc !== fallbackAboutImg) {
                    setImgSrc(fallbackAboutImg);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars matching Preview Screen 2: Our Mission, Our Vision, Why Choose Us */}
      <section className="section container">
        <div className="section-head centered">
          <div className="eyebrow">CORE VALUES</div>
          <h2>What Guides <em>Everything We Do</em></h2>
          <p>Delivering unforgettable travel experiences built on integrity, expertise, and personalized service.</p>
        </div>

        <div className="three-pillars-grid">
          <article className="pillar-card">
            <div className="pillar-icon">
              <Target size={28} />
            </div>
            <h3>{a.missionTitle || 'Our Mission'}</h3>
            <p>{a.missionDesc}</p>
          </article>

          <article className="pillar-card highlight">
            <div className="pillar-icon">
              <Eye size={28} />
            </div>
            <h3>{a.visionTitle || 'Our Vision'}</h3>
            <p>{a.visionDesc}</p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>{a.whyUsTitle || 'Why Choose Us'}</h3>
            <p>{a.whyUsDesc}</p>
          </article>
        </div>
      </section>

      {/* 3. Credentials & Service Assurances */}
      <section className="soft-section">
        <div className="container credentials-inner">
          <div className="credentials-copy">
            <div className="eyebrow">THE SKYRAY PROMISE</div>
            <h2>Peace of Mind on Every Step</h2>
            <p>From initial enquiry to your safe return home, we handle every detail with precision and care.</p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> {a.promise1}</li>
              <li><CheckCircle2 size={18} /> {a.promise2}</li>
              <li><CheckCircle2 size={18} /> {a.promise3}</li>
              <li><CheckCircle2 size={18} /> {a.promise4}</li>
            </ul>
          </div>
          <div className="credentials-stats">
            <div className="c-stat"><strong>10,000+</strong><span>Travellers Served</span></div>
            <div className="c-stat"><strong>99.4%</strong><span>Customer Satisfaction</span></div>
            <div className="c-stat"><strong>50+</strong><span>Global Destinations</span></div>
            <div className="c-stat"><strong>12+</strong><span>Years in Tourism</span></div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="cta-section container">
        <div>
          <div className="eyebrow light">READY TO EXPLORE?</div>
          <h2>Let&apos;s plan your next adventure together.</h2>
          <p>Connect with our destination specialists for tailored quotes and itinerary planning.</p>
        </div>
        <Link className="btn btn-gold" href="/enquire">
          Start Your Enquiry <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}

