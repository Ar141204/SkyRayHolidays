'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  const pathname = usePathname();

  return (
    <header className="site-header">
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
            <Link className="btn btn-primary" href="/enquire" onClick={() => setOpen(false)}>
              Enquire Now <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>

        {/* Right Corner: Enquiry Button & Mobile Toggle */}
        <div className="nav-actions">
          <Link className="btn btn-primary nav-cta" href="/enquire">
            Enquire Now <ArrowUpRight size={16} />
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
