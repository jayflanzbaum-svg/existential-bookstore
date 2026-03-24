import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from('books')
    .select('id, slug, title, author, category, cover_url, featured, personalized')
    .order('title');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { error, data } = await supabaseAdmin
    .from('books')
    .insert({
      slug: body.slug,
      title: body.title,
      author: body.author,
      author_slugs: body.author_slugs || [],
      cover_url: body.cover_url || '',
      isbn: body.isbn || '',
      og_description: body.og_description || '',
      published_year: body.published_year || null,
      category: body.category || '',
      category_slug: body.category_slug || '',
      featured: body.featured || false,
      personalized: body.personalized || false,
      rating: body.rating || 0,
      amazon_url: body.amazon_url || '',
      purchase_links: body.purchase_links || [],
      review: body.review || '',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
