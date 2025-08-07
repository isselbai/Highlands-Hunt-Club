import { clsx } from 'clsx'
export default function Badge({ children, tone='ok' }: { children: React.ReactNode; tone?: 'ok' | 'warn' | 'danger' }) {
  const styles = {
    ok: 'bg-emerald-100 text-emerald-800',
    warn: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  }[tone]
  return <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium', styles)}>{children}</span>
}