'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'

export default function Login() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMsg(error ? error.message : 'Logged in. Refresh or navigate.')
  }

  return (
    <form className="max-w-sm space-y-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <Button type="submit">Sign In</Button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </form>
  )
}