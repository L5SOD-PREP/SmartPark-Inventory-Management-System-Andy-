import { useState, useEffect } from 'react';
import { Plus, ArrowDownToLine, Wrench } from 'lucide-react';
import API from '../api/axios';
import Table from '../component/Table';
import Modal from '../component/Modal';
import Input from '../component/Input';
import Button from '../component/Button';
import Loading from '../component/Loading';
import { useToast } from '../component/Toast';

const columns = [
  { key: 'StockIn_ID', label: 'ID' },
  { key: 'SparePartName', label: 'Spare Part' },
  { key: 'Category', label: 'Category' },
  { key: 'StockInQuantity', label: 'Qty Received' },
  { key: 'StockInDate', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' },
];

export default function StockIn() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ SpareP_ID: '', StockInQuantity: '', StockInDate: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [siRes, spRes] = await Promise.all([API.get('/stock-in'), API.get('/spare-parts')]);
      setData(siRes.data);
      setSpareParts(spRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock in records.');
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    setError(null);
    try {
      const [siRes, spRes] = await Promise.all([API.get('/stock-in'), API.get('/spare-parts')]);
      setData(siRes.data);
      setSpareParts(spRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock in records.');
    }
  };
  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!form.SpareP_ID) errors.SpareP_ID = 'Select a spare part.';
    const qty = parseInt(form.StockInQuantity, 10);
    if (!form.StockInQuantity || isNaN(qty) || qty < 1) errors.StockInQuantity = 'Enter a quantity of 1 or more.';
    if (!form.StockInDate) errors.StockInDate = 'Select a date.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await API.post('/stock-in', form);
      toast('Stock in recorded successfully.', 'success');
      setModal(false);
      setForm({ SpareP_ID: '', StockInQuantity: '', StockInDate: '' });
      setFormErrors({});
      refreshData();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to record stock in.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setForm({ SpareP_ID: '', StockInQuantity: '', StockInDate: '' });
    setFormErrors({});
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex items-center gap-4">
          <div className="">
            <Wrench size={40} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-text tracking-tight">Stock In</h1>
            <p className="text-sm text-brand-muted mt-1">Record incoming stock to the inventory.</p>
          </div>
        </div>
        <Button onClick={() => setModal(true)}><Plus size={18} />New Stock In</Button>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowDownToLine size={24} className="text-red-600" />
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          {data.length > 0 && (
            <div className="flex items-center gap-2 mb-6 text-sm text-brand-muted">
              <ArrowDownToLine size={16} /><span>{data.length} stock in record{data.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <Table columns={columns} data={data} actions={false} />
        </div>
      )}

      <Modal isOpen={modal} onClose={handleCloseModal} title="Record Stock In">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-brand-muted mb-2">Spare Part</label>
            <select name="SpareP_ID" value={form.SpareP_ID} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-blue-500/20">
              <option value="">Select a spare part</option>
              {spareParts.map((sp) => <option key={sp.SpareP_ID} value={sp.SpareP_ID}>{sp.Name} — Current stock: {sp.Quantity}</option>)}
            </select>
            {formErrors.SpareP_ID && <p className="text-red-500 text-xs mt-1.5">{formErrors.SpareP_ID}</p>}
          </div>
          <Input label="Quantity Received" name="StockInQuantity" type="number" min="1" value={form.StockInQuantity} onChange={handleChange} placeholder="e.g. 50" required error={formErrors.StockInQuantity} />
          <Input label="Receipt Date" name="StockInDate" type="date" value={form.StockInDate} onChange={handleChange} required error={formErrors.StockInDate} />
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Stock In'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
