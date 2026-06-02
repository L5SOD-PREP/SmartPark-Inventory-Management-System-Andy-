import { useState } from 'react';
import API from '../api/axios';
import Button from '../component/Button';
import Input from '../component/Input';
import Table from '../component/Table';
import Loading from '../component/Loading';
import { useToast } from '../component/Toast';
import { FileText, AlertTriangle, ClipboardList, Download, Search, Wrench } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Reports() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('status');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/reports/stock-status');
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock status.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchReport = async () => {
    if (!dates.startDate || !dates.endDate) {
      toast('Please select both start and end dates.', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/reports/stock-report?startDate=${dates.startDate}&endDate=${dates.endDate}`);
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchLowStock = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/reports/low-stock');
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load low stock alerts.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (data.length === 0) return;
    const doc = new jsPDF();
    const tabLabel = tabs.find((t) => t.id === activeTab)?.label || 'Report';
    const cols = activeTab === 'status' ? statusColumns : activeTab === 'low' ? lowStockColumns : reportColumns;
    const headers = cols.map((c) => c.label);
    const keys = cols.map((c) => c.key);
    const rows = data.map((row) => keys.map((k) => String(row[k] ?? '')));

    doc.setFontSize(14);
    doc.text(`SIMS — ${tabLabel}`, 14, 20);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

    let y = 35;
    const margin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - margin * 2) / headers.length;
    const rowHeight = 7;

    const drawCell = (text, x, y, w, h, isHeader) => {
      if (isHeader) {
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.rect(x, y, w, h, 'F');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.setTextColor(30, 30, 30);
        doc.rect(x, y, w, h, 'F');
        doc.rect(x, y, w, h, 'S');
      }
      doc.setFontSize(7);
      doc.text(String(text), x + 1.5, y + 4.5);
    };

    headers.forEach((h, i) => drawCell(h, margin + i * colWidth, y, colWidth, rowHeight, true));
    y += rowHeight;

    rows.forEach((row) => {
      if (y > 270) { doc.addPage(); y = 20; }
      row.forEach((cell, i) => drawCell(cell, margin + i * colWidth, y, colWidth, rowHeight, false));
      y += rowHeight;
    });

    doc.save(`${activeTab}-report.pdf`);
    toast('PDF exported successfully.', 'success');
  };

  const statusColumns = [
    { key: 'Name', label: 'Part Name' }, { key: 'Category', label: 'Category' }, { key: 'Quantity', label: 'Current Stock' },
    { key: 'UnityPrice', label: 'Unit Price', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
    { key: 'TotalPrice', label: 'Total Value', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
    { key: 'TotalStockIn', label: 'Total In' }, { key: 'TotalStockOut', label: 'Total Out' },
  ];

  const reportColumns = [
    { key: 'Type', label: 'Type', render: (v) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${v === 'Stock In' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${v === 'Stock In' ? 'bg-emerald-500' : 'bg-red-500'}`} />{v}
      </span>
    )},
    { key: 'Name', label: 'Item' }, { key: 'Quantity', label: 'Quantity' },
    { key: 'UnitPrice', label: 'Unit Price', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
    { key: 'TotalPrice', label: 'Total', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
    { key: 'Date', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' },
  ];

  const lowStockColumns = [
    { key: 'SpareP_ID', label: 'ID' }, { key: 'Name', label: 'Part Name' }, { key: 'Category', label: 'Category' },
    { key: 'Quantity', label: 'Current Stock', render: (v) => <span className={`font-semibold ${v === 0 ? 'text-red-600' : 'text-amber-600'}`}>{v}</span> },
    { key: 'UnityPrice', label: 'Unit Price', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
  ];

  const tabs = [
    { id: 'status', label: 'Stock Status', icon: <ClipboardList size={18} />, desc: 'View current stock levels for all spare parts.' },
    { id: 'report', label: 'Stock Report', icon: <FileText size={18} />, desc: 'Generate movement reports within a date range.' },
    { id: 'low', label: 'Low Stock Alerts', icon: <AlertTriangle size={18} />, desc: 'Identify items running low on stock.' },
  ];

  const fetchByTab = (tabId) => {
    setActiveTab(tabId);
    setData([]);
    setError(null);
    if (tabId === 'status') fetchStatus();
    else if (tabId === 'low') fetchLowStock();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-12 sm:mb-16 lg:mb-20">
        <div className="">
          <Wrench size={40} className="text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-brand-muted mt-1">Generate and view inventory reports.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => fetchByTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-brand-muted hover:text-brand-text border border-brand-border'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-brand-text tracking-tight mb-1">{tabs.find((t) => t.id === activeTab)?.label}</h2>
            <p className="text-sm text-brand-muted">{tabs.find((t) => t.id === activeTab)?.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            {data.length > 0 && <Button variant="secondary" onClick={exportPDF}><Download size={16} />Export PDF</Button>}
            {activeTab === 'status' && <Button onClick={fetchStatus}><Search size={16} />Generate</Button>}
            {activeTab === 'low' && <Button onClick={fetchLowStock}><Search size={16} />Check Alerts</Button>}
          </div>
        </div>

        {activeTab === 'report' && (
          <div className="flex flex-col sm:flex-row gap-6 items-end mb-8 p-6 bg-slate-50 rounded-2xl border border-brand-border">
            <Input label="Start Date" name="startDate" type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} className="mb-0" />
            <Input label="End Date" name="endDate" type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} className="mb-0" />
            <Button onClick={fetchReport} className="mb-1"><Search size={16} />Generate Report</Button>
          </div>
        )}

        {loading ? <Loading /> : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              {activeTab === 'status' ? <ClipboardList size={28} className="text-red-400" /> : activeTab === 'low' ? <AlertTriangle size={28} className="text-red-400" /> : <FileText size={28} className="text-red-400" />}
            </div>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            {activeTab === 'status' && <Button onClick={fetchStatus}>Retry</Button>}
            {activeTab === 'report' && <Button onClick={fetchReport}>Retry</Button>}
            {activeTab === 'low' && <Button onClick={fetchLowStock}>Retry</Button>}
          </div>
        ) : data.length > 0 ? (
          <Table columns={activeTab === 'status' ? statusColumns : activeTab === 'low' ? lowStockColumns : reportColumns} data={data} actions={false} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              {activeTab === 'status' ? <ClipboardList size={28} /> : activeTab === 'low' ? <AlertTriangle size={28} /> : <FileText size={28} />}
            </div>
            <p className="text-sm font-medium text-slate-500">No data to display</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'report' ? 'Select a date range and click "Generate Report".' : `Click "Generate" to load ${activeTab === 'status' ? 'stock status' : 'low stock alerts'}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
