import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://existential-bookstore.vercel.app'
  ),
  title: {
    default: 'Existential Bookstore',
    template: '%s — Existential Bookstore',
  },
  description:
    'A curated collection of book reviews spanning existentialism, Beat Generation, magical realism, science fiction, and the philosophy of making things.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#1a1a2e', color: '#f5f0e8' }}>
        {children}
      </body>
    </html>
  );
}
