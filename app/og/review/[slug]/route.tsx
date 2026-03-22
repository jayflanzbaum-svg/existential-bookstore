import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Decode slug into a readable title (fallback if we can't read the file in edge)
  const slug = params.slug;
  const titleFromSlug = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // We pass title/author as query params so the edge runtime can render them
  // The review page sets the image URL as /og/review/[slug]?title=...&author=...
  // However, since the metadata uses a plain URL, we derive from slug as fallback.
  const url = new URL(_req.url);
  const title = url.searchParams.get('title') ?? titleFromSlug;
  const author = url.searchParams.get('author') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#1a1a2e',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-1px',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        {author && (
          <div
            style={{
              fontSize: '32px',
              color: '#a09880',
              marginBottom: '16px',
            }}
          >
            {author}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '80px',
            fontSize: '20px',
            color: '#6060a0',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Existential Bookstore
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
