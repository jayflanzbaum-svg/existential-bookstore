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
    .from('books')
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
    .from('books')
    .update({
      slug: body.slug,
      title: body.title,
      author: body.author,
      cover_url: body.cover_url,
      isbn: body.isbn,
      og_description: body.og_description,
      published_year: body.published_year,
      category: body.category,
      category_slug: body.category_slug,
      featured: body.featured,
      personalized: body.personalized,
      rating: body.rating,
      amazon_url: body.amazon_url,
      purchase_links: body.purchase_links,
      review: body.review,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { error } = await supabaseAdmin.from('books').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
