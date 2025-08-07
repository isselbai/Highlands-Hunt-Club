import { NextRequest, NextResponse } from 'next/server'
import { cancelBookingAction } from '@/app/actions/bookings'

export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=> ({}))
  try {
    const data = await cancelBookingAction({ booking_id: params.id, ...body })
    return NextResponse.json(data)
  } catch (e:any) {
    return new NextResponse(e?.message ?? 'Error', { status: 400 })
  }
}