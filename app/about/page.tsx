import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind The Existential Bookstore — a personal reading journal turned curated review site.',
  openGraph: {
    title: `About — ${SITE_NAME}`,
    description: 'A personal reading journal turned curated review site.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero strip ─────────────────────────────────────────── */}
      <div className="gradient-navy py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-sky-light font-body mb-4">
            About
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            The Story Behind the Shelf
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg">
            A reading life made public.
          </p>
        </div>
      </div>

      {/* ── Editorial sections ─────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 max-w-2xl py-16 space-y-16">

        {/* My Story */}
        <section>
          <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
            My Story
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            About the Existential Bookstore
          </h2>

          {/* On the Road photo — floated left, text wraps right */}
          <div className="mb-6">
            <figure className="float-left mr-6 mb-2 w-36 md:w-44 flex-shrink-0">
              <div className="border-4 border-accent/50 rounded-lg overflow-hidden bg-muted shadow-md">
                <Image
                  src="/images/about-on-the-road.jpg"
                  alt="A well-loved copy of On the Road by Jack Kerouac"
                  width={176}
                  height={220}
                  className="w-full object-cover rotate-3 scale-110"
                />
              </div>
            </figure>
            <div className="space-y-4">
              <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
                I grew up surrounded by books. My aunt worked at a bookstore, my uncle was an avid reader, and both filled my childhood with stories. While other kids were outside playing, I was finding entire Hardy Boys series in neighborhood garbage heaps and reading every single one. I treasured school book fairs where the cafeteria transformed into a wonderland. I collected every book I read, and each one became a marker of who I was becoming.
              </p>
              <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
                In eighth grade, a teacher asked if I had read <em>On the Road</em> by Jack Kerouac. That question changed everything. It opened a door to the Beats, to Kerouac and Ginsberg and Anaïs Nin, to philosophy and existence itself. Suddenly I was reading at fifteen what most people would not encounter until college.
              </p>
              <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
                I discovered the existentialists, then Gabriel García Márquez and magical realism. I fell in love with the Renaissance and the humanistic philosophy that reminds us life is more than survival, more than commerce alone—it is art, philosophy, cuisine, beauty, and meaning. And I became fascinated by science fiction writers like William Gibson and Neal Stephenson, who asked hard questions about technology and the future we are building. This bookstore is my way of sharing that world with you.
              </p>
            </div>
            <div className="clear-both" />
          </div>
        </section>

        {/* How We Got Here */}
        <section>
          <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
            How We Got Here
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            A Shared Shelf, a Shared Life
          </h2>

          {/* Founders photo — floated left, text wraps right */}
          <div className="mb-6">
            <figure className="float-left mr-6 mb-2 w-36 md:w-44 flex-shrink-0">
              <div className="border-4 border-accent/50 rounded-lg overflow-hidden bg-muted shadow-md">
                <Image
                  src="/images/about-founders.jpg"
                  alt="The founders sharing a kiss on an old rail cart in the Everglades"
                  width={176}
                  height={220}
                  className="w-full object-cover"
                />
              </div>
            </figure>
          <div className="space-y-4">
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              My wife and I fell in love over our shared passion for art, music, and literature. We navigate the world through song lyrics and passages from books and poems, through images from our favorite artists. We speak to each other in these languages.
            </p>
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              So when we met on an online dating site, which is far less romantic than the story we prefer to tell, we immediately rewrote it. We say we met at an existential bookstore. She was reading Sartre, I was reading Camus, and we caught each other out of the corners of our eyes and struck up a conversation that changed everything.
            </p>
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              From that fictional meeting place, we imagined something larger: a real bookstore in a bucolic college town or artsy community. We envisioned an old downtown brick building we would renovate and fill with books, comfortable chairs, the smell of coffee, and jazz playing softly in the background. Our cats and dogs would curl up with guests. My wife would make exotic elixir drinks. It would be a sanctuary, a place of solace where art, music, and literature converge.
            </p>
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              For years, this place lived only in our minds—a magical realist dream. Now we are making it real. This website is the beginning of that dream. It is our way of curating the books and authors that shaped us, and inviting you into the world we have always imagined.
            </p>
          </div>
          <div className="clear-both" />
          </div>
        </section>

        {/* The Vision */}
        <section>
          <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
            The Vision
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            More Than Reviews
          </h2>
          <div className="space-y-4">
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              We&apos;re building more than a bookshelf. In the near future, The Existential Bookstore will offer personalized newsletter recommendations powered by an understanding of your reading taste—not just genres you like, but the themes, moods, and questions that move you.
            </p>
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              Eventually, we&apos;ll stock first editions and signed copies of the books we love most, sourced carefully and offered to readers who understand their value. But for now, every purchase link supports us through our affiliate partnerships.
            </p>
          </div>
        </section>

        {/* Why "Existential" */}
        <section>
          <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
            Why &ldquo;Existential&rdquo;
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            The Name Is a Question
          </h2>
          <div className="space-y-4">
            <p className="font-body text-base md:text-[17px] text-foreground leading-[1.85]">
              Because every great book is existential. Every act of reading is a choice to spend your finite time engaging with another consciousness. We believe that literature—at its best—doesn&apos;t just describe existence. It deepens it.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="mt-10 border-l-4 border-accent pl-6">
            <p className="font-display text-xl md:text-2xl italic text-foreground leading-snug">
              &ldquo;One must imagine the reader happy.&rdquo;
            </p>
            <footer className="mt-2 font-body text-sm text-muted-foreground">
              — with apologies to Camus
            </footer>
          </blockquote>
        </section>

      </div>
    </div>
  );
}
