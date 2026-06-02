import { useState, useEffect, useMemo } from 'react';
import { Plus, Package, Wrench, Search } from 'lucide-react';
import API from '../api/axios';
import Table from '../component/Table';
import Modal from '../component/Modal';
import Input from '../component/Input';
import Button from '../component/Button';
import Loading from '../component/Loading';
import { useToast } from '../component/Toast';

const columns = [
  { key: 'SpareP_ID', label: 'ID' },
  { key: 'Name', label: 'Part Name' },
  { key: 'Category', label: 'Category' },
  { key: 'Quantity', label: 'Stock Qty' },
  { key: 'UnityPrice', label: 'Unit Price', render: (v) => `${parseFloat(v || 0).toLocaleString()} RWF` },
  { key: 'TotalPrice', label: 'Total Value', render: (v) => `${parseFloat(v || 0).toLocaleString()} RWF` },
];

export default function SpareParts() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ Name: '', Category: '', Quantity: '', UnityPrice: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/spare-parts');
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load spare parts.');
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    setError(null);
    try {
      const { data } = await API.get('/spare-parts');
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load spare parts.');
    }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      item.Name?.toLowerCase().includes(q) ||
      item.Category?.toLowerCase().includes(q) ||
      String(item.SpareP_ID).includes(q)
    );
  }, [data, search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!form.Name.trim()) errors.Name = 'Part name is required.';
    if (!form.Category.trim()) errors.Category = 'Category is required.';
    const qty = parseInt(form.Quantity, 10);
    if (!form.Quantity || isNaN(qty) || qty < 0) errors.Quantity = 'Enter a valid quantity (0 or more).';
    const price = parseFloat(form.UnityPrice);
    if (!form.UnityPrice || isNaN(price) || price < 0) errors.UnityPrice = 'Enter a valid price (0 or more).';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await API.post('/spare-parts', form);
      toast('Spare part added successfully.', 'success');
      setModal(false);
      setForm({ Name: '', Category: '', Quantity: '', UnityPrice: '' });
      setFormErrors({});
      refreshData();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to add spare part.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setForm({ Name: '', Category: '', Quantity: '', UnityPrice: '' });
    setFormErrors({});
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
        <div className="flex items-center gap-4">
          <div className="">
            <Wrench size={40} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">Spare Parts</h1>
            <p className="text-sm text-brand-muted mt-1">Manage your spare parts catalog.</p>
          </div>
        </div>
        <Button onClick={() => setModal(true)}><Plus size={18} />Add Spare Part</Button>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-card">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-red-600" />
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card" style={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <Package size={16} />
              <span>{data.length} spare part{data.length !== 1 ? 's' : ''} in catalog</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300"
              />
            </div>
          </div>
          <Table columns={columns} data={filtered} actions={false} />
          {search && filtered.length === 0 && (
            <p className="text-xs text-center text-slate-400 mt-4">No parts match your search.</p>
          )}
        </div>
      )}

      <Modal isOpen={modal} onClose={handleCloseModal} title="Add New Spare Part">
        <form onSubmit={handleSubmit}>
          <Input label="Part Name" name="Name" value={form.Name} onChange={handleChange} placeholder="e.g. Brake Pad" required error={formErrors.Name} />
          <div className="mb-6">
            <label className="block text-sm font-semibold text-brand-muted mb-2">Category</label>
            <select name="Category" value={form.Category} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300">
              <option value="">Select a category</option>
              <option value="Brakes">Brakes</option>
              <option value="Engine">Engine</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Transmission">Transmission</option>
              <option value="Cooling">Cooling</option>
              <option value="Exhaust">Exhaust</option>
              <option value="Steering">Steering</option>
              <option value="Body & Trim">Body & Trim</option>
              <option value="Filters">Filters</option>
              <option value="Tires">Tires</option>
              <option value="Lubricants">Lubricants</option>
            </select>
            {formErrors.Category && <p className="text-red-500 text-xs mt-1.5">{formErrors.Category}</p>}
          </div>
          <Input label="Initial Quantity" name="Quantity" type="number" min="0" value={form.Quantity} onChange={handleChange} placeholder="0" required error={formErrors.Quantity} />
          <Input label="Unit Price (RWF)" name="UnityPrice" type="number" min="0" step="0.01" value={form.UnityPrice} onChange={handleChange} placeholder="0.00" required error={formErrors.UnityPrice} />
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Part'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
