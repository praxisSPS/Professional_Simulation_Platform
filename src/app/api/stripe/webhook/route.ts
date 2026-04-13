import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const Stripe = (await import('stripe')).default
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) return NextResponse.json({ received: true })
    const stripe = new Stripe(stripeSecretKey)
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    let event: any
    if (webhookSecret && sig) {
      try { event = stripe.webhooks.constructEvent(body, sig, webhookSecret) }
      catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }) }
    } else {
      event = JSON.parse(body)
    }
    const supabase = await createClient()
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const sub = event.data.object
      if (sub.status === 'active') {
        await supabase.from('profiles').update({ subscription_tier: 'premium' }).eq('stripe_customer_id', sub.customer)
      }
    }
    if (event.type === 'customer.subscription.deleted') {
      await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('stripe_customer_id', event.data.object.customer)
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ received: true })
  }
}
