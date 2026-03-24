import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminAuth';

interface Props {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Props) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { error, data } = await supabaseAdmin
    .from('categories')
    .update({
      slug: body.slug,
      name: body.name,
      description: body.description,
      content: body.content,
      icon: body.icon,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
