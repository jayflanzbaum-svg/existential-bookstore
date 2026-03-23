import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getReviews } from './reviews';

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  bookCount: number;
}

const contentDir = path.join(process.cwd(), 'content', 'categories');

export function getCategoryBySlug(slug: string): Category {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

  const reviews = getReviews();
  const bookCount = reviews.filter(
    (r) => r.category.toLowerCase() === data.name.toLowerCase()
  ).length;

  return {
    name: data.name,
    slug: data.slug,
    icon: data.icon,
    description: data.description,
    bookCount,
  };
}

export function getCategories(): Category[] {
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'));

  return files.map((f) => getCategoryBySlug(f.replace(/\.mdx$/, '')));
}

export function getAllCategorySlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
