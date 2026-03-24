export function addAffiliateTag(url: string): string {
  if (!url) return url;
  const associateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || 'existential0d-20';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('amazon.com')) {
      parsed.searchParams.set('tag', associateId);
      return parsed.toString();
    }
    if (parsed.hostname.includes('abebooks.com')) {
      // AbeBooks uses a different affiliate program - leave unchanged for now
      return url;
    }
    return url;
  } catch {
    return url;
  }
}
