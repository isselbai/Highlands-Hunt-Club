import Link from 'next/link'

export default function Nav() {
  return (
    <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-heading text-xl text-brand-green">Highland</Link>
        <div className="hidden md:flex gap-4 text-sm">
          <Link href="/(member)/dashboard" className="hover:text-brand-green">Dashboard</Link>
          <Link href="/(member)/book" className="hover:text-brand-green">Book</Link>
          <Link href="/(admin)/admin/calendar" className="hover:text-brand-green">Admin</Link>
          <Link href="/(admin)/admin/availability" className="hover:text-brand-green">Availability</Link>
          <Link href="/(admin)/admin/reports" className="hover:text-brand-green">Reports</Link>
        </div>
      </nav>
    </header>
  )
}