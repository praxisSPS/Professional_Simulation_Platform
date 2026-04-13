// src/app/api/stripe/webhook/route.ts
// Handles all Stripe events — subscription created, updated, cancelled

import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Use service role for webhook (bypasses RLS — only ever called server-side)
const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map Stripe price IDs to ESP tiers
// Replace these with your actual Stripe Price IDs from the dashboard
const PRICE_TO_TIER: Record<string, string> = {
  'price_premium_monthly': 'premium',   // £29/month
  'price_pro_monthly': 'pro',           // £99/month
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const priceId = sub.items.data[0]?.price.id
      const tier = PRICE_TO_TIER[priceId] ?? 'free'
      const customerEmail = (await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer).email

      if (customerEmail) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier, subscription_id: sub.id })
          .eq('email', customerEmail)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerEmail = (await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer).email
      if (customerEmail) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'free', subscription_id: null })
          .eq('email', customerEmail)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

export const dynamic = 'force-dynamic'
