import Link from 'next/link';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-lg mb-2">
              The Existential Bookstore
            </p>
            <p className="text-primary-foreground/60 text-sm font-body leading-relaxed">
              Books for the insatiably curious. A curated journey through the
              ideas that shape how we think and who we become.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4 font-body">
              Navigate
            </p>
            <ul className="space-y-2 text-sm font-body">
              {[
                { label: 'Categories', href: '/categories' },
                { label: 'About', href: '/about' },
                { label: 'Newsletter', href: '/newsletter' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4 font-body">
              Collections
            </p>
            <ul className="space-y-2 text-sm font-body">
              {[
                { label: 'Existentialism', href: '/categories/existentialism' },
                { label: 'Beat Generation', href: '/categories/beat-generation' },
                { label: 'Science Fiction', href: '/categories/science-fiction' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4 font-body">
              Connect
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1EBuXWNgnt/?mibextid=wwXIfr"
                aria-label="Facebook"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 pt-6 text-center text-xs text-primary-foreground/40 font-body">
          © 2026 The Existential Bookstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
