-- =============================================================
-- Ninebridge DB Schema + Seed
-- Supabase PostgreSQL
-- =============================================================

-- 1. Extensions
create extension if not exists "uuid-ossp";

-- =============================================================
-- 2. Tables
-- =============================================================

-- projects
create table if not exists projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  content       text,
  details       text,
  thumbnail     text,
  featured_thumbnail text,
  categories    text[] not null default '{}',
  tags          text[] not null default '{}',
  client        text,
  date_start    text,
  date_end      text,
  link          text,
  gallery       jsonb not null default '[]',
  related_projects text[] not null default '{}',
  is_published  boolean not null default false,
  is_featured   boolean not null default false,
  has_detail    boolean not null default false,
  "order"       integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- notices
create table if not exists notices (
  id            uuid primary key default uuid_generate_v4(),
  category      text not null check (category in ('notice', 'press', 'recruit')),
  title         text not null,
  content       text,
  thumbnail     text,
  attachments   jsonb not null default '[]',
  link          text,
  is_published  boolean not null default false,
  is_pinned     boolean not null default false,
  is_expanded   boolean not null default false,
  view_count    integer not null default 0,
  "order"       integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- site_settings (단일 행)
create table if not exists site_settings (
  id                    uuid primary key default uuid_generate_v4(),
  company_name          text not null,
  ceo_name              text not null,
  address               text not null,
  tel                   text not null,
  fax                   text not null,
  email                 text not null,
  business_number       text not null,
  business_license      text,
  privacy_officer       text,
  privacy_officer_email text,
  sns_kakao             text,
  sns_instagram         text,
  sns_youtube           text,
  sns_facebook          text,
  header_tagline        text,
  hero_title            text,
  hero_subtitle         text,
  hero_description      text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- =============================================================
-- 3. RPC: 조회수 증가
-- =============================================================

create or replace function increment_notice_view(notice_id uuid)
returns void
language plpgsql
as $$
begin
  update notices
  set view_count = view_count + 1
  where id = notice_id;
end;
$$;

-- =============================================================
-- 4. RLS (Row Level Security)
-- =============================================================

alter table projects enable row level security;
alter table notices enable row level security;
alter table site_settings enable row level security;

-- 공개 읽기: 퍼블리시된 항목만
create policy "projects_public_read" on projects
  for select using (is_published = true);

create policy "notices_public_read" on notices
  for select using (is_published = true);

create policy "site_settings_public_read" on site_settings
  for select using (true);

-- 인증된 사용자: 모든 작업 허용 (어드민)
create policy "projects_auth_all" on projects
  for all using (auth.role() = 'authenticated');

create policy "notices_auth_all" on notices
  for all using (auth.role() = 'authenticated');

create policy "site_settings_auth_all" on site_settings
  for all using (auth.role() = 'authenticated');

-- =============================================================
-- 5. Storage Buckets
-- =============================================================
-- Supabase 대시보드에서 생성하거나 아래 SQL 실행:
--
-- insert into storage.buckets (id, name, public)
-- values ('projects', 'projects', true),
--        ('attachments', 'attachments', true);

-- =============================================================
-- 6. Seed Data
-- =============================================================

-- site_settings (단일 행)
insert into site_settings (
  company_name, ceo_name, address, tel, fax, email, business_number,
  header_tagline, hero_title, hero_subtitle, hero_description
) values (
  '나인브릿지', '홍길동', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '02-1234-5679',
  'contact@ninebridge.co.kr', '123-45-67890',
  '나인브릿지', 'We Bridge Ideas\nto Reality',
  '아이디어를 현실로 연결합니다',
  '나인브릿지는 플랫폼 개발, 마케팅, 콘텐츠 제작을 통해 고객의 비전을 실현합니다.'
);

-- 샘플 프로젝트
insert into projects (title, description, categories, tags, client, date_start, date_end, is_published, is_featured, has_detail, "order") values
(
  '스마트 물류 플랫폼',
  '실시간 물류 추적 및 관리 시스템 구축',
  '{platform}', '{웹,물류,대시보드}',
  '(주)물류테크', '2025-01', '2025-06',
  true, true, true, 1
),
(
  '브랜드 캠페인 영상',
  '신제품 출시 홍보 영상 기획/제작',
  '{contents}', '{영상,브랜딩}',
  '뷰티코리아', '2025-03', '2025-04',
  true, false, false, 2
),
(
  'SNS 마케팅 프로젝트',
  '인스타그램/유튜브 채널 운영 대행',
  '{marketing}', '{SNS,인스타그램,유튜브}',
  '푸드스타', '2025-02', '2025-08',
  true, false, true, 3
);

-- 샘플 공지사항
insert into notices (category, title, content, is_published, is_pinned, "order") values
(
  'notice', '2025년 하반기 채용 안내',
  '나인브릿지에서 함께 성장할 인재를 찾습니다.\n\n## 모집 분야\n- 프론트엔드 개발자\n- 콘텐츠 디자이너\n\n자세한 내용은 채용 페이지를 확인해주세요.',
  true, true, 1
),
(
  'press', '나인브릿지, 스마트물류 플랫폼 수주',
  '나인브릿지가 (주)물류테크의 스마트 물류 플랫폼 구축 프로젝트를 수주했습니다.',
  true, false, 2
),
(
  'notice', '설 연휴 휴무 안내',
  '2025년 설 연휴 기간(1/28~1/30) 동안 휴무입니다.\n\n긴급 문의: contact@ninebridge.co.kr',
  true, false, 3
);
