# ESP — Deployment Guide
# Follow these steps EXACTLY. Takes about 30 minutes.

# ════════════════════════════════════════
# STEP 1 — Accounts you need (all free to start)
# ════════════════════════════════════════

# 1a. GitHub: github.com — create account, create new repo called "esp-platform"
# 1b. Supabase: supabase.com — create account, create new project called "esp"
#     → Copy: Project URL + anon key (Settings → API)
#     → Copy: service_role key (Settings → API → scroll down)
#
# 1c. Vercel: vercel.com — create account, connect GitHub
#
# 1d. Google AI Studio: aistudio.google.com
#     → Get API Key → copy it
#
# 1e. Stripe: stripe.com — create account
#     → Developers → API keys → copy publishable + secret keys
#     → Create webhook: Endpoint = https://your-domain.vercel.app/api/stripe/webhook
#       Events: customer.subscription.created, updated, deleted
#     → Copy webhook signing secret

# ════════════════════════════════════════
# STEP 2 — Set up Supabase database
# ════════════════════════════════════════

# In Supabase Dashboard → SQL Editor → New query
# Copy the entire contents of supabase/schema.sql and run it.
# You should see: "Success. No rows returned"

# ════════════════════════════════════════
# STEP 3 — Local development setup
# ════════════════════════════════════════

# Install Node.js 18+ from nodejs.org if you don't have it

# Clone or download this folder, then:
npm install

# Create your environment file
cp .env.example .env.local

# Edit .env.local and fill in all values from Step 1
# Use any text editor — Notepad works fine on Windows

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
# You should see the ESP login page

# ════════════════════════════════════════
# STEP 4 — Deploy to Vercel (public URL)
# ════════════════════════════════════════

# Install Vercel CLI
npm install -g vercel

# Deploy (first time — follow the prompts)
vercel

# Add your environment variables in Vercel Dashboard:
# Project → Settings → Environment Variables
# Add all variables from your .env.local file

# Deploy to production
vercel --prod

# Your app is now live at: https://esp-platform.vercel.app
# (or your custom domain)

# ════════════════════════════════════════
# STEP 5 — Set up Stripe products
# ════════════════════════════════════════

# In Stripe Dashboard → Products → Add product
# Product 1: "ESP Premium"
#   → Price: £29/month, recurring
#   → Copy the Price ID (starts with price_)
#   → Paste into src/app/api/stripe/webhook/route.ts line:
#     'price_premium_monthly': 'premium'  ← replace price_premium_monthly with your real Price ID
#
# Product 2: "ESP Pro"
#   → Price: £99/month, recurring
#   → Same process for pro tier

# ════════════════════════════════════════
# STEP 6 — Test end to end
# ════════════════════════════════════════

# 1. Go to your live URL
# 2. Sign up with a real email
# 3. Check Supabase → Table Editor → profiles → you should see your row
# 4. Click "Clock in" on the dashboard
# 5. Check Supabase → simulation_sessions → you should see an active session
# 6. An AI message should appear in your inbox within ~10 seconds

# ════════════════════════════════════════
# WHAT CLAUDE BUILT vs WHAT YOU CONFIGURE
# ════════════════════════════════════════
#
# Claude built:           You configure:
# ─────────────────────   ──────────────────────────────────
# All React components    Supabase project URL + keys
# All API routes          Gemini API key
# KPI engine              Stripe products + price IDs
# AI coworker engine      Vercel deployment
# Simulation scripts      Custom domain (optional)
# Database schema         Email auth settings in Supabase
# Stripe webhook          
# Deployment config       
#
# If anything breaks: copy the error message and send it to Claude.
# Claude will fix the code. You re-deploy with: vercel --prod

# ════════════════════════════════════════
# ADDING A BETA USER
# ════════════════════════════════════════

# Option A — they sign up themselves at your URL
# Option B — invite via Supabase Dashboard → Authentication → Users → Invite user

# To give a user premium access manually (while Stripe isn't wired up):
# Supabase → SQL Editor:
# UPDATE profiles SET subscription_tier = 'premium' WHERE email = 'user@example.com';
