'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ActivityHero from '@/components/ActivityHero'
import SlotCard, { Slot } from '@/components/SlotCard'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Activity = { id: string; name: string; type: string }
const MIN_LEAD_MINUTES = Number(process.env.NEXT_PUBLIC_MIN_LEAD_MINUTES ?? '0')

function dayPart(d: Date){
  const h = d.getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Midday'
  return 'Afternoon'
}

export default function Book() {
  const { push } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [activityType, setActivityType] = useState<string>('upland_solo')
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().slice(0,10))
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('activities').select('id,name,type').then(({ data }) => setActivities(data ?? []))
  }, [])

  async function loadSlots() {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_available_slots', {
      p_activity: activityType, p_day: dateStr, p_min_lead_minutes: MIN_LEAD_MINUTES
    })
    setLoading(false)
    if (error) { push({ text: error.message, tone:'danger' }); return }
    setSlots((data ?? []).map((d:any)=> ({ ...d })))
  }

  async function onBook(slot: Slot) {
    const { data: me } = await supabase.from('members').select('id').limit(1)
    const { data: act } = await supabase.from('activities').select('id').eq('type', activityType).limit(1)
    if (!me?.[0]?.id || !act?.[0]?.id) { push({ text: 'Member or activity not found', tone:'danger' }); return }
    const res = await fetch('/api/book', {
      method: 'POST',
      body: JSON.stringify({ member_id: me[0].id, activity_id: act[0].id, field_id: slot.field_id, starts_at: slot.starts_at, ends_at: slot.ends_at })
    })
    if (res.ok) { push({ text: 'Booked! See your dashboard.' }); loadSlots(); }
    else push({ text: await res.text(), tone:'danger' })
  }

  useEffect(()=>{ loadSlots() }, [activityType, dateStr])

  const grouped = useMemo(() => {
    const g: Record<string, Slot[]> = { Morning: [], Midday: [], Afternoon: [] }
    for (const s of slots) g[dayPart(new Date(s.starts_at))].push(s)
    return g
  }, [slots])

  const currentActivity = activities.find(a => a.type === activityType)

  return (
    <div className="space-y-5">
      <ActivityHero
        title={currentActivity?.name ?? 'Book an Activity'}
        subtitle="Pick a time that works for you. You’ll receive a confirmation email immediately."
        imageUrl={activityType.includes('upland') ? '/upland-hero.jpg' :
                  activityType.includes('clays') ? '/clays-hero.jpg' :
                  activityType.includes('rifle') ? '/rifle-hero.jpg' : undefined}
      />
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-700">Activity</label>
          <select className="border rounded p-2" value={activityType} onChange={e=>setActivityType(e.target.value)}>
            {activities.map(a => <option key={a.type} value={a.type}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Date</label>
          <input className="border rounded p-2" type="date" value={dateStr} onChange={e=>setDateStr(e.target.value)} />
        </div>
        <Button onClick={loadSlots}>Refresh</Button>
        {MIN_LEAD_MINUTES > 0 && (
          <div className="text-xs text-gray-600">Note: minimum lead time {MIN_LEAD_MINUTES} minutes.</div>
        )}
      </div>

      {loading && <p>Loading…</p>}

      {!loading && ['Morning','Midday','Afternoon'].map(part => (
        <div key={part} className="space-y-2">
          <h3 className="font-heading text-lg text-brand-green">{part}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grouped[part].map(s => <SlotCard key={s.field_id + s.starts_at} slot={s} onBook={onBook} />)}
            {grouped[part].length === 0 && <p className="text-sm text-gray-500">No slots.</p>}
          </div>
        </div>
      ))}
    </div>
  )
}