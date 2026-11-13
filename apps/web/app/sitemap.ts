import type { MetadataRoute } from 'next';
import { API_URL } from '@/lib/config';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'https://skyrayholidays.com'
  ).replace(/\/$/, '');
  if (!base) return [];
  const routes: MetadataRoute.Sitemap = ['', '/about', '/packages', '/hajj-umrah', '/contact', '/enquire', '/privacy', '/terms'].map(path => ({ url: `${base}${path}`, changeFrequency: path === '' ? 'weekly' : 'monthly', priority: path === '' ? 1 : 0.6 }));
  try {
    const response = await fetch(`${API_URL}/packages`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const packages = await response.json();
      for (const item of packages) if (item.slug) routes.push({ url: `${base}/packages/${item.slug}`, changeFrequency: 'weekly', priority: 0.7, lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined });
    }
  } catch { /* Sitemap still serves the public static routes when the API is offline. */ }
  return routes;
}
