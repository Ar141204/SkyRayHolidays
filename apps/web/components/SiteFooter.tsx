'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { usePublicSettings } from './ContactDetails';
import { useWebsiteContent } from '@/lib/content';
import { contactDefaults } from '@/lib/config';

export default function SiteFooter() {
  const s = usePublicSettings();
  const { content } = useWebsiteContent();

  const phone = s.phone || contactDefaults.phone;
  const email = s.email || contactDefaults.email;
  const address = s.address || contactDefaults.address;
  const reviewsUrl = s.googleReviewsUrl || contactDefaults.googleReviewsUrl;

  const f = content.footer;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={120}
            height={90}
            className="footer-logo-img"
          />
          <p>
            {f.companyBio ||
              'Thoughtful journeys, meaningful experiences. Discover your next dream holiday or sacred pilgrimage with SkyRay Holidays.'}
          </p>

          {/* Official Google Reviews Badge */}
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-reviews-badge"
          >
            <div className="reviews-stars-row">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
            </div>
            <span className="reviews-badge-text">
              <strong>{f.ratingText || '5.0 Rating on Google Reviews'}</strong> ↗
            </span>
          </a>
        </div>

        <div>
          <h4>Services &amp; Explore</h4>
          <Link href="/services">All Services Hub</Link>
          <Link href="/services?tab=packages">Tour Packages</Link>
          <Link href="/services?tab=visa">Visa Services (US, UK, Schengen, E-Visa)</Link>
          <Link href="/hajj-umrah">Hajj &amp; Umrah</Link>
          <Link href="/packages?category=Specialized">Specialized Key Destinations</Link>
          <Link href="/about">About Us</Link>
        </div>

        <div>
          <h4>Plan With Us</h4>
          <Link href="/enquire">Send an Enquiry</Link>
          <Link href="/contact">Contact &amp; Support</Link>
          <a href={reviewsUrl} target="_blank" rel="noopener noreferrer">
            Google Reviews &amp; Maps
          </a>
          <Link href="/privacy">Privacy Notice</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>

        <div>
          <h4>Get In Touch</h4>
          <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone} (India)</a>
          <a href={`tel:${(s.phoneSecondary || '+966 57 549 0602').replace(/\s+/g, '')}`}>
            {s.phoneSecondary || '+966 57 549 0602'} (Saudi)
          </a>
          <a href={`mailto:${email}`}>{email}</a>
          {address ? <p>{address}</p> : null}
          <Link href="/contact" className="text-link">
            Contact our concierge team →
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {f.copyrightText || 'SkyRay Holidays. All rights reserved.'}</span>
        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          ⭐ {f.ratingText || '5.0 Rating on Google Reviews'} &bull; SkyRay Holidays
        </a>
        <span>{f.sloganText || 'Explore • Travel • Experience'}</span>
      </div>
    </footer>
  );
}
