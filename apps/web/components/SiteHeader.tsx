'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ChevronDown, Plane, FileText } from 'lucide-react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Never hide header when mobile drawer is open
      if (open) return;

      if (currentScrollY <= 40) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 90) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  const isServicesActive =
    pathname?.startsWith('/services') ||
    pathname?.startsWith('/packages') ||
    pathname?.startsWith('/visa');

  return (
    <header className={`site-header ${hidden ? 'header-hidden' : ''}`}>
      <div className="nav-wrap">
        {/* Left: Brand Logo */}
        <Link href="/" className="brand" aria-label="SkyRay Holidays Home">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={120}
            height={90}
            className="brand-logo-img"
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <Link
            href="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={pathname?.startsWith('/about') ? 'nav-link active' : 'nav-link'}
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          {/* Desktop & Mobile Services with Dropdown */}
          <div
            className="nav-dropdown-wrap"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/services"
              className={isServicesActive ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                setOpen(false);
                setDropdownOpen(false);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              Services <ChevronDown size={14} />
            </Link>

            {/* Dropdown Menu for Desktop */}
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link
                href="/services?tab=packages"
                className="dropdown-link-item"
                onClick={() => {
                  setOpen(false);
                  setDropdownOpen(false);
                }}
              >
                <div className="dropdown-icon-wrap" style={{ background: '#eaf7fd', padding: '6px', borderRadius: '6px', color: '#0284c7' }}>
                  <Plane size={16} />
                </div>
                <div>
                  <div style={{ color: '#17496b', fontWeight: 800 }}>Tour Packages</div>
                  <small style={{ color: '#64748b' }}>Curated holiday escapes &amp; destinations</small>
                </div>
              </Link>

              <Link
                href="/services?tab=visa"
                className="dropdown-link-item"
                onClick={() => {
                  setOpen(false);
                  setDropdownOpen(false);
                }}
              >
                <div className="dropdown-icon-wrap" style={{ background: '#eaf7fd', padding: '6px', borderRadius: '6px', color: '#0284c7' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ color: '#17496b', fontWeight: 800 }}>Visa Services</div>
                  <small style={{ color: '#64748b' }}>US, UK, Schengen &amp; Global E-Visas</small>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile sub-links under Services for seamless drawer navigation */}
          {open && (
            <div className="mobile-nested-links" style={{ display: 'grid', gap: '2px', paddingLeft: '16px', marginBottom: '6px' }}>
              <Link
                href="/services?tab=packages"
                style={{ fontSize: '13.5px', color: '#0284c7', padding: '6px 12px', fontWeight: 700 }}
                onClick={() => setOpen(false)}
              >
                ✈️ Tour Packages
              </Link>
              <Link
                href="/services?tab=visa"
                style={{ fontSize: '13.5px', color: '#0284c7', padding: '6px 12px', fontWeight: 700 }}
                onClick={() => setOpen(false)}
              >
                🛂 Visa Services (US, UK, Schengen)
              </Link>
            </div>
          )}

          <Link
            href="/hajj-umrah"
            className={pathname?.startsWith('/hajj-umrah') ? 'nav-link active' : 'nav-link'}
            onClick={() => setOpen(false)}
          >
            Hajj &amp; Umrah
          </Link>

          <Link
            href="/contact"
            className={pathname?.startsWith('/contact') ? 'nav-link active' : 'nav-link'}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

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
