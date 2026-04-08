# Saltend Chemicals Park — Root Cause Analysis Tool

AI-powered 5-Whys, root cause analysis, contributing factors and corrective actions.  
No app installs needed — everything via browser.

---

## Deploy (browser only — no installs on your work laptop)

### Step 1 — Put the files on GitHub

1. Go to **github.com** → sign in (or create a free account)
2. Click **+** (top right) → **New repository**
3. Name it `scp-rca`, leave everything else as default → **Create repository**
4. Click **uploading an existing file** (link on the empty repo page)
5. **Drag the entire unzipped `scp-rca` folder contents** into the upload area
   - You should see: `api/analyse.js`, `public/index.html`, `vercel.json`, `package.json`
6. Click **Commit changes**

### Step 2 — Deploy to Vercel

1. Go to **vercel.com** → click **Sign up with GitHub** → authorise
2. Click **Add New → Project** → find `scp-rca` → click **Import**
3. Leave all settings as default → click **Deploy**
4. Wait ~60 seconds — Vercel gives you a URL like `https://scp-rca-abc123.vercel.app`

### Step 3 — Add the API key (keeps it secret)

1. In Vercel → click your project → **Settings** (top nav) → **Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (your key from console.anthropic.com)
   - **Environments:** tick all three (Production, Preview, Development)
3. Click **Save**
4. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**

Done. Share the Vercel URL with colleagues — the API key is never visible to them.

---

## How it works

```
scp-rca/
├── api/
│   └── analyse.js      ← Runs on Vercel's servers, holds the API key
├── public/
│   └── index.html      ← What colleagues see in their browser
├── vercel.json         ← Routing config
└── package.json
```

The browser calls `/api/analyse` → Vercel's server calls Anthropic with the hidden key → results returned to browser. The key never touches the user's machine.

---

## Updating the tool

To make changes: edit files on GitHub directly (click the file → pencil icon → edit → commit). Vercel auto-redeploys within 30 seconds.
