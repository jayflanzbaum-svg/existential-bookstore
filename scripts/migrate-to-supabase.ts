import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const contentDir = path.join(process.cwd(), 'content', 'reviews');
const coversDir = path.join(process.cwd(), 'public', 'covers');

function getLocalCoverUrl(slug: string, fallback: string): string {
  if (fs.existsSync(path.join(coversDir, `${slug}.jpg`))) {
    return `/covers/${slug}.jpg`;
  }
  return fallback;
}

async function migrateAuthors() {
  const authorsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'lib', 'authors.json'), 'utf-8')
  );
  console.log(`\nMigrating ${authorsData.length} authors...`);
  const { error } = await supabaseAdmin.from('authors').upsert(
    authorsData.map((a: { slug: string; name: string; bio: string }) => ({
      slug: a.slug,
      name: a.name,
      bio: a.bio || '',
    })),
    { onConflict: 'slug' }
  );
  if (error) {
    console.error('Authors error:', error.message);
    return false;
  }
  console.log(`✓ ${authorsData.length} authors upserted`);
  return true;
}

async function migrateCategories() {
  const categoriesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'lib', 'categories.json'), 'utf-8')
  );
  console.log(`\nMigrating ${categoriesData.length} categories...`);
  const { error } = await supabaseAdmin.from('categories').upsert(
    categoriesData.map((c: { slug: string; name: string; description: string; content: string; icon: string }) => ({
      slug: c.slug,
      name: c.name,
      description: c.description || '',
      content: c.content || '',
      icon: c.icon || 'Feather',
    })),
    { onConflict: 'slug' }
  );
  if (error) {
    console.error('Categories error:', error.message);
    return false;
  }
  console.log(`✓ ${categoriesData.length} categories upserted`);
  return true;
}

async function migrateBooks() {
  const slugs = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));

  console.log(`\nMigrating ${slugs.length} books...`);
  let ok = 0;
  let fail = 0;

  for (const slug of slugs) {
    const raw = fs.readFileSync(path.join(contentDir, `${slug}.mdx`), 'utf-8');
    const { data, content } = matter(raw);

    const coverUrl = getLocalCoverUrl(slug, data.coverUrl ?? '');

    const { error } = await supabaseAdmin.from('books').upsert(
      {
        slug,
        title: data.title ?? '',
        author: data.author ?? '',
        author_slugs: Array.isArray(data.authorSlugs) ? data.authorSlugs : [],
        cover_url: coverUrl,
        isbn: data.isbn ?? '',
        og_description: data.ogDescription ?? '',
        published_year: data.publishedYear ?? null,
        category: data.category ?? '',
        category_slug: data.categorySlug ?? '',
        featured: data.featured ?? false,
        personalized: data.personalized ?? false,
        rating: data.rating ?? 0,
        amazon_url: data.amazonUrl ?? '',
        purchase_links: Array.isArray(data.purchaseLinks) ? data.purchaseLinks : [],
        review: content,
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${slug}`);
      ok++;
    }
  }

  console.log(`\nBooks: ${ok} succeeded, ${fail} failed`);
  return fail === 0;
}

async function main() {
  console.log('Starting Supabase migration...');
  console.log('URL:', process.env.SUPABASE_URL);

  const authorsOk = await migrateAuthors();
  const categoriesOk = await migrateCategories();
  const booksOk = await migrateBooks();

  if (authorsOk && categoriesOk && booksOk) {
    console.log('\n✅ Migration complete — 0 errors');
  } else {
    console.error('\n❌ Migration finished with errors');
    process.exit(1);
  }
}

main();
