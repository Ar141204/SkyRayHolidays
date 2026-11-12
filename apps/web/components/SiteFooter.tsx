'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { usePublicSettings } from './ContactDetails';
import { contactDefaults } from '@/lib/config';

export default function SiteFooter() {
  const s = usePublicSettings();
  const phone = s.phone || contactDefaults.phone;
  const email = s.email || contactDefaults.email;
  const address = s.address || contactDefaults.address;
  const reviewsUrl = s.googleReviewsUrl || contactDefaults.googleReviewsUrl;

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
            Thoughtful journeys, meaningful experiences. Discover your next dream holiday or sacred pilgrimage with SkyRay Holidays.
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
              <strong>5.0 Rating</strong> on Google Reviews ↗
            </span>
          </a>
        </div>

        <div>
          <h4>Explore</h4>
          <Link href="/packages">Tour Packages</Link>
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
          <a href="tel:+919176357791">+91 91763 57791 (India)</a>
          <a href="tel:+966575490602">+966 57 549 0602 (Saudi)</a>
          <a href="mailto:syedrahamathullah@skyrayholidays.com">syedrahamathullah@skyrayholidays.com</a>
          {address ? <p>{address}</p> : null}
          <Link href="/contact" className="text-link">
            Contact our concierge team →
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SkyRay Holidays. All rights reserved.</span>
        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          ⭐ Official Google Business Profile &bull; SkyRay Holidays
        </a>
        <span>Explore &bull; Travel &bull; Experience</span>
      </div>
    </footer>
  );
}
