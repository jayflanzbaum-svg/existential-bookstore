import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'reviews');
const coversDir = path.join(process.cwd(), 'public', 'covers');

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

async function main() {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));
  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const destPath = path.join(coversDir, `${slug}.jpg`);

    if (fs.existsSync(destPath)) {
      skipped++;
      console.log(`  skip  ${slug}`);
      continue;
    }

    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const { data } = matter(raw);
    const coverUrl: string = data.coverUrl ?? '';

    if (!coverUrl) {
      failed++;
      failures.push(`${slug}: no coverUrl in frontmatter`);
      console.log(`  fail  ${slug} — no coverUrl`);
      continue;
    }

    try {
      // Use curl: follows redirects (-L), silent (-s), fail on HTTP error (-f),
      // write to file (-o), timeout 20s (--max-time)
      execSync(
        `curl -L -s -f --max-time 20 -o "${destPath}" "${coverUrl}"`,
        { stdio: 'pipe' }
      );

      const size = fs.existsSync(destPath) ? fs.statSync(destPath).size : 0;
      if (size < 1000) {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        throw new Error(`File too small (${size} bytes) — likely a placeholder`);
      }

      success++;
      console.log(`  ok    ${slug}`);
    } catch (err) {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${slug}: ${msg}`);
      console.log(`  fail  ${slug} — ${msg}`);
    }
  }

  console.log('\n── Results ───────────────────────────────');
  console.log(`  Downloaded: ${success}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Failed:     ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log(`  • ${f}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
