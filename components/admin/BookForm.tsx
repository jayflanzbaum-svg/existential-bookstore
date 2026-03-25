'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

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
}

interface Props {
  initial?: Partial<BookFormData>;
  categories: { id: string; slug: string; name: string }[];
}

// ── Personalization prompts ────────────────────────────────────────────────

const STEPS = [
  {
    id: 'scene' as const,
    title: 'Setting the Scene',
    prompt:
      'Where were you when you read this book — not just physically, but emotionally? What stage of life were you in? What was happening around you?',
    placeholder: 'I read this during a period when…',
  },
  {
    id: 'pull' as const,
    title: 'The Pull',
    prompt:
      "What drew you to this book in the first place? Was it a recommendation, a chance encounter on a shelf, something you'd been meaning to read for years?",
    placeholder: 'I came across this book when…',
  },
  {
    id: 'moment' as const,
    title: 'The Moment That Stayed',
    prompt:
      'What single scene, passage, or idea from this book has stayed with you the most? Why does it still surface in your mind?',
    placeholder: "The part I can't stop thinking about is…",
  },
  {
    id: 'shift' as const,
    title: 'The Shift',
    prompt:
      'How did this book change the way you think, feel, or see the world — even in a small way?',
    placeholder: 'After reading this, I…',
  },
  {
    id: 'passing' as const,
    title: 'Passing It On',
    prompt:
      "Who would you press this book into the hands of, and what would you say to convince them?",
    placeholder: "I'd give this to anyone who…",
  },
] as const;

type StepId = typeof STEPS[number]['id'];
type Answers = Record<StepId, string>;

// ── PersonalizeModal ───────────────────────────────────────────────────────

function PersonalizeModal({
  bookId,
  bookTitle,
  bookAuthor,
  existingReview,
  onComplete,
  onClose,
}: {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  existingReview: string;
  onComplete: (newReview: string) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    scene: '',
    pull: '',
    moment: '',
    shift: '',
    passing: '',
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function setAnswer(val: string) {
    setAnswers((a) => ({ ...a, [current.id]: val }));
  }

  async function submit() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/books/${bookId}/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, existingReview, bookTitle, bookAuthor }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Generation failed');
      }
      const { review } = await res.json();
      onComplete(review);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <span className="font-body font-semibold text-foreground text-sm">
              Personalize Review — <span className="text-muted-foreground font-normal">{bookTitle}</span>
            </span>
          </div>
          <button onClick={onClose} disabled={generating} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5 pb-2 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-accent' : i === step ? 'bg-accent/60' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <p className="px-6 pb-1 font-body text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>

        {/* Prompt */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-display text-xl font-bold text-foreground mb-1">{current.title}</h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">{current.prompt}</p>
        </div>

        {/* Textarea */}
        <div className="px-6 py-3 flex-1 overflow-y-auto">
          <textarea
            autoFocus
            value={answers[current.id]}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={current.placeholder}
            disabled={generating}
            rows={6}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
          <p className="mt-1.5 font-body text-xs text-muted-foreground/70">
            Write in your own words — your phrasing will be preserved as-is.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="px-6 pb-2 font-body text-xs text-destructive">{error}</p>
        )}

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0 || generating}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {isLast ? (
            <button
              onClick={submit}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-body font-semibold text-sm hover:bg-accent/90 disabled:opacity-60 transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate My Review
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-body font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── BookForm ───────────────────────────────────────────────────────────────

export default function BookForm({ initial, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
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
    <>
      {showPersonalize && form.id && (
        <PersonalizeModal
          bookId={form.id}
          bookTitle={form.title}
          bookAuthor={form.author}
          existingReview={form.review}
          onComplete={(newReview) => {
            setForm((f) => ({ ...f, review: newReview, personalized: true }));
            setShowPersonalize(false);
          }}
          onClose={() => setShowPersonalize(false)}
        />
      )}

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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium font-body text-foreground mb-1">Amazon URL</label>
            <input
              type="url"
              value={form.amazon_url}
              onChange={(e) => setForm((f) => ({ ...f, amazon_url: e.target.value }))}
              placeholder="https://www.amazon.com/dp/XXXXXXXXXX"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1 font-body">
              Use the clean dp/ format. The affiliate tag is added automatically.
            </p>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass + ' mb-0'}>Review</label>
            {form.id && (
              <button
                type="button"
                onClick={() => setShowPersonalize(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-md font-body text-xs font-semibold transition-colors"
              >
                <Sparkles size={12} />
                Personalize
              </button>
            )}
          </div>
          <textarea
            className={`${inputClass} resize-y font-mono text-xs`}
            rows={16}
            value={form.review}
            onChange={(e) => set('review', e.target.value)}
          />
          {form.personalized && (
            <p className="mt-1.5 font-body text-xs text-accent flex items-center gap-1">
              <Sparkles size={10} /> This review has been personalized.
            </p>
          )}
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
    </>
  );
}
