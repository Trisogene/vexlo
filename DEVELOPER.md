# 🧑‍💻 Developer Quickstart

> **Not a developer?** [← Back to main README](README.md) for the beginner-friendly guide.

Quick guide for developers — copy the commands and you'll be up and running in minutes.

---

## Prerequisites

- [Node.js v20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com) (for local Supabase)
- [pnpm](https://pnpm.io/) (recommended) or npm
- Git

---

## Quick Start

```bash
# 1. Clone (or download ZIP)
git clone https://github.com/yourorg/vexlo.git
cd vexlo

# 2. Initialize (one-time - makes it YOUR project)
pnpm run init

# 3. Start developing
pnpm run start
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm run init` | **One-time setup:** removes git remote, creates `.env`, optional git init |
| `pnpm run start` | **Full setup:** installs deps, starts Supabase, launches dev server |
| `pnpm dev` | **Fast restart:** skips setup wizard, just starts Vite |
| `pnpm run gen-types` | Regenerate TypeScript DB types after schema changes |
| `pnpm run db:reset` | Reset local DB and reapply migrations |
| `pnpm run build` | Build for production |
| `pnpm run lint` | Run Biome linter |

---

## Project Structure

```
vexlo/
├── src/
│   ├── routes/           # Pages (TanStack Router file-based routing)
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature modules (auth, posts, etc.)
│   │   ├── auth/         # Authentication logic
│   │   └── posts/        # Posts feature
│   ├── lib/              # Utilities, Supabase client, types
│   └── stores/           # Zustand state stores
├── supabase/
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase local config
├── scripts/
│   ├── init.cjs          # Project initialization script
│   ├── setup.cjs         # Full setup wizard
│   └── create-github-repo.*  # GitHub repo creation helpers
├── AGENT_CONTEXT.md      # Context file for AI assistants
├── DEVELOPER.md          # You are here
└── README.md             # Beginner-friendly guide
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **TanStack Router** | File-based routing |
| **TanStack Query** | Server state management |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui + Base UI** | Component library |
| **Supabase** | Database + Auth (local via Docker) |
| **Zustand** | Client state management |
| **Zod** | Schema validation |
| **Framer Motion** | Animations |

---

## Make It Your Own

### Option A: Fork & Clone (Recommended)

1. Click **Fork** on GitHub (top-right)
2. Clone YOUR fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/vexlo.git
   cd vexlo
   pnpm run init
   pnpm run start
   ```

### Option B: Set Your Remote

If you already cloned the original:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/your-repo.git
git push -u origin main
```

### Option C: Downloaded ZIP

The `pnpm run init` command will initialize git for you.

---

## Helper Scripts

If you have [GitHub CLI](https://cli.github.com/) installed:

```bash
# Unix/macOS
./scripts/create-github-repo.sh my-app-name

# Windows PowerShell
./scripts/create-github-repo.ps1 -RepoName my-app-name
```

---

## Git Workflow

```bash
# Create a feature branch
git checkout -b feat/my-feature

# Work, commit, push
git add .
git commit -m "feat: description"
git push -u origin feat/my-feature
```

---

## Database

### Local Supabase (default)

Runs via Docker. Start with `pnpm run start` or manually:

```bash
npx supabase start
```

Dashboard: [http://localhost:54323](http://localhost:54323)

### Remote Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Update `.env` with your project URL and anon key
3. Apply migrations: `npx supabase db push`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Supabase errors | Check Docker is running, try `pnpm run db:reset` |
| Can't push to git | Check `git remote -v`, set origin correctly |
| Port 5173 in use | Close other apps or change port in `vite.config.ts` |
| Types out of sync | Run `pnpm run gen-types` |

---

## Environment Variables

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

For production, replace with your Supabase project credentials.

---

<p align="center">
  <a href="README.md">← Back to main README</a>
</p>