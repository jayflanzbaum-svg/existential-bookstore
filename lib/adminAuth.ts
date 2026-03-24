import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_GITHUB_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
