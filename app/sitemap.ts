import type { MetadataRoute } from 'next';
import { getAllReviewSlugs } from '@/lib/reviews';
import { getAllCategorySlugs } from '@/lib/categories';
import { getAuthorSlugsWithBooks } from '@/lib/authors';
import { SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewSlugs = getAllReviewSlugs();
  const categorySlugs = getAllCategorySlugs();
  const authorSlugs = getAuthorSlugsWithBooks();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/categories`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/newsletter`, priority: 0.4, changeFrequency: 'monthly' },
  ];

  const reviewPages: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${SITE_URL}/reviews/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    priority: 0.6,
    changeFrequency: 'weekly',
  }));

  const authorPages: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${SITE_URL}/authors/${slug}`,
    priority: 0.5,
    changeFrequency: 'monthly',
  }));

  return [...staticPages, ...reviewPages, ...categoryPages, ...authorPages];
}
