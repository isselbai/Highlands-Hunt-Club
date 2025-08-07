'use server'

const FUNCTIONS_BASE = process.env.SUPABASE_FUNCTIONS_URL || `https://${
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//,'').split('.')[0]
}.functions.supabase.co`

async function callFn(name: string, payload: unknown): Promise<any> {
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE!}`
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Function ${name} failed: ${res.status} ${text}`)
  }
  return await res.json()
}

export { callFn }