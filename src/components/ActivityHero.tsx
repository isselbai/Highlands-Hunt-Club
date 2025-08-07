export default function ActivityHero({ title, subtitle, imageUrl }: { title: string; subtitle?: string; imageUrl?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.55))]" />
      <img src={imageUrl ?? '/hero-fallback.jpg'} alt="" className="w-full h-44 object-cover" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h2 className="font-heading text-2xl text-white drop-shadow">{title}</h2>
        {subtitle && <p className="text-brand-cream/90">{subtitle}</p>}
      </div>
    </div>
  )
}