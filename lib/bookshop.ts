const AFFILIATE_ID = process.env.NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID || '122581';

/**
 * Returns the best Bookshop.org affiliate URL for a book.
 * - With ISBN: bookshop.org/a/{id}/{isbn}  → affiliate gets credit on any format purchase
 * - Without ISBN: search URL (no affiliate credit, but still functional)
 */
export function bookshopUrl(isbn?: string | null, title?: string): string {
  if (isbn) {
    const clean = isbn.replace(/[^0-9X]/gi, '');
    return `https://bookshop.org/a/${AFFILIATE_ID}/${clean}`;
  }
  return `https://bookshop.org/search?keywords=${encodeURIComponent(title ?? '')}`;
}
