-- ============================================================
-- Estern Birds — Supabase Database Setup
-- Run this SQL in your Supabase project's SQL Editor
-- Project: xirusglqbsijqqzzzuqk
-- ============================================================

-- Create the birds table
CREATE TABLE IF NOT EXISTS birds (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  species     TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  fun_fact    TEXT,
  price       TEXT,
  emoji       TEXT DEFAULT '🐦',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE birds ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read birds (public read access for the shop)
CREATE POLICY "Birds are publicly readable"
  ON birds
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can manage birds"
  ON birds
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed data — sample birds to get you started
-- Replace prices with your actual prices
-- ============================================================

INSERT INTO birds (name, species, description, image_url, fun_fact, price, emoji) VALUES
(
  'Blue Jay',
  'Cyanocitta cristata',
  'A bold and striking bird known for its vivid blue plumage and loud, assertive calls. Blue Jays are highly intelligent and make wonderful companions.',
  'public/images/birds/blue-jay.jpg',
  'Blue Jays can mimic the calls of hawks to scare away other birds from a food source.',
  'BDT 2,500',
  '🔵'
),
(
  'Northern Cardinal',
  'Cardinalis cardinalis',
  'One of the most recognizable birds, the male Northern Cardinal dazzles with brilliant red plumage. A stunning addition to any aviary.',
  'public/images/birds/cardinal.jpg',
  'Unlike most songbirds, female Northern Cardinals also sing — often while sitting on the nest.',
  'BDT 3,200',
  '❤️'
),
(
  'Ruby-throated Hummingbird',
  'Archilochus colubris',
  'These tiny aerial acrobats can hover in place and even fly backwards, beating their wings up to 80 times per second.',
  'public/images/birds/hummingbird.jpg',
  'A Ruby-throated Hummingbird''s heart beats up to 1,260 times per minute during flight.',
  'BDT 4,800',
  '💚'
),
(
  'American Goldfinch',
  'Spinus tristis',
  'Often called the "wild canary," the male American Goldfinch transforms into brilliant lemon-yellow in spring and summer.',
  'public/images/birds/goldfinch.jpg',
  'Goldfinches are strict vegetarians, feeding almost exclusively on seeds.',
  'BDT 1,800',
  '💛'
),
(
  'Painted Bunting',
  'Passerina ciris',
  'Arguably the most colorful bird in the world — a mosaic of vivid blue, green, and red. A true showpiece for any collection.',
  'public/images/birds/painted-bunting.jpg',
  'Painted Buntings are called "nonpareil" — French for "without equal" — for their unmatched beauty.',
  'BDT 6,500',
  '🎨'
),
(
  'Bald Eagle',
  'Haliaeetus leucocephalus',
  'A powerful raptor with a wingspan reaching up to 8 feet. Majestic and commanding — the king of birds.',
  'public/images/birds/bald-eagle.jpg',
  'Bald Eagles build the largest nests of any North American bird — some weigh over a ton.',
  'Contact for price',
  '🦅'
);

-- ============================================================
-- To add a new bird later, use:
-- ============================================================
-- INSERT INTO birds (name, species, description, image_url, fun_fact, price, emoji)
-- VALUES (
--   'Your Bird Name',
--   'Scientific name',
--   'Description of the bird...',
--   'public/images/birds/your-bird.jpg',
--   'An interesting fact...',
--   'BDT 0,000',
--   '🐦'
-- );
