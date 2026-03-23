import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
        <div
          style={{
            width: '60px',
            height: '3px',
            backgroundColor: '#2385E7',
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
            backgroundColor: '#2385E7',
            marginBottom: '24px',
          }}
        />
        <div
          style={{
            fontSize: '32px',
            color: '#74B1E7',
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
