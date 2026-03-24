'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const ICONS = [
  'Feather', 'BookOpen', 'Radio', 'Briefcase', 'Scroll', 'Star', 'Globe',
  'Music', 'Brain', 'Compass', 'Flame', 'Heart', 'Lightbulb', 'Telescope',
  'Zap', 'Coffee', 'Mountain', 'Anchor',
];

interface CategoryData {
  id: string;
  slug: string;
  name: string;
  description: string;
  content: string;
  icon: string;
}

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<CategoryData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((r) => r.json())
      .then(setForm);
  }, [id]);

  function set(field: keyof CategoryData, value: string) {
    setForm((f) => f ? { ...f, [field]: value } : f);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin/categories');
      router.refresh();
    } else {
      alert('Save failed');
    }
  }

  if (!form) return <div className="p-8 font-body text-muted-foreground">Loading...</div>;

  const inputClass = 'w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:border-accent';
  const labelClass = 'block font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/categories" className="text-accent text-sm font-body hover:underline">← Categories</Link>
        <h1 className="font-display text-3xl font-bold text-foreground mt-2 mb-8">Edit Category</h1>

        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Icon</label>
              <select className={inputClass} value={form.icon} onChange={(e) => set('icon', e.target.value)}>
                {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Short Description</label>
            <input className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Content Essay (displayed on category page)</label>
            <textarea
              className={`${inputClass} resize-y`}
              rows={10}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
