# KNITSPEED PRIME ENGINE HANDOFF

Author: Jay + Jarvis
Status: Current Tactical State
Last Updated: 2026-05-10

---

# START HERE

Read these files first:
1. `PROJECT_ROADMAP.md`
2. `DECISIONS.md`
3. `SESSIONS.md`
4. `HANDOFF.md`

---

# CURRENT REPO STATE

Branch:
- `main`

Latest product checkpoint:
- `0004816 Complete Prime article quote flow`

Remote:
- `origin/main`

Known local untracked backup files:
- `scripts/build_products_master.py.bak-p1`
- `src/App.jsx.bak-prime-payload`

Do not commit those backup files unless Jay explicitly asks.

---

# COMPLETED CHECKPOINT

## Phase 3.4A — Prime Article Quote Flow

Status:
- complete
- committed
- pushed

Implemented:
- finished article frontend data export
- homepage article cards
- article quote button
- selected article state
- quote metadata payload wiring
- build and lint passing

---

# NEXT TASK

## Phase 3.4B — Buyer Intent Tracking

Goal:
- track buyer interest in articles before and during quote submission

Possible subtasks:
1. Inspect current quote flow and Supabase schema
2. Decide first tracking storage:
   - local/session only
   - Supabase `lead_activity`
   - additional fields on `quote_leads`
3. Track article card clicks
4. Track quoted article slugs
5. Surface top articles/categories in dashboard later

Suggested first implementation:
- start with low-risk local/session tracking and quote payload metadata
- avoid new database table until schema decision is clear

Estimated time:
- 1.5-3 hours

---

# OPERATING STYLE

Jay prefers:
- terminal-first workflow
- inspect before modifying
- exact shell/patch commands
- surgical changes only
- preserve architecture unless explicitly refactoring
- preserve textile naming/business logic
- avoid overwriting large files blindly
- explain intended patch before applying
- build-test after meaningful patches

Default verification:
- `npm run build`
- `npm run lint`

Generated article data:
- `python3 scripts/export_finished_articles.py`

---

# USEFUL COMMANDS

Check repo:

```bash
git status --branch --short
git log --oneline --decorate -5
```

Run app:

```bash
npm run dev
```

Verify:

```bash
npm run build
npm run lint
```

Regenerate finished articles:

```bash
python3 scripts/export_finished_articles.py
```
