-- Run this script in the Supabase SQL Editor for the project used by My Wall.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'Jon'
    constraint posts_author_name_is_jon check (author_name = 'Jon'),
  content text not null
    constraint posts_content_is_valid check (
      char_length(content) between 1 and 280
      and content !~ '^[[:space:]]|[[:space:]]$'
      and content ~ '[^[:space:]]'
    ),
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_desc_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;

revoke update, delete on public.posts from anon, authenticated;
grant select, insert on public.posts to anon, authenticated;

drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can publish as Jon" on public.posts;
create policy "Anyone can publish as Jon"
  on public.posts for insert
  to anon, authenticated
  with check (author_name = 'Jon');

-- Enable INSERT events for the client's Supabase Realtime subscription.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;
end;
$$;
