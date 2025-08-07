import { createCheckoutSessionAction } from '@/app/actions/bookings'
import Button from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function PayInvoice({ params }: { params: { invoiceId: string }}) {
  async function pay() {
    "use server"
    const res = await createCheckoutSessionAction({ invoice_id: params.invoiceId })
    if ((res as any).alreadyPaid) {
      redirect("/(member)/dashboard?paid=1")
    }
    const url = (res as any).url as string
    if (!url) throw new Error("No URL from Checkout session")
    redirect(url)
  }

  return (
    <form action={pay}>
      <h1 className="text-xl font-semibold">Pay Invoice</h1>
      <p className="text-sm text-gray-600 mb-3">Invoice ID: {params.invoiceId}</p>
      <Button type="submit">Pay with Stripe</Button>
    </form>
  )
}