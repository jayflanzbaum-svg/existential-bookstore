import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import { getCategoryWithBooks, getAllCategorySlugs } from '@/lib/categories';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let category;
  try {
    ({ category } = await getCategoryWithBooks(params.slug));
  } catch {
    return {};
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} — ${SITE_NAME}`,
      description: category.description,
      url: `${SITE_URL}/categories/${category.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: `/og/category/${category.slug}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description)}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/category/${category.slug}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description)}`],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  let category;
  let reviews;
  try {
    ({ category, books: reviews } = await getCategoryWithBooks(params.slug));
  } catch {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-accent hover:underline font-body mb-8"
        >
          ← All Categories
        </Link>

        <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
          Collection
        </p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          {category.name}
        </h1>
        <p className="font-body text-muted-foreground max-w-xl mb-8">
          {category.description}
        </p>

        {category.content && (
          <div className="font-body text-foreground leading-relaxed max-w-2xl mb-12 text-base text-muted-foreground border-l-2 border-accent pl-6">
            {category.content}
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {reviews.map((review, i) => (
              <BookCard
                key={review.slug}
                title={review.title}
                author={review.author}
                slug={review.slug}
                coverUrl={review.coverUrl}
                rating={review.rating}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground">
            No reviews in this category yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
