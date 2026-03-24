import { ExternalLink } from 'lucide-react';
import type { PurchaseLink } from '@/lib/reviews';
import { addAffiliateTag } from '@/lib/amazon';

interface Props {
  purchaseLinks: PurchaseLink[];
  amazonUrl?: string;
}

export default function PurchaseLinks({ purchaseLinks, amazonUrl }: Props) {
  const firstEdition = purchaseLinks?.find((l) => l.tier === 'first_edition');
  const otherLinks = purchaseLinks?.filter(
    (l) => l.tier !== 'first_edition' && l.tier !== 'softcover' && l.tier !== 'hardcover'
  ) ?? [];

  const hasAny = amazonUrl || firstEdition || otherLinks.length > 0;
  if (!hasAny) return null;

  return (
    <div>
      <p className="font-body text-sm font-medium text-foreground mb-3">
        Find this book:
      </p>
      <div className="flex flex-wrap gap-3">
        {amazonUrl && (
          <a
            href={addAffiliateTag(amazonUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-body font-semibold transition-colors"
          >
            Buy on Amazon
            <ExternalLink size={14} />
          </a>
        )}

        {firstEdition && (
          <a
            href={firstEdition.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--coral))] hover:bg-[hsl(var(--coral)/.85)] text-white text-sm font-body font-semibold transition-colors"
          >
            First Edition (Check availability)
            <ExternalLink size={14} />
          </a>
        )}

        {otherLinks.map((link) => (
          <a
            key={link.tier}
            href={addAffiliateTag(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-body font-semibold transition-colors"
          >
            {link.label || link.tier}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
