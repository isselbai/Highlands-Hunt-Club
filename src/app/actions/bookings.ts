'use server'
import { callFn } from './_functions'

export async function createBookingAction(input: {
  member_id: string
  activity_id: string
  field_id: string
  starts_at: string
  ends_at?: string
  requires_guide?: boolean
}) {
  return callFn('create-booking', input)
}

export async function assignGuideAction(input: { booking_id: string, guide_id: string }) {
  return callFn('assign-guide', input)
}

export async function generateInvoiceAction(input: { booking_id: string }) {
  return callFn('generate-invoice', input)
}

export async function createCheckoutSessionAction(input: { invoice_id: string }) {
  return callFn('create-checkout-session', input)
}

export async function cancelBookingAction(input: { booking_id: string; member_user_id?: string; reason?: string }) {
  return callFn('cancel-booking', input)
}