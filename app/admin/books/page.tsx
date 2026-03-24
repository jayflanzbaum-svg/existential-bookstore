'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Search, Edit, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  cover_url: string;
  featured: boolean;
  personalized: boolean;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/books')
      .then((r) => r.json())
      .then((data) => { setBooks(data); setLoading(false); });
  }, []);

  async function toggle(id: string, field: 'featured' | 'personalized', current: boolean) {
    await fetch(`/api/admin/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    });
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: !current } : b))
    );
  }

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Books</h1>
            <p className="font-body text-muted-foreground text-sm mt-1">{books.length} total</p>
          </div>
          <Link
            href="/admin/books/new"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-body font-medium hover:bg-accent/90 transition-colors text-sm"
          >
            <PlusCircle size={16} /> Add Book
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>

        {loading ? (
          <p className="font-body text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Cover</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="text-center px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Featured</th>
                  <th className="text-center px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Personal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          width={32}
                          height={48}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-12 bg-secondary rounded flex items-center justify-center">
                          <BookOpen size={14} className="text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body font-medium text-foreground text-sm line-clamp-1">{book.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-body text-muted-foreground text-sm">{book.author}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="font-body text-muted-foreground text-sm">{book.category}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(book.id, 'featured', book.featured)}
                        className={`w-10 h-5 rounded-full transition-colors ${book.featured ? 'bg-accent' : 'bg-border'}`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${book.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(book.id, 'personalized', book.personalized)}
                        className={`w-10 h-5 rounded-full transition-colors ${book.personalized ? 'bg-accent' : 'bg-border'}`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${book.personalized ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="inline-flex items-center gap-1 text-accent text-xs font-body hover:underline"
                      >
                        <Edit size={12} /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
