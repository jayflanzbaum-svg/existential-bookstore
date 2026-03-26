import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.log('[newsletter] BUTTONDOWN_API_KEY is not set');
    return NextResponse.json({ error: 'Newsletter service not configured' }, { status: 500 });
  }

  const payload = {
    email_address: email.trim().toLowerCase(),
    ...(name?.trim() ? { metadata: { name: name.trim() } } : {}),
  };
  console.log('[newsletter] POST /v1/subscribers payload:', JSON.stringify(payload));

  const res = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  console.log('[newsletter] Buttondown POST status:', res.status, 'body:', JSON.stringify(body));

  if (res.ok) {
    return NextResponse.json({ ok: true });
  }

  // Handle re-subscribe: previously-removed subscriber comes back as 400
  // Try PATCH to reactivate them
  if (res.status === 400) {
    const msg = JSON.stringify(body).toLowerCase();

    if (msg.includes('already') || msg.includes('exist') || msg.includes('duplicate')) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    // Attempt PATCH to re-subscribe a previously removed subscriber
    console.log('[newsletter] Attempting PATCH re-subscribe for:', email.trim().toLowerCase());
    const patchRes = await fetch(
      `https://api.buttondown.email/v1/subscribers/${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'regular' }),
      }
    );
    const patchBody = await patchRes.json().catch(() => ({}));
    console.log('[newsletter] Buttondown PATCH status:', patchRes.status, 'body:', JSON.stringify(patchBody));

    // Always return success to the user regardless of PATCH result
    return NextResponse.json({ ok: true });
  }

  console.log('[newsletter] Unexpected error from Buttondown:', res.status, JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
