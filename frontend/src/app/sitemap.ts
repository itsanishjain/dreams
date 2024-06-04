import { getBlogPosts } from '@/lib/blog';
import { getURL } from '@/lib/utils';

export default async function sitemap() {
  const baseUrl = getURL();
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = [
    '',
    '/auth',
    '/blog',
    '/privacy-policy',
    '/cookie-policy',
    '/terms-of-service',
    '/cancellation',
    '/support',
    '/dashboard',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
