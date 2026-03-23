'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  slug: string;
  coverUrl?: string;
  rating: number;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((filled, i) => (
        <Star
          key={i}
          size={12}
          className={filled ? 'fill-coral text-coral' : 'text-muted-foreground'}
          style={filled ? { color: 'hsl(var(--coral))', fill: 'hsl(var(--coral))' } : {}}
        />
      ))}
    </div>
  );
}

export default function BookCard({
  title,
  author,
  slug,
  coverUrl,
  rating,
  index = 0,
}: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link href={`/reviews/${slug}`} className="group block">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-editorial hover:shadow-lift transition-shadow duration-300">
          {/* Cover image — 2:3 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '150%' }}>
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`${title} by ${author}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 gradient-navy flex flex-col items-center justify-center p-4 text-center">
                <p className="font-display text-sm font-semibold text-primary-foreground leading-snug mb-1">
                  {title}
                </p>
                <p className="font-body text-xs text-primary-foreground/60">
                  {author}
                </p>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-3">
            <p className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug mb-0.5 line-clamp-2">
              {title}
            </p>
            <p className="font-body text-xs text-muted-foreground mb-2">{author}</p>
            <StarRating rating={rating} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
