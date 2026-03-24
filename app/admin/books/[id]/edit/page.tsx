import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookForm from '@/components/admin/BookForm';
import { supabaseAdmin } from '@/lib/supabase';

interface Props {
  params: { id: string };
}

export default async function EditBookPage({ params }: Props) {
  const [{ data: book }, { data: categories }] = await Promise.all([
    supabaseAdmin.from('books').select('*').eq('id', params.id).single(),
    supabaseAdmin.from('categories').select('id, slug, name').order('name'),
  ]);

  if (!book) notFound();

  const initial = {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    cover_url: book.cover_url || '',
    isbn: book.isbn || '',
    og_description: book.og_description || '',
    published_year: book.published_year ? String(book.published_year) : '',
    category: book.category || '',
    category_slug: book.category_slug || '',
    featured: book.featured || false,
    personalized: book.personalized || false,
    rating: String(book.rating || 0),
    amazon_url: book.amazon_url || '',
    review: book.review || '',
    purchase_links: book.purchase_links || [],
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin/books" className="text-accent text-sm font-body hover:underline">← Books</Link>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Edit Book</h1>
        <p className="font-body text-muted-foreground text-sm mb-8">{book.title}</p>
        <div className="bg-card border border-border rounded-xl p-8">
          <BookForm initial={initial} categories={categories || []} />
        </div>
      </div>
    </div>
  );
}
