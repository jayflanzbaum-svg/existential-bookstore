import type { Metadata } from 'next';
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

const sections = [
  {
    label: 'My Story',
    heading: 'It Started With the Hardy Boys',
    body: [
      'Before I understood what a book was — before I had any framework for what reading could do — I was already hooked. The Hardy Boys. Encyclopedia Brown. The Boxcar Children. My parents had arranged them on a low shelf in my bedroom, and I worked through them the way other children worked through puzzles: methodically, with a pleasure that was partly the story and partly the texture of the pages.',
      'Then came the school book fair, which I remember as one of the genuinely ceremonial occasions of childhood. The gymnasium lined with folding tables, the paperbacks arranged by color and size, the smell of new books mixed with the industrial cleaner they used on the gym floor. I would arrive with a carefully budgeted amount and leave with more than I could carry. The books changed every year; the feeling never did.',
      'By high school I had found the section of the library that no one else seemed to use: the philosophy shelves, the cultural criticism, the books that seemed to be in conversation with each other across decades. I did not always understand what I was reading. I kept reading anyway. The not-understanding felt important, like a door I was learning to lean against.',
    ],
  },
  {
    label: 'How We Got Here',
    heading: 'A Shared Shelf, a Shared Life',
    body: [
      'I met my wife in college, in a seminar on postwar American literature. She was reading Pynchon for pleasure. I knew immediately that we would be spending our lives together.',
      'We spent years imagining a bookstore. Not the kind that exists as a business plan or a spreadsheet — the imaginary kind, the kind that lives in conversation. A small shop in a college town, we said. A place with armchairs and a cat and a back room for events. A place organized not by genre but by question: books about solitude together with books about connection; books about making things across the aisle from books about understanding them.',
      'The physical bookstore remains imaginary. But the project of curating — of reading widely and saying clearly what a book does and why it matters — that is real, and it is this site.',
    ],
  },
  {
    label: 'The Vision',
    heading: 'More Than Reviews',
    body: [
      'The Existential Bookstore is a reading journal made public. It began as notes I kept for myself — the kind of record that lets you go back and remember not just what a book said but what it felt like to read it, and what was happening in your life when you did.',
      'Over time it has become something more deliberate. I want to build a space where book recommendations are genuinely personal — not algorithmic, not driven by affiliate economics, but shaped by the kind of reading that changes how you think. The newsletter is where that conversation happens in its most direct form: a dispatch from one reader to another, honest about what worked and what didn\'t.',
      'There are larger ambitions: first editions, a physical presence someday, partnerships with independent bookstores whose values I trust. But the core of it is simpler than any of that. I want to tell you about books worth reading, and tell you why they are worth reading, and trust you to decide what to do with that information.',
    ],
  },
  {
    label: 'Why "Existential"',
    heading: 'The Name Is a Question',
    body: [
      'People sometimes ask whether the name means this is a site about existentialist philosophy specifically. It is not — though existentialism is well represented in the catalog, because it is a tradition that has mattered to me.',
      'The name is an adjective applied more broadly. An existential question is one that concerns the conditions of existence itself: how to live, what to value, what to do with the fact of being conscious and finite and capable of both great cruelty and great tenderness. Not every book asks these questions explicitly. But the books I return to tend to ask them, or to model a way of being in the world that implies an answer.',
      'There is also something I mean by "existential" that is more personal. A reading life is a life examined through other lives. Every book you read seriously is a negotiation between their experience and yours — a testing of your assumptions against a mind that had different ones. That negotiation is, I think, one of the better things a person can do with the time they have.',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero strip */}
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

      {/* Editorial sections */}
      <div className="container mx-auto px-4 md:px-6 max-w-2xl py-16 space-y-16">
        {sections.map((section) => (
          <section key={section.label}>
            <p className="text-xs uppercase tracking-widest text-accent font-body mb-2">
              {section.label}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.body.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-base md:text-[17px] text-foreground leading-[1.85]"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
