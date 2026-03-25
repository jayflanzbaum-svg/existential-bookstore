'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Search, Edit, BookOpen, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  cover_url: string;
  featured: boolean;
  personalized: boolean;
  published_year: number | null;
}

interface Author {
  id: string;
  slug: string;
  name: string;
  bio: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

type SortField = 'title' | 'author' | 'category' | 'published_year';
type SortDir = 'asc' | 'desc';
type Tab = 'books' | 'authors' | 'categories';
type StatusFilter = 'all' | 'featured' | 'personalized';

// ── Helpers ────────────────────────────────────────────────────────────────

function SortIcon({ field, active, dir }: { field: string; active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="ml-1 opacity-40" />;
  return dir === 'asc'
    ? <ChevronUp size={12} className="ml-1 text-accent" />
    : <ChevronDown size={12} className="ml-1 text-accent" />;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-5 rounded-full transition-colors relative ${on ? 'bg-accent' : 'bg-border'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

const thClass = 'px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider select-none';
const inputClass = 'px-3 py-2.5 bg-card border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:border-accent';

// ── Main component ─────────────────────────────────────────────────────────

export default function AdminBooksPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('books');

  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Authors / categories tab state
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [catsLoading, setCatsLoading] = useState(false);

  // Load books on mount; load authors/categories lazily on tab switch
  useEffect(() => {
    fetch('/api/admin/books')
      .then((r) => r.json())
      .then((d) => { setBooks(d); setBooksLoading(false); });
  }, []);

  useEffect(() => {
    if (tab === 'authors' && authors.length === 0 && !authorsLoading) {
      setAuthorsLoading(true);
      fetch('/api/admin/authors')
        .then((r) => r.json())
        .then((d) => { setAuthors(d); setAuthorsLoading(false); });
    }
    if (tab === 'categories' && categories.length === 0 && !catsLoading) {
      setCatsLoading(true);
      fetch('/api/admin/categories')
        .then((r) => r.json())
        .then((d) => { setCategories(d); setCatsLoading(false); });
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sort handler
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  // Toggle featured / personalized
  async function toggle(id: string, field: 'featured' | 'personalized', current: boolean) {
    await fetch(`/api/admin/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    });
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: !current } : b)));
  }

  // Delete book
  async function deleteBook(book: Book) {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/books/${book.id}`, { method: 'DELETE' });
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  }

  // Unique filter options derived from books list
  const uniqueCategories = useMemo(
    () => Array.from(new Set(books.map((b) => b.category).filter(Boolean))).sort(),
    [books]
  );
  const uniqueAuthors = useMemo(
    () => Array.from(new Set(books.map((b) => b.author).filter(Boolean))).sort(),
    [books]
  );

  // Filtered + sorted books
  const displayed = useMemo(() => {
    let result = books.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesCat = !catFilter || b.category === catFilter;
      const matchesAuthor = !authorFilter || b.author === authorFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'featured' && b.featured) ||
        (statusFilter === 'personalized' && b.personalized);
      return matchesSearch && matchesCat && matchesAuthor && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      const av = (a[sortField] ?? '') as string | number;
      const bv = (b[sortField] ?? '') as string | number;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [books, search, catFilter, authorFilter, statusFilter, sortField, sortDir]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Content</h1>
          <Link
            href="/admin/books/new"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-body font-medium hover:bg-accent/90 transition-colors text-sm"
          >
            <PlusCircle size={16} /> Add Book
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {([
            ['books', `Books (${books.length})`],
            ['authors', `Authors (${authors.length || '…'})`],
            ['categories', `Categories (${categories.length || '…'})`],
          ] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 font-body text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── BOOKS TAB ────────────────────────────────────────── */}
        {tab === 'books' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search title or author…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputClass} w-full pl-9`}
                />
              </div>

              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={inputClass}>
                <option value="">All Categories</option>
                {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className={inputClass}>
                <option value="">All Authors</option>
                {uniqueAuthors.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className={inputClass}>
                <option value="all">All Status</option>
                <option value="featured">Featured</option>
                <option value="personalized">Personalized</option>
              </select>
            </div>

            <p className="font-body text-xs text-muted-foreground mb-3">
              {displayed.length} of {books.length} books
            </p>

            {booksLoading ? (
              <p className="font-body text-muted-foreground">Loading…</p>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={`${thClass} text-left w-12`}>Cover</th>

                      <th className={`${thClass} text-left cursor-pointer`} onClick={() => handleSort('title')}>
                        <span className="inline-flex items-center">
                          Title <SortIcon field="title" active={sortField === 'title'} dir={sortDir} />
                        </span>
                      </th>

                      <th className={`${thClass} text-left cursor-pointer hidden md:table-cell`} onClick={() => handleSort('author')}>
                        <span className="inline-flex items-center">
                          Author <SortIcon field="author" active={sortField === 'author'} dir={sortDir} />
                        </span>
                      </th>

                      <th className={`${thClass} text-left cursor-pointer hidden lg:table-cell`} onClick={() => handleSort('category')}>
                        <span className="inline-flex items-center">
                          Category <SortIcon field="category" active={sortField === 'category'} dir={sortDir} />
                        </span>
                      </th>

                      <th className={`${thClass} text-center`}>Status</th>
                      <th className={`${thClass} text-center`}>Featured</th>
                      <th className={`${thClass} text-center`}>Personalized</th>
                      <th className={`${thClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((book) => (
                      <tr
                        key={book.id}
                        onClick={() => router.push(`/admin/books/${book.id}/edit`)}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        {/* Cover */}
                        <td className="px-4 py-3">
                          {book.cover_url ? (
                            <Image src={book.cover_url} alt={book.title} width={32} height={48} className="rounded object-cover" />
                          ) : (
                            <div className="w-8 h-12 bg-secondary rounded flex items-center justify-center">
                              <BookOpen size={14} className="text-muted-foreground" />
                            </div>
                          )}
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3">
                          <p className="font-body font-medium text-foreground text-sm line-clamp-1">{book.title}</p>
                        </td>

                        {/* Author */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="font-body text-muted-foreground text-sm">{book.author}</p>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="font-body text-muted-foreground text-sm">{book.category}</p>
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-green-500/15 text-green-600 dark:text-green-400">
                            published
                          </span>
                        </td>

                        {/* Featured toggle */}
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Toggle on={book.featured} onToggle={() => toggle(book.id, 'featured', book.featured)} />
                        </td>

                        {/* Personalized toggle */}
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Toggle on={book.personalized} onToggle={() => toggle(book.id, 'personalized', book.personalized)} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/books/${book.id}/edit`}
                              className="inline-flex items-center gap-1 text-accent text-xs font-body hover:underline"
                            >
                              <Edit size={12} /> Edit
                            </Link>
                            <button
                              onClick={() => deleteBook(book)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {displayed.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center font-body text-muted-foreground text-sm">
                          No books match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── AUTHORS TAB ──────────────────────────────────────── */}
        {tab === 'authors' && (
          <>
            {authorsLoading ? (
              <p className="font-body text-muted-foreground">Loading…</p>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={`${thClass} text-left`}>Name</th>
                      <th className={`${thClass} text-left hidden md:table-cell`}>Slug</th>
                      <th className={`${thClass} text-left hidden lg:table-cell`}>Bio</th>
                      <th className={`${thClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors.map((author) => (
                      <tr key={author.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-body font-medium text-foreground text-sm">{author.name}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="font-body text-muted-foreground text-xs font-mono">{author.slug}</p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="font-body text-muted-foreground text-sm line-clamp-1">{author.bio}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-body text-xs text-muted-foreground">—</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── CATEGORIES TAB ───────────────────────────────────── */}
        {tab === 'categories' && (
          <>
            {catsLoading ? (
              <p className="font-body text-muted-foreground">Loading…</p>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={`${thClass} text-left`}>Name</th>
                      <th className={`${thClass} text-left hidden md:table-cell`}>Icon</th>
                      <th className={`${thClass} text-left hidden lg:table-cell`}>Description</th>
                      <th className={`${thClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-body font-medium text-foreground text-sm">{cat.name}</p>
                          <p className="font-body text-xs text-muted-foreground font-mono">{cat.slug}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="font-body text-muted-foreground text-sm">{cat.icon}</p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="font-body text-muted-foreground text-sm line-clamp-1">{cat.description}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/categories/${cat.id}/edit`}
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
          </>
        )}

      </div>
    </div>
  );
}
