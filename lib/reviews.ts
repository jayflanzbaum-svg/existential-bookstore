import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Review {
  title: string;
  author: string;
  slug: string;
  coverUrl: string;
  ogDescription: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  personalized: boolean;
  rating: number;
  content: string;
}

const contentDir = path.join(process.cwd(), 'content', 'reviews');

export function getReviewBySlug(slug: string): Review {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title,
    author: data.author,
    slug: data.slug,
    coverUrl: data.coverUrl ?? '',
    ogDescription: data.ogDescription,
    publishedAt: data.publishedAt,
    category: data.category,
    featured: data.featured ?? false,
    personalized: data.personalized ?? false,
    rating: data.rating ?? 5,
    content,
  };
}

export function getReviews(): Review[] {
  const slugs = getAllReviewSlugs();
  return slugs.map((slug) => getReviewBySlug(slug));
}

export function getFeaturedReviews(): Review[] {
  return getReviews().filter((r) => r.featured);
}

export function getPersonalizedReviews(): Review[] {
  return getReviews().filter((r) => r.personalized);
}

export function getReviewsByCategory(categoryName: string): Review[] {
  return getReviews().filter(
    (r) => r.category.toLowerCase() === categoryName.toLowerCase()
  );
}

export function getAllReviewSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
