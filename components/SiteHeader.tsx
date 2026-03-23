'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, User } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
];

function Wordmark() {
  return (
    <svg
      viewBox="0 0 465 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="The Existential Bookstore"
      role="img"
      style={{
        height: 'clamp(32px, 6vw, 64px)',
        width: 'auto',
        maxWidth: 'min(92vw, 700px)',
        display: 'block',
      }}
    >
      <text
        x="2"
        y="30"
        fill="hsl(var(--primary-foreground))"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="26"
        transform="rotate(-8, 20, 30)"
      >
        the
      </text>
      <text
        x="42"
        y="40"
        fill="hsl(var(--primary-foreground))"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="36"
        letterSpacing="3"
      >
        EXISTENTIAL
      </text>
      <text
        x="322"
        y="40"
        fill="hsl(var(--primary-foreground))"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontWeight="300"
        fontSize="18"
        letterSpacing="4"
      >
        BOOKSTORE
      </text>
    </svg>
  );
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-body font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/newsletter"
            className="rounded-md border border-primary-foreground/40 px-3 py-1.5 text-sm font-body text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            Newsletter
          </Link>
          <button
            aria-label="Search"
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Account"
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <User size={18} />
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-primary border-t border-primary-foreground/10 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-primary-foreground/80 hover:text-primary-foreground py-2 text-base font-body transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground py-2 text-base font-body transition-colors"
              >
                Newsletter
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
