alter table public.quote_leads
add column if not exists assigned_owner text,
add column if not exists next_followup_at timestamptz;

drop policy if exists "Allow authenticated quote lead updates" on public.quote_leads;

create policy "Allow authenticated quote lead updates"
on public.quote_leads
for update
to authenticated
using (true)
with check (true);
