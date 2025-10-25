-- reports_deep: 심층 모듈 상태·타임스탬프
create table if not exists reports_deep (
  report_id uuid primary key references reports(id) on delete cascade,
  modules jsonb not null default '{
    "cognition":"pending","communication":"pending","goal":"pending",
    "relation":"pending","energy":"pending","growth":"pending"
  }',
  narrative text,
  resources jsonb,
  updated_at timestamptz default now()
);

-- RLS: 소유자만 접근
alter table reports_deep enable row level security;

create policy "owner_readwrite_reports_deep" on reports_deep
  for all using (auth.uid() = (select user_id::text from reports where id = report_id))
  with check (auth.uid() = (select user_id::text from reports where id = report_id));

-- 인덱스 추가
create index if not exists idx_reports_deep_report_id on reports_deep(report_id);
create index if not exists idx_reports_deep_updated_at on reports_deep(updated_at);

-- reports 테이블에 공유 관련 컬럼 추가
alter table reports add column if not exists share_id text;
alter table reports add column if not exists share_scope text check (share_scope in ('summary', 'full'));
alter table reports add column if not exists share_expires_at timestamptz;

-- 공유 관련 인덱스
create index if not exists idx_reports_share_id on reports(share_id) where share_id is not null;
create index if not exists idx_reports_share_expires on reports(share_expires_at) where share_expires_at is not null;
