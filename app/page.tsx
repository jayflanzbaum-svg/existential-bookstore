import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Existential Bookstore',
  description:
    'A curated collection of book reviews spanning existentialism, Beat Generation, magical realism, science fiction, and the philosophy of making things.',
  openGraph: {
    title: 'Existential Bookstore',
    description: 'Books that make you question everything.',
    url: 'https://existentialbookstore.vercel.app',
    siteName: 'Existential Bookstore',
    images: [
      {
        url: '/og/home',
        width: 1200,
        height: 630,
        alt: 'Existential Bookstore — Books that make you question everything',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Existential Bookstore',
    description: 'Books that make you question everything.',
    images: ['/og/home'],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <header className="mb-16">
        <h1
          className="text-4xl font-bold tracking-tight mb-4"
          style={{ color: '#f5f0e8' }}
        >
          Existential Bookstore
        </h1>
        <p className="text-xl italic mb-6" style={{ color: '#c8c0b0' }}>
          Books that make you question everything.
        </p>
        <p className="leading-relaxed" style={{ color: '#a09880' }}>
          A curated collection of reviews spanning existentialism, Beat
          Generation, magical realism, science fiction, and the philosophy of
          making things. These are books that don&apos;t just tell stories —
          they rearrange the furniture of your mind. Each review is a record of
          a reading that changed something, however slightly, in the way the
          world looked afterward.
        </p>
      </header>

      <section>
        <h2
          className="text-xs uppercase tracking-widest mb-6"
          style={{ color: '#a09880' }}
        >
          Featured Review
        </h2>
        <Link
          href="/reviews/my-side-of-the-mountain"
          className="block group"
        >
          <article
            className="border rounded-lg p-6 transition-colors"
            style={{
              borderColor: '#2e2e4e',
              backgroundColor: '#12121e',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: '#6060a0' }}
            >
              Childhood Classics
            </p>
            <h3
              className="text-2xl font-semibold mb-1 group-hover:underline"
              style={{ color: '#f5f0e8' }}
            >
              My Side of the Mountain
            </h3>
            <p className="text-sm mb-3" style={{ color: '#a09880' }}>
              Jean Craighead George
            </p>
            <p className="leading-relaxed text-sm" style={{ color: '#c8c0b0' }}>
              A boy, a falcon, and a hollow tree: the book that taught me
              solitude could be chosen, not just endured.
            </p>
          </article>
        </Link>
      </section>
    </main>
  );
}
