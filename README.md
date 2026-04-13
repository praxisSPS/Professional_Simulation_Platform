# Praxis — Professional Simulation Platform

## Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Payments: Stripe
- AI: Google Gemini API
- Deploy: Vercel

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your keys (see DEPLOY.md for step-by-step)
npm run dev
```

## Deploy
```bash
vercel --prod
```
