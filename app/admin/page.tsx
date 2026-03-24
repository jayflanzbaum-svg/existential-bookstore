import Link from 'next/link';
import { BookOpen, Star, Users, Grid, Clock, ArrowRight, PlusCircle } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

async function getStats() {
  const [books, featured, personalized, categories] = await Promise.all([
    supabaseAdmin.from('books').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('books').select('id', { count: 'exact', head: true }).eq('featured', true),
    supabaseAdmin.from('books').select('id', { count: 'exact', head: true }).eq('personalized', true),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
  ]);
  return {
    books: books.count ?? 0,
    featured: featured.count ?? 0,
    personalized: personalized.count ?? 0,
    categories: categories.count ?? 0,
  };
}

async function getRecentBooks() {
  const { data } = await supabaseAdmin
    .from('books')
    .select('id, slug, title, author, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function AdminDashboard() {
  const [stats, recentBooks] = await Promise.all([getStats(), getRecentBooks()]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-1">Admin Dashboard</h1>
          <p className="font-body text-muted-foreground">Manage your bookstore content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Books', value: stats.books, icon: BookOpen, href: '/admin/books' },
            { label: 'Featured', value: stats.featured, icon: Star, href: '/admin/books' },
            { label: 'Personalized', value: stats.personalized, icon: Users, href: '/admin/books' },
            { label: 'Categories', value: stats.categories, icon: Grid, href: '/admin/categories' },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent transition-colors"
            >
              <Icon size={22} className="text-accent mb-3" />
              <p className="font-display text-3xl font-bold text-foreground">{value}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/admin/books/new"
            className="flex items-center gap-3 bg-accent text-accent-foreground rounded-xl px-6 py-4 font-body font-medium hover:bg-accent/90 transition-colors"
          >
            <PlusCircle size={18} />
            Add New Book
          </Link>
          <Link
            href="/admin/books"
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 font-body font-medium hover:border-accent transition-colors"
          >
            <BookOpen size={18} className="text-accent" />
            Manage Books
          </Link>
          <Link
            href="/admin/newsletter"
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 font-body font-medium hover:border-accent transition-colors"
          >
            <Users size={18} className="text-accent" />
            Newsletter
          </Link>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Recently Updated</h2>
          </div>
          <div className="space-y-3">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-body font-medium text-foreground text-sm">{book.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{book.author}</p>
                </div>
                <Link
                  href={`/admin/books/${book.id}/edit`}
                  className="inline-flex items-center gap-1 text-accent text-xs font-body hover:underline"
                >
                  Edit <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
