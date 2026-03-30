# Ninebridge Handoff

## 프로젝트 개요

나인브릿지(Nine Bridge) 회사 포트폴리오 사이트 + CMS.
사용자 대면 콘텐츠는 모두 한국어.

- **프로덕션 URL:** (배포 후 기입)
- **Supabase 대시보드:** https://supabase.com/dashboard (프로젝트: fqdviucoszeymcclvbpb)
- **배포:** Vercel (추정)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 백엔드 | Supabase (PostgreSQL + Auth + Storage) |
| 모노레포 | Turborepo |
| 아이콘 | lucide-react |
| 마크다운 | react-markdown + remark-gfm |

## 핵심 아키텍처

### 듀얼 레이아웃

하나의 페이지(`app/page.tsx`)에서 모바일/데스크톱 뷰를 동시에 렌더링하고 CSS로 전환.

```
page.tsx (useState: activeMenu, selectedProject, selectedNotice, projectFilter)
  ├── PWAContainer  → components/pwa/*     (모바일)
  └── ExtendedContent → components/extended/* (데스크톱)
```

### 어드민

`/admin` 경로에서 프로젝트, 공지사항, 사이트 설정 CRUD.
좌측 폼 에디터 + 우측 PWA 라이브 프리뷰 분할 레이아웃.
인증: Supabase Auth (이메일/비밀번호).

### Supabase 테이블

| 테이블 | 용도 |
|--------|------|
| `projects` | 포트폴리오 프로젝트 |
| `notices` | 공지사항/언론자료 |
| `site_settings` | 회사 정보, SNS 링크, 히어로 텍스트 (단일 행) |

### Storage 버킷

| 버킷 | 용도 |
|-------|------|
| `projects` | 프로젝트 이미지 (`{folder}/{timestamp}_{random}.{ext}`) |
| `attachments` | 공지 첨부파일 (`files/`), 공지 썸네일 (`thumbnails/`) |

## 로컬 환경 설정

```bash
npm install
cp apps/web/.env.local.example apps/web/.env.local  # Supabase 키 입력
npm run dev   # http://localhost:3000
```

## 주의사항

- 전역 상태 관리 없음 — `page.tsx`에서 props drilling
- 테스트 프레임워크 없음
- `packages/ui`는 거의 미사용 — 대부분의 컴포넌트는 `apps/web/components/`에 존재
- 프로젝트 갤러리(`gallery` 컬럼)는 JSONB 배열 — 타입: `GalleryItem[]`
- 공지 첨부파일(`attachments` 컬럼)도 JSONB 배열 — 타입: `Attachment[]`
- `increment_notice_view` RPC가 없으면 직접 UPDATE로 폴백
