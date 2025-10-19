-- 운세(만세력) 테이블 정의
create table if not exists public.horoscope (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  lunar_birth date,
  solar_birth date not null,
  birth_time time,
  location text,
  saju_data jsonb,
  daily_fortune text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 인덱스 추가
create index if not exists idx_horoscope_user_id on public.horoscope (user_id);
create index if not exists idx_horoscope_created_at on public.horoscope (created_at desc);

-- RLS 정책 설정
alter table public.horoscope enable row level security;

-- 사용자는 자신의 운세만 조회 가능
create policy "Users can view own horoscope"
  on public.horoscope
  for select
  using (auth.uid() = user_id);

-- 사용자는 자신의 운세만 생성 가능
create policy "Users can insert own horoscope"
  on public.horoscope
  for insert
  with check (auth.uid() = user_id);

-- 사용자는 자신의 운세만 수정 가능
create policy "Users can update own horoscope"
  on public.horoscope
  for update
  using (auth.uid() = user_id);

-- 사용자는 자신의 운세만 삭제 가능
create policy "Users can delete own horoscope"
  on public.horoscope
  for delete
  using (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
create or replace function public.update_horoscope_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_horoscope_updated_at
  before update on public.horoscope
  for each row
  execute function public.update_horoscope_updated_at();

-- 코멘트 추가
comment on table public.horoscope is '사용자 운세(만세력) 정보';
comment on column public.horoscope.lunar_birth is '음력 생년월일';
comment on column public.horoscope.solar_birth is '양력 생년월일';
comment on column public.horoscope.birth_time is '출생 시간';
comment on column public.horoscope.location is '출생 지역';
comment on column public.horoscope.saju_data is '사주 데이터 (천간지지, 오행 등)';
comment on column public.horoscope.daily_fortune is '오늘의 운세';

