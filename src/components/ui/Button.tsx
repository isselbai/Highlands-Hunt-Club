import { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export default function Button({
  className, children, disabled, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const { variant='primary', size='md' } = props as any
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-3'
  }[size]
  const variants = {
    primary:  'bg-brand-green text-white hover:opacity-95 focus:ring-brand-gold',
    secondary:'bg-white text-brand-green border border-brand-green hover:bg-brand-cream focus:ring-brand-gold',
    ghost:    'bg-transparent text-brand-green hover:bg-brand-cream focus:ring-brand-gold',
    success:  'bg-emerald-600 text-white hover:opacity-95 focus:ring-emerald-400',
    danger:   'bg-red-600 text-white hover:opacity-95 focus:ring-red-400',
  }[variant]
  return <button className={clsx(base, sizes, variants, className)} disabled={disabled} {...props}>{children}</button>
}