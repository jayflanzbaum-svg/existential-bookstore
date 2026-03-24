import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const res = await fetch('https://api.buttondown.email/v1/emails?page_size=10', {
    headers: { Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}` },
  });
  if (!res.ok) return NextResponse.json({ results: [] }, { status: 200 });
  const data = await res.json();
  return NextResponse.json({ results: data.results ?? [] });
}
