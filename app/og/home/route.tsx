import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
            width: '60px',
            height: '3px',
            backgroundColor: 'hsl(210,80%,52%)',
            marginBottom: '32px',
          }}
        />
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-1px',
            maxWidth: '960px',
          }}
        >
          The Existential Bookstore
        </div>
        <div
          style={{
            width: '60px',
            height: '3px',
            backgroundColor: 'hsl(210,80%,52%)',
            marginBottom: '24px',
          }}
        />
        <div
          style={{
            fontSize: '32px',
            color: 'hsl(208,70%,68%)',
            letterSpacing: '1px',
          }}
        >
          Books for the Insatiably Curious
        </div>
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
          existentialbookstore.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
