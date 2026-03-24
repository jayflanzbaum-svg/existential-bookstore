import { supabase } from './supabase';
import { getReviews } from './reviews';
import type { Review } from './reviews';

export interface Author {
  id: string;
  slug: string;
  name: string;
  bio: string;
}

function mapAuthor(row: Record<string, unknown>): Author {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    bio: (row.bio as string) || '',
  };
}

export async function getAuthors(): Promise<Author[]> {
  const { data } = await supabase.from('authors').select('*').order('name');
  return (data || []).map(mapAuthor);
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const { data } = await supabase
    .from('authors')
    .select('*')
    .eq('slug', slug)
    .single();
  return data ? mapAuthor(data) : undefined;
}

export async function getAuthorWithBooks(
  slug: string
): Promise<{ author: Author; books: Review[] }> {
  const author = await getAuthorBySlug(slug);
  if (!author) throw new Error(`Author not found: ${slug}`);
  const allReviews = await getReviews();
  const books = allReviews.filter((r) => r.authorSlugs.includes(slug));
  return { author, books };
}

export async function getAuthorSlugsWithBooks(): Promise<string[]> {
  const reviews = await getReviews();
  const slugSet = new Set<string>();
  reviews.forEach((r) => r.authorSlugs.forEach((s) => slugSet.add(s)));
  return Array.from(slugSet);
}
