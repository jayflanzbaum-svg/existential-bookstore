import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/reviews';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import { addAffiliateTag } from '@/lib/amazon';

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
      images: [{ url: review.coverUrl, width: 400, height: 600, alt: `${review.title} by ${review.author}` }],
      type: 'article',
    },
    twitter: { card: 'summary_large_image', images: [review.coverUrl] },
  };
}


export default async function ReviewPage({ params }: Props) {
  const review = await getReviewBySlug(params.slug);
  if (!review) notFound();

  const firstEditionLink = review.purchaseLinks?.find((l) => l.tier === 'first_edition');
  const authorSlug = review.authorSlugs?.[0];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        {/* Back link */}
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-accent hover:underline font-body mb-8"
        >
          ← Back to categories
        </Link>

        <article>
          {/* ── TOP: cover + metadata ─────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Left — cover */}
            {review.coverUrl && (
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <Image
                  src={review.coverUrl}
                  alt={`${review.title} cover`}
                  width={220}
                  height={330}
                  className="max-w-[220px] w-full rounded-lg shadow-lift object-cover"
                />
              </div>
            )}

            {/* Right — metadata */}
            <div className="flex-1 min-w-0">
              {/* 1. Category badge */}
              <Link
                href={`/categories/${review.categorySlug}`}
                className="inline-block text-xs uppercase tracking-widest font-semibold text-accent font-body mb-3 hover:underline"
              >
                {review.category}
              </Link>

              {/* 2. Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
                {review.title}
              </h1>

              {/* 3. Author */}
              {authorSlug ? (
                <Link
                  href={`/authors/${authorSlug}`}
                  className="font-body text-lg text-muted-foreground mt-1 hover:text-accent transition-colors"
                >
                  {review.author}
                </Link>
              ) : (
                <p className="font-body text-lg text-muted-foreground mt-1">{review.author}</p>
              )}

              {/* 4. Star rating */}
              {review.rating > 0 && (
                <div className="inline-flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }, (_, i) => {
                    const filled = i < Math.floor(review.rating);
                    const half = !filled && i < review.rating;
                    return (
                      <Star
                        key={i}
                        size={16}
                        style={
                          filled || half
                            ? { color: 'hsl(var(--coral))', fill: 'hsl(var(--coral))' }
                            : { color: 'hsl(var(--muted-foreground))' }
                        }
                      />
                    );
                  })}
                  <span className="font-body text-sm font-medium text-foreground ml-1">
                    {review.rating}
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    ({review.rating}/5)
                  </span>
                </div>
              )}

              {/* 5. Published + ISBN */}
              {(review.publishedYear || review.isbn) && (
                <p className="font-body text-sm text-muted-foreground mt-2">
                  {[
                    review.publishedYear ? `Published ${review.publishedYear}` : null,
                    review.isbn ? `ISBN ${review.isbn}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}

              {/* 6. Purchase section divider */}
              <div className="mt-6 mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground font-body">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Purchase</span>
              </div>

              {/* 7. Purchase buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Buy on Amazon */}
                {review.amazonUrl && (
                  <a
                    href={addAffiliateTag(review.amazonUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-semibold font-body transition-colors"
                  >
                    Amazon
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* Bookshop.org — always shown */}
                <a
                  href={`https://bookshop.org/search?keywords=${encodeURIComponent(review.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold font-body transition-colors"
                >
                  Bookshop.org
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {/* First Edition */}
                {firstEditionLink && (
                  <a
                    href={firstEditionLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--coral))] hover:bg-[hsl(var(--coral)/.85)] text-white text-sm font-semibold font-body transition-colors"
                  >
                    First Edition (Check availability)
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── REVIEW BODY ───────────────────────────────────── */}
          {review.content && (
            <div className="border-t border-border mt-8 pt-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {review.personalized ? 'Our Review' : 'About This Book'}
              </h2>
              <div className="bg-muted/40 rounded-xl p-6 md:p-8 font-body text-base leading-relaxed text-foreground">
                {review.content.split(/\n\n+/).map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
