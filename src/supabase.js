import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

/*
  ============================================================
  SUPABASE SETUP INSTRUCTIONS
  ============================================================

  1. Create a Supabase project at https://supabase.com

  2. Add to your .env file:
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key

  3. Run these SQL queries in your Supabase SQL Editor:

  -- Products table
  CREATE TABLE products (
    id TEXT PRIMARY KEY,           -- product code like SAR001
    doc_id UUID DEFAULT gen_random_uuid() UNIQUE,
    title TEXT NOT NULL,
    collection TEXT NOT NULL,
    original_price NUMERIC NOT NULL DEFAULT 0,
    discounted_price NUMERIC,
    sizes TEXT[] DEFAULT '{}',
    occasion TEXT NOT NULL DEFAULT 'festive',
    style TEXT NOT NULL DEFAULT 'traditional',
    image TEXT NOT NULL DEFAULT '',
    images TEXT[] DEFAULT '{}',
    fabric TEXT,
    fit TEXT,
    care TEXT,
    stock TEXT,
    description TEXT,
    is_best_seller BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Collections table
  CREATE TABLE collections (
    doc_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    image TEXT DEFAULT '',
    count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable Row Level Security
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

  -- Allow public read
  CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
  CREATE POLICY "Public read collections" ON collections FOR SELECT USING (true);

  -- Allow authenticated users (admin) full access
  CREATE POLICY "Auth write products" ON products FOR ALL USING (auth.role() = 'authenticated');
  CREATE POLICY "Auth write collections" ON collections FOR ALL USING (auth.role() = 'authenticated');

  4. Storage bucket setup:
     - Create a bucket called "product-images" in Supabase Storage
     - Set it to Public
     - In bucket policies allow uploads for authenticated users

  5. Admin user:
     - Go to Authentication > Users > Invite User
     - Add your admin email and password
*/
