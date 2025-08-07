'use server'

import { supabaseServer } from '@/lib/supabaseServer'
import { generateInvoiceAction } from './bookings'

export async function completeBookingAndInvoiceAction(bookingId: string) {
  const sb = supabaseServer()
  const { error: updErr } = await sb.from('bookings').update({ status: 'completed' }).eq('id', bookingId)
  if (updErr) throw new Error(updErr.message)
  const res = await generateInvoiceAction({ booking_id: bookingId })
  return res
}