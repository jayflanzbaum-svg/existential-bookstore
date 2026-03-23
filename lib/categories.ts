import categoriesData from './categories.json';
import { getReviewsByCategory } from './reviews';

export interface Category {
  slug: string;
  name: string;
  description: string;
  content: string;
  icon: string;
  bookCount: number;
}

function hydrate(cat: typeof categoriesData[number]): Category {
  return {
    ...cat,
    bookCount: getReviewsByCategory(cat.slug).length,
  };
}

export function getCategories(): Category[] {
  return categoriesData.map(hydrate);
}

export function getCategoryBySlug(slug: string): Category {
  const cat = categoriesData.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Category not found: ${slug}`);
  return hydrate(cat);
}

export function getAllCategorySlugs(): string[] {
  return categoriesData.map((c) => c.slug);
}

export function getCategoryWithBooks(slug: string): {
  category: Category;
  books: ReturnType<typeof getReviewsByCategory>;
} {
  const category = getCategoryBySlug(slug);
  const books = getReviewsByCategory(slug);
  return { category, books };
}
