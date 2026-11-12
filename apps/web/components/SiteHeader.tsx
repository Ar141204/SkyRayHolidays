'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/packages', label: 'Packages' },
  { href: '/hajj-umrah', label: 'Hajj & Umrah' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Never hide header when mobile drawer is open
      if (open) return;

      if (currentScrollY <= 40) {
        // At the top of page, always show
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 90) {
        // Scrolling down past threshold -> hide navbar
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> reveal navbar
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  return (
    <header className={`site-header ${hidden ? 'header-hidden' : ''}`}>
      <div className="nav-wrap">
        {/* Left Corner: Extra Large Brand Logo */}
        <Link href="/" className="brand" aria-label="SkyRay Holidays Home">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={130}
            height={110}
            className="brand-logo-img"
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map((x) => {
            const isActive =
              x.href === '/'
                ? pathname === '/'
                : pathname === x.href || pathname?.startsWith(`${x.href}/`);
            return (
              <Link
                key={x.href}
                href={x.href}
                className={isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setOpen(false)}
              >
                {x.label}
              </Link>
            );
          })}
          <div className="mobile-menu-actions">
            <Link className="btn btn-primary nav-cta" href="/enquire" onClick={() => setOpen(false)}>
              Enquire Now <ArrowUpRight size={17} />
            </Link>
          </div>
        </nav>

        {/* Right Corner: Solid Sky-Blue Enquiry Button & Mobile Toggle */}
        <div className="nav-actions">
          <Link className="btn btn-primary nav-cta" href="/enquire">
            Enquire Now <ArrowUpRight size={17} />
          </Link>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
