import { NextRequest, NextResponse } from 'next/server'
import { createBookingAction } from '@/app/actions/bookings'

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const data = await createBookingAction(body)
    return NextResponse.json(data)
  } catch (e: any) {
    return new NextResponse(e?.message ?? 'Error', { status: 400 })
  }
}