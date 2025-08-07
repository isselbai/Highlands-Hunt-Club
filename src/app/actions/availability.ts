'use server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function listAvailability({ fromISO, toISO }:{fromISO:string;toISO:string}) {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('availability_windows')
    .select('id, field_id, activity_type, starts_at, ends_at, is_blocked, max_concurrent, fields(name)')
    .gte('starts_at', fromISO).lt('starts_at', toISO)
    .order('starts_at',{ascending:true})
  if (error) throw new Error(error.message)
  return data
}

export async function createAvailability(input:{
  field_id:string; activity_type:string; starts_at:string; ends_at:string;
  is_blocked?:boolean; notes?:string; max_concurrent?:number;
}) {
  const sb = supabaseServer()
  const { error } = await sb.from('availability_windows').insert({
    field_id: input.field_id,
    activity_type: input.activity_type as any,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    is_blocked: !!input.is_blocked,
    notes: input.notes ?? null,
    max_concurrent: input.max_concurrent ?? 1
  })
  if (error) throw new Error(error.message)
  return { ok:true }
}

export async function updateAvailability(id:string, patch: Partial<{
  field_id:string; activity_type:string; starts_at:string; ends_at:string; is_blocked:boolean; notes:string; max_concurrent:number;
}>) {
  const sb = supabaseServer()
  const { error } = await sb.from('availability_windows').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
  return { ok:true }
}

export async function deleteAvailability(id:string) {
  const sb = supabaseServer()
  const { error } = await sb.from('availability_windows').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { ok:true }
}

export async function toggleBlackout(id:string, is_blocked:boolean) {
  return updateAvailability(id, { is_blocked })
}