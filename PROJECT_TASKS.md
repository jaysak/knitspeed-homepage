# Knitspeed Homepage Tasks

## DONE
- GitHub repo connected
- Vercel auto deploy configured
- Supabase environment variables configured
- Quote form functional
- Quantity unit restored (KG locked)
- Git identity configured
- Production deployment workflow operational

---

## CURRENT PRIORITIES

### UI Polish
- [ ] Fix Usage dropdown styling
  Est: 15 min

- [ ] Improve quantity/unit spacing
  Est: 10 min

- [ ] Add submit success/error toast polish
  Est: 20–30 min

---

### Business Logic

- [ ] Process 2026 sales naming
  Goal:
  Normalize real GSC/Knitspeed product naming
  Est: 1–2 hrs

- [ ] Build products_master table
  Goal:
  Real centralized textile product catalog
  Est: 45–60 min

- [ ] Dynamic unit mapping
  Logic:
    Knitting → KG
    Woven → Yard
  Est: 30–45 min

---

### Supabase Integration

- [ ] Product dropdown from Supabase
  Est: 45–60 min

- [ ] Usage categories from database
  Est: 30 min

- [ ] Quote tracking improvements
  Est: 30–45 min

---

### CRM / Leads

- [ ] Lead dashboard v1
  Est: 1–2 hrs

- [ ] Quote tracking status
  Est: 1 hr

- [ ] CRM capture workflow
  Est: TBD

---

### Strategic / Platform

- [ ] Domain migration from old GoDaddy WordPress
- [ ] knitspeed.com integration
- [ ] Portal merge strategy
- [ ] Customer forecasting layer
- [ ] Safety stock recommendation layer
- [ ] Textile supply intelligence system roadmap

---

## WORKFLOW

Development flow:

edit → npm run build → git add . → git commit → git push

Vercel auto deploys after push.

---

## NOTES

Current architecture:

Local Mac
↕
GitHub
↕
Vercel
↕
Supabase

Knitspeed is evolving from:
simple homepage
→ quotation platform
→ textile operations interface
→ CRM + forecasting platform

