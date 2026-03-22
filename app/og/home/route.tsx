import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
            fontSize: '72px',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-1px',
          }}
        >
          Existential Bookstore
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#a09880',
            fontStyle: 'italic',
          }}
        >
          Books that make you question everything.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '80px',
            width: '60px',
            height: '3px',
            backgroundColor: '#6060a0',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
