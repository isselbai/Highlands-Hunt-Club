import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabaseServer'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const buf = Buffer.from(await req.arrayBuffer())
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoice_id = session.metadata?.invoice_id
    if (invoice_id) {
      const sb = supabaseServer()
      await sb.from('invoices').update({ status: 'paid' }).eq('id', invoice_id)
      await sb.from('payments').insert({
        invoice_id,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        method: 'stripe',
        stripe_payment_intent_id: session.payment_intent?.toString() ?? null
      })
      await fetch(`${process.env.SUPABASE_FUNCTIONS_URL}/email-dispatch`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE!}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payment_receipt', invoice_id })
      }).catch(()=>{})
    }
  }

  return NextResponse.json({ received: true })
}