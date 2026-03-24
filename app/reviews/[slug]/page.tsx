import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Star } from 'lucide-react';
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/reviews';
import PurchaseLinks from '@/components/PurchaseLinks';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllReviewSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = await getReviewBySlug(params.slug);
  if (!review) return {};

  return {
    title: `${review.title} by ${review.author}`,
    description: review.ogDescription,
    openGraph: {
      title: `${review.title} by ${review.author}`,
      description: review.ogDescription,
      url: `${SITE_URL}/reviews/${review.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: review.coverUrl,
          width: 400,
          height: 600,
          alt: `${review.title} by ${review.author}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: [review.coverUrl],
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          style={
            i < full
              ? { color: 'hsl(var(--coral))', fill: 'hsl(var(--coral))' }
              : { color: 'hsl(var(--muted-foreground))' }
          }
        />
      ))}
      <span className="font-body text-sm text-muted-foreground ml-1">
        {rating}/5
      </span>
    </div>
  );
}

const mdxComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className="text-accent hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
        {children}
      </a>
    );
  },
};

export default async function ReviewPage({ params }: Props) {
  const review = await getReviewBySlug(params.slug);
  if (!review) notFound();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
        {/* Back link */}
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-accent hover:underline font-body mb-8"
        >
          ← Back to categories
        </Link>

        <article>
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Cover */}
            {review.coverUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-[160px] md:w-[200px] shadow-lift rounded-md overflow-hidden">
                  <Image
                    src={review.coverUrl}
                    alt={`${review.title} cover`}
                    width={200}
                    height={300}
                    className="object-cover w-full"
                  />
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex-1">
              {/* Category badge */}
              <Link
                href={`/categories/${review.categorySlug}`}
                className="inline-block text-xs font-body font-medium text-accent-foreground bg-accent px-2.5 py-0.5 rounded-full mb-4 hover:bg-accent/90 transition-colors"
              >
                {review.category}
              </Link>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                {review.title}
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-1">
                {review.author}
              </p>
              {review.publishedYear && (
                <p className="font-body text-sm text-muted-foreground mb-3">
                  {review.publishedYear}
                </p>
              )}
              {review.rating > 0 && <StarRating rating={review.rating} />}
            </div>
          </div>

          {/* Body */}
          <div className="font-body text-foreground leading-[1.85] space-y-5 text-base md:text-[17px] prose prose-neutral max-w-none">
            <MDXRemote source={review.content} components={mdxComponents} />
          </div>

          {/* Purchase links */}
          {review.purchaseLinks && review.purchaseLinks.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <PurchaseLinks purchaseLinks={review.purchaseLinks} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
