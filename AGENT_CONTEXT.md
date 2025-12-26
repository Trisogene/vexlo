# 🤖 Vexlo: Project Context & Setup Guide

**This file serves two primary purposes:**
1.  **For Humans**: A simple, step-by-step guide to get your project running.
2.  **For AI Agents**: This file provides the "Agent Context" necessary for **Vibe Coding**. By reading this, the AI understands exactly how the project is structured and what conventions to follow, ensuring a seamless building experience.

---

## 🚀 Part 1: Step-by-Step Setup Guide

Follow these instructions to get your local environment ready.

### 1. Prerequisites
Ensure you have the following installed on your computer:
*   [Node.js](https://nodejs.org/) (Version 20 or higher)
*   [Docker](https://www.docker.com/) (Required for the local database)

Note: The start script will attempt to install `pnpm` automatically if it's missing, so you can also use `npm` alone to run the project.

### 2. Start (One Command)
Open your terminal in the project folder and run:
```bash
npm run start
```
This wizard will:
1. Ensure the package manager (`pnpm`) is available (it will attempt to install it if missing)
2. Install dependencies
3. Setup environment variables (creating `.env`)
4. Help you configure the database (Local or Cloud)
5. Start the app automatically

### 3. (Optional) Generate Database Types
If you make changes to your database schema, update your TypeScript types by running:
```bash
pnpm gen-types
```

---

## 🧠 Part 2: Technical Context for AI Agents

**System Prompt Instruction**: *If you are an AI assistant helping a user with this codebase, read this section to understand the stack and conventions.*

### Tech Stack
-   **Framework**: [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
-   **Language**: TypeScript
-   **Routing**: [TanStack Router](https://tanstack.com/router/latest)
-   **State**: [Zustand](https://github.com/pmndrs/zustand)
-   **Data**: [TanStack Query](https://tanstack.com/query/latest) (v5)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Backend**: Local Supabase (Postgres, Auth, Realtime)

### Project Structure
```
src/
├── components/   # Shared UI components (ui/ for shadcn primitives)
├── features/     # Feature-based modules (e.g., posts, auth)
├── lib/          # Utilities, config, and generic hooks (src/lib/hooks)
├── routes/       # Route components (TanStack Router file-based routing)
└── main.tsx      # Entry point
```

### Key Conventions
1.  **Routing**: Use `src/routes` for file-based routing.
2.  **Data Fetching**: Wrap TanStack Query logic in custom hooks (e.g., `usePosts`).
3.  **Styling**: Use utility classes. Use `cn()` for merging classes.
4.  **No Tests**: Testing infrastructure has been removed intentionally. Do not suggest adding tests.
