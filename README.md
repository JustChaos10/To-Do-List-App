### To-Do AI: Next.js + Supabase

- **Stack**: Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui, TanStack Query, Supabase (Auth + Postgres), Zod, Vitest, Playwright.

### Env vars
Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Database (Supabase)
Run the SQL in `scripts/supabase.sql` in the Supabase SQL editor to create the `todos` table and RLS policies.

### Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start prod server
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint
- `npm run test` — Vitest unit tests
- `npm run test:e2e` — Playwright e2e

### Deploy
1. Push to GitHub
2. Vercel: Import repo, set env vars above
3. Connect to Supabase project, run SQL
4. Deploy and verify auth + CRUD

