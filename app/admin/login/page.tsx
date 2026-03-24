'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-primary-foreground mb-2">
            The Existential Bookstore
          </h1>
          <p className="font-body text-primary-foreground/60 text-sm">Admin Area</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
          <h2 className="font-display text-xl font-bold text-foreground mb-2 text-center">
            Sign In
          </h2>
          <p className="font-body text-muted-foreground text-sm text-center mb-8">
            Access is restricted to the site owner.
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-4 py-3 mb-6 font-body text-center">
              Access denied. Only the authorized account may sign in.
            </div>
          )}

          <button
            onClick={() => signIn('github', { callbackUrl: '/admin' })}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-md bg-foreground text-background font-body font-medium hover:bg-foreground/90 transition-colors"
          >
            <Github size={18} />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
