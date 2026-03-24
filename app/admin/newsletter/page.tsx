'use client';

import { useEffect, useState } from 'react';
import { Users, Send, Mail } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  creation_date: string;
}

export default function AdminNewsletterPage() {
  const [count, setCount] = useState<number | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/admin/newsletter/subscribers')
      .then((r) => r.json())
      .then((d) => setCount(d.count));

    fetch('/api/admin/newsletter/emails')
      .then((r) => r.json())
      .then((d) => setEmails(d.results || []));
  }, []);

  async function send() {
    if (!subject || !body) return;
    setSending(true);
    const res = await fetch('/api/admin/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
      setSubject('');
      setBody('');
    } else {
      alert('Failed to send');
    }
  }

  const inputClass = 'w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground focus:outline-none focus:border-accent';
  const labelClass = 'block font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Newsletter</h1>

        {/* Subscriber count */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 flex items-center gap-4">
          <Users size={32} className="text-accent" />
          <div>
            <p className="font-display text-4xl font-bold text-foreground">
              {count === null ? '—' : count}
            </p>
            <p className="font-body text-muted-foreground text-sm">Subscribers on Buttondown</p>
          </div>
        </div>

        {/* Compose */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8 space-y-5">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Mail size={18} className="text-accent" /> Compose Email
          </h2>

          {sent && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm rounded-md px-4 py-3 font-body">
              Email sent successfully!
            </div>
          )}

          <div>
            <label className={labelClass}>Subject</label>
            <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your email subject" />
          </div>
          <div>
            <label className={labelClass}>Body (Markdown supported)</label>
            <textarea
              className={`${inputClass} resize-y font-mono text-xs`}
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your newsletter content here..."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={send}
              disabled={sending || !subject || !body}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              <Send size={14} />
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>

        {/* Recent emails */}
        {emails.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Emails</h2>
            <div className="space-y-3">
              {emails.map((email) => (
                <div key={email.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <p className="font-body text-sm text-foreground">{email.subject}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(email.creation_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
