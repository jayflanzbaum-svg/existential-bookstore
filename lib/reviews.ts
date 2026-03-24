import { supabase } from './supabase';

export interface PurchaseLink {
  tier: string;
  label: string;
  url: string;
  priceNote: string;
}

export interface Review {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorSlugs: string[];
  coverUrl: string;
  isbn: string;
  ogDescription: string;
  publishedYear: number | null;
  category: string;
  categorySlug: string;
  featured: boolean;
  personalized: boolean;
  rating: number;
  amazonUrl: string;
  purchaseLinks: PurchaseLink[];
  content: string;
}

function mapBook(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    author: row.author as string,
    authorSlugs: (row.author_slugs as string[]) || [],
    coverUrl: (row.cover_url as string) || '',
    isbn: (row.isbn as string) || '',
    ogDescription: (row.og_description as string) || '',
    publishedYear: (row.published_year as number) || null,
    category: (row.category as string) || '',
    categorySlug: (row.category_slug as string) || '',
    featured: (row.featured as boolean) || false,
    personalized: (row.personalized as boolean) || false,
    rating: (row.rating as number) || 0,
    amazonUrl: (row.amazon_url as string) || '',
    purchaseLinks: (row.purchase_links as PurchaseLink[]) || [],
    content: (row.review as string) || '',
  };
}

export async function getReviews(): Promise<Review[]> {
  const { data } = await supabase.from('books').select('*').order('title');
  return (data || []).map(mapBook);
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single();
  return data ? mapBook(data) : null;
}

export async function getAllReviewSlugs(): Promise<string[]> {
  const { data } = await supabase.from('books').select('slug');
  return (data || []).map((r) => r.slug as string);
}

export async function getFeaturedReviews(limit = 8): Promise<Review[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('featured', true);
  const featured = (data || []).map(mapBook);
  for (let i = featured.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [featured[i], featured[j]] = [featured[j], featured[i]];
  }
  return featured.slice(0, limit);
}

export async function getPersonalizedReviews(): Promise<Review[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('personalized', true)
    .order('title');
  return (data || []).map(mapBook);
}

export async function getReviewsByCategory(categorySlug: string): Promise<Review[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('category_slug', categorySlug)
    .order('title');
  return (data || []).map(mapBook);
}
