-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  bio text DEFAULT ''
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  icon text DEFAULT 'Feather'
);

-- Books
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  author_slugs jsonb DEFAULT '[]',
  cover_url text DEFAULT '',
  isbn text DEFAULT '',
  og_description text DEFAULT '',
  published_year integer,
  category text DEFAULT '',
  category_slug text DEFAULT '',
  featured boolean DEFAULT false,
  personalized boolean DEFAULT false,
  rating numeric DEFAULT 0,
  amazon_url text DEFAULT '',
  purchase_links jsonb DEFAULT '[]',
  review text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Junction tables
CREATE TABLE IF NOT EXISTS book_authors (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  author_id uuid REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE IF NOT EXISTS book_categories (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (book_id, category_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: public read, service role write
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Service write books" ON books FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Service write authors" ON authors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Service write categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read book_authors" ON book_authors FOR SELECT USING (true);
CREATE POLICY "Service write book_authors" ON book_authors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read book_categories" ON book_categories FOR SELECT USING (true);
CREATE POLICY "Service write book_categories" ON book_categories FOR ALL USING (auth.role() = 'service_role');
