# TECH_DETAILS.md
> **Technical details for Vexlo (advanced users and developers)**

## 🛠 Setup & Configuration

### 1. Node & Package Manager
- **Node.js**: required to run the frontend.
- **pnpm**: preferred package manager.

```bash
npm install -g pnpm
```

### 2. Docker & Supabase
- Docker handles local database and Supabase backend.
- The start script (`npm run start`) automatically:
  - Installs the package manager if missing (installs `pnpm` via `npm`)
  - Installs frontend dependencies
  - Builds local Supabase containers
  - Seeds initial data
  - Starts Realtime and Auth services

### 3. Project Structure
```
vexlo/
├─ frontend/          # React + Vite app
├─ supabase/          # Local Supabase setup
├─ AGENT_CONTEXT.md   # AI agent instructions
└─ TECH_DETAILS.md    # This file
```

### 4. AI Agent (Vibe Coding)
- `AGENT_CONTEXT.md` contains instructions and project conventions.
- The AI agent can:
  - Apply code changes
  - Update database schemas
  - Suggest features based on your prompts

> Note: This is optional; you can ignore if you prefer manual coding.

### 5. Stack Details
- **React + Vite**: fast frontend setup
- **TanStack Router**: data-first routing
- **Zustand + TanStack Query v5**: state and server data management
- **Tailwind CSS + Shadcn UI**: flexible styling and component library
- **Supabase**: local Postgres, Auth, Realtime backend

### 6. Deployment
- Deployment-ready for Vercel or Netlify.
- Minimal adjustments needed:
  - Update Supabase URL in `.env`
  - Configure environment variables for production

### 7. Advanced Usage
- Customize AI agent behavior in `AGENT_CONTEXT.md`
- Add new tables in Supabase using `pnpm run db:migrate`
- Override frontend routes by editing `frontend/src/routes`

---

**Vexlo is designed to get you from idea to prototype fast, while giving advanced users full control.**
