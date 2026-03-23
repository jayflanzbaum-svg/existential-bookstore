'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather, Sparkles, Ghost, Wand2, Rocket, Scroll, Hammer, Radio, Music, Briefcase, Heart, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Feather,
  Sparkles,
  Ghost,
  Wand2,
  Rocket,
  Scroll,
  Hammer,
  Radio,
  Music,
  Briefcase,
  Heart,
  Compass,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  description: string;
  bookCount: number;
  index?: number;
  variant?: 'card' | 'muted';
}

export default function CategoryCard({
  name,
  slug,
  icon,
  description,
  bookCount,
  index = 0,
  variant = 'card',
}: CategoryCardProps) {
  const Icon = iconMap[icon] ?? Feather;
  const bg = variant === 'muted' || index % 2 === 1 ? 'bg-muted' : 'bg-card';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link href={`/categories/${slug}`} className="group block h-full">
        <div
          className={`relative h-full ${bg} border border-border rounded-lg p-6 shadow-editorial hover:shadow-lift transition-shadow duration-300`}
        >
          {/* Arrow top-right */}
          <div className="absolute top-4 right-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200">
            <ArrowRight size={16} />
          </div>

          {/* Icon */}
          <div className="mb-4 text-accent">
            <Icon size={28} />
          </div>

          {/* Name */}
          <p className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
            {name}
          </p>

          {/* Description */}
          <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>

          {/* Book count badge */}
          {bookCount > 0 && (
            <span className="inline-block border border-accent text-accent text-xs font-body px-2.5 py-0.5 rounded-full">
              {bookCount} {bookCount === 1 ? 'book' : 'books'}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
