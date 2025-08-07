import { supabaseServer } from '@/lib/supabaseServer'
import CalendarTable from '@/components/CalendarTable'
import ClientWeek from './ClientWeek'
import Link from 'next/link'

function getRange(dateStr: string, range: 'day' | 'week') {
  const d = new Date(dateStr + 'T00:00:00')
  const start = new Date(d)
  const end = new Date(d)
  if (range === 'day') {
    end.setDate(end.getDate() + 1)
  } else {
    const day = d.getDay()
    const diffToMon = (day + 6) % 7
    start.setDate(d.getDate() - diffToMon)
    end.setTime(start.getTime())
    end.setDate(start.getDate() + 7)
  }
  return { start: start.toISOString(), end: end.toISOString() }
}

export default async function AdminCalendar({ searchParams }: { searchParams: Record<string, string> }) {
  const date = searchParams.date ?? new Date().toISOString().slice(0,10)
  const range = (searchParams.range as 'day' | 'week') ?? 'day'
  const activityType = searchParams.activity ?? undefined
  const guideId = searchParams.guide ?? undefined

  const { start, end } = getRange(date, range)
  const sb = supabaseServer()

  let q = sb.from('bookings').select(`
      id, starts_at, ends_at, status,
      activities:activity_id ( name, type ),
      fields:field_id ( name ),
      guides:guide_id ( full_name )
    `)
    .gte('starts_at', start).lt('starts_at', end)
    .order('starts_at', { ascending: true })

  if (activityType) q = q.eq('activities.type', activityType)
  if (guideId) q = q.eq('guide_id', guideId)

  const { data: rows } = await q
  const { data: guides } = await sb.from('guides').select('id, full_name').eq('is_active', true)
  const { data: acts } = await sb.from('activities').select('type, name').order('name')

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin — Calendar</h1>

      <form className="flex flex-wrap gap-3">
        <div>
          <label className="block text-sm">Date</label>
          <input className="border rounded p-2" type="date" name="date" defaultValue={date} />
        </div>
        <div>
          <label className="block text-sm">Range</label>
          <select className="border rounded p-2" name="range" defaultValue={range}>
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Activity</label>
          <select className="border rounded p-2" name="activity" defaultValue={activityType ?? ''}>
            <option value="">All</option>
            {acts?.map(a => <option key={a.type} value={a.type}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Guide</label>
          <select className="border rounded p-2" name="guide" defaultValue={guideId ?? ''}>
            <option value="">All</option>
            {guides?.map(g => <option key={g.id} value={g.id}>{g.full_name}</option>)}
          </select>
        </div>
        <button className="border px-3 py-2 rounded">Apply</button>
      </form>

      <details open>
        <summary className="cursor-pointer font-medium">Table View</summary>
        <CalendarTable rows={rows ?? []} />
      </details>

      <details>
        <summary className="cursor-pointer font-medium">Week (Draggable)</summary>
        <ClientWeek />
      </details>

      <div className="text-sm text-gray-600">
        Use the Week view to drag bookings; select empty time to create a blackout (choose Field first).
      </div>
    </div>
  )
}