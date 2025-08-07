'use server'
import { callFn } from './_functions'

export async function rescheduleBookingAction(input:{
  booking_id:string; field_id:string; starts_at:string; ends_at:string
}) {
  return callFn('reschedule-booking', input)
}