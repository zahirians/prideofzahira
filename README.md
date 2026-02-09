# Pride of Zahira

A public website showcasing students and alumni of Zahira College, Mawanella who have achieved excellence in curricular, co-curricular, and extra-curricular activities.

**Domain:** [prideofzahira.com](https://prideofzahira.com)

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, optional Storage)
- **Hosting:** GitHub Pages (static) — app URL: **https://zahirians.github.io/prideofzahira**

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Set up Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
   - Add your admin email to the `admin_users` table:
     ```sql
     INSERT INTO admin_users (email) VALUES ('your-admin@example.com');
     ```
   - Enable Email Auth in Supabase Dashboard → Authentication → Providers

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Home
│   │   ├── achievements/         # Achievements list & detail
│   │   └── about/                # About Zahira
│   └── admin/
│       ├── login/
│       ├── dashboard/
│       ├── achievements/         # Add & Edit
│       └── categories/
├── components/
│   ├── layout/
│   ├── achievements/
│   └── admin/
├── lib/
│   ├── supabase/
│   └── actions/
└── types/
```

## User Roles

- **Public:** View achievements, search, filter
- **Admin:** Login, add/edit/delete achievements, control publish status

## Deploying to Production (GitHub Pages)

- **GitHub:** [github.com/zahirians/prideofzahira](https://github.com/zahirians/prideofzahira)
- **Live app (no domain needed):** **https://zahirians.github.io/prideofzahira**
- **Pipeline:** `.github/workflows/deploy.yml` runs on every push/PR:
  - **Build & Lint** on all pushes and pull requests
  - **Deploy to GitHub Pages** on push to `main` (static export)

**One-time setup:**

1. In the repo **Settings** → **Pages** → **Build and deployment**: set **Source** to **GitHub Actions**.
2. Add repository **Secrets** (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_SUPABASE_URL` — from Supabase → Settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase → Settings → API
3. Push to `main`; the workflow builds the static site and deploys it. The app will be at **https://zahirians.github.io/prideofzahira**.

## License

Private — Zahira College, Mawanella
