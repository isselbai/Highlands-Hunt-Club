type Row = {
  id: string
  starts_at: string
  ends_at: string
  status: string
  activities: { name: string; type: string } | null
  fields: { name: string } | null
  guides: { full_name: string } | null
}

export default function CalendarTable({ rows }: { rows: Row[] }) {
  const grouped = rows.reduce<Record<string, Row[]>>((acc, r) => {
    const key = r.fields?.name ?? 'Unknown Field'
    acc[key] = acc[key] || []
    acc[key].push(r)
    return acc
  }, {})

  const fieldNames = Object.keys(grouped).sort()

  return (
    <div className="space-y-6">
      {fieldNames.map(field => (
        <div key={field}>
          <h3 className="font-medium mb-2">{field}</h3>
          <div className="overflow-x-auto border rounded bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">End</th>
                  <th className="px-3 py-2">Activity</th>
                  <th className="px-3 py-2">Guide</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {grouped[field].map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{new Date(r.starts_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{new Date(r.ends_at).toLocaleTimeString()}</td>
                    <td className="px-3 py-2">{r.activities?.name}</td>
                    <td className="px-3 py-2">{r.guides?.full_name ?? '—'}</td>
                    <td className="px-3 py-2">{r.status}</td>
                  </tr>
                ))}
                {grouped[field].length === 0 && (
                  <tr><td className="px-3 py-2" colSpan={5}>No bookings</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {fieldNames.length === 0 && <p>No bookings in range.</p>}
    </div>
  )
}