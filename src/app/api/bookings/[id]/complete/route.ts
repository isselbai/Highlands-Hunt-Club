import { NextRequest, NextResponse } from 'next/server'
import { completeBookingAndInvoiceAction } from '@/app/actions/admin'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await completeBookingAndInvoiceAction(params.id)
    return NextResponse.json(data)
  } catch (e: any) {
    return new NextResponse(e?.message ?? 'Error', { status: 400 })
  }
}