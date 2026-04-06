# mtthemes

> A fan project for sharing custom Monkeytype themes. Not endorsed or promoted by miodec.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (Postgres + Row Level Security)
- **Hosting**: Vercel
- **No server needed** — Supabase handles everything, keys are locked behind Vercel env vars.

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase_schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Local dev

```bash
# Clone and install
npm install

# Create your local env file
cp .env.example .env.local
# Fill in your Supabase URL and anon key in .env.local

npm run dev
# → http://localhost:3000
```

### 3. Deploy to Vercel

1. Push this repo to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. In your Vercel project → **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
4. Deploy — done!

> ⚠️ Never commit `.env.local`. It's gitignored by default in Next.js.
> The anon key is safe to expose client-side (Supabase's RLS policies protect your data),
> but keeping it in env vars means no one can scrape it from your source code on GitHub.

---

## Project structure

```
mtthemes/
├── app/
│   ├── globals.css          # Global styles + Roboto Mono
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── page.module.css
├── components/
│   ├── PostThemeModal.tsx   # Upload popup
│   ├── PostThemeModal.module.css
│   ├── ThemeCard.tsx        # Individual theme card
│   └── ThemeCard.module.css
├── lib/
│   ├── supabase.ts          # Supabase client (reads from env)
│   └── fingerprint.ts       # Anonymous like fingerprinting
├── supabase_schema.sql      # Run this in Supabase SQL editor
├── .env.example             # Copy to .env.local
└── vercel.json
```

---

## How likes work

No accounts needed. Each browser gets a random ID saved to `localStorage`. This prevents the same person from liking a theme multiple times, without needing sign-up. It's not bulletproof (clearing localStorage resets it) but it's good enough for a fan project.
