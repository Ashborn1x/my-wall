-- Restore the original rich frontend sample posts in Supabase.
-- Run once in the SQL Editor for the same project configured in .env.local.

alter table public.posts
  drop constraint if exists posts_author_name_is_jon,
  drop constraint if exists posts_content_is_valid,
  drop constraint if exists posts_author_name_not_blank,
  drop constraint if exists posts_category_is_valid,
  drop constraint if exists posts_likes_nonnegative;

alter table public.posts
  add column if not exists author_avatar text not null default '/assets/aistudio/image_d0e5de4a.png',
  add column if not exists category text not null default 'status',
  add column if not exists privacy text,
  add column if not exists likes integer not null default 0,
  add column if not exists show_wall_to_wall boolean not null default false,
  add column if not exists album jsonb,
  add column if not exists link_attachment jsonb,
  add column if not exists photo_attachment text;

alter table public.posts
  add constraint posts_author_name_not_blank check (length(btrim(author_name)) > 0),
  add constraint posts_content_is_valid check (
    char_length(content) between 0 and 280
    and content = btrim(content)
    and content !~ '^[[:space:]]|[[:space:]]$'
    and (content ~ '[^[:space:]]' or album is not null)
  ),
  add constraint posts_category_is_valid check (category in ('status', 'photos', 'wall')),
  add constraint posts_likes_nonnegative check (likes >= 0);

alter table public.posts enable row level security;
revoke update, delete on public.posts from anon, authenticated;
grant select, insert on public.posts to anon, authenticated;

create index if not exists posts_created_at_desc_idx
  on public.posts (created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_name text not null default 'Jon',
  author_avatar text not null default '/assets/aistudio/image_d0e5de4a.png',
  content text not null check (
    char_length(content) between 1 and 280
    and content = btrim(content)
    and content ~ '[^[:space:]]'
  ),
  created_at timestamptz not null default now(),
  likes integer not null default 0 check (likes >= 0)
);

create index if not exists comments_post_created_at_idx
  on public.comments (post_id, created_at asc);

alter table public.comments enable row level security;
revoke update, delete on public.comments from anon, authenticated;
grant select, insert on public.comments to anon, authenticated;

drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
  on public.comments for select to anon, authenticated using (true);

drop policy if exists "Anyone can comment as Jon" on public.comments;
create policy "Anyone can comment as Jon"
  on public.comments for insert to anon, authenticated
  with check (author_name = 'Jon');

-- Public clients can change the persisted post like count only by one at a time.
create or replace function public.change_post_likes(p_post_id uuid, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  updated_likes integer;
begin
  if p_delta not in (-1, 1) then
    raise exception 'Like delta must be 1 or -1';
  end if;

  update public.posts
  set likes = greatest(0, likes + p_delta)
  where id = p_post_id
  returning likes into updated_likes;

  if updated_likes is null then
    raise exception 'Post not found';
  end if;

  return updated_likes;
end;
$$;

revoke all on function public.change_post_likes(uuid, integer) from public;
grant execute on function public.change_post_likes(uuid, integer) to anon, authenticated;

create or replace function public.change_comment_likes(p_comment_id uuid, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  updated_likes integer;
begin
  if p_delta not in (-1, 1) then
    raise exception 'Like delta must be 1 or -1';
  end if;

  update public.comments
  set likes = greatest(0, likes + p_delta)
  where id = p_comment_id
  returning likes into updated_likes;

  if updated_likes is null then
    raise exception 'Comment not found';
  end if;

  return updated_likes;
end;
$$;

revoke all on function public.change_comment_likes(uuid, integer) from public;
grant execute on function public.change_comment_likes(uuid, integer) to anon, authenticated;

-- Restore the posts from src/data/initialWallData.ts into the existing rows.
update public.posts
set author_name = 'Priscilla Chan',
    author_avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSrp085s778rxMq_u8iU6fXP-XM3TPH3b3iZYNjtmzyIwHgPrJoEhdUtst8SS1pzPX0RcuGCGceK-FKyW8t4TZQyqnsGZicCF1afpA-oFw1wH-m6j_TswJYfBqv2O_DxOwH9rxUUOzsnXgxU8C-7lk2CTJzzvf5HO0OblEJK0KVgMQrhRpfZhRYICgZx86slfLARwmuleGjXjwTCJWkZqHVmP125WVqUHHi4z7fw',
    content = 'hi!', category = 'wall', likes = 0, show_wall_to_wall = true,
    album = null, created_at = '2009-06-06T10:52:00+08:00'
where content = 'hi!'
  and created_at = '2009-06-06T02:52:00+00:00';

update public.posts
set author_name = 'Robert Scoble',
    author_avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKw8zwgHwOyl6hWLroMI_xxIL2hdT0HHDYhJLc9dWT69po6-N4qJm9lMImFkb2BmY2e2sSzGiGll7JdwVopUcEVVaTrK77r2vAqHuXXnSnk-R7Gl99hH-7MlvavAihwALlrLHnQ926FZG24SpoO9T5Dao4BRvy0HR1D4WbiyXYLyK0dYeWNhwOESENo98NyubEVNoQP6rDd4npGJ6RLXv1g1XF3V9dTQcezAlkdw',
    content = '', category = 'photos', likes = 2, show_wall_to_wall = false,
    album = jsonb_build_object(
      'title', 'Photowalk around Facebook''s new headquarters',
      'description', 'I visited Facebook''s new headquarters today (they''ve been in there just a little more than a week now so I figured I should document what life was like on May 2, 2009). We were filming interviews for building43.com!',
      'photos', jsonb_build_array(
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTb2h3g_isQ-PwbRQRCEP5d2t-BymyqQNB_vYAkF8527HF08hnlx4xZBjdrB51yj6K23PRtV1vXliuBljQHS9rT2R3hN0FXq3JNz7C1FuCI2PUm6aIQEis0sO75ZzLr5OD5yk8do7avUeKwOw6YNecxONbRfV3H8WtVHXX_jQKzE5f0iJTj5j9Khv6Vd-n_PY3CcBkmhZDoFNk3ys8GiKICm-K9sSZv7UT1Vo0cg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCiW1DeN19WYfOyiC9NVWW-6k2CoLO37kqOK2arg3H84sZRXuIlh_2cAgT7PpRhFP3aG1K6bf1kDODJW94HQzcbFJiy4MIbE_lH8nNUrn1mxvMnyz-PNp5Wj2e7yxzSziKj0PUkyyeFA9yl0V33fJLU5_vjH7DNoTFmk6iqVbHFjsadg5elwB_ROZicKZKd9E8AzYcrGuGp8I1uScBKCe_cwhgwUkQCoj4sdyojXQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUaA1saqoDjqlBJ-Em6FdM5xQAWRibx20tsXVKYnkeD0wxUsY8DurhfhTyBR-YZKB4y-z4Tu_viM_HBXTvEjZRTx-AO3q6oMbKGQtkmCM7Bdf9_hfkdqCLy6GOOmFy9graUCRkBMXbxO9Ku0RUdua2cFRp62eWu5LFKG5cI3UDx1yakx79EPPxtlrd-kUYWxeoQ5H212eXclwVv4ZDen3yTK_tSIzXOopnzCIPOA'
      ),
      'taggedUser', 'Jon Doe'
    ),
    created_at = '2009-06-03T00:02:00+08:00'
where content like 'Photowalk around Facebook%'
  and created_at = '2009-06-02T16:02:00+00:00';

update public.posts
set author_name = 'Jon Doe',
    author_avatar = '/assets/aistudio/image_d0e5de4a.png',
    content = 'Awesome -- famous actors and singers sing Andy Samberg songs at MTV Movie Awards... check it out!',
    category = 'status', likes = 3, show_wall_to_wall = false,
    album = null, created_at = '2009-06-01T15:14:00+08:00'
where content = 'Awesome -- famous actors and singers sing Andy Samberg songs at MTV Movie Awards... check it out!'
  and created_at = '2009-06-01T07:14:00+00:00';

update public.posts
set author_name = 'Sean Parker',
    author_avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6gVtVXbbCThZr7j3fnDWL1XF1Ra_FbMbot1i6IuRK64XS7W41f8fy6A6fUn2qc4JxgIM9HL6ZRQATCIVhVDpCeWtRy4Bnzl_s2FkLQAplXfHzakxFaBaQDyHZXaykSDSKa-rM2blc2ByaRUcTxb1XBrwctnMIyxXlPjsOif3JZsf4RC7MhbkecEbXA08fMKae2acM47j-FQUgqCiOg9XZAy39pbrxBMAj6FYHHQ',
    content = 'A billion dollars isn''t cool. You know what''s cool? A retro 2008 Facebook wall rebuilt in pixel perfection! Congrats man!',
    category = 'wall', likes = 4, show_wall_to_wall = true,
    album = null, created_at = '2009-05-28T18:45:00+08:00'
where content = 'A billion dollars isn''t cool. You know what''s cool? A retro 2008 Facebook wall rebuilt in pixel perfection! Congrats man!'
  and created_at = '2009-05-28T10:45:00+00:00';

insert into public.comments (post_id, author_name, author_avatar, content, created_at, likes)
select p.id, 'Jon Doe', '/assets/aistudio/image_d0e5de4a.png',
       'Haha thanks Sean! Drop by the office tomorrow!', '2009-05-28T19:12:00+08:00', 1
from public.posts p
where p.author_name = 'Sean Parker'
  and p.content = 'A billion dollars isn''t cool. You know what''s cool? A retro 2008 Facebook wall rebuilt in pixel perfection! Congrats man!'
  and not exists (
    select 1 from public.comments c
    where c.post_id = p.id
      and c.content = 'Haha thanks Sean! Drop by the office tomorrow!'
  );

-- Enable Realtime for the feed and restored comments.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'posts') then
      alter publication supabase_realtime add table public.posts;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'comments') then
      alter publication supabase_realtime add table public.comments;
    end if;
  end if;
end;
$$;
