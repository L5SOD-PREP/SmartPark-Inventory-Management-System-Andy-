import { Link } from "react-router-dom";
import {
  Wrench,
  Package,
  FileText,
  LogIn,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: <Package size={22} />,
    title: "Spare Parts Catalog",
    desc: "Manage your entire inventory with categories, quantities, and pricing.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Stock In & Out",
    desc: "Track every movement with automatic quantity updates.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: <FileText size={22} />,
    title: "Reports & Alerts",
    desc: "Generate reports and get notified when stock runs low.",
    color: "from-violet-500 to-violet-600",
  },
];

const stats = [
  { icon: <Shield size={16} />, label: "Real-time tracking" },
  { icon: <Clock size={16} />, label: "Instant alerts" },
  { icon: <TrendingUp size={16} />, label: "Smart analytics" },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <nav className="px-4 sm:px-6 lg:px-8 py-5 border-b border-brand-border bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="">
              <Wrench size={40} className="text-blue-700" />
            </div>
            <span className="text-brand-text font-bold text-xl tracking-tight">
              SIMS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-brand-muted hover:text-brand-text transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-blue-700 hover:from-brand-hover hover:to-blue-800 rounded-[10px] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <UserPlus size={16} className="inline mr-1.5" />
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto w-full py-16 lg:py-24 relative z-10">
          <div
            className="max-w-3xl mx-auto text-center mb-20"
            style={{ animation: "fadeInUp 0.6s ease-out" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-text leading-tight mb-6 tracking-tight">
              Smart Inventory for
              <span className="bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                SmartPark
              </span>
            </h1>
            <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Eliminate paper-based tracking. SIMS gives you real-time control
              over your spare parts inventory — from stock in to stock out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-blue-700 hover:from-brand-hover hover:to-blue-800 rounded-[10px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center inline-flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Create Account
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-brand-muted border border-brand-border hover:border-slate-300 hover:text-brand-text rounded-[10px] transition-all duration-200 bg-white hover:shadow-sm text-center inline-flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            </div>
          </div>

          <div
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="group text-center p-6 rounded-2xl bg-white border border-brand-border hover:border-blue-200 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-4 text-white shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-brand-text mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-400 border-t border-brand-border bg-white/95">
        <div className="max-w-[1200px] mx-auto">
          &copy; {new Date().getFullYear()} SIMS — SmartPark Inventory
          Management System
        </div>
      </footer>
    </div>
  );
}
