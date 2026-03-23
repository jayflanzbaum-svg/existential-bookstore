import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Book Review';
  const author = searchParams.get('author') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#10224C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ color: '#f5f0e8', fontSize: '64px', fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ color: '#74B1E7', fontSize: '32px', marginTop: '24px' }}>
          {author}
        </div>
        <div style={{ color: '#888888', fontSize: '20px', marginTop: '40px' }}>
          The Existential Bookstore
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
