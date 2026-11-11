'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock3, Star } from 'lucide-react';
import { demoPackages } from '@/lib/config';

export default function PilgrimageExplorer() {
  const [activeTab, setActiveTab] = useState<'HAJJ' | 'UMRAH'>('HAJJ');

  const hajjPkg = demoPackages.find((p) => p.kind === 'HAJJ') || demoPackages[4];
  const umrahPkg = demoPackages.find((p) => p.kind === 'UMRAH') || demoPackages[5];

  const currentPkg = activeTab === 'HAJJ' ? hajjPkg : umrahPkg;

  return (
    <div className="pilgrim-showcase">
      {/* Toggle Tabs matching Preview Screen 4 */}
      <div className="pilgrim-tabs">
        <button
          className={`pilgrim-tab-btn ${activeTab === 'HAJJ' ? 'active' : ''}`}
          onClick={() => setActiveTab('HAJJ')}
        >
          Hajj Packages
        </button>
        <button
          className={`pilgrim-tab-btn ${activeTab === 'UMRAH' ? 'active' : ''}`}
          onClick={() => setActiveTab('UMRAH')}
        >
          Umrah Packages
        </button>
      </div>

      {/* Featured Pilgrimage Package Card matching Preview Screen 4 */}
      <div className="pilgrim-featured-card">
        <div className="p-card-left">
          <div className="p-eyebrow">
            {activeTab === 'HAJJ' ? 'FEATURED HAJJ JOURNEY' : 'FEATURED UMRAH PACKAGE'}
          </div>
          <h2>{currentPkg.title}</h2>
          <div className="p-meta">
            <span className="p-duration"><Clock3 size={15} /> {currentPkg.duration}</span>
            <span className="p-rating"><Star size={14} fill="#f59e0b" color="#f59e0b" /> 5.0 (Verified Pilgrim Reviews)</span>
          </div>
          <p className="p-summary">{currentPkg.summary}</p>

          <div className="p-checklist">
            <h4>Key Inclusions:</h4>
            <ul>
              <li><CheckCircle2 size={18} className="p-check-icon" /> 5-Star Hotel Accommodation near Haram</li>
              <li><CheckCircle2 size={18} className="p-check-icon" /> VIP Air-conditioned Transport &amp; Transfers</li>
              <li><CheckCircle2 size={18} className="p-check-icon" /> Dedicated Scholar &amp; Religious Guidance</li>
              <li><CheckCircle2 size={18} className="p-check-icon" /> Complete Visa Assistance &amp; Permits</li>
            </ul>
          </div>

          <div className="p-action-box">
            <div className="p-price">
              <strong>Price on Enquiry</strong>
              <small>Customized packages based on dates &amp; hotel category</small>
            </div>
            <Link href={`/enquire?package=${currentPkg.slug}`} className="btn btn-primary">
              Enquire Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="p-card-right">
          <div className="p-image-wrap">
            <Image
              src={currentPkg.image || '/images/destinations/mecca.jpg'}
              alt={currentPkg.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="p-image-badge">
              <ShieldCheck size={16} /> Licensed Pilgrim Operator
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

