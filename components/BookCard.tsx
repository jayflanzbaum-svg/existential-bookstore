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
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link href={`/reviews/${slug}`} className="group block h-full">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-editorial hover:shadow-lift transition-all duration-300 h-full flex flex-col">
          {/* Cover — 2:3 aspect ratio */}
          <div className="aspect-[2/3] overflow-hidden flex-shrink-0">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`${title} by ${author}`}
                width={300}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="w-full h-full gradient-navy flex flex-col items-center justify-center p-4 text-center">
                <p className="font-display text-sm font-semibold text-primary-foreground leading-snug mb-1">
                  {title}
                </p>
                <p className="font-body text-xs text-primary-foreground/60">{author}</p>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-1 truncate">{author}</p>
            <div className="flex items-center gap-1 mt-auto pt-2">
              <Star className="h-3.5 w-3.5 fill-coral text-coral" style={{ color: 'hsl(var(--coral))', fill: 'hsl(var(--coral))' }} />
              <span className="text-xs font-body text-foreground font-medium">
                {rating > 0 ? rating.toFixed(1) : '—'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
