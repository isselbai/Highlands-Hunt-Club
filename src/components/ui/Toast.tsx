'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useState } from 'react'

type Toast = { id: string; text: string; tone?: 'ok'|'warn'|'danger' }
const Ctx = createContext<{push:(t:Omit<Toast,'id'>)=>void}>({ push: ()=>{} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((t: Omit<Toast,'id'>)=> {
    const id = Math.random().toString(36).slice(2)
    setToasts(s => [...s, { id, ...t }])
    setTimeout(()=> setToasts(s => s.filter(x=>x.id!==id)), 3200)
  },[])
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className={`shadow-card rounded-md px-3 py-2 text-sm bg-white border
                ${t.tone==='danger'?'border-red-200':'border-brand-gold/30'}`}>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
export function useToast(){ return useContext(Ctx) }