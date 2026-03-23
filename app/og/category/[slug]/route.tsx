import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(req.url);
  const slug = params.slug;

  const name =
    searchParams.get('name') ??
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  const description = searchParams.get('desc') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, hsl(222,65%,18%) 0%, hsl(220,60%,28%) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            color: 'hsl(210,80%,52%)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Collection
        </div>

        <div
          style={{
            fontSize: name.length > 30 ? '56px' : '72px',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '960px',
          }}
        >
          {name}
        </div>

        {description && (
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(245,240,232,0.7)',
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}

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

        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '100%',
            height: '4px',
            backgroundColor: 'hsl(210,80%,52%)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
