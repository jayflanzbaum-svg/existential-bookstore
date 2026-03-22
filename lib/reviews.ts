import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Review {
  title: string;
  author: string;
  slug: string;
  ogImage: string;
  ogDescription: string;
  publishedAt: string;
  category: string;
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
    ogImage: data.ogImage,
    ogDescription: data.ogDescription,
    publishedAt: data.publishedAt,
    category: data.category,
    content,
  };
}

export function getAllReviewSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
