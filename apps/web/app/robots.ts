import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/syedrahamathullah@portal-1614', '/admin', '/api/'],
    },
    sitemap: 'https://www.skyrayholidays.com/sitemap.xml',
    host: 'https://www.skyrayholidays.com',
  };
}
