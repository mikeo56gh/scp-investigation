# Saltend Event Reporting Site

A static site providing two browser-based forms for the Saltend Chemicals Park event reporting workflow.

## Structure

- `index.html` — landing page with picker (witness statement vs. full investigation)
- `account-of-events.html` — witness / person-involved statement form
- `event-investigation.html` — full Level 1 / Level 2 investigation form
- `vercel.json` — Vercel routing config (clean URLs, no trailing slash)

All three pages are fully self-contained — no backend, no database, no API calls. Drafts are saved/loaded as JSON files locally on the user's device. PDF exports are generated client-side via jsPDF.

## Deploying to Vercel

### One-time setup

1. Create a new GitHub repo (e.g. `saltend-investigation-site`)
2. Drag-drop the contents of this folder onto the GitHub repo's web UI to upload (or `git push`)
3. On vercel.com, "Add New Project" → import the repo → click Deploy
4. Vercel gives you a URL like `https://saltend-investigation-site.vercel.app`

### Updating

- Edit any HTML file in github.dev (or via the GitHub web editor)
- Commit
- Vercel auto-deploys within ~15 seconds

### Custom domain (optional)

If px Group IT can point a subdomain like `forms.px-group.com` at Vercel, add it under Project Settings → Domains.

## Technical notes

- All pages use Nunito Sans (Google Fonts) for body text and Georgia (system serif) for brand titles.
- Logo is embedded as base64 in each file — works fully offline.
- jsPDF and html2canvas are loaded from cdnjs. Without internet, the PDF export will fail but the form remains usable.
- AI investigation assistant link points to `https://scp-investigation.vercel.app/` (separate deployment).
- Both forms have a clickable brand block in their header that returns to `index.html`.

## Browser support

Modern browsers only — Chrome, Edge, Firefox, Safari, latest 2 versions. Internet Explorer is not supported (it's deprecated).

---

© Saltend Chemicals Park Limited · px Group
