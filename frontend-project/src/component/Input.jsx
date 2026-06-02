export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-semibold text-brand-muted mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-brand-border hover:border-slate-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
