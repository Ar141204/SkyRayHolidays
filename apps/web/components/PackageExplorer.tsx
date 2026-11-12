'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Clock3, ArrowUpRight, Star } from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

const PRESET_CATEGORIES = ['All', 'Specialized Destinations', 'International', 'Domestic', 'Honeymoon', 'Family'];

export default function PackageExplorer() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [kindFilter, setKindFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/packages`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Package catalogue is temporarily unavailable');
        return r.json();
      })
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setItems(d);
        } else {
          setItems(demoPackages);
        }
      })
      .catch(() => {
        setItems(demoPackages);
      })
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    let list = items.filter((x) => {
      // Exclude Hajj and Umrah packages: they have their own dedicated Hajj & Umrah page!
      if (x.kind === 'HAJJ' || x.kind === 'UMRAH') return false;

      const isSpecialized =
        x.category === 'Specialized' ||
        ['reunion', 'russia', 'turkey', 'mauritius', 'maldives', 'seychelles', 'armenia', 'georgia', 'azerbaijan'].some(
          (k) => x.slug?.toLowerCase().includes(k) || x.destination?.toLowerCase().includes(k)
        );

      const matchKind =
        kindFilter === 'All' ||
        (kindFilter === 'Specialized' && isSpecialized) ||
        (kindFilter === 'International' && x.category !== 'Domestic') ||
        (kindFilter === 'Domestic' && x.category === 'Domestic');

      const matchCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Specialized Destinations' && isSpecialized) ||
        (activeCategory === 'International' && x.category !== 'Domestic') ||
        (activeCategory === 'Domestic' && x.category === 'Domestic') ||
        (x.category && x.category.toLowerCase() === activeCategory.toLowerCase());

      const text = `${x.title} ${x.destination} ${x.summary} ${x.category || ''}`.toLowerCase();
      const matchSearch = !search.trim() || text.includes(search.toLowerCase());

      return matchKind && matchCategory && matchSearch;
    });

    if (sort === 'featured') {
      list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === 'duration') {
      list.sort((a, b) => a.duration.localeCompare(b.duration));
    } else if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [items, activeCategory, kindFilter, search, sort]);

  return (
    <div className="packages-explorer-wrap">
      {/* Search and Dropdowns Bar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages (e.g. Turkey, Russia, Maldives, Georgia)..."
            aria-label="Search packages"
          />
        </div>

        <div className="dropdown-controls">
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Types</option>
            <option value="Specialized">Specialized Key Destinations</option>
            <option value="International">International Escapes</option>
            <option value="Domestic">Within India</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="filter-dropdown"
          >
            <option value="featured">Sort By: Featured</option>
            <option value="rating">Top Rated</option>
            <option value="duration">Duration</option>
            <option value="title">Alphabetical (A - Z)</option>
          </select>

          <button className="btn btn-primary search-action-btn" aria-label="Apply search">
            <Search size={17} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills-row">
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="catalog-empty">Loading our travel packages…</div>
      ) : shown.length === 0 ? (
        <div className="catalog-empty">
          <p>No packages match your search criteria.</p>
          <button
            className="btn btn-outline small"
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
              setKindFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="catalog-count">Showing {shown.length} travel packages</div>
          <div className="package-grid">
            {shown.map((p) => (
              <article className="package-card" key={p.id}>
                <Link href={`/packages/${p.slug}`} className="package-photo">
                  <Image
                    src={p.image || '/images/destinations/bali.jpg'}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                      <small>Custom Quote</small>
                      <strong>Price on Enquiry</strong>
                    </span>
                    <Link href={`/packages/${p.slug}`} className="view-detail-btn" aria-label={`View ${p.title}`}>
                      View Details <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
