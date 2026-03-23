import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PurchaseLink {
  tier: string;
  label: string;
  url: string;
  priceNote: string;
}

export interface Review {
  slug: string;
  title: string;
  author: string;
  authorSlugs: string[];
  coverUrl: string;
  localCoverUrl: string;
  isbn: string;
  ogDescription: string;
  publishedYear: number | null;
  category: string;
  categorySlug: string;
  featured: boolean;
  personalized: boolean;
  rating: number;
  purchaseLinks: PurchaseLink[];
  content: string;
}

const contentDir = path.join(process.cwd(), 'content', 'reviews');
const coversDir = path.join(process.cwd(), 'public', 'covers');

export function getReviewBySlug(slug: string): Review {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug: data.slug ?? slug,
    title: data.title ?? '',
    author: data.author ?? '',
    authorSlugs: Array.isArray(data.authorSlugs) ? data.authorSlugs : [],
    coverUrl: data.coverUrl ?? '',
    localCoverUrl: fs.existsSync(path.join(coversDir, `${slug}.jpg`))
      ? `/covers/${slug}.jpg`
      : (data.coverUrl ?? ''),
    isbn: data.isbn ?? '',
    ogDescription: data.ogDescription ?? '',
    publishedYear: data.publishedYear ?? null,
    category: data.category ?? '',
    categorySlug: data.categorySlug ?? '',
    featured: data.featured ?? false,
    personalized: data.personalized ?? false,
    rating: data.rating ?? 0,
    purchaseLinks: Array.isArray(data.purchaseLinks) ? data.purchaseLinks : [],
    content,
  };
}

export function getAllReviewSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getReviews(): Review[] {
  return getAllReviewSlugs()
    .map((slug) => getReviewBySlug(slug))
    .sort((a, b) => {
      if (a.personalized !== b.personalized) return a.personalized ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
}

export function getPersonalizedReviews(): Review[] {
  return getReviews()
    .filter((r) => r.personalized)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getFeaturedReviews(limit = 8): Review[] {
  const featured = getReviews().filter((r) => r.featured);
  // Fisher-Yates shuffle — runs once per build for static pages
  for (let i = featured.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [featured[i], featured[j]] = [featured[j], featured[i]];
  }
  return featured.slice(0, limit);
}

export function getReviewsByCategory(categorySlug: string): Review[] {
  return getReviews().filter((r) => r.categorySlug === categorySlug);
}
