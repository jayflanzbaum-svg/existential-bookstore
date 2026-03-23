import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(req.url);
  const slug = params.slug;

  const title =
    searchParams.get('title') ??
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  const author = searchParams.get('author') ?? '';
  const description = searchParams.get('desc') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #10224C 0%, #1D3972 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? '52px' : '64px',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        {/* Author */}
        {author && (
          <div
            style={{
              fontSize: '28px',
              color: '#74B1E7',
              marginBottom: '24px',
            }}
          >
            {author}
          </div>
        )}

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(245,240,232,0.65)',
              maxWidth: '860px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}

        {/* Site name */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '16px',
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          The Existential Bookstore
        </div>

        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '100%',
            height: '4px',
            backgroundColor: '#2385E7',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
