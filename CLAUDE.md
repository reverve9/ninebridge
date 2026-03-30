# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development (runs all apps via Turborepo)
npm run dev

# Build all workspaces
turbo run build

# Lint all workspaces (zero warnings enforced: --max-warnings 0)
turbo run lint

# Type checking (runs next typegen before tsc)
turbo run check-types

# Format code with Prettier
npm run format

# Run commands for specific workspace
turbo run build --filter=web
turbo run dev --filter=web
```

No test framework is configured. There are no tests in this repository.

## Architecture

**Monorepo (Turborepo)** with workspaces:
- `apps/web` — Main Next.js 16 application (App Router, React 19)
- `packages/ui` — Shared UI components (minimally used — most components live in `apps/web/components/`)
- `packages/eslint-config` — Shared ESLint flat configs
- `packages/typescript-config` — Shared TypeScript configs

### Web App (`apps/web`)

**Company portfolio site and CMS** for Nine Bridge (나인브릿지), a Korean company. All user-facing content, comments, and category labels are in Korean.

**Dual-layout rendering:** The main page (`app/page.tsx`) is a single client component that uses `useState`-based client-side routing (`activeMenu`) for menu navigation (home, works, notice, contact). It renders two layout variants simultaneously — CSS controls which is visible:
- `PWAContainer` — mobile/narrow view (`components/pwa/`)
- `ExtendedContent` — desktop/wide view (`components/extended/`)
- `MainLayout` handles responsive breakpoint detection and switches between them

Root-level state (`activeMenu`, `selectedProject`, `selectedNotice`, `projectFilter`) is defined in `page.tsx` and threaded down via props.

**Admin panel** (`app/admin/`) — CRUD interface for projects, notices, and site settings with Supabase Auth (email/password). Admin pages use a split-screen layout: form editor on the left + live PWA preview on the right (`PWAPreview`, `PWANoticePreview`).

### Data Layer

**Supabase** (PostgreSQL + Storage + Auth):
- Tables: `projects`, `notices`, `site_settings`
- Storage buckets: `projects` (images), `attachments` (files)
- API wrappers: `lib/projects.ts`, `lib/notices.ts`, `lib/siteSettings.ts` — direct Supabase SDK queries
- Client singleton: `lib/supabase.ts`
- Types: `lib/types.ts` (`Project`, `Notice`, `GalleryItem`, `Attachment`, `SiteSettings`)
- Constants: `lib/constants.ts` (`PROJECT_CATEGORIES`, `NOTICE_CATEGORIES` — Korean labels)
- Utilities: `lib/utils.ts` (`getYoutubeId`, `formatDateTime`, `formatFileSize` — Korean locale)

### Component Organization

- `components/pwa/` — Mobile-optimized views (PWAHome, PWAProject, PWANotice, PWAContact, PWAFooter)
- `components/extended/` — Desktop views (ExtendedContent dispatches to sub-components per menu)
- `components/admin/` — Admin forms and live preview components (ProjectForm, NoticeForm, AdminLayout)
- `components/layout/` — Layout wrappers (MainLayout, PWAContainer, PWANavBar, PWAHeader, PWANavigation, PWATopNav)
- `components/common/` — Shared UI (Button, Badge, MarkdownRenderer, WhiteBox, SNSLinks)

### Key Patterns

- **State management:** Local `useState` hooks only — no global store. Props drilling from root page.
- **Data fetching:** `useEffect` + Supabase SDK queries with loading/error boolean states.
- **Path alias:** `@/*` maps to `apps/web/*`
- **Styling:** Tailwind CSS 4 with inline hex values in brackets (e.g., `bg-[#3071a5]`).
- **Icons:** `lucide-react` for all icons.
- **Markdown:** `react-markdown` + `remark-gfm` for content rendering.

### Environment Variables

Required in `apps/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
