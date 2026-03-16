# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development (runs all apps via Turborepo)
npm run dev

# Build all workspaces
turbo run build

# Lint all workspaces
turbo run lint

# Type checking
turbo run check-types

# Run commands for specific workspace
turbo run build --filter=web
turbo run lint --filter=web
```

## Architecture

**Monorepo (Turborepo)** with workspaces:
- `apps/web` — Main Next.js 16 application (App Router, React 19)
- `packages/ui` — Shared UI components
- `packages/eslint-config` — Shared ESLint flat configs
- `packages/typescript-config` — Shared TypeScript configs

### Web App (`apps/web`)

**Company portfolio site and CMS** for Nine Bridge (나인브릿지), a Korean company. All user-facing content is in Korean.

**Dual-layout rendering:** The main page (`app/page.tsx`) is a client component that uses client-side routing via `useState` for menu navigation (home, works, notice, contact). It renders two layout variants simultaneously:
- `PWAContainer` — mobile/narrow view
- `ExtendedContent` — desktop/wide view
- `MainLayout` handles responsive breakpoint detection

**Admin panel** (`app/admin/`) — CRUD interface for projects and notices with Supabase Auth (email/password). Admin pages use split-screen: form editor + live PWA preview.

### Data Layer

**Supabase** (PostgreSQL + Storage + Auth):
- Tables: `projects`, `notices`
- Storage buckets: `projects` (images), `attachments` (files)
- API wrappers in `lib/projects.ts` and `lib/notices.ts` — direct Supabase SDK queries
- Client initialized in `lib/supabase.ts`
- Types defined in `lib/types.ts`

### Component Organization

- `components/pwa/` — Mobile-optimized views (PWAHome, PWAProject, PWANotice, PWAContact)
- `components/extended/` — Desktop views (ExtendedContent routes to sub-components)
- `components/admin/` — Admin forms (ProjectForm, NoticeForm, AdminLayout)
- `components/layout/` — Layout wrappers (MainLayout, PWAContainer, PWANavBar, SidePanel)
- `components/common/` — Shared UI (Button, Badge, MarkdownRenderer, WhiteBox)

### Key Patterns

- **State management:** Local `useState` hooks only — no global store. Props drilling from root page.
- **Data fetching:** `useEffect` + Supabase SDK queries with loading/error boolean states.
- **Path alias:** `@/*` maps to `apps/web/*`
- **Styling:** Tailwind CSS 4 with inline hex values in brackets (e.g., `bg-[#3071a5]`).
- **Markdown:** `react-markdown` + `remark-gfm` for content rendering.

### Environment Variables

Required in `apps/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
