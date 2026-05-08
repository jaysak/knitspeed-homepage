alter table quote_leads
add column if not exists sales_notes text;

alter table quote_leads
add column if not exists last_contact_at timestamptz;
