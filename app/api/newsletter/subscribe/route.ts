import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Newsletter service not configured' }, { status: 500 });
  }

  const res = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email.trim().toLowerCase(),
      ...(name?.trim() ? { metadata: { name: name.trim() } } : {}),
    }),
  });

  // Buttondown returns 400 with "already subscribed" — treat as success
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}));
    const msg: string = JSON.stringify(body).toLowerCase();
    if (msg.includes('already') || msg.includes('exist') || msg.includes('duplicate')) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
