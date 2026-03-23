'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Review } from '@/lib/reviews';

interface Props {
  reviews: Review[];
}

export default function LatestReviewsSection({ reviews }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {reviews.map((review, i) => (
        <motion.div
          key={review.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.15 }}
          className="h-full"
        >
          <Link
            href={`/reviews/${review.slug}`}
            className="group block h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              {/* Top half — cover */}
              <div className="relative bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 p-5 flex items-center justify-center">
                {review.localCoverUrl ? (
                  <Image
                    src={review.localCoverUrl}
                    alt={review.title}
                    width={112}
                    height={160}
                    className="w-28 h-40 object-cover rounded-lg shadow-lift group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-28 h-40 flex items-center justify-center bg-secondary rounded-lg">
                    <BookOpen size={40} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Bottom half — meta */}
              <div className="flex-1 p-5 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold font-body mb-3">
                  <Sparkles size={12} />
                  Editor&apos;s Pick
                </span>

                <p className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                  {review.title}
                </p>

                <p className="text-muted-foreground font-body text-sm mt-1.5">
                  {review.author}
                </p>

                <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed line-clamp-2">
                  {review.ogDescription}
                </p>

                <span className="inline-flex items-center gap-1.5 text-accent text-sm font-medium mt-4 group-hover:gap-2.5 transition-all font-body">
                  Read the review
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
