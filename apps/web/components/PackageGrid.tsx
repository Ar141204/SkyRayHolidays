'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock3, MapPin, Star } from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

export default function PackageGrid({
  featured = false,
  kind,
}: {
  featured?: boolean;
  kind?: string;
}) {
  const [items, setItems] = useState<PackageItem[]>(() => {
    let initial = demoPackages.filter((p) => p.published !== false);
    if (kind) initial = initial.filter((p) => p.kind === kind);
    if (featured) initial = initial.filter((p) => p.featured).slice(0, 4);
    return initial;
  });

  useEffect(() => {
    fetch(`${API_URL}/packages${kind ? `?kind=${kind}` : ''}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          let list = data.filter((p: any) => p.status !== 'DRAFT');
          if (kind) list = list.filter((p: any) => p.kind === kind);
          if (featured) list = list.filter((p: any) => p.featured).slice(0, 4);
          setItems(list);
        }
      })
      .catch(() => {});
  }, [featured, kind]);

  return (
    <div className="package-grid">
      {items.map((p) => (
        <article className="package-card" key={p.id}>
          <Link href={`/packages/${p.slug}`} className="package-photo">
            <Image
              src={p.image || '/images/destinations/bali.jpg'}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              unoptimized={Boolean(p.image?.startsWith('data:') || p.image?.startsWith('/uploads'))}
            />
            <span className="package-kind">{p.kind === 'TOUR' ? p.category || 'TOUR' : p.kind}</span>
          </Link>
          <div className="package-body">
            <div className="package-meta">
              <span>
                <MapPin size={13} />
                {p.destination}
              </span>
              <span>
                <Clock3 size={13} />
                {p.duration}
              </span>
            </div>

            <h3>
              <Link href={`/packages/${p.slug}`}>{p.title}</Link>
            </h3>

            {p.rating && (
              <div className="package-rating-badge">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span>{p.rating.toFixed(1)}</span>
                {p.reviewCount && <small>({p.reviewCount} reviews)</small>}
              </div>
            )}

            <p>{p.summary}</p>

            <div className="package-bottom">
              <span className="package-price">
                <strong>{p.priceFrom ? `${p.currency || '$'}${p.priceFrom}` : 'Price on Enquiry'}</strong>
                {p.priceFrom && <small>per person</small>}
              </span>
              <Link href={`/packages/${p.slug}`} className="view-detail-btn" aria-label={`View ${p.title}`}>
                View Details <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
