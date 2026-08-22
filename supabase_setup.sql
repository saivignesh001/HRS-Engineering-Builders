-- ============================================================
-- HRS Engineers & Builders — Contact Form Supabase Setup
-- ============================================================
-- Ithu Supabase project la: SQL Editor -> New Query -> paste pannunga
-- -> Run click pannunga. Ondrae thadava mattum pannaal podhum.
-- ============================================================

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  phone text,
  email text,
  project_type text,
  budget text,
  area_sqft text,
  location text,
  message text
);

-- Row Level Security on pannunga
alter table contact_submissions enable row level security;

-- Website form (anon key) INSERT mattum pannalam, data padikka/edit panna mudiyathu.
-- (Neenga Supabase Dashboard -> Table Editor la mattum ella data um paakalam)
create policy "Allow public insert from website"
  on contact_submissions
  for insert
  to anon
  with check (true);
