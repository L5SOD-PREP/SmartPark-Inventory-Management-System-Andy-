import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white border border-brand-border rounded-2xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-base font-bold text-brand-text mb-2">{title}</h3>
          <p className="text-sm text-brand-muted leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant={variant} onClick={onConfirm} className="flex-1">{confirmText}</Button>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
