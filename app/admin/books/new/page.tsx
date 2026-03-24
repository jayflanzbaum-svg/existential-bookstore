import Link from 'next/link';
import BookForm from '@/components/admin/BookForm';
import { supabaseAdmin } from '@/lib/supabase';

export default async function NewBookPage() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, slug, name')
    .order('name');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin/books" className="text-accent text-sm font-body hover:underline">← Books</Link>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Add New Book</h1>
        <div className="bg-card border border-border rounded-xl p-8">
          <BookForm categories={categories || []} />
        </div>
      </div>
    </div>
  );
}
