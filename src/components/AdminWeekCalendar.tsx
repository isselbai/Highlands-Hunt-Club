'use client'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateSelectArg, EventDropArg, EventResizeDoneArg } from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { rescheduleBookingAction } from '@/app/actions/calendar'
import { createAvailability } from '@/app/actions/availability'
import Link from 'next/link'

type FCEvent = { id:string; title:string; start:string; end:string; backgroundColor?:string; borderColor?:string; extendedProps:{ field_id:string } }

function hashToColor(id: string): string {
  let h = 0
  for (let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) % 360
  return `hsl(${h}, 65%, 75%)`
}

function Modal({ open, onClose, children }:{ open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-card max-w-lg w-full p-4" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function AdminWeekCalendar() {
  const [events,setEvents] = useState<FCEvent[]>([])
  const [fields,setFields] = useState<{id:string;name:string}[]>([])
  const [msg,setMsg] = useState<string| null>(null)
  const [blkField,setBlkField] = useState<string | null>(null)
  const [open,setOpen] = useState(false)
  const [selected, setSelected] = useState<{ id:string; title:string } | null>(null)

  useEffect(()=>{
    supabase.from('fields').select('id,name').then(({data})=>setFields(data??[]))
    const now = new Date()
    const start = new Date(now); start.setDate(start.getDate()-2)
    const end = new Date(now); end.setDate(end.getDate()+8)

    supabase.from('bookings').select(`
      id, starts_at, ends_at,
      activities:activity_id(name),
      fields:field_id(id,name),
      guides:guide_id(full_name)
    `)
    .gte('starts_at', start.toISOString()).lt('starts_at', end.toISOString())
    .then(({data})=>{
      const ev = (data??[]).map((b:any)=>{
        const color = hashToColor(b.fields?.id as string)
        return ({
          id: b.id,
          title: `${b.activities?.name ?? 'Booking'}${b.guides?.full_name ? ' • '+b.guides.full_name : ''} @ ${b.fields?.name ?? ''}`,
          start: b.starts_at,
          end: b.ends_at,
          backgroundColor: color, borderColor: color,
          extendedProps: { field_id: b.fields?.id as string }
        })
      })
      setEvents(ev)
    })
  },[])

  async function onEventDrop(arg: EventDropArg) {
    setMsg(null)
    const ev = arg.event
    const field_id = (ev.extendedProps as any).field_id
    try{
      await rescheduleBookingAction({
        booking_id: ev.id,
        field_id,
        starts_at: ev.start!.toISOString(),
        ends_at: ev.end!.toISOString()
      })
      setMsg('Rescheduled')
    }catch(e:any){ setMsg(e.message || 'Failed'); arg.revert() }
  }

  function onEventClick(info: any){
    setSelected({ id: info.event.id, title: info.event.title }); setOpen(true)
  }
  async function onEventResize(arg: EventResizeDoneArg) {
    return onEventDrop(arg as unknown as EventDropArg)
  }

  async function onSelect(sel: DateSelectArg) {
    setMsg(null)
    if (!blkField) { setMsg('Select a Field for blackout first.'); return }
    try {
      await createAvailability({
        field_id: blkField,
        activity_type: 'upland_solo',
        starts_at: sel.startStr,
        ends_at: sel.endStr,
        is_blocked: true
      })
      setMsg('Blackout created')
    } catch(e:any){
      setMsg(e.message || 'Failed')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm">Blackout Field:</label>
        <select className="border rounded p-2" value={blkField ?? ''} onChange={e=>setBlkField(e.target.value || null)}>
          <option value="">— choose —</option>
          {fields.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <span className="text-sm text-gray-600">Drag events to reschedule; drag borders to resize; drag-select to create a blackout.</span>
      </div>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotDuration="00:30:00"
        editable
        selectable
        events={events}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        select={onSelect}
        height="auto"
      />
      {msg && <p className="text-sm text-gray-700">{msg}</p>}
      <Modal open={open} onClose={()=>setOpen(false)}>
        <div className="space-y-3">
          <h3 className="font-heading text-lg">{selected?.title}</h3>
          <div className="flex gap-2">
            <Link className="underline" href={`/(admin)/admin/bookings/${selected?.id}`}>Open booking</Link>
            <button className="text-gray-500" onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}