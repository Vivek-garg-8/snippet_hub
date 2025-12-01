-- Create snippets table
create table if not exists snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  type text not null,
  category_id text, -- Keeping as text to match frontend ID generation for now, ideally uuid if categories are in DB
  tags text[], -- Array of tag IDs
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_pinned boolean default false,
  language text
);

-- Enable RLS
alter table snippets enable row level security;

-- Create policies
create policy "Users can view their own snippets"
  on snippets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own snippets"
  on snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own snippets"
  on snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own snippets"
  on snippets for delete
  using (auth.uid() = user_id);

-- Create tags table
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  color text not null,
  created_at timestamptz default now()
);

-- Enable RLS for tags
alter table tags enable row level security;

-- Create policies for tags
create policy "Users can view their own tags"
  on tags for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tags"
  on tags for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tags"
  on tags for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tags"
  on tags for delete
  using (auth.uid() = user_id);
