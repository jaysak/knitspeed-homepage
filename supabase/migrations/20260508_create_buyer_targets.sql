create table if not exists buyer_targets (
  id uuid primary key default gen_random_uuid(),

  company_name text,
  contact_name text,
  phone text,
  line_id text,
  email text,

  province text,
  platform text,
  business_type text,
  product_focus text,

  source_engine text,
  lead_temperature text default 'cold',

  assigned_to text,
  status text default 'new',

  last_contacted_at timestamptz,
  next_followup_at timestamptz,

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table buyer_targets enable row level security;

drop policy if exists "Authenticated users can read buyer targets" on buyer_targets;

create policy "Authenticated users can read buyer targets"
on buyer_targets
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert buyer targets" on buyer_targets;

create policy "Authenticated users can insert buyer targets"
on buyer_targets
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update buyer targets" on buyer_targets;

create policy "Authenticated users can update buyer targets"
on buyer_targets
for update
to authenticated
using (true)
with check (true);

create index if not exists buyer_targets_status_idx on buyer_targets(status);
create index if not exists buyer_targets_phone_idx on buyer_targets(phone);
create index if not exists buyer_targets_platform_idx on buyer_targets(platform);
create index if not exists buyer_targets_business_type_idx on buyer_targets(business_type);
create index if not exists buyer_targets_created_at_idx on buyer_targets(created_at desc);
