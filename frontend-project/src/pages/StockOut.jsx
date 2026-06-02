import { useState, useEffect } from 'react';
import { Plus, ArrowUpFromLine, Pencil, Trash2, Wrench } from 'lucide-react';
import API from '../api/axios';
import Modal from '../component/Modal';
import Input from '../component/Input';
import Button from '../component/Button';
import Loading from '../component/Loading';
import ConfirmModal from '../component/ConfirmModal';
import { useToast } from '../component/Toast';

const columns = [
  { key: 'StockOut_ID', label: 'ID' },
  { key: 'SparePartName', label: 'Spare Part' },
  { key: 'Category', label: 'Category' },
  { key: 'StockOutQuantity', label: 'Qty Sold' },
  { key: 'StockOutUnitPrice', label: 'Unit Price', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
  { key: 'StockOutTotalPrice', label: 'Total', render: (v) => v ? `${parseFloat(v).toLocaleString()} RWF` : '-' },
  { key: 'StockOutDate', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' },
];

export default function StockOut() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ SpareP_ID: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [soRes, spRes] = await Promise.all([API.get('/stock-out'), API.get('/spare-parts')]);
      setData(soRes.data);
      setSpareParts(spRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock out records.');
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    setError(null);
    try {
      const [soRes, spRes] = await Promise.all([API.get('/stock-out'), API.get('/spare-parts')]);
      setData(soRes.data);
      setSpareParts(spRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock out records.');
    }
  };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ SpareP_ID: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
    setEditRecord(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleEdit = (row) => {
    setEditRecord(row);
    setForm({
      SpareP_ID: row.SpareP_ID,
      StockOutQuantity: row.StockOutQuantity,
      StockOutUnitPrice: row.StockOutUnitPrice,
      StockOutDate: row.StockOutDate ? row.StockOutDate.split('T')[0] : '',
    });
    setModal(true);
  };

  const handleDeleteRequest = (row) => {
    setDeleteTarget(row);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/stock-out/${deleteTarget.StockOut_ID}`);
      toast('Stock out record deleted. Quantity returned to inventory.', 'success');
      setDeleteTarget(null);
      refreshData();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete record.', 'error');
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.SpareP_ID) errors.SpareP_ID = 'Select a spare part.';
    const qty = parseInt(form.StockOutQuantity, 10);
    if (!form.StockOutQuantity || isNaN(qty) || qty < 1) errors.StockOutQuantity = 'Enter a quantity of 1 or more.';
    const price = parseFloat(form.StockOutUnitPrice);
    if (!form.StockOutUnitPrice || isNaN(price) || price < 0) errors.StockOutUnitPrice = 'Enter a valid price.';
    if (!form.StockOutDate) errors.StockOutDate = 'Select a date.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editRecord) {
        await API.put(`/stock-out/${editRecord.StockOut_ID}`, form);
        toast('Stock out record updated successfully.', 'success');
      } else {
        await API.post('/stock-out', form);
        toast('Stock out recorded successfully.', 'success');
      }
      setModal(false);
      resetForm();
      refreshData();
    } catch (err) {
      toast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    resetForm();
  };

  if (loading) return <Loading />;

  const actionColumns = [
    ...columns,
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleEdit(row)} className="p-1.5 text-brand-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer" title="Edit" aria-label="Edit record">
          <Pencil size={15} />
        </button>
        <button onClick={() => handleDeleteRequest(row)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" title="Delete" aria-label="Delete record">
          <Trash2 size={15} />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex items-center gap-4">
          <div className="">
            <Wrench size={40} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">Stock Out</h1>
            <p className="text-sm text-brand-muted mt-1">Manage stock out transactions with full CRUD control.</p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setModal(true); }}><Plus size={18} />New Stock Out</Button>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowUpFromLine size={24} className="text-red-600" />
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          {data.length > 0 && (
            <div className="flex items-center gap-2 mb-6 text-sm text-brand-muted">
              <ArrowUpFromLine size={16} /><span>{data.length} stock out record{data.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="overflow-x-auto max-w-full rounded-2xl border border-brand-border bg-white">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="bg-slate-50">
                  {actionColumns.map((col) => (<th key={col.key} className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-muted">{col.label}</th>))}
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={actionColumns.length} className="px-4 sm:px-6 py-12 sm:py-16 text-center text-sm text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <ArrowUpFromLine size={32} className="text-slate-300" aria-hidden="true" />
                        <span className="text-slate-500">No records found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr key={row.StockOut_ID || idx} className="hover:bg-slate-50/50 transition-colors">
                      {actionColumns.map((col) => (<td key={col.key} className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-slate-700 whitespace-nowrap">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modal} onClose={handleCloseModal} title={editRecord ? 'Edit Stock Out' : 'Record Stock Out'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-brand-muted mb-2">Spare Part</label>
            <select name="SpareP_ID" value={form.SpareP_ID} onChange={handleChange} required disabled={!!editRecord} className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:cursor-not-allowed">
              <option value="">Select a spare part</option>
              {spareParts.map((sp) => <option key={sp.SpareP_ID} value={sp.SpareP_ID}>{sp.Name} — Available: {sp.Quantity}</option>)}
            </select>
            {editRecord && <p className="text-xs text-brand-muted mt-1.5">Part cannot be changed after creation.</p>}
            {formErrors.SpareP_ID && <p className="text-red-500 text-xs mt-1.5">{formErrors.SpareP_ID}</p>}
          </div>
          <Input label="Quantity Sold" name="StockOutQuantity" type="number" min="1" value={form.StockOutQuantity} onChange={handleChange} placeholder="e.g. 5" required error={formErrors.StockOutQuantity} />
          <Input label="Selling Price per Unit (RWF)" name="StockOutUnitPrice" type="number" min="0" step="0.01" value={form.StockOutUnitPrice} onChange={handleChange} placeholder="0.00" required error={formErrors.StockOutUnitPrice} />
          <Input label="Sale Date" name="StockOutDate" type="date" value={form.StockOutDate} onChange={handleChange} required error={formErrors.StockOutDate} />
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? editRecord ? 'Updating...' : 'Recording...' : editRecord ? 'Update Record' : 'Record Stock Out'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Stock Out Record"
        message={`This will delete the record and return ${deleteTarget?.StockOutQuantity || ''} units to inventory. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
