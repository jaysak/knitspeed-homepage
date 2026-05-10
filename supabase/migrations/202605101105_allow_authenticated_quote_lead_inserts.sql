drop policy if exists "Allow authenticated quote lead inserts" on public.quote_leads;

create policy "Allow authenticated quote lead inserts"
on public.quote_leads
for insert
to authenticated
with check (true);
