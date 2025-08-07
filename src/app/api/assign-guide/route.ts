import { NextRequest, NextResponse } from 'next/server'
import { assignGuideAction } from '@/app/actions/bookings'

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const data = await assignGuideAction(body)
    return NextResponse.json(data)
  } catch (e: any) {
    return new NextResponse(e?.message ?? 'Error', { status: 400 })
  }
}