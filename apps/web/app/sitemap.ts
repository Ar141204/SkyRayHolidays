import type { MetadataRoute } from 'next';
import { API_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.skyrayholidays.com';

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/about`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/packages`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hajj-umrah`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/visa`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/enquire`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const response = await fetch(`${API_URL}/packages`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const packages = await response.json();
      for (const item of packages) {
        if (item.slug) {
          routes.push({
            url: `${base}/packages/${item.slug}`,
            changeFrequency: 'weekly',
            priority: 0.8,
            lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          });
        }
      }
    }
  } catch {
    // fallback static routes
  }

  return routes;
}
