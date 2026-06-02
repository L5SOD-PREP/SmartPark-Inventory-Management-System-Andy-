export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary animate-spin" />
        </div>
        <p className="text-sm text-brand-muted font-medium">{message}</p>
      </div>
    </div>
  );
}
