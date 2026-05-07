create table if not exists public.quote_leads (
  id uuid primary key default gen_random_uuid(),

  name text,
  phone text,
  line_id text,
  company text,

  fabric_type text,
  material_family text,
  yarn_count text,
  width_inches numeric,

  quantity numeric,
  quantity_unit text,
  usage text,
  message text,

  source text default 'knitspeed_homepage',
  status text default 'new',

  created_at timestamptz default now()
);

alter table public.quote_leads enable row level security;

create policy "Allow public quote lead inserts"
on public.quote_leads
for insert
to anon
with check (true);

create policy "Allow authenticated users to read quote leads"
on public.quote_leads
for select
to authenticated
using (true);
