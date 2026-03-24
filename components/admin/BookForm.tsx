'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';

interface PurchaseLink {
  tier: string;
  label: string;
  url: string;
  priceNote: string;
}

interface BookFormData {
  id?: string;
  slug: string;
  title: string;
  author: string;
  cover_url: string;
  isbn: string;
  og_description: string;
  published_year: string;
  category: string;
  category_slug: string;
  featured: boolean;
  personalized: boolean;
  rating: string;
  amazon_url: string;
  review: string;
  purchase_links: PurchaseLink[];
}

interface Props {
  initial?: Partial<BookFormData>;
  categories: { id: string; slug: string; name: string }[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function BookForm({ initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<BookFormData>({
    slug: '',
    title: '',
    author: '',
    cover_url: '',
    isbn: '',
    og_description: '',
    published_year: '',
    category: '',
    category_slug: '',
    featured: false,
    personalized: false,
    rating: '0',
    amazon_url: '',
    review: '',
    purchase_links: [],
    ...initial,
  });

  function set(field: keyof BookFormData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function onTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: f.id ? f.slug : slugify(title) }));
  }

  function onCategoryChange(slug: string) {
    const cat = categories.find((c) => c.slug === slug);
    setForm((f) => ({ ...f, category_slug: slug, category: cat?.name ?? '' }));
  }

  function addLink() {
    setForm((f) => ({
      ...f,
      purchase_links: [...f.purchase_links, { tier: 'softcover', label: 'Softcover', url: '', priceNote: '' }],
    }));
  }

  function updateLink(i: number, field: keyof PurchaseLink, value: string) {
    setForm((f) => {
      const links = [...f.purchase_links];
      links[i] = { ...links[i], [field]: value };
      return { ...f, purchase_links: links };
    });
  }

  function removeLink(i: number) {
    setForm((f) => ({ ...f, purchase_links: f.purchase_links.filter((_, j) => j !== i) }));
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      published_year: form.published_year ? parseInt(form.published_year) : null,
      rating: parseFloat(form.rating) || 0,
    };
    const url = form.id ? `/api/admin/books/${form.id}` : '/api/admin/books';
    const method = form.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin/books');
      router.refresh();
    } else {
      alert('Save failed');
    }
  }

  async function deleteBook() {
    setDeleting(true);
    await fetch(`/api/admin/books/${form.id}`, { method: 'DELETE' });
    router.push('/admin/books');
    router.refresh();
  }

  const inputClass = 'w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:border-accent';
  const labelClass = 'block font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Author</label>
          <input className={inputClass} value={form.author} onChange={(e) => set('author', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>ISBN</label>
          <input className={inputClass} value={form.isbn} onChange={(e) => set('isbn', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Cover URL</label>
          <input className={inputClass} value={form.cover_url} onChange={(e) => set('cover_url', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Amazon URL</label>
          <input className={inputClass} value={form.amazon_url} onChange={(e) => set('amazon_url', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Published Year</label>
          <input type="number" className={inputClass} value={form.published_year} onChange={(e) => set('published_year', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Rating (0–5)</label>
          <input type="number" min="0" max="5" step="0.1" className={inputClass} value={form.rating} onChange={(e) => set('rating', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={form.category_slug} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">— Select —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-6 pt-5">
          <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-accent" />
            Featured
          </label>
          <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
            <input type="checkbox" checked={form.personalized} onChange={(e) => set('personalized', e.target.checked)} className="accent-accent" />
            Personalized
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>OG Description <span className="normal-case text-muted-foreground/60">({form.og_description.length}/160)</span></label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          maxLength={160}
          value={form.og_description}
          onChange={(e) => set('og_description', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Review (Markdown)</label>
        <textarea
          className={`${inputClass} resize-y font-mono text-xs`}
          rows={16}
          value={form.review}
          onChange={(e) => set('review', e.target.value)}
        />
      </div>

      {/* Purchase links */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass}>Purchase Links</label>
          <button onClick={addLink} className="inline-flex items-center gap-1 text-accent text-xs font-body hover:underline">
            <PlusCircle size={12} /> Add link
          </button>
        </div>
        <div className="space-y-3">
          {form.purchase_links.map((link, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className={labelClass}>Tier</label>
                <input className={inputClass} value={link.tier} onChange={(e) => updateLink(i, 'tier', e.target.value)} placeholder="softcover" />
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input className={inputClass} value={link.label} onChange={(e) => updateLink(i, 'label', e.target.value)} placeholder="Softcover" />
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input className={inputClass} value={link.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelClass}>Price note</label>
                  <input className={inputClass} value={link.priceNote} onChange={(e) => updateLink(i, 'priceNote', e.target.value)} />
                </div>
                <button onClick={() => removeLink(i)} className="mb-0.5 text-muted-foreground hover:text-destructive transition-colors self-end pb-2">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          {form.id && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-destructive text-sm font-body hover:underline"
            >
              Delete book
            </button>
          )}
          {form.id && confirmDelete && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-body text-muted-foreground">Are you sure?</span>
              <button onClick={deleteBook} disabled={deleting} className="text-destructive text-sm font-body hover:underline font-medium">
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-muted-foreground text-sm font-body hover:underline">
                Cancel
              </button>
            </div>
          )}
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Create Book'}
        </button>
      </div>
    </div>
  );
}
