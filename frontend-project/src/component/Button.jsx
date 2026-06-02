const variants = {
  primary: 'bg-brand-primary hover:bg-brand-hover text-white shadow-sm shadow-blue-500/15 hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5',
  secondary: 'bg-white hover:bg-slate-50 text-brand-text border border-brand-border hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
  outline: 'border border-brand-border hover:border-brand-primary text-brand-muted hover:text-brand-primary bg-transparent hover:bg-blue-50/50 hover:-translate-y-0.5',
};

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-[10px] font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer active:scale-[0.97] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
