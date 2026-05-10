alter table public.quote_leads
add column if not exists monthly_usage_kg numeric,
add column if not exists buyer_type text,
add column if not exists target_market text,
add column if not exists production_stage text,
add column if not exists sourcing_pain_points text;
