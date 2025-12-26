-- Squashed migration: create public.users and public.posts with policies and trigger

-- 1) Create public.users to mirror auth.users for easy joins
create table public.users (
  id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone not null default now(),
  constraint users_pkey primary key (id)
);

-- Enable RLS on public.users
alter table public.users enable row level security;

create policy "Public users are viewable by everyone"
  on public.users for select
  using (true);

-- Trigger to sync auth.users -> public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing auth users into public.users (if any)
insert into public.users (id, email, created_at)
select id, email, now() from auth.users
on conflict (id) do nothing;

-- 2) Create public.posts table (references public.users)
create table public.posts (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint posts_pkey primary key (id)
);

-- Enable Row Level Security on posts
alter table public.posts enable row level security;

-- Policies for posts
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);
