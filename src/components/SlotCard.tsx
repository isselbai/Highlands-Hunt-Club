'use client'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export type Slot = { field_id: string; field_name: string; starts_at: string; ends_at: string; remaining_capacity?: number }

function capTone(n?: number){
  if (n === undefined) return 'ok'
  if (n >= 3) return 'ok'
  if (n >= 1) return 'warn'
  return 'danger'
}
function capLabel(n?: number){
  if (n === undefined) return 'Available'
  if (n >= 3) return 'Plenty'
  if (n >= 1) return 'Limited'
  return 'Full'
}

export default function SlotCard({ slot, onBook }: { slot: Slot; onBook: (slot: Slot)=>void }) {
  const start = new Date(slot.starts_at)
  const end = new Date(slot.ends_at)
  const tone = capTone(slot.remaining_capacity)
  const full = (slot.remaining_capacity ?? 1) <= 0

  return (
    <div className="rounded-xl border bg-white p-4 shadow-card hover:shadow-cardHover transition flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – {end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
        <div className="text-sm text-gray-600">{slot.field_name}</div>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={tone as any}>{capLabel(slot.remaining_capacity)}</Badge>
        <Button onClick={()=>onBook(slot)} disabled={full} variant={full?'secondary':'primary'}>
          {full ? 'Full' : 'Book'}
        </Button>
      </div>
    </div>
  )
}