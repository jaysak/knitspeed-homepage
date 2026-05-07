alter table public.quote_leads
add column if not exists material_family text,
add column if not exists width_inches numeric,
add column if not exists source text default 'knitspeed_homepage';

alter table public.quote_leads
alter column lead_status set default 'new',
alter column business_unit set default 'knitspeed';
