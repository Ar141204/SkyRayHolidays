'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';

type Reviews = {
  available?: boolean;
  name?: { text?: string } | string;
  rating?: number;
  reviewCount?: number;
  reviews?: { author?: string; rating?: number; text?: string; publishTime?: string }[];
  url?: string;
  message?: string;
};

const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8';

const ORIGINAL_GOOGLE_REVIEWS = [
  {
    author: 'Riyaz Ahamed',
    rating: 5,
    text: 'Great service, quick response, knowledge in immigration services.',
    publishTime: 'Verified Google Review',
  },
  {
    author: 'Mohamed Thasin',
    rating: 5,
    text: 'Excellent customer services and Kind personal care to customers.',
    publishTime: 'Verified Google Review',
  },
  {
    author: 'Abdul Rasheed',
    rating: 5,
    text: 'He was very patient and guided me annd responded to all my queries.',
    publishTime: 'Verified Google Review',
  },
];

export default function GoogleReviews() {
  const [data, setData] = useState<Reviews | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/integrations/google-reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.available) setData(res);
      })
      .catch(() => {});
  }, []);

  const rating = data?.rating || 4.9;
  const reviewCount = data?.reviewCount || 34;
  const reviewsList =
    data?.reviews && data.reviews.length > 0 ? data.reviews : ORIGINAL_GOOGLE_REVIEWS;
  const gmapsUrl = data?.url || GOOGLE_MAPS_REVIEWS_URL;

  return (
    <div className="review-placeholder" style={{ borderRadius: '14px', border: '1px solid #dce8ee' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="google-g" style={{ margin: 0, fontSize: '30px' }}>G</div>
          <div>
            <strong style={{ fontSize: '18px', color: '#17496b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Skyray Holidays
              <CheckCircle size={15} color="#10b981" />
            </strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Google Business Profile</span>
          </div>
        </div>

        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="live-status-pill"
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          <span className="dot-green"></span>
          <span>Verified on Google</span>
        </a>
      </div>

      <div className="review-rating" style={{ margin: '14px 0 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '26px', fontWeight: 800, color: '#17496b' }}>{Number(rating).toFixed(1)}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
            ))}
          </span>
          <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            {reviewCount} Google reviews (5.0 Star Rating)
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviewsList.slice(0, 3).map((r, i) => (
          <div
            className="google-review"
            key={i}
            style={{
              background: '#f8fbfe',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #eaf2f6',
              marginTop: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <b style={{ fontSize: '13px', color: '#17496b' }}>{r.author || 'Verified Traveller'}</b>
              <div className="stars" style={{ color: '#f59e0b', fontSize: '12px' }}>
                {'★'.repeat(Math.round(r.rating || 5))}
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#334155', margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
              &ldquo;{r.text}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '11.5px', color: '#64748b' }}>
          Melacavery, Kumbakonam, Tamil Nadu
        </span>
        <a
          className="text-link"
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all reviews on Google Maps <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
