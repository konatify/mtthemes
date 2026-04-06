-- Run this in your Supabase SQL editor

create table themes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  link text not null,
  description text check (char_length(description) <= 280),
  likes integer default 0,
  created_at timestamp with time zone default now()
);

create table likes (
  id uuid default gen_random_uuid() primary key,
  theme_id uuid references themes(id) on delete cascade,
  fingerprint text not null, -- anonymous client fingerprint so one user can't spam likes
  created_at timestamp with time zone default now(),
  unique(theme_id, fingerprint)
);

-- Allow anyone to read themes
alter table themes enable row level security;
create policy "Anyone can read themes" on themes for select using (true);
create policy "Anyone can insert themes" on themes for insert with check (true);

-- Allow anyone to read/insert likes
alter table likes enable row level security;
create policy "Anyone can read likes" on likes for select using (true);
create policy "Anyone can insert likes" on likes for insert with check (true);
create policy "Anyone can delete own like" on likes for delete using (true);

-- Function to get like count per theme
create or replace function get_like_count(theme_id uuid)
returns integer as $$
  select count(*)::integer from likes where likes.theme_id = $1;
$$ language sql stable;
