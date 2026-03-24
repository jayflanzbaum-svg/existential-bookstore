import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import { getAuthorWithBooks, getAuthorSlugsWithBooks } from '@/lib/authors';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAuthorSlugsWithBooks();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let author;
  try {
    ({ author } = await getAuthorWithBooks(params.slug));
  } catch {
    return {};
  }

  return {
    title: `${author.name} — ${SITE_NAME}`,
    description: author.bio,
    openGraph: {
      title: `${author.name} — ${SITE_NAME}`,
      description: author.bio,
      url: `${SITE_URL}/authors/${author.slug}`,
      siteName: SITE_NAME,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  let author;
  let books;
  try {
    ({ author, books } = await getAuthorWithBooks(params.slug));
  } catch {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-accent hover:underline font-body mb-8"
        >
          ← Browse Collection
        </Link>

        <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">Author</p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          {author.name}
        </h1>

        {author.bio && (
          <p className="font-body text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            {author.bio}
          </p>
        )}

        <p className="text-xs uppercase tracking-widest text-accent font-body mb-4">
          Books by {author.name}
        </p>

        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {books.map((review, i) => (
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
          <p className="font-body text-muted-foreground">No reviews yet for this author.</p>
        )}
      </div>
    </div>
  );
}
