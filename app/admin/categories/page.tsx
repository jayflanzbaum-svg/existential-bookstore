import Link from 'next/link';
import { Edit } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminCategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, slug, name, description, icon')
    .order('name');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Categories</h1>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(categories || []).map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-body font-medium text-foreground text-sm">{cat.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{cat.slug}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="font-body text-muted-foreground text-sm line-clamp-1">{cat.description}</p>
                  </td>
                  <td className="px-6 py-4">
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
      </div>
    </div>
  );
}
