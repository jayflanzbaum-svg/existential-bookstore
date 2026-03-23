import type { Metadata } from 'next';
import { getCategories } from '@/lib/categories';
import CategoryCard from '@/components/CategoryCard';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse book reviews by category at The Existential Bookstore.',
  openGraph: {
    title: 'Browse Categories — The Existential Bookstore',
    description: 'Explore our curated reading collections by genre and theme.',
    url: `${SITE_URL}/categories`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
          Browse
        </p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          All Categories
        </h1>
        <p className="font-body text-muted-foreground max-w-xl mb-12">
          Each collection is a way of grouping books that share a sensibility —
          an era, a genre, a set of questions they cannot stop asking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              description={cat.description}
              bookCount={cat.bookCount}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
