'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const decodedPath = pathname ? decodeURIComponent(pathname) : '';
  const isAdmin =
    pathname?.startsWith('/syedrahamathullah@portal-1614') ||
    decodedPath.startsWith('/syedrahamathullah@portal-1614') ||
    pathname?.startsWith('/admin') ||
    pathname?.includes('portal') ||
    decodedPath.includes('portal') ||
    pathname?.includes('syedrahamathullah');

  if (isAdmin) {
    return <main className="admin-wrapper">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}

