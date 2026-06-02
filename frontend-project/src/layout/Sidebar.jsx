import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  LogOut,
  Wrench,
  ChevronLeft,
  X,
} from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/spare-parts", label: "Spare Parts", icon: <Package size={20} /> },
  { to: "/stock-in", label: "Stock In", icon: <ArrowDownToLine size={20} /> },
  { to: "/stock-out", label: "Stock Out", icon: <ArrowUpFromLine size={20} /> },
  { to: "/reports", label: "Reports", icon: <FileText size={20} /> },
];

export default function Sidebar({ onLogout, onClose }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-[260px]"} bg-white min-h-screen flex flex-col transition-all duration-300 relative border-r border-brand-border`}
    >
      <div className={`px-6 py-6 flex items-center justify-between ${collapsed ? "px-5" : ""}`}>
        {collapsed ? (
          <div className="">
            <Wrench size={40} className="text-blue-700" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="">
              <Wrench size={40} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-text tracking-tight">
                SIMS
              </h1>
              <p className="text-[11px] text-brand-muted font-medium">
                SmartPark Inventory
              </p>
            </div>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 -mr-1.5 text-brand-muted hover:text-brand-text rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      {!collapsed && user.name && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-text truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-brand-muted truncate leading-tight mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className={`flex-1 space-y-1 ${collapsed ? "px-3" : "px-4"}`}>
        {links.map((l) => {
          const isActive = location.pathname === l.to;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? "bg-brand-primary text-white shadow-sm" : "text-brand-muted hover:bg-slate-50 hover:text-brand-text"}`}
            >
              <span className="shrink-0">{l.icon}</span>
              {!collapsed && <span>{l.label}</span>}
              {isActive && collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-primary rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={`p-4 ${collapsed ? "px-3" : "px-4"}`}>
        <button
          onClick={onLogout}
          className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-brand-muted hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-1/2 w-6 h-6 bg-white border border-brand-border rounded-full items-center justify-center text-brand-muted hover:text-brand-text cursor-pointer transition-colors shadow-sm"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          size={14}
          className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
    </aside>
  );
}
