import type { PurchaseLink } from '@/lib/reviews';

const TIER_LABELS: Record<string, string> = {
  softcover: 'Softcover',
  hardcover: 'Hardcover',
  first_edition: 'First Edition',
  signed_copy: 'Signed Copy',
};

interface Props {
  purchaseLinks: PurchaseLink[];
}

export default function PurchaseLinks({ purchaseLinks }: Props) {
  if (!purchaseLinks || purchaseLinks.length === 0) return null;

  return (
    <div>
      <p className="font-body text-sm font-medium text-foreground mb-3">
        Find this book:
      </p>
      <div className="flex flex-wrap gap-3">
        {purchaseLinks.map((link) => (
          <div key={link.tier} className="flex flex-col items-start gap-1">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-md border border-accent text-accent text-sm font-body font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {TIER_LABELS[link.tier] ?? link.label}
            </a>
            {link.priceNote && (
              <span className="text-xs text-muted-foreground font-body">
                {link.priceNote}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
