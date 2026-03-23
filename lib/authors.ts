import authorsData from './authors.json';
import { getReviews } from './reviews';
import type { Review } from './reviews';

export interface Author {
  slug: string;
  name: string;
  bio: string;
}

export function getAuthors(): Author[] {
  return authorsData as Author[];
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return (authorsData as Author[]).find((a) => a.slug === slug);
}

export function getAuthorWithBooks(slug: string): {
  author: Author;
  books: Review[];
} {
  const author = getAuthorBySlug(slug);
  if (!author) throw new Error(`Author not found: ${slug}`);
  const books = getReviews().filter((r) => r.authorSlugs.includes(slug));
  return { author, books };
}

/** Only author slugs that have at least one book in the catalog */
export function getAuthorSlugsWithBooks(): string[] {
  const reviews = getReviews();
  const slugSet = new Set<string>();
  reviews.forEach((r) => r.authorSlugs.forEach((s) => slugSet.add(s)));
  return Array.from(slugSet);
}
