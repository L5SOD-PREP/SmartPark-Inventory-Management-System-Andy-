export default function Table({ columns, data, onEdit, onDelete, actions = true }) {
  return (
    <div className="overflow-x-auto max-w-full rounded-2xl border border-brand-border bg-white">
      <table className="min-w-[600px] w-full">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col) => (
              <th key={col.key} className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-muted sticky top-0 bg-slate-50 z-10">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-muted sticky top-0 bg-slate-50 z-10">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 sm:px-6 sm:py-16 text-center text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                  <svg className="w-10 h-10 text-slate-300" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span className="text-slate-500">No records found</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || row[columns[0]?.key] || idx} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-slate-700 whitespace-nowrap max-w-[200px] sm:max-w-[250px] truncate" title={row[col.key]}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {onEdit && <button onClick={() => onEdit(row)} className="px-3 py-1.5 text-xs font-medium text-brand-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">Edit</button>}
                      {onDelete && <button onClick={() => onDelete(row)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">Delete</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
