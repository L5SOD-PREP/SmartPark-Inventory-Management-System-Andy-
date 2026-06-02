import { useState, useEffect } from "react";
import API from "../api/axios";
import Card from "../component/Card";
import Loading from "../component/Loading";
import Button from "../component/Button";
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [spRes, siRes, soRes, lowRes] = await Promise.all([
        API.get("/spare-parts"),
        API.get("/stock-in"),
        API.get("/stock-out"),
        API.get("/reports/low-stock"),
      ]);
      const totalValue = spRes.data.reduce(
        (sum, item) => sum + parseFloat(item.TotalPrice || 0),
        0,
      );
      setStats({
        totalParts: spRes.data.length,
        totalStockIn: siRes.data.length,
        totalStockOut: soRes.data.length,
        lowStock: lowRes.data.length,
        totalValue,
      });
      setLowStockItems(lowRes.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div>
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center gap-4 mb-2">
            <div className="">
              <Wrench size={44} className="text-blue" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-brand-muted mt-1 leading-relaxed">
                SmartPark Inventory — overview at a glance.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-card">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="mb-12 sm:mb-16 lg:mb-20"
        style={{ animation: "fadeInUp 0.4s ease-out" }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="">
            <Wrench size={40} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-brand-muted mt-1 leading-relaxed">
              SmartPark Inventory — overview at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
        <div style={{ animation: "fadeInUp 0.4s ease-out 0.05s both" }}>
          <Card
            title="Total Spare Parts"
            value={stats?.totalParts || 0}
            icon={<Package size={24} />}
            color="blue"
            subtitle="Items in catalog"
          />
        </div>
        <div style={{ animation: "fadeInUp 0.4s ease-out 0.1s both" }}>
          <Card
            title="Stock In Records"
            value={stats?.totalStockIn || 0}
            icon={<ArrowDownToLine size={24} />}
            color="green"
            subtitle="Total transactions"
          />
        </div>
        <div style={{ animation: "fadeInUp 0.4s ease-out 0.15s both" }}>
          <Card
            title="Stock Out Records"
            value={stats?.totalStockOut || 0}
            icon={<ArrowUpFromLine size={24} />}
            color="purple"
            subtitle="Total transactions"
          />
        </div>
        <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
          <Card
            title="Low Stock Alerts"
            value={stats?.lowStock || 0}
            icon={<AlertTriangle size={24} />}
            color="yellow"
            subtitle="Items below threshold"
          />
        </div>
      </div>

      <div
        className="grid lg:grid-cols-2 gap-6"
        style={{ animation: "fadeInUp 0.4s ease-out 0.25s both" }}
      >
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg lg:text-xl font-bold text-brand-text tracking-tight mb-2">
            Inventory Summary
          </h2>
          <p className="text-sm text-brand-muted mb-8">
            Current stock value and totals.
          </p>
          {stats ? (
            <div className="space-y-6">
              {[
                {
                  label: "Total Inventory Value",
                  value: `${stats.totalValue.toLocaleString()} RWF`,
                  dot: "bg-brand-primary",
                },
                {
                  label: "Total Spare Parts",
                  value: stats.totalParts,
                  dot: "bg-blue-400",
                },
                {
                  label: "Average Unit Value",
                  value: stats.totalParts
                    ? `${(stats.totalValue / stats.totalParts).toFixed(0)} RWF`
                    : "0 RWF",
                  dot: "bg-slate-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-brand-text">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              No data available.
            </p>
          )}
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg lg:text-xl font-bold text-brand-text tracking-tight">
              Low Stock Items
            </h2>
            {stats?.lowStock > 0 && (
              <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                {stats.lowStock} alert{stats.lowStock !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-muted mb-8">
            Items with quantity below 10 units.
          </p>
          {lowStockItems.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-slate-500">
                  All items are well stocked
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.SpareP_ID}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50/80 to-amber-50/80 border border-red-100 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      {item.Name}
                    </p>
                    <p className="text-xs text-brand-muted mt-1">
                      {item.Category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${item.Quantity === 0 ? "text-red-600" : "text-amber-600"}`}
                    >
                      {item.Quantity} units
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5">remaining</p>
                  </div>
                </div>
              ))}
              {stats?.lowStock > 5 && (
                <p className="text-xs text-center text-slate-400 pt-3">
                  +{stats.lowStock - 5} more items with low stock
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
