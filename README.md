# FRA DSS Platform (Forest Rights Act Decision Support System)

The Forest Rights Act of 2006 was meant to give land rights to millions of forest-dwelling people in India. But even after 18 years, most promises remain unfulfilled. Around 80% of the eligible land is still not recognized, and out of 4 million claims filed, nearly half have been rejected. The system is overloaded with piles of outdated paper records.

This is more than just poor administration—it’s about real people left without legal rights, stuck in poverty and insecurity. The answer isn’t simply working harder; it’s about finding smarter solutions.

We’ve developed the FRA DSS Platform, an AI-powered digital ecosystem that transforms this entire process. Think of it as a “living digital twin” of India’s forest communities.
Demo Video - 


https://github.com/user-attachments/assets/538faea3-0db3-4d10-8353-a7cc1de50e6b


## What the Platform Does

1) AI-Powered Digitization
- We use cutting-edge OCR and Named Entity Recognition (NER) to convert chaotic paper files into a single, structured national database. It’s a one-time process that solves the root problem of data fragmentation.

2) Interactive FRA Atlas (WebGIS)
- A dynamic, real-time map of rights and resources. Using Computer Vision and SOTA Transformers like DeepLabv3, the system automatically maps community assets (water bodies, agricultural land, etc.) from satellite imagery. This creates transparent, visual truth for villagers, NGOs, and policymakers alike.

3) Proactive Decision Support System (DSS)
- A hybrid AI + rule-based engine analyzes a recognized land claim and automatically recommends specific government welfare schemes a beneficiary is eligible for (e.g., PM-KISAN, MGNREGA, Jal Jeevan Mission). This bridges the gap between legal rights and tangible livelihood outcomes.

## Impact

- For communities: secure tenure + direct access to welfare; stronger role in local governance.
- For government: breaks silos; enables data-driven, efficient, and coordinated planning.
- For NGOs/activists: unprecedented transparency to track progress and advocate effectively.

The FRA DSS Platform is not just technology; it’s a governance transformation tool—moving beyond a historic law on paper to a living reality that secures land rights, livelihoods, and the sustainable conservation of forests.

---

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, TanStack Query
- UI: Radix UI components (via shadcn-inspired wrappers), Lucide icons
- Mapping: Leaflet, React-Leaflet
- Backend: Supabase (PostgreSQL + PostGIS, Auth, Storage, Edge Functions)
- Build/Deploy: Vite, Vercel

## Project Structure (key folders)

- src/ — application code (components, pages, hooks, integrations)
- supabase/ — SQL migrations, seed data, and edge functions
- docs/ — backend API notes and setup guides
- scripts/ — helper scripts (e.g., database setup/testing)

## Live Demo

- Production: https://fra-atlas-platform.vercel.app

---

## Getting Started (Local)

Prerequisites
- Node.js 18+ and npm
- Supabase project (URL + anon key)

1) Clone and install
```
# from any directory
git clone <your-repo-url> fra-atlas-platform
cd fra-atlas-platform
npm install
```

2) Environment variables
Create a .env file in the project root with your Supabase credentials:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

3) Run the app
```
npm run dev
```
- Vite will print a local URL (e.g., http://localhost:5173 or 8080).

4) Optional: Test backend connectivity (Supabase)
```
npm run test-backend
```
This script verifies DB access, table presence, and storage.

---

## Deploying to Vercel (recommended)

Option A: Using the Vercel Dashboard (no CLI required)
1) Go to https://vercel.com and log in.
2) New Project → Import your GitHub repo.
3) Framework Preset: Vite (auto-detected).
4) Build settings:
   - Build Command: vite build
   - Output Directory: dist
5) Environment Variables (both Production and Preview):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
6) Deploy.

Option B: Using Vercel CLI
1) Install (one-time):
```
npm i -g vercel  # or run with npx as shown below
```
2) From the project root, log in and link:
```
npx vercel login
npx vercel link
```
3) Add env vars (do this for production and preview):
```
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```
4) Deploy:
```
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

Custom domain (optional)
```
npx vercel domains add yourdomain.com
```
Then assign the domain under Project → Settings → Domains in the Vercel dashboard and follow DNS instructions.

Make project page public (optional)
- Vercel Dashboard → Project → Settings → General → Project Visibility → Public → Save.

---

## Deployment Notes

- This project builds with Vite (no server rendering); ensure Output Directory is set to dist.
- The .env file should never be committed. The repository’s .gitignore already excludes it.
- On CI (Vercel), set environment variables in the dashboard or via CLI; do not hardcode secrets.

## Scripts

- dev: start Vite dev server
- build: build the production bundle
- preview: preview the production build locally
- test-backend: quick Supabase connectivity check

```
npm run dev
npm run build
npm run preview
npm run test-backend
```
## Team Members :
- Suman Sharma - https://github.com/Suman1108-beep
- kshitij Singh - https://github.com/kxhitz
- Aastha Sinha - https://github.com/builtbyaastha
- Khushi - http://github.com/khushiiiip
- Anjali - 
- Diva Bhattacharya - https://github.com/Divabhattacharya

## License

- MIT License



