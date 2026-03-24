import type { Metadata } from 'next';
import BookCard from '@/components/BookCard';
import { getReviews } from '@/lib/reviews';
import { SITE_NAME } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `All Reviews — ${SITE_NAME}`,
  description: 'Every book reviewed on The Existential Bookstore.',
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-body font-semibold mb-2">
          The Collection
        </p>
        <div className="flex items-baseline gap-4 mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            All Reviews
          </h1>
          <span className="font-body text-muted-foreground text-sm">
            {reviews.length} books
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      </div>
    </div>
  );
}
