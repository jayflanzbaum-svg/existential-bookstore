import { supabase } from './supabase';
import { getReviewsByCategory } from './reviews';
import type { Review } from './reviews';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  content: string;
  icon: string;
  bookCount: number;
}

function mapCategory(row: Record<string, unknown>, bookCount = 0): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) || '',
    content: (row.content as string) || '',
    icon: (row.icon as string) || 'Feather',
    bookCount,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').order('name');
  if (!data) return [];
  return Promise.all(
    data.map(async (row) => {
      const books = await getReviewsByCategory(row.slug as string);
      return mapCategory(row, books.length);
    })
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) return null;
  const books = await getReviewsByCategory(slug);
  return mapCategory(data, books.length);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const { data } = await supabase.from('categories').select('slug');
  return (data || []).map((r) => r.slug as string);
}

export async function getCategoryWithBooks(
  slug: string
): Promise<{ category: Category; books: Review[] }> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) throw new Error(`Category not found: ${slug}`);
  const books = await getReviewsByCategory(slug);
  return { category: mapCategory(data, books.length), books };
}
