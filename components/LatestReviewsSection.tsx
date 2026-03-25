'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { Review } from '@/lib/reviews';

interface Props {
  reviews: Review[];
}

export default function LatestReviewsSection({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {reviews.map((review) => (
        <Link
          key={review.slug}
          href={`/reviews/${review.slug}`}
          className="group flex-shrink-0 w-48 md:w-52 flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
          {/* Cover */}
          <div className="relative bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 p-4 flex items-center justify-center h-52">
            {review.coverUrl ? (
              <Image
                src={review.coverUrl}
                alt={review.title}
                width={96}
                height={144}
                className="w-24 h-36 object-cover rounded-md shadow-lift group-hover:scale-[1.03] transition-transform duration-300"
              />
            ) : (
              <div className="w-24 h-36 flex items-center justify-center bg-secondary rounded-md">
                <BookOpen size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="p-4 flex flex-col flex-1">
            <p className="font-display text-sm font-bold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {review.title}
            </p>
            <p className="text-muted-foreground font-body text-xs mt-1 line-clamp-1">
              {review.author}
            </p>
            <span className="inline-flex items-center gap-1 text-accent text-xs font-medium mt-auto pt-3 group-hover:gap-1.5 transition-all font-body">
              Read <ArrowRight size={11} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
