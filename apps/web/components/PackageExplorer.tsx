'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Clock3, ArrowUpRight, Star } from 'lucide-react';
import { API_URL, demoPackages, type PackageItem } from '@/lib/config';

const PRESET_CATEGORIES = ['All', 'Domestic', 'International', 'Family', 'Honeymoon', 'Adventure'];

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
      const matchKind = kindFilter === 'All' || x.kind === kindFilter;
      const matchCategory =
        activeCategory === 'All' ||
        (x.category && x.category.toLowerCase() === activeCategory.toLowerCase()) ||
        (activeCategory === 'International' && x.kind === 'TOUR' && x.category !== 'Domestic') ||
        (activeCategory === 'Domestic' && x.category === 'Domestic');

      const text = `${x.title} ${x.destination} ${x.summary} ${x.category || ''}`.toLowerCase();
      const matchSearch = !search.trim() || text.includes(search.toLowerCase());

      return matchKind && matchCategory && matchSearch;
    });

    if (sort === 'featured') {
      list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    } else if (sort === 'price-low') {
      list.sort((a, b) => (a.priceFrom ?? 999999) - (b.priceFrom ?? 999999));
    } else if (sort === 'price-high') {
      list.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
    } else if (sort === 'duration') {
      list.sort((a, b) => a.duration.localeCompare(b.duration));
    }

    return list;
  }, [items, activeCategory, kindFilter, search, sort]);

  return (
    <div className="packages-explorer-wrap">
      {/* Search and Dropdowns Bar matching Preview Screen 3 */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages or destinations..."
            aria-label="Search packages"
          />
        </div>

        <div className="dropdown-controls">
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="TOUR">Tour Holidays</option>
            <option value="HAJJ">Hajj Packages</option>
            <option value="UMRAH">Umrah Packages</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="filter-dropdown"
          >
            <option value="featured">Sort By: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>

          <button className="btn btn-primary search-action-btn" aria-label="Apply search">
            <Search size={17} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills matching Preview Screen 3 */}
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
                    src={p.image || '/images/bali.svg'}
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
                      {p.priceFrom ? (
                        <>
                          <small>From</small> <strong>{p.currency || '$'}{p.priceFrom.toLocaleString('en-IN')}</strong>
                        </>
                      ) : (
                        'Price on enquiry'
                      )}
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
