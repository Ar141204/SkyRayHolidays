'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/packages', label: 'Packages' },
  { href: '/hajj-umrah', label: 'Hajj & Umrah' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Left Corner: Large Brand Logo */}
        <Link href="/" className="brand" aria-label="SkyRay Holidays Home">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={110}
            height={95}
            className="brand-logo-img"
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map((x) => (
            <Link key={x.href} href={x.href} onClick={() => setOpen(false)}>
              {x.label}
            </Link>
          ))}
          <div className="mobile-menu-actions">
            <Link className="btn btn-admin" href="/admin" onClick={() => setOpen(false)}>
              <ShieldCheck size={16} /> Admin Panel
            </Link>
            <Link className="btn btn-primary" href="/enquire" onClick={() => setOpen(false)}>
              Enquire Now <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>

        {/* Right Corner: Admin Panel & Enquiry Buttons */}
        <div className="nav-actions">
          <Link className="btn btn-admin" href="/admin" title="Access Admin Console">
            <ShieldCheck size={16} />
            <span>Admin Panel</span>
          </Link>
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
