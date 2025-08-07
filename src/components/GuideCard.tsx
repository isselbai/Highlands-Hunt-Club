export default function GuideCard({ guide }: { guide: { full_name: string; photo_url?: string; dog_names?: string[]; bio?: string } }) {
  return (
    <div className="rounded-xl border bg-white shadow-card overflow-hidden">
      <img src={guide.photo_url ?? '/guide-fallback.jpg'} alt="" className="w-full h-40 object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="font-heading text-lg">{guide.full_name}</h3>
        {guide.dog_names && guide.dog_names.length > 0 && (
          <p className="text-sm text-gray-600">Dogs: {guide.dog_names.join(', ')}</p>
        )}
        {guide.bio && <p className="text-sm text-gray-700">{guide.bio}</p>}
      </div>
    </div>
  )
}