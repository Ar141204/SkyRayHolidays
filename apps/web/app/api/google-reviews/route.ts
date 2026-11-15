import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const key = process.env.GOOGLE_PLACES_API_KEY;
    const place = process.env.GOOGLE_PLACE_ID;

    if (key && place) {
      const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
        place,
      )}?fields=displayName,rating,userRatingCount,reviews,googleMapsUri&key=${encodeURIComponent(key)}`;

      const r = await fetch(url, {
        headers: {
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
        },
        next: { revalidate: 3600 },
      });

      if (r.ok) {
        const d: any = await r.json();
        return NextResponse.json({
          available: true,
          name: d.displayName?.text || 'Skyray Holidays',
          rating: d.rating || 4.9,
          reviewCount: d.userRatingCount || 34,
          reviews: (d.reviews || []).map((x: any) => ({
            author: x.authorAttribution?.displayName,
            rating: x.rating,
            text: x.text?.text,
            publishTime: x.relativePublishTimeDescription || x.publishTime,
            url: x.authorAttribution?.uri,
          })),
          url: d.googleMapsUri || 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
        });
      }
    }

    // Secondary fallback: query backend if configured
    try {
      const backendRes = await fetch(`${API_URL}/integrations/google-reviews`, {
        next: { revalidate: 3600 },
      });
      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData?.available) {
          return NextResponse.json(backendData);
        }
      }
    } catch {}

    return NextResponse.json({
      available: true,
      name: 'Skyray Holidays',
      rating: 4.9,
      reviewCount: 34,
      reviews: [],
      url: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
    });
  } catch (err: any) {
    return NextResponse.json({
      available: true,
      name: 'Skyray Holidays',
      rating: 4.9,
      reviewCount: 34,
      reviews: [],
      url: 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8',
    });
  }
}
