# 🦅 Estern Birds

A beautiful, responsive bird shop website built with vanilla HTML, CSS, and JavaScript.
Deployed on **Vercel** via **GitHub**, with **Supabase** as the backend database.

WhatsApp: **01711667746**

---

## Project Structure

```
bird-website/
├── public/
│   └── images/
│       └── birds/          ← Drop your bird photos here
│           └── .gitkeep
├── index.html              ← Main page
├── styles.css              ← All styling
├── script.js               ← Interactivity + Supabase integration
├── supabase-setup.sql      ← SQL to create the Supabase table
├── .gitignore
└── README.md
```

---

## Step 1 — Get Your Supabase Anon Key

Your connection string gives the DB password, but the website needs the **anon public key**:

1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Project Settings** → **API**
3. Copy the **anon public** key (starts with `eyJ...`)
4. Open `script.js` and replace `PASTE_YOUR_ANON_PUBLIC_KEY_HERE` with it

Your project URL is already set: `https://xirusglqbsijqqzzzuqk.supabase.co`

---

## Step 2 — Set Up the Database

1. Go to your Supabase project → **SQL Editor**
2. Paste and run the contents of `supabase-setup.sql`
3. This creates the `birds` table with `price` and `emoji` columns and seeds 6 sample birds

---

## Step 3 — Add Your Bird Photos

Drop photos into `public/images/birds/` using these filenames:

| Bird                      | Filename                  |
|---------------------------|---------------------------|
| Blue Jay                  | `blue-jay.jpg`            |
| Northern Cardinal         | `cardinal.jpg`            |
| Ruby-throated Hummingbird | `hummingbird.jpg`         |
| American Goldfinch        | `goldfinch.jpg`           |
| Painted Bunting           | `painted-bunting.jpg`     |
| Bald Eagle                | `bald-eagle.jpg`          |

The site shows a placeholder emoji until photos are added.

---

## Step 4 — Deploy to Vercel via GitHub

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Vercel auto-detects a static site — no configuration needed
4. Click **Deploy** — done!

> After deploying, update bird `image_url` values in Supabase to use full URLs
> (e.g. `https://your-project.vercel.app/public/images/birds/blue-jay.jpg`)
> or upload images to Supabase Storage and use those URLs instead.

---

## Step 5 — Add More Birds

In the Supabase Table Editor, or via SQL:

```sql
INSERT INTO birds (name, species, description, image_url, fun_fact, price, emoji)
VALUES (
  'Cockatiel',
  'Nymphicus hollandicus',
  'A friendly and affectionate parrot, perfect for families. Known for its cheerful whistling.',
  'public/images/birds/cockatiel.jpg',
  'Cockatiels can learn to whistle tunes and even mimic speech.',
  'BDT 3,500',
  '🦜'
);
```

---

## Supabase Table Schema

| Column       | Type        | Notes                          |
|--------------|-------------|--------------------------------|
| `id`         | bigserial   | Primary key, auto-increment    |
| `name`       | text        | Common name (e.g. "Blue Jay")  |
| `species`    | text        | Scientific name                |
| `description`| text        | Paragraph description          |
| `image_url`  | text        | Path or full URL to photo      |
| `fun_fact`   | text        | One interesting fact           |
| `price`      | text        | e.g. "BDT 2,500" or "Contact" |
| `emoji`      | text        | Emoji icon for the bird        |
| `created_at` | timestamptz | Auto-set on insert             |

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES2020+)
- **Fonts:** Google Fonts — Playfair Display + Lato
- **Backend:** Supabase (PostgreSQL + REST API)
- **Hosting:** Vercel
- **Version Control:** GitHub
- **Contact:** WhatsApp 01711667746
