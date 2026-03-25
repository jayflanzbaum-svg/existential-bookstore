import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import BookCard from '@/components/BookCard';
import CategoryCard from '@/components/CategoryCard';
import LatestReviewsSection from '@/components/LatestReviewsSection';
import NewsletterCTA from '@/components/NewsletterCTA';
import { getFeaturedReviews, getPersonalizedReviews } from '@/lib/reviews';
import { getCategories } from '@/lib/categories';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Existential Bookstore — Books for the Insatiably Curious',
  description:
    'A curated journey through fiction, philosophy, art, technology, business and the humanities.',
  openGraph: {
    title: 'The Existential Bookstore',
    description: 'Books for the insatiably curious.',
    url: SITE_URL,
    siteName: 'The Existential Bookstore',
    images: [{ url: '/og/home', width: 1200, height: 630, alt: 'The Existential Bookstore' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', images: ['/og/home'] },
};

export default async function HomePage() {
  const [allPersonalized, featured, allCategories] = await Promise.all([
    getPersonalizedReviews(),
    getFeaturedReviews(8),
    getCategories(),
  ]);
  const personalized = allPersonalized.slice(0, 5);
  const categories = allCategories.slice(0, 6);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[24vh] md:min-h-[30vh] flex items-center">
        <Image
          src="/images/hero-bookshelf.jpg"
          alt="Bookshelf"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/85 to-navy/50" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up max-w-3xl leading-tight">
            Books for the insatiably curious
          </h1>
          <p className="font-body text-base md:text-lg text-primary-foreground/75 mb-8 max-w-xl animate-fade-in">
            A curated journey through fiction, philosophy, art, technology,
            business and the humanities.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in">
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 rounded-md bg-accent text-accent-foreground font-body font-medium hover:bg-accent/90 transition-colors"
            >
              Browse Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-md border border-primary-foreground/40 text-primary-foreground font-body font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────── */}
      <section className="py-4 bg-muted border-b border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="h-0.5 w-12 bg-accent mx-auto mb-4" />
          <blockquote>
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              My Books. My Thoughts. My Journey.
            </p>
            <p className="font-body italic text-muted-foreground text-sm">
              Every book left a mark. This is the trail.
            </p>
          </blockquote>
          <div className="h-0.5 w-12 bg-accent mx-auto mt-4 mb-2" />
          <Link href="/about" className="text-accent text-sm font-body hover:underline">
            Learn more about this project →
          </Link>
        </div>
      </section>

      {/* ── LATEST REVIEWS ───────────────────────────────────────── */}
      <section className="py-10 bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-body font-semibold mb-2">
                Fresh Off the Shelf
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Latest Reviews
              </h2>
            </div>
            <Link
              href="/reviews"
              className="hidden md:inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline font-body"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <LatestReviewsSection reviews={personalized} />
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/reviews"
              className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1.5 font-body"
            >
              View all reviews <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED REVIEWS ─────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-body font-semibold mb-2">
                Selected
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Reviews
              </h2>
            </div>
            <Link
              href="/reviews"
              className="hidden md:inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline font-body"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((review, i) => (
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
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/reviews"
              className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1.5 font-body"
            >
              View all reviews <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ────────────────────────────────────── */}
      <section className="py-20 bg-sky/10">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-body font-semibold mb-2">
            Browse
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1.5 font-body"
            >
              View all categories <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ───────────────────────────────────────── */}
      <section className="py-24 gradient-navy text-center">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-xs uppercase tracking-widest text-sky-light font-body mb-4">
            Stay Connected
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Join the Reading Circle
          </h2>
          <p className="font-body text-primary-foreground/70 max-w-md mx-auto mb-8">
            New reviews, curated reading lists, and the occasional dispatch from the
            stacks — delivered to your inbox.
          </p>
          <NewsletterCTA />
        </div>
      </section>
    </>
  );
}
