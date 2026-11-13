-- FEBRIA MEDIA NEWSROOM / Supabase SQL
-- Jalankan sekali di Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text,
 full_name text,
 role text not null default 'author' check (role in ('author','editor','admin')),
 created_at timestamptz not null default now()
);
create table if not exists public.articles (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references auth.users(id) on delete restrict,
 reviewed_by uuid references auth.users(id) on delete set null,
 title text not null,
 slug text not null unique,
 category text not null check (category in ('update','business','tech','viral')),
 excerpt text not null,
 content text not null,
 image_url text,
 source_url text,
 author_name text,
 seo_title text,
 seo_description text,
 status text not null default 'draft' check (status in ('draft','pending','approved','published','rejected')),
 scheduled_at timestamptz,
 published_at timestamptz,
 reviewed_at timestamptz,
 view_count bigint not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists articles_status_date_idx on public.articles(status,published_at desc);
create index if not exists articles_author_idx on public.articles(author_id);
create index if not exists articles_category_idx on public.articles(category);

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path=public
as $$ select coalesce((select role from public.profiles where id=auth.uid()),'author'); $$;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$ begin
 insert into public.profiles(id,email,full_name,role)
 values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''),'author')
 on conflict(id) do update set email=excluded.email;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
drop policy if exists "profile self or admin read" on public.profiles;
create policy "profile self or admin read" on public.profiles for select to authenticated
using(id=auth.uid() or public.current_user_role()='admin');
drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles" on public.profiles for update to authenticated
using(public.current_user_role()='admin') with check(public.current_user_role()='admin');

drop policy if exists "published articles public read" on public.articles;
create policy "published articles public read" on public.articles for select to anon,authenticated
using(status='published' and (published_at is null or published_at<=now()));
drop policy if exists "authors read own and editors read all" on public.articles;
create policy "authors read own and editors read all" on public.articles for select to authenticated
using(author_id=auth.uid() or public.current_user_role() in ('editor','admin'));
drop policy if exists "authors create own articles" on public.articles;
create policy "authors create own articles" on public.articles for insert to authenticated
with check(author_id=auth.uid() and status in ('draft','pending'));
drop policy if exists "authors edit own drafts" on public.articles;
create policy "authors edit own drafts" on public.articles for update to authenticated
using(author_id=auth.uid() and status in ('draft','rejected','pending'))
with check(author_id=auth.uid() and status in ('draft','pending'));
drop policy if exists "editors review and publish" on public.articles;
create policy "editors review and publish" on public.articles for update to authenticated
using(public.current_user_role() in ('editor','admin'))
with check(public.current_user_role() in ('editor','admin'));
drop policy if exists "authors delete own drafts" on public.articles;
create policy "authors delete own drafts" on public.articles for delete to authenticated
using(author_id=auth.uid() and status in ('draft','rejected'));
drop policy if exists "admins delete any article" on public.articles;
create policy "admins delete any article" on public.articles for delete to authenticated
using(public.current_user_role()='admin');

-- Public image bucket. Upload only for signed-in users; limit 5 MB and image MIME types.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('news-media','news-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "authenticated upload news media" on storage.objects;
create policy "authenticated upload news media" on storage.objects for insert to authenticated
with check(bucket_id='news-media' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "public read news media" on storage.objects;
create policy "public read news media" on storage.objects for select to public
using(bucket_id='news-media');
drop policy if exists "owner delete own news media" on storage.objects;
create policy "owner delete own news media" on storage.objects for delete to authenticated
using(bucket_id='news-media' and (storage.foldername(name))[1]=auth.uid()::text);

-- Increment page views safely from the public site. Call with the article UUID.
create or replace function public.increment_article_view(article_uuid uuid)
returns void language sql security definer set search_path=public
as $$ update public.articles set view_count=view_count+1
where id=article_uuid and status='published' and (published_at is null or published_at<=now()); $$;
grant execute on function public.increment_article_view(uuid) to anon,authenticated;

-- Run this after creating your first Supabase Auth user; replace the email.
-- update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
-- Add scheduled publication automation only after testing; see ADMIN-SETUP.md.
