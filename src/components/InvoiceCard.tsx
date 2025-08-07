import Button from '@/components/ui/Button'
export default function InvoiceCard({ invoice }: { invoice: { id: string; amount_cents: number; status: string; created_at: string } }) {
  const amt = (invoice.amount_cents / 100).toFixed(2)
  const d = new Date(invoice.created_at).toLocaleDateString()
  const isPaid = invoice.status === 'paid'
  return (
    <div className="rounded-xl border bg-white p-4 shadow-card flex items-center justify-between">
      <div>
        <div className="font-medium">Invoice #{invoice.id.slice(0,8).toUpperCase()}</div>
        <div className="text-sm text-gray-600">{d} • ${amt}</div>
      </div>
      {isPaid ? (
        <span className="text-emerald-700 font-medium">Paid</span>
      ) : (
        <a href={`/(member)/invoices/${invoice.id}/pay`}><Button variant="primary">Pay Now</Button></a>
      )}
    </div>
  )
}