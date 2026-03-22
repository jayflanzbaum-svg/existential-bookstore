import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/reviews';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllReviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let review;
  try {
    review = getReviewBySlug(params.slug);
  } catch {
    return {};
  }

  return {
    title: review.title,
    description: review.ogDescription,
    openGraph: {
      title: `${review.title} by ${review.author}`,
      description: review.ogDescription,
      url: `https://existentialbookstore.vercel.app/reviews/${review.slug}`,
      siteName: 'Existential Bookstore',
      images: [
        {
          url: `/og/review/${review.slug}?title=${encodeURIComponent(review.title)}&author=${encodeURIComponent(review.author)}`,
          width: 1200,
          height: 630,
          alt: `${review.title} by ${review.author}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${review.title} by ${review.author}`,
      description: review.ogDescription,
      images: [`/og/review/${review.slug}?title=${encodeURIComponent(review.title)}&author=${encodeURIComponent(review.author)}`],
    },
  };
}

export default function ReviewPage({ params }: Props) {
  let review;
  try {
    review = getReviewBySlug(params.slug);
  } catch {
    notFound();
  }

  const paragraphs = review.content
    .trim()
    .split(/\n\n+/)
    .filter(Boolean);

  return (
    <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <nav className="mb-12">
        <a
          href="/"
          className="text-xs uppercase tracking-widest hover:underline"
          style={{ color: '#6060a0' }}
        >
          ← Existential Bookstore
        </a>
      </nav>

      <article>
        <header className="mb-10">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: '#6060a0' }}
          >
            {review.category}
          </p>
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{ color: '#f5f0e8' }}
          >
            {review.title}
          </h1>
          <p className="text-lg" style={{ color: '#a09880' }}>
            {review.author}
          </p>
          <p className="text-sm mt-2" style={{ color: '#6060a0' }}>
            {new Date(review.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <div className="space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="leading-relaxed" style={{ color: '#c8c0b0' }}>
              {para.trim()}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
