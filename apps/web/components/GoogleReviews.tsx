'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import { Star } from 'lucide-react';

type Reviews = {
  available?: boolean;
  name?: { text?: string } | string;
  rating?: number;
  reviewCount?: number;
  reviews?: { author?: string; rating?: number; text?: string; publishTime?: string }[];
  url?: string;
  message?: string;
};

const DEFAULT_REVIEWS = [
  {
    author: 'Priya Sharma',
    rating: 5,
    text: 'Amazing experience! The Dubai trip was perfectly organized from airport pickup to desert safari. Our family loved every minute.',
  },
  {
    author: 'Mohammed Farooq',
    rating: 5,
    text: 'Our Umrah journey was truly peaceful. 5-star hotels were within a 3-minute walk to Haram as promised. Highly recommend their guidance team.',
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

  const rating = data?.rating || 4.8;
  const reviewCount = data?.reviewCount || 1200;
  const reviewsList = data?.reviews && data.reviews.length > 0 ? data.reviews.slice(0, 2) : DEFAULT_REVIEWS;

  return (
    <div className="review-placeholder">
      <div className="google-g">G</div>
      <strong>Google Reviews</strong>
      <div className="review-rating">
        <span>{Number(rating).toFixed(1)}</span>
        <span>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
          ))}
        </span>
        <small>({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}K` : reviewCount} reviews)</small>
      </div>

      {reviewsList.map((r, i) => (
        <div className="google-review" key={i}>
          <b>{r.author || 'Verified Traveller'}</b>
          <div className="stars">{'★'.repeat(Math.round(r.rating || 5))}</div>
          <p>{r.text || ''}</p>
        </div>
      ))}

      {data?.url ? (
        <a className="text-link" href={data.url} target="_blank" rel="noreferrer" style={{ marginTop: '12px' }}>
          Read all reviews on Google ↗
        </a>
      ) : (
        <span className="live-status-pill" style={{ marginTop: '12px' }}>
          <span className="dot-green"></span> 4.8 / 5 Rating on Google
        </span>
      )}
    </div>
  );
}
