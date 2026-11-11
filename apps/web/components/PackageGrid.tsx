import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock3, MapPin, Star } from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

export default async function PackageGrid({
  featured = false,
  kind,
}: {
  featured?: boolean;
  kind?: string;
}) {
  let items: PackageItem[] = [];

  try {
    const res = await fetch(`${API_URL}/packages${kind ? `?kind=${kind}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) items = await res.json();
  } catch {}

  if (items.length === 0) {
    items = demoPackages.filter((p) => p.published !== false);
  }

  if (kind) {
    items = items.filter((p) => p.kind === kind);
  }

  if (featured) {
    items = items.filter((p) => p.featured).slice(0, 4);
  }

  return (
    <div className="package-grid">
      {items.map((p) => (
        <article className="package-card" key={p.id}>
          <Link href={`/packages/${p.slug}`} className="package-photo">
            <Image
              src={p.image || '/images/bali.svg'}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
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
                <strong>Price on Enquiry</strong>
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
