alter table public.quote_leads
add column if not exists lead_owner text,
add column if not exists follow_up_at timestamptz;

update public.quote_leads
set lead_owner = coalesce(lead_owner, assigned_owner)
where lead_owner is null
  and assigned_owner is not null;

update public.quote_leads
set follow_up_at = coalesce(follow_up_at, next_followup_at)
where follow_up_at is null
  and next_followup_at is not null;

update public.quote_leads
set lead_status = case lead_status
  when 'sampling' then 'contacted'
  when 'confirmed' then 'won'
  when 'dead' then 'lost'
  else lead_status
end
where lead_status in ('sampling', 'confirmed', 'dead');
