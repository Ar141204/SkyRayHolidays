'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePublicSettings } from './ContactDetails';
import { contactDefaults } from '@/lib/config';

export default function SiteFooter() {
  const s = usePublicSettings();
  const phone = s.phone || contactDefaults.phone;
  const email = s.email || contactDefaults.email;
  const address = s.address || contactDefaults.address;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Image src="/brand/skyray-logo.png" alt="SkyRay Holidays" width={80} height={70} style={{ width: 'auto', height: '68px', objectFit: 'contain' }} />
          <p>
            Thoughtful journeys, meaningful experiences. Discover your next holiday or sacred pilgrimage with SkyRay Holidays.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <Link href="/packages">Tour Packages</Link>
          <Link href="/hajj-umrah">Hajj &amp; Umrah</Link>
          <Link href="/about">About Us</Link>
          <Link href="/packages?kind=TOUR">International Tours</Link>
        </div>

        <div>
          <h4>Plan With Us</h4>
          <Link href="/enquire">Send an Enquiry</Link>
          <Link href="/contact">Contact</Link>
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
            Contact our team →
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SkyRay Holidays. All rights reserved.</span>
        <span>Explore · Travel · Experience</span>
      </div>
    </footer>
  );
}
