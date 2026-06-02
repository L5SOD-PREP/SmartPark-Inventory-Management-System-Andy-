const iconBg = {
  blue: 'bg-blue-100',
  green: 'bg-emerald-100',
  yellow: 'bg-amber-100',
  red: 'bg-red-100',
  purple: 'bg-violet-100',
};
const iconColor = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  yellow: 'text-amber-600',
  red: 'text-red-600',
  purple: 'text-violet-600',
};

export default function Card({ title, value, icon, color = 'blue', subtitle, children }) {
  return (
    <div className="group bg-white border border-brand-border rounded-2xl p-6 hover:border-blue-200 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary/40 via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-muted mb-2">{title}</p>
          <p className="text-3xl font-bold text-brand-text tracking-tight leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg[color] || iconBg.blue} flex items-center justify-center ${iconColor[color] || iconColor.blue} shrink-0 group-hover:scale-110 group-hover:shadow-sm transition-all duration-300`}>
          {icon}
        </div>
      </div>
      <div className="mt-5 h-px rounded-full bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent" />
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
