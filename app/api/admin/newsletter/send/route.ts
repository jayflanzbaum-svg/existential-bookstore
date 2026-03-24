import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { subject, body } = await req.json();
  if (!subject || !body) {
    return NextResponse.json({ error: 'subject and body are required' }, { status: 400 });
  }

  const res = await fetch('https://api.buttondown.email/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, body }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
