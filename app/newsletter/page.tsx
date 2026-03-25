'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Mail, ArrowLeft } from 'lucide-react';

const PERKS = [
  {
    icon: BookOpen,
    title: 'New Reviews',
    description: 'First look at every new book we add to the collection, with full personalized reviews.',
  },
  {
    icon: Sparkles,
    title: 'Curated Selections',
    description: 'Themed reading lists built around ideas, moods, and moments — not algorithms.',
  },
  {
    icon: Mail,
    title: 'Dispatches from the Stacks',
    description: 'Occasional personal notes on what I\'m reading, thinking about, and recommending to people I care about.',
  },
];

export default function NewsletterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="gradient-navy py-20 text-center px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm font-body mb-10 transition-colors"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-light font-body font-semibold mb-3">
          Stay Connected
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Join the Reading Circle
        </h1>
        <p className="font-body text-primary-foreground/70 max-w-lg mx-auto text-base leading-relaxed">
          A newsletter for people who take their reading seriously — and personally.
          No filler, no algorithms, no ads.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left — perks */}
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              What you&apos;ll get
            </h2>
            <div className="space-y-6">
              {PERKS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 font-body text-xs text-muted-foreground/60 leading-relaxed">
              No spam. Unsubscribe any time. Your email stays private.
            </p>
          </div>

          {/* Right — form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  You&apos;re in!
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  Check your inbox to confirm your subscription. Welcome to the Reading Circle.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 mt-6 text-accent text-sm font-body font-medium hover:underline"
                >
                  <ArrowLeft size={13} /> Back to the bookstore
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-foreground mb-1">
                  Subscribe
                </h2>
                <p className="font-body text-muted-foreground text-sm mb-6">
                  Free. No obligations. Just good books.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      First name <span className="normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jay"
                      disabled={status === 'loading'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={status === 'loading'}
                      className={inputClass}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="font-body text-xs text-destructive">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-body font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Subscribing…' : 'Join the Reading Circle'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
